// app/api/search/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { tavilySearch } from "@/lib/search/tavily";
import { extractIdeasFromSearch } from "@/lib/ai/extractor";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();
  const clerkId = session.userId;
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const { query } = await req.json();
  
  // 1. Get or Create User
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  // 2. Check Limit (3/day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limitCheck = await prisma.searchLimit.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: {},
    create: { userId: user.id, date: today },
  });

  if (limitCheck.count >= 3) {
    return NextResponse.json({ error: "Limite diário de 3 buscas atingido." }, { status: 429 });
  }

  // 3. Perform Deep Search
  const searchResults = await tavilySearch(query);

  // 4. Extract Ideas
  const ideas = await extractIdeasFromSearch(query, searchResults);

  // 5. Save to DB
  await Promise.all(ideas.map(idea => 
    prisma.contentIdea.create({
      data: {
        userId: user.id,
        topic: query,
        toolName: idea.toolName,
        businessCase: idea.businessCase,
        strategyDesc: idea.strategyDesc,
        searchableGroup: idea.searchableGroup,
        category: idea.category,
      }
    })
  ));

  // 6. Increment Limit
  await prisma.searchLimit.update({
    where: { id: limitCheck.id },
    data: { count: { increment: 1 } },
  });

  return NextResponse.json({ success: true, ideas });
}

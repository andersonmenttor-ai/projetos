// lib/ai/extractor.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IdeaResult {
  toolName: string;
  businessCase: string;
  strategyDesc: string;
  searchableGroup: "Pesquisável" | "Viral";
  category: "Educativo" | "Autoridade" | "Relacionamento" | "Oferta";
}

export async function extractIdeasFromSearch(query: string, searchResults: string): Promise<IdeaResult[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um especialista em Consultoria de IA e Marketing para LinkedIn. Seu objetivo é extrair oportunidades de ferramentas de IA para negócios."
      },
      {
        role: "user",
        content: `Com base na pesquisa sobre "${query}":\n\n${searchResults}\n\nExtraia 3-5 ideias de conteúdo no formato "Como usar [FERRAMENTA] para [NEGÓCIO]". Determine o Grupo (Pesquisável/Viral), Categoria (Educativo/Autoridade/Relacionamento/Oferta) e uma breve Estratégia. Retorne APENAS um JSON array.`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) return [];

  const parsed = JSON.parse(content);
  // O formato esperado do LLM deve ser { "ideas": [{...}, {...}] }
  return parsed.ideas || [];
}

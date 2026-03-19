// app/bank/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import "@/styles/dashboard.css";

export default async function IdeaBank() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return <div>Unauthorized</div>;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { ideas: { orderBy: { createdAt: "desc" } } }
  });

  const ideas = user?.ideas || [];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">LinkedIn AI Ideas</div>
        <nav>
          <a href="/dashboard" className="nav-item">Pesquisar</a>
          <a href="/bank" className="nav-item active">Banco de Ideias</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Seu Banco de Ideias Estratégicas</h1>
          <p>Todas as ideias extraídas das suas pesquisas recentes.</p>
        </header>

        <section className="idea-grid">
          {ideas.length === 0 && <p>Você ainda não salvou nenhuma ideia. Vá em "Pesquisar" para começar!</p>}
          {ideas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <div className="badges">
                <span className={`badge badge-${idea.searchableGroup.toLowerCase()}`}>
                  {idea.searchableGroup}
                </span>
                <span className="badge badge-category">
                  {idea.category}
                </span>
              </div>
              <h3 className="idea-title">{idea.toolName || "Ferramenta de IA"}</h3>
              <p className="idea-desc"><strong>Tópico:</strong> {idea.topic}</p>
              <p className="idea-desc"><strong>Caso:</strong> {idea.businessCase}</p>
              <p className="idea-desc">{idea.strategyDesc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

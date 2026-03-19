// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import "@/styles/dashboard.css";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.ideas) setIdeas(data.ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">LinkedIn AI Ideas</div>
        <nav>
          <a href="/dashboard" className="nav-item active">Pesquisar</a>
          <a href="/bank" className="nav-item">Banco de Ideias</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Encontrar Estratégias de IA para Negócios</h1>
          <p>Digite um tópico ou nicho para descobrir ferramentas e casos de uso.</p>
        </header>

        <section className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Ex: 'IA para consultoria de RH' ou 'Automação de contabilidade'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="btn-primary" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Pesquisando..." : "Realizar Pesquisa Profunda"}
          </button>
        </section>

        <section className="idea-grid">
          {ideas.map((idea, i) => (
            <div key={i} className="idea-card">
              <div className="badges">
                <span className={`badge badge-${idea.searchableGroup.toLowerCase()}`}>
                  {idea.searchableGroup}
                </span>
                <span className="badge badge-category">
                  {idea.category}
                </span>
              </div>
              <h3 className="idea-title">{idea.toolName || "Ferramenta de IA"}</h3>
              <p className="idea-desc"><strong>Caso:</strong> {idea.businessCase}</p>
              <p className="idea-desc">{idea.strategyDesc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

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
  const prompt = `
    Você é um especialista em Consultoria de IA e Marketing para LinkedIn.
    Com base na seguinte pesquisa sobre "${query}":
    
    ${searchResults}
    
    Extraia 3-5 ideias de conteúdo no formato "Como usar [FERRAMENTA] para [NEGÓCIO]".
    
    Para cada ideia, determine:
    1. Grupo: "Pesquisável" (se for algo que as pessoas buscam no Google/YouTube) ou "Viral" (se for algo disruptivo/emocional para o feed).
    2. Categoria: "Educativo" (tutorial), "Autoridade" (estudo de caso/prova), "Relacionamento" (opinião/humanização) ou "Oferta" (venda de consultoria).
    3. Descrição Estratégica: Um resumo de 2 frases sobre a estratégia.

    Retorne apenas um JSON array de objetos.
  `;

  // Simulação ou chamada real (aqui implementamos a estrutura)
  // return JSON.parse(response.choices[0].message.content);
  return []; // Placeholder
}

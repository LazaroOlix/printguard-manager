import { GoogleGenAI } from "@google/genai";
import { Printer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePrinterProblem = async (
  printer: Printer,
  problemDescription: string
): Promise<{ diagnosis: string; recommendedAction: string; suggestedParts: string[] }> => {
  try {
    const prompt = `
      Você é um técnico especialista sênior em manutenção de impressoras.
      Analise o seguinte problema:
      
      Impressora: ${printer.brand} ${printer.model}
      Contador de Páginas: ${printer.pageCounter}
      Descrição do Erro: ${problemDescription}
      
      Forneça uma resposta JSON com o seguinte formato (sem markdown):
      {
        "diagnosis": "Diagnóstico provável...",
        "recommendedAction": "Passo a passo recomendado...",
        "suggestedParts": ["Nome da peça 1", "Nome da peça 2"]
      }
      Seja técnico e preciso. Considere o desgaste natural baseado no contador de páginas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return {
      diagnosis: "Não foi possível analisar automaticamente.",
      recommendedAction: "Verifique o manual de serviço do equipamento.",
      suggestedParts: []
    };
  }
};

export const generatePreventiveReport = async (printers: Printer[]): Promise<string> => {
    try {
        const printerData = printers.map(p => `${p.brand} ${p.model} (Contador: ${p.pageCounter})`).join('\n');
        const prompt = `
            Com base na lista de impressoras abaixo, identifique quais provavelmente precisarão de manutenção preventiva em breve considerando um ciclo médio de 50.000 páginas para laser e 15.000 para jato de tinta.
            Lista:
            ${printerData}

            Responda em texto corrido curto, focado apenas nas que precisam de atenção.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: prompt
        });

        return response.text || "Sem recomendações no momento.";
    } catch (error) {
        return "Erro ao gerar relatório preventivo.";
    }
}

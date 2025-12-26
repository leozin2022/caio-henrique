
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLegalAssistantResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `Você é o assistente virtual do Dr. Caio Henrique, um advogado de prestígio especializado em Direito Civil brasileiro (Família, Contratos, Sucessões, Imobiliário).
        
Seu tom deve ser profissional, empático, formal mas acessível. 
Responda a dúvidas preliminares sobre estes temas jurídicos.
Sempre que o assunto for complexo ou exigir análise de documentos, sugira fortemente que o usuário agende uma consulta oficial ou entre em contato pelo WhatsApp do escritório.

Responda em Português do Brasil.`,
      },
    });
    
    return response.text || "Desculpe, tive um problema ao processar sua solicitação. Poderia repetir?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "No momento estou passando por uma manutenção técnica. Por favor, tente novamente em instantes ou utilize nossos canais de contato direto.";
  }
};

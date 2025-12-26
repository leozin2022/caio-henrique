
import { GoogleGenAI } from "@google/genai";

// Proteção contra ReferenceError: process is not defined em navegadores
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : '';
  } catch {
    return '';
  }
};

const apiKey = getApiKey();

export const getLegalAssistantResponse = async (userMessage: string) => {
  if (!apiKey) {
    console.warn("Gemini API Key não configurada. O chat funcionará em modo offline.");
    return "Olá! No momento meu sistema de IA está em modo de manutenção. Por favor, entre em contato direto pelo WhatsApp (89) 99986-7161 para que possamos te ajudar imediatamente.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `Você é o assistente virtual do Dr. Caio Henrique, um advogado de prestígio especializado em Direito Civil brasileiro (Família, Contratos, Sucessões, Imobiliário).
        
Seu tom deve ser profissional, empático, formal mas acessível. 
Responda a dúvidas preliminares sobre estes temas jurídicos.
Sempre que o assunto for complexo ou exigir análise de documentos, sugira fortemente que o usuário agende uma consulta oficial ou entre em contato pelo WhatsApp do escritório (89) 99986-7161.

Responda em Português do Brasil.`,
      },
    });
    
    return response.text || "Desculpe, tive um problema ao processar sua solicitação. Poderia repetir?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "No momento estou passando por uma instabilidade técnica. Por favor, tente novamente em instantes ou utilize nosso canal de atendimento via WhatsApp.";
  }
};

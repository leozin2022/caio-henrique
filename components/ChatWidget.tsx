
import React, { useState, useRef, useEffect } from 'react';
import { getLegalAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: "Olá! Sou o assistente virtual do Dr. Caio Henrique. Posso tirar dúvidas preliminares sobre Direito Civil. Como posso ajudar?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserQuery, setLastUserQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = "5589999867161";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentQuery = input;
    setLastUserQuery(currentQuery);
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botResponseText = await getLegalAssistantResponse(input);
    const botMsg: ChatMessage = { role: 'bot', text: botResponseText, timestamp: Date.now() };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const openWhatsAppWithQuery = (query: string) => {
    const text = `Olá Dr. Caio Henrique, gostaria de tratar sobre uma dúvida que tive com sua IA:\n\n*Minha dúvida:* ${query}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#136dec] text-white shadow-xl hover:bg-blue-600 transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Container do Chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-fade-up">
          {/* Header */}
          <div className="bg-[#136dec] p-4 text-white flex items-center gap-3">
            <span className="material-symbols-outlined">smart_toy</span>
            <div>
              <h3 className="font-bold text-sm">Assistente Jurídico IA</h3>
              <p className="text-[10px] text-blue-100">Especialista em Direito Civil</p>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#136dec] text-white self-end rounded-br-none' 
                      : 'bg-white text-slate-800 self-start border border-slate-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Botão de WhatsApp após resposta da IA */}
                {msg.role === 'bot' && i === messages.length - 1 && !isLoading && i > 0 && (
                  <button 
                    onClick={() => openWhatsAppWithQuery(lastUserQuery)}
                    className="flex items-center gap-2 self-start bg-[#25D366]/10 text-[#128C7E] px-4 py-2 rounded-full text-[11px] font-bold hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    Falar com Dr. Caio agora
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-slate-400 self-start p-3 rounded-2xl text-sm italic shadow-sm">
                Analisando seu caso...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Descreva sua dúvida..."
              className="flex-1 rounded-full border-slate-200 text-sm focus:border-[#136dec] focus:ring-[#136dec]"
            />
            <button
              onClick={handleSend}
              className="bg-[#136dec] text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;


import { SiteContent } from './types';

export const INITIAL_CONTENT: SiteContent = {
  header: {
    title: "Dr. Caio Henrique",
    cta: "Agendar Consulta"
  },
  hero: {
    badge: "Direito Civil Especializado",
    titleMain: "Defesa Excepcional em",
    rotatingSpecialties: [
      "Direito de Família",
      "Direito de Sucessões",
      "Contratos Complexos",
      "Gestão Patrimonial",
      "Responsabilidade Civil",
      "Direito Imobiliário"
    ],
    description: "Compromisso inabalável com a justiça e a proteção dos seus interesses. Oferecemos consultoria jurídica estratégica e personalizada para resolver seus conflitos com elegância e eficácia.",
    btn1: "Fale Conosco Agora",
    btn2: "Conheça o Escritório"
  },
  about: {
    title: "Sobre o Dr. Caio Henrique",
    text1: "Com mais de 15 anos de atuação na esfera cível, construí uma carreira pautada na ética, transparência e na busca incansável pelos direitos dos meus clientes.",
    text2: "Minha abordagem combina profundo conhecimento técnico com um olhar humano e acolhedor. Entendo que por trás de cada processo existe uma história de vida, uma família ou um patrimônio construído com esforço.",
    stat1Val: "15+",
    stat1Label: "Anos de Experiência",
    stat2Val: "500+",
    stat2Label: "Casos Resolvidos"
  },
  services: {
    subtitle: "Atendimento Especializado",
    title: "Selecione sua Área de Interesse",
    items: [
      {
        id: "family",
        title: "Direito de Família",
        desc: "Divórcios, guarda e pensão alimentícia.",
        icon: "family_restroom",
        formType: "basic",
        buttonText: "Consultar Agora",
        bgColor: "bg-[#eef2ff]"
      },
      {
        id: "civil",
        title: "Cível e Contratos",
        desc: "Revisão contratual e responsabilidade civil.",
        icon: "gavel",
        formType: "contract",
        buttonText: "Agendar Análise",
        bgColor: "bg-[#f8fafc]"
      },
      {
        id: "property",
        title: "Direito Imobiliário",
        desc: "Regularização de imóveis e locações.",
        icon: "home_work",
        formType: "property",
        buttonText: "Solicitar Assessoria",
        bgColor: "bg-blue-50"
      }
    ]
  },
  reviews: {
    title: "O que dizem nossos clientes",
    list: [
      {
        id: "1",
        stars: 5,
        text: "O Dr. Caio foi excepcional no meu processo de divórcio. Muita sensibilidade e profissionalismo em um momento tão difícil.",
        author: "Maria Silva",
        context: "Direito de Família",
        avatar: "https://picsum.photos/seed/maria/100/100"
      },
      {
        id: "2",
        stars: 5,
        text: "Profissionalismo ímpar. Resolveu uma questão contratual complexa da minha empresa com rapidez e eficiência.",
        author: "João Pereira",
        context: "Direito Civil",
        avatar: "https://picsum.photos/seed/joao/100/100",
        highlighted: true
      },
      {
        id: "3",
        stars: 5,
        text: "Atenção aos detalhes e clareza nas explicações. Me senti muito segura durante todo o processo de inventário.",
        author: "Ana Costa",
        context: "Sucessões",
        avatar: "https://picsum.photos/seed/ana/100/100"
      }
    ]
  },
  location: {
    title: "Nosso Escritório",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
    cta: "Calcule sua rota"
  },
  footer: {
    logoText: "Dr. Caio Henrique",
    desc: "Defendendo seus direitos com elegância, ética e determinação. Sua tranquilidade é a nossa prioridade.",
    col1Title: "Links Rápidos",
    col2Title: "Contato",
    phone: "(89) 99986-7161",
    email: "contato@draadvogada.com.br",
    hours: "Seg - Sex: 09h às 18h",
    col3Title: "Social"
  }
};

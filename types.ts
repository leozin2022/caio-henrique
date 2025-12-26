
export interface SiteContent {
  header: {
    title: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    rotatingSpecialties: string[];
    description: string;
    btn1: string;
    btn2: string;
  };
  about: {
    title: string;
    text1: string;
    text2: string;
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
  };
  services: {
    subtitle: string;
    title: string;
    items: ServiceItem[];
  };
  reviews: {
    title: string;
    list: ReviewItem[];
  };
  location: {
    title: string;
    address: string;
    cta: string;
  };
  footer: {
    logoText: string;
    desc: string;
    col1Title: string;
    col2Title: string;
    phone: string;
    email: string;
    hours: string;
    col3Title: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  formType: 'basic' | 'contract' | 'property' | 'inheritance';
  buttonText: string;
  bgColor: string;
}

export interface ReviewItem {
  id: string;
  stars: number;
  text: string;
  author: string;
  context: string;
  avatar: string;
  highlighted?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
}

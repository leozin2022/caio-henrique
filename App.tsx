
import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_CONTENT } from './constants';
import { SiteContent, ServiceItem } from './types';
import EditableText from './components/EditableText';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [routeInput, setRouteInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States para Formulário de Serviço
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({ name: '', details: '', specific: '' });

  const WHATSAPP_NUMBER = "5589999867161";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const openWhatsApp = (message?: string) => {
    const url = message 
      ? `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`
      : WHATSAPP_LINK;
    window.open(url, '_blank');
  };

  const handleCalculateRoute = () => {
    if (!routeInput.trim()) {
      alert('Por favor, digite seu endereço para calcular a rota.');
      return;
    }
    const destination = encodeURIComponent(content.location.address);
    const origin = encodeURIComponent(routeInput);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    const message = `Olá Dr. Caio!\n\n*Assunto:* ${selectedService.title}\n*Nome:* ${formData.name}\n*Informações:* ${formData.details}\n*Complemento:* ${formData.specific}`;
    openWhatsApp(message);
    setSelectedService(null);
    setFormData({ name: '', details: '', specific: '' });
  };

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('site_content', JSON.stringify(content));
    }
  }, [content, isAdmin]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % content.hero.rotatingSpecialties.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [content.hero.rotatingSpecialties.length]);

  const updateField = useCallback((path: string, value: any) => {
    setContent(prev => {
      const newContent = { ...prev };
      const keys = path.split('.');
      let current: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '220611') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleScrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Sobre', id: 'sobre' },
    { label: 'Atuação', id: 'atuacao' },
    { label: 'Localização', id: 'localizacao' },
    { label: 'Contato', id: 'contato' }
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-blue-100">
      {/* Modal de Formulário de Serviço */}
      {selectedService && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#136dec]">
                  <span className="material-symbols-outlined">{selectedService.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{selectedService.title}</h3>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seu Nome</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Como podemos te chamar?"
                  className="w-full rounded-xl border-slate-200 focus:border-[#136dec] focus:ring-[#136dec]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Breve Descrição do Caso</label>
                <textarea 
                  required
                  value={formData.details}
                  onChange={e => setFormData({...formData, details: e.target.value})}
                  placeholder="Conte um pouco sobre sua necessidade..."
                  rows={3}
                  className="w-full rounded-xl border-slate-200 focus:border-[#136dec] focus:ring-[#136dec]" 
                />
              </div>
              {selectedService.formType === 'property' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Localização do Imóvel</label>
                  <input 
                    type="text" 
                    value={formData.specific}
                    onChange={e => setFormData({...formData, specific: e.target.value})}
                    placeholder="Cidade / Bairro"
                    className="w-full rounded-xl border-slate-200 focus:border-[#136dec] focus:ring-[#136dec]" 
                  />
                </div>
              )}
              {selectedService.formType === 'contract' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Contrato</label>
                  <input 
                    type="text" 
                    value={formData.specific}
                    onChange={e => setFormData({...formData, specific: e.target.value})}
                    placeholder="Ex: Compra e Venda, Aluguel..."
                    className="w-full rounded-xl border-slate-200 focus:border-[#136dec] focus:ring-[#136dec]" 
                  />
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-lg shadow-emerald-100"
              >
                <span className="material-symbols-outlined">send</span>
                Enviar para WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Login Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-6">
              <div className="h-14 w-14 bg-[#136dec] rounded-full flex items-center justify-center text-white mb-4">
                <span className="material-symbols-outlined text-3xl text-white">admin_panel_settings</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Área Admin</h2>
              <p className="text-slate-500 text-sm">Digite a senha para editar</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full rounded-xl border-slate-300 focus:border-[#136dec] focus:ring-[#136dec]"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#136dec] text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#101822] border-b border-white/10 px-6 py-4 lg:px-20 text-white shadow-2xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#136dec] shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-white text-xl">balance</span>
            </div>
            <EditableText
              isAdmin={isAdmin}
              value={content.header.title}
              onChange={(val) => updateField('header.title', val)}
              as="h2"
              className="text-xl font-black tracking-tight"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleScrollToSection(e, item.id)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all hover:text-[#136dec] active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => openWhatsApp("Olá Dr. Caio, gostaria de agendar uma consulta.")}
              className="hidden md:flex items-center gap-2 rounded-full bg-[#136dec] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              <EditableText
                isAdmin={isAdmin}
                value={content.header.cta}
                onChange={(val) => updateField('header.cta', val)}
              />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#101822] border-t border-white/5 p-6 flex flex-col gap-2 lg:hidden animate-fade-up shadow-2xl">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleScrollToSection(e, item.id)}
                className="w-full text-left px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                {item.label}
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </button>
            ))}
            <button 
              onClick={() => openWhatsApp("Olá Dr. Caio, gostaria de agendar uma consulta.")}
              className="mt-4 w-full rounded-xl bg-[#136dec] py-5 text-sm font-black uppercase tracking-widest text-white text-center shadow-xl shadow-blue-500/20"
            >
              {content.header.cta}
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative flex min-h-[700px] flex-col justify-center overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-20">
          <div className="max-w-3xl space-y-8 animate-fade-up">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 w-fit px-3 py-1 border border-blue-100">
              <span className="material-symbols-outlined text-[#136dec] text-sm">verified</span>
              <EditableText
                isAdmin={isAdmin}
                value={content.hero.badge}
                onChange={(val) => updateField('hero.badge', val)}
                className="text-[10px] font-black text-[#136dec] uppercase tracking-widest"
              />
            </div>

            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-[#111418] lg:text-7xl">
              <EditableText
                isAdmin={isAdmin}
                value={content.hero.titleMain}
                onChange={(val) => updateField('hero.titleMain', val)}
              />
              <br />
              <span className="text-[#136dec] block mt-2 h-[1.1em] overflow-hidden">
                <span 
                  className="inline-block transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${rotatingIndex * 100}%)` }}
                >
                  {content.hero.rotatingSpecialties.map((spec, i) => (
                    <span key={i} className="block">{spec}</span>
                  ))}
                </span>
              </span>
            </h1>

            <EditableText
              isAdmin={isAdmin}
              value={content.hero.description}
              onChange={(val) => updateField('hero.description', val)}
              as="p"
              className="text-lg text-slate-600 leading-relaxed max-w-2xl"
            />

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => openWhatsApp("Olá Dr. Caio, gostaria de falar com um especialista agora.")}
                className="rounded-xl bg-[#136dec] px-10 py-5 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:translate-y-[-2px] active:scale-95"
              >
                <EditableText
                  isAdmin={isAdmin}
                  value={content.hero.btn1}
                  onChange={(val) => updateField('hero.btn1', val)}
                />
              </button>
              <button 
                onClick={(e) => handleScrollToSection(e, 'sobre')}
                className="rounded-xl border border-slate-200 bg-white px-10 py-5 text-base font-bold text-slate-800 transition-all hover:bg-slate-50 active:scale-95"
              >
                {content.hero.btn2}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="bg-slate-50 py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#136dec]/5 rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800" 
                alt="Dr. Caio Henrique" 
                className="relative z-10 h-[500px] w-full rounded-3xl object-cover shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <EditableText isAdmin={isAdmin} value={content.about.title} onChange={(val) => updateField('about.title', val)} as="h2" className="text-4xl font-black text-slate-900" />
                <div className="h-1.5 w-20 bg-[#136dec] rounded-full"></div>
              </div>
              <EditableText
                isAdmin={isAdmin}
                value={content.about.text1}
                onChange={(val) => updateField('about.text1', val)}
                as="p"
                className="text-lg text-slate-600 leading-relaxed"
              />
              <EditableText
                isAdmin={isAdmin}
                value={content.about.text2}
                onChange={(val) => updateField('about.text2', val)}
                as="p"
                className="text-lg text-slate-600 leading-relaxed"
              />
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="group">
                  <EditableText isAdmin={isAdmin} value={content.about.stat1Val} onChange={(val) => updateField('about.stat1Val', val)} as="div" className="text-4xl font-black text-[#136dec] group-hover:scale-110 transition-transform origin-left" />
                  <EditableText isAdmin={isAdmin} value={content.about.stat1Label} onChange={(val) => updateField('about.stat1Label', val)} as="div" className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1" />
                </div>
                <div className="group">
                  <EditableText isAdmin={isAdmin} value={content.about.stat2Val} onChange={(val) => updateField('about.stat2Val', val)} as="div" className="text-4xl font-black text-[#136dec] group-hover:scale-110 transition-transform origin-left" />
                  <EditableText isAdmin={isAdmin} value={content.about.stat2Label} onChange={(val) => updateField('about.stat2Label', val)} as="div" className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="atuacao" className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <EditableText
            isAdmin={isAdmin}
            value={content.services.subtitle}
            onChange={(val) => updateField('services.subtitle', val)}
            as="p"
            className="text-xs font-black uppercase tracking-[0.2em] text-[#136dec]"
          />
          <EditableText
            isAdmin={isAdmin}
            value={content.services.title}
            onChange={(val) => updateField('services.title', val)}
            as="h2"
            className="mt-4 text-4xl font-black text-slate-900"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.services.items.map((item, idx) => (
              <div 
                key={item.id} 
                className={`${item.bgColor} group rounded-3xl p-8 text-left border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-8px] cursor-pointer`}
                onClick={() => setSelectedService(item)}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#136dec] shadow-md group-hover:bg-[#136dec] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <EditableText
                  isAdmin={isAdmin}
                  value={item.title}
                  onChange={(val) => {
                    const newList = [...content.services.items];
                    newList[idx].title = val;
                    updateField('services.items', newList);
                  }}
                  as="h3"
                  className="text-xl font-bold text-slate-900"
                />
                <EditableText
                  isAdmin={isAdmin}
                  value={item.desc}
                  onChange={(val) => {
                    const newList = [...content.services.items];
                    newList[idx].desc = val;
                    updateField('services.items', newList);
                  }}
                  as="p"
                  className="mt-3 text-sm text-slate-500 leading-relaxed"
                />
                <div className="mt-8">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#136dec] group-hover:translate-x-1 transition-transform">
                    {item.buttonText}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="localizacao" className="bg-[#f0f4f8]">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          <div className="flex flex-1 flex-col justify-center p-10 lg:p-24">
            <div className="max-w-md space-y-8">
              <EditableText
                isAdmin={isAdmin}
                value={content.location.title}
                onChange={(val) => updateField('location.title', val)}
                as="h2"
                className="text-4xl font-black text-slate-900"
              />
              <EditableText
                isAdmin={isAdmin}
                value={content.location.address}
                onChange={(val) => updateField('location.address', val)}
                as="p"
                className="text-slate-600 leading-relaxed"
              />
              <div className="space-y-3">
                <EditableText
                  isAdmin={isAdmin}
                  value={content.location.cta}
                  onChange={(val) => updateField('location.cta', val)}
                  as="label"
                  className="block text-sm font-bold text-slate-800"
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={routeInput}
                    onChange={(e) => setRouteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculateRoute()}
                    placeholder="Seu endereço..." 
                    className="flex-grow rounded-xl border-none bg-white py-4 px-4 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-[#136dec]" 
                  />
                  <button 
                    onClick={handleCalculateRoute}
                    className="rounded-xl bg-[#136dec] px-6 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined">directions</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full lg:h-auto lg:flex-1">
             <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-[#101822] text-white">
        <div className="container mx-auto px-6 py-20 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-4">
            <div className="space-y-6">
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.logoText}
                onChange={(val) => updateField('footer.logoText', val)}
                as="span"
                className="text-lg font-bold"
              />
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.desc}
                onChange={(val) => updateField('footer.desc', val)}
                as="p"
                className="text-sm text-slate-400 leading-relaxed"
              />
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Links Rápidos</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button onClick={(e) => handleScrollToSection(e, item.id)} className="hover:text-white transition-colors">{item.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <EditableText isAdmin={isAdmin} value={content.footer.col2Title} onChange={(val) => updateField('footer.col2Title', val)} as="h4" className="text-xs font-black uppercase tracking-widest text-slate-500" />
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-lg">call</span>
                  <EditableText isAdmin={isAdmin} value={content.footer.phone} onChange={(val) => updateField('footer.phone', val)} />
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-lg">mail</span>
                  <EditableText isAdmin={isAdmin} value={content.footer.email} onChange={(val) => updateField('footer.email', val)} />
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 border-t border-white/5 pt-10 text-center relative">
            <p className="text-xs text-slate-500">© 2024 Dr. Caio Henrique. Todos os direitos reservados. OAB/SP 000.000</p>
            
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">{isAdmin ? 'lock_open' : 'lock'}</span>
              Área Administrativa
            </button>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;

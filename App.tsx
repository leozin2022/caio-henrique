
import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_CONTENT } from './constants';
import { SiteContent } from './types';
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

  const WHATSAPP_NUMBER = "5589999867161";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const openWhatsApp = (message?: string) => {
    const url = message 
      ? `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`
      : WHATSAPP_LINK;
    window.open(url, '_blank');
  };

  // Auto-save when content changes (and we are in admin mode)
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('site_content', JSON.stringify(content));
    }
  }, [content, isAdmin]);

  // Rotation for Hero text
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

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-blue-100">
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

      {/* Admin Controls Floating Toolbar */}
      {isAdmin && (
        <div className="fixed left-6 bottom-6 z-[150] flex flex-col gap-3">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 min-w-[200px]">
             <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
               <span className="material-symbols-outlined text-sm">lock_open</span>
               Modo Edição Ativo
             </div>
             <p className="text-[10px] text-slate-400 mb-4">Clique nos textos pontilhados para alterar.</p>
             <button
              onClick={() => setIsAdmin(false)}
              className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
             >
               <span className="material-symbols-outlined text-sm">logout</span>
               Sair do Modo Admin
             </button>
          </div>
          {showSaveIndicator && (
            <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-bold shadow-lg animate-bounce flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              Salvo no Navegador
            </div>
          )}
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#101822] px-6 py-4 shadow-xl lg:px-20 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#136dec]">
            <span className="material-symbols-outlined text-white">balance</span>
          </div>
          <EditableText
            isAdmin={isAdmin}
            value={content.header.title}
            onChange={(val) => updateField('header.title', val)}
            as="h2"
            className="text-xl font-bold tracking-tight"
          />
        </div>
        <nav className="hidden items-center gap-8 lg:flex">
          <a href="#inicio" onClick={(e) => handleScrollToSection(e, 'inicio')} className="text-sm font-medium hover:text-[#136dec] transition-colors">Início</a>
          <a href="#sobre" onClick={(e) => handleScrollToSection(e, 'sobre')} className="text-sm font-medium hover:text-[#136dec] transition-colors">Sobre</a>
          <a href="#atuacao" onClick={(e) => handleScrollToSection(e, 'atuacao')} className="text-sm font-medium hover:text-[#136dec] transition-colors">Atuação</a>
          <a href="#localizacao" onClick={(e) => handleScrollToSection(e, 'localizacao')} className="text-sm font-medium hover:text-[#136dec] transition-colors">Localização</a>
          <a href="#contato" onClick={(e) => handleScrollToSection(e, 'contato')} className="text-sm font-medium hover:text-[#136dec] transition-colors">Contato</a>
        </nav>
        <button 
          onClick={() => openWhatsApp("Olá Dr. Caio, gostaria de agendar uma consulta.")}
          className="hidden rounded-full bg-[#136dec] px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 lg:block"
        >
          <EditableText
            isAdmin={isAdmin}
            value={content.header.cta}
            onChange={(val) => updateField('header.cta', val)}
          />
        </button>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative flex min-h-[700px] flex-col justify-center overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
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
                className="rounded-xl bg-[#136dec] px-10 py-5 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:translate-y-[-2px]"
              >
                <EditableText
                  isAdmin={isAdmin}
                  value={content.hero.btn1}
                  onChange={(val) => updateField('hero.btn1', val)}
                />
              </button>
              <button 
                onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-xl border border-slate-200 bg-white px-10 py-5 text-base font-bold text-slate-800 transition-all hover:bg-slate-50"
              >
                <EditableText
                  isAdmin={isAdmin}
                  value={content.hero.btn2}
                  onChange={(val) => updateField('hero.btn2', val)}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="bg-[#f8fafc] py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#136dec]/10 rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800" 
                alt="Lawyer Profile" 
                className="relative z-10 h-[550px] w-full rounded-3xl object-cover shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <EditableText
                  isAdmin={isAdmin}
                  value={content.about.title}
                  onChange={(val) => updateField('about.title', val)}
                  as="h2"
                  className="text-4xl font-black text-slate-900"
                />
                <div className="h-1.5 w-24 bg-[#136dec] rounded-full"></div>
              </div>
              
              <div className="space-y-6">
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
              </div>

              <div className="grid grid-cols-2 gap-10 pt-6">
                <div className="space-y-1">
                  <EditableText
                    isAdmin={isAdmin}
                    value={content.about.stat1Val}
                    onChange={(val) => updateField('about.stat1Val', val)}
                    as="span"
                    className="text-4xl font-black text-[#136dec]"
                  />
                  <EditableText
                    isAdmin={isAdmin}
                    value={content.about.stat1Label}
                    onChange={(val) => updateField('about.stat1Label', val)}
                    as="p"
                    className="text-sm font-bold text-slate-500 uppercase tracking-wide"
                  />
                </div>
                <div className="space-y-1">
                  <EditableText
                    isAdmin={isAdmin}
                    value={content.about.stat2Val}
                    onChange={(val) => updateField('about.stat2Val', val)}
                    as="span"
                    className="text-4xl font-black text-[#136dec]"
                  />
                  <EditableText
                    isAdmin={isAdmin}
                    value={content.about.stat2Label}
                    onChange={(val) => updateField('about.stat2Label', val)}
                    as="p"
                    className="text-sm font-bold text-slate-500 uppercase tracking-wide"
                  />
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
              <div key={item.id} className={`${item.bgColor} group rounded-3xl p-8 text-left border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-8px]`}>
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
                <div className="mt-8 space-y-4">
                  <button 
                    onClick={() => openWhatsApp(`Olá Dr. Caio, gostaria de saber mais sobre ${item.title}.`)}
                    className="w-full rounded-xl bg-slate-900 py-4 text-sm font-bold text-white transition-all hover:bg-black"
                  >
                    {item.buttonText}
                  </button>
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
                  <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">location_on</span>
                    <input type="text" placeholder="Seu endereço..." className="w-full rounded-xl border-none bg-white py-4 pl-10 pr-4 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-[#136dec]" />
                  </div>
                  <button className="rounded-xl bg-[#136dec] px-6 text-white hover:bg-blue-700 transition-colors">
                    <span className="material-symbols-outlined">directions</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full lg:h-auto lg:flex-1">
             <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"></div>
             <a 
               href="https://www.google.com/maps/search/?api=1&query=Av.+Paulista,+1000+-+Bela+Vista,+São+Paulo+-+SP,+01310-100" 
               target="_blank" 
               rel="noopener noreferrer"
               className="absolute bottom-6 right-6 rounded-lg bg-white px-5 py-2.5 text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
             >
               <span className="material-symbols-outlined text-sm">map</span>
               Ver no Google Maps
             </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-[#101822] text-white scroll-margin-top-0">
        <div className="container mx-auto px-6 py-20 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#136dec]">
                  <span className="material-symbols-outlined text-sm">balance</span>
                </div>
                <EditableText
                  isAdmin={isAdmin}
                  value={content.footer.logoText}
                  onChange={(val) => updateField('footer.logoText', val)}
                  as="span"
                  className="text-lg font-bold"
                />
              </div>
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.desc}
                onChange={(val) => updateField('footer.desc', val)}
                as="p"
                className="text-sm text-slate-400 leading-relaxed"
              />
            </div>

            <div className="space-y-6">
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.col1Title}
                onChange={(val) => updateField('footer.col1Title', val)}
                as="h4"
                className="text-xs font-black uppercase tracking-widest text-slate-500"
              />
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#inicio" onClick={(e) => handleScrollToSection(e, 'inicio')} className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#sobre" onClick={(e) => handleScrollToSection(e, 'sobre')} className="hover:text-white transition-colors">Sobre Mim</a></li>
                <li><a href="#atuacao" onClick={(e) => handleScrollToSection(e, 'atuacao')} className="hover:text-white transition-colors">Áreas de Atuação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog Jurídico</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.col2Title}
                onChange={(val) => updateField('footer.col2Title', val)}
                as="h4"
                className="text-xs font-black uppercase tracking-widest text-slate-500"
              />
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-lg">call</span>
                  <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-white">
                    <EditableText isAdmin={isAdmin} value={content.footer.phone} onChange={(val) => updateField('footer.phone', val)} />
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-lg">mail</span>
                  <EditableText isAdmin={isAdmin} value={content.footer.email} onChange={(val) => updateField('footer.email', val)} />
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#136dec] text-lg">schedule</span>
                  <EditableText isAdmin={isAdmin} value={content.footer.hours} onChange={(val) => updateField('footer.hours', val)} />
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <EditableText
                isAdmin={isAdmin}
                value={content.footer.col3Title}
                onChange={(val) => updateField('footer.col3Title', val)}
                as="h4"
                className="text-xs font-black uppercase tracking-widest text-slate-500"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => openWhatsApp("Olá Dr. Caio, vim através do Instagram.")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-xs font-bold hover:bg-pink-600 transition-all"
                >
                  IG
                </button>
                <button 
                  onClick={() => openWhatsApp("Olá Dr. Caio, vi seu perfil no LinkedIn.")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-xs font-bold hover:bg-blue-600 transition-all"
                >
                  LI
                </button>
                <button 
                  onClick={() => openWhatsApp("Olá Dr. Caio, gostaria de iniciar um atendimento.")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-xs font-bold hover:bg-emerald-600 transition-all"
                >
                  WA
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-slate-800 pt-10 text-center">
            <p className="text-xs text-slate-500">© 2024 Dr. Caio Henrique. Todos os direitos reservados. OAB/SP 000.000</p>
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-slate-800/50 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-sm">{isAdmin ? 'lock_open' : 'lock'}</span>
              Área Administrativa
            </button>
          </div>
        </div>
      </footer>

      {/* Chat Bot Widget */}
      <ChatWidget />
    </div>
  );
};

export default App;

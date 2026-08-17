import { useEffect, useState } from 'react';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';
import logoIcone from '../assets/logo-icone.png';
import SidebarUser from '../components/SidebarUser';

export default function PageAssistenteIA({ navigate }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const loader = (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, background:'var(--bg)' }}>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'4px solid var(--blue)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
      <div style={{ fontSize:14, fontWeight:900, color:'#888' }}>Carregando Assistente IA...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (loading) return loader;

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .ia-mobile { display: none !important; } }
        .ia-desktop { display: none; }
        @media (min-width: 768px) { .ia-desktop { display: block !important; } }
      `}</style>

      <div className="ia-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'8px 20px 24px', color:'#fff' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="cfg-close-x" onClick={() => navigate('home-aluno')}>×</button>
            <div style={{ fontSize:20, fontWeight:900, flex:1, textAlign:'center' }}>Assistente IA</div>
            <div style={{ width:36 }}></div>
          </div>
        </div>
        <div style={{ padding:20, flex:1 }}>
          <div style={{ background:'#fff', borderRadius:24, padding:24, boxShadow:'var(--shadow-card)' }}>
            <div style={{ fontSize:22, fontWeight:900, color:'var(--dark)' }}>Como posso ajudar?</div>
            <div style={{ marginTop:10, color:'#888', fontSize:13 }}>A inteligência artificial está disponível em breve.</div>
            <button onClick={() => navigate('home-aluno')} style={{ marginTop:20, background:'var(--blue)', color:'#fff', border:'none', borderRadius:12, padding:'12px 22px', fontWeight:900, cursor:'pointer' }}>Voltar ao início</button>
          </div>
        </div>
        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      <div className="ia-desktop">
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          <div className="sidebar-nav-item" onClick={() => navigate('home-aluno')}><IconHome />Início</div>
          <div className="sidebar-nav-item" onClick={() => navigate('comunicacao')}><IconChat />Comunicação</div>
          <div className="sidebar-nav-item"><IconSchool />Lições</div>
          <div className="sidebar-nav-item" onClick={() => navigate('agenda')}><IconCalendar />Agenda</div>
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
          <SidebarUser />
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:720 }}>
            <div style={{ background:'#fff', borderRadius:24, padding:30, boxShadow:'var(--shadow-card)' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Assistente IA</div>
              <div style={{ marginTop:10, fontSize:14, color:'#888', fontWeight:700 }}>A inteligência artificial está em construção.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

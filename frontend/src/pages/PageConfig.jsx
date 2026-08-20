import { useEffect, useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings, IconRobot } from '../components/icons';
import SidebarUser from '../components/SidebarUser';
import { speakText } from '../hooks/voiceUtils';

const SETTINGS_KEY = 'autim.user-settings';

function getStoredSettings() {
  const fallback = {
    narrator: true,
    darkMode: false,
    vibration: true,
    notifications: true,
    speed: 50,
    voice: 'Feminina'
  };

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (e) {
    return fallback;
  }
}

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{
      width:48, height:26, borderRadius:99, flexShrink:0, cursor:'pointer', position:'relative',
      background: on ? 'var(--green)' : '#e0e8f0', transition:'background .2s',
    }}>
      <div style={{
        position:'absolute', top:3, left: on ? 25 : 3, width:20, height:20,
        borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.2)',
        transition:'left .2s',
      }} />
    </div>
  );
}

export default function PageConfig({ navigate }) {
  const initialSettings = getStoredSettings();
  const [narrator, setNarrator]   = useState(initialSettings.narrator);
  const [darkMode, setDarkMode]   = useState(initialSettings.darkMode);
  const [vibration, setVibration] = useState(initialSettings.vibration);
  const [notifs, setNotifs]       = useState(initialSettings.notifications);
  const [speed, setSpeed]         = useState(initialSettings.speed);
  const [voice, setVoice]         = useState(initialSettings.voice);
  const [openFaq, setOpenFaq]     = useState(null);

  useEffect(() => {
    const settings = { narrator, darkMode, vibration, notifications: notifs, speed, voice };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.body.classList.toggle('autim-dark-theme', darkMode);
    }
  }, [narrator, darkMode, vibration, notifs, speed, voice]);

  const faqs = [
    { q:'Como funciona o sistema de lições?', a:'As lições são divididas em categorias e fases. Cada fase apresenta uma palavra ou frase para o aluno aprender. O responsável avalia o desempenho após cada fase.' },
    { q:'Como afiliar a uma instituição?',    a:'Vá em Perfil → Afiliação e insira o código fornecido pela sua instituição. Após aprovação, os profissionais poderão acompanhar o progresso do aluno.' },
    { q:'Como entrar em contato com o suporte?', a:'Envie um e-mail para suporte@autim.com.br ou acesse nosso chat de atendimento de segunda a sexta, das 8h às 18h.' },
  ];

  const triggerVibration = () => {
    if (vibration && 'vibrate' in navigator) {
      window.navigator.vibrate(35);
    }
  };

  const testVoice = () => {
    if (!narrator) {
      setNarrator(true);
    }

    const frasesExemplo = {
      Feminina: 'Olá! Sou a voz feminina do narrador do Autim.',
      Masculina: 'Olá! Sou a voz masculina do narrador do Autim.',
      Infantil: 'Olá amiguinho! Sou a voz infantil do Autim!'
    };

    const frase = frasesExemplo[voice] || 'Teste da voz do narrador Autim.';
    speakText(frase, { narrator: true, speed, voice });
  };

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'8px 4px 4px' }}>{children}</div>
  );

  const ConfigItem = ({ icon, bg, title, desc, right }) => (
    <div style={{ background:'var(--white)', borderRadius:16, padding:'15px 18px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 3px 10px rgba(0,0,0,.06)' }}>
      <div style={{ width:40, height:40, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{title}</div>
        {desc && <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginTop:2 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );

  const innerContent = (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <SectionLabel>🔊 Voz do Narrador</SectionLabel>

      <ConfigItem icon="🔊" bg="#fff8e1" title="Narrador ativo" desc="Lê palavras e instruções em voz alta"
        right={<Toggle on={narrator} onChange={() => {
          setNarrator(v => !v);
          triggerVibration();
        }} />} />

      <div style={{ background:'var(--white)', borderRadius:16, padding:'15px 18px', boxShadow:'0 3px 10px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#fff8e1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🐢</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Velocidade da voz</div>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--blue)' }}>
              {speed <= 50 ? `${Math.round(85 + (speed / 50) * 15)}%` : `${Math.round(100 + ((speed - 50) / 50) * 30)}%`}
            </div>
          </div>
          <input type="range" min="0" max="100" value={speed} onChange={e => setSpeed(+e.target.value)}
            style={{ width:'100%', accentColor:'var(--blue)', height:6, borderRadius:99, outline:'none', cursor:'pointer' }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'var(--text-muted)', marginTop:4 }}>
            <span>Mais lento</span><span>Normal</span><span>Mais rápido</span>
          </div>
          <button onClick={testVoice} style={{ marginTop:10, border:'none', borderRadius:999, background:'var(--blue)', color:'#fff', padding:'8px 16px', fontWeight:900, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <span>▶</span> Testar voz atual
          </button>
        </div>
      </div>

      <div style={{ background:'var(--white)', borderRadius:16, padding:'15px 18px', boxShadow:'0 3px 10px rgba(0,0,0,.06)', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'#fff8e1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🎙️</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Tipo de voz</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginTop:2 }}>Escolha o estilo da voz</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[
            { key: 'Feminina', label: '👩 Feminina', desc: 'Natural' },
            { key: 'Masculina', label: '👨 Masculina', desc: 'Normal' },
            { key: 'Infantil', label: '👧 Infantil', desc: 'Alegre' }
          ].map(v => (
            <div key={v.key} onClick={() => {
              setVoice(v.key);
              triggerVibration();
              const frases = {
                Feminina: 'Olá! Sou a voz feminina do narrador do Autim.',
                Masculina: 'Olá! Sou a voz masculina do narrador do Autim.',
                Infantil: 'Olá amiguinho! Sou a voz infantil do Autim, vamos aprender juntos!'
              };
              speakText(frases[v.key], { narrator: true, speed, voice: v.key });
            }} style={{
              padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight:800, cursor:'pointer', transition:'all .2s',
              background: voice===v.key ? 'var(--blue)' : 'var(--input-bg)',
              color:       voice===v.key ? '#fff'         : 'var(--text-muted)',
              border:      voice===v.key ? '2px solid var(--blue)' : '2px solid var(--border)',
            }}>{v.label}</div>
          ))}
        </div>
      </div>

      <SectionLabel>⚙️ Preferências</SectionLabel>
      <ConfigItem icon="🌙" bg="#e8f4ff" title="Modo escuro"   desc="Tema escuro no app"
        right={<Toggle on={darkMode}   onChange={() => {
          setDarkMode(v => !v);
          triggerVibration();
        }} />} />
      <ConfigItem icon="📳" bg="#edfaf3" title="Vibração"      desc="Feedback tátil ao tocar"
        right={<Toggle on={vibration}  onChange={() => {
          setVibration(v => !v);
          triggerVibration();
        }} />} />
      <ConfigItem icon="🔔" bg="#f0f0ff" title="Notificações"  desc="Lembretes de lições e agenda"
        right={<Toggle on={notifs}     onChange={() => {
          setNotifs(v => !v);
          triggerVibration();

          if (typeof Notification !== 'undefined' && Notification.permission === 'default' && !notifs) {
            Notification.requestPermission();
          }
        }} />} />

      <SectionLabel>🆘 Suporte</SectionLabel>
      {faqs.map((faq, i) => (
        <div key={i} onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{
          background:'var(--white)', borderRadius:16, padding:'14px 18px',
          boxShadow:'0 3px 10px rgba(0,0,0,.06)', cursor:'pointer',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)', flex:1, paddingRight:8 }}>{faq.q}</div>
            <div style={{ fontSize:16, color:'var(--text-muted)', transition:'transform .2s', transform: openFaq===i ? 'rotate(90deg)' : 'none', flexShrink:0 }}>›</div>
          </div>
          {openFaq === i && (
            <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, lineHeight:1.6, marginTop:10 }}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .cfg-mobile { display: none !important; } }
        .cfg-desktop { display: none; }
        @media (min-width: 768px) { .cfg-desktop { display: block !important; } }

        .cfg-close-x {
          background: #ff5b50 !important;
          color: white !important;
          border: 2px solid rgba(255,255,255,.88) !important;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          cursor: pointer;
          line-height: 1;
        }
        .cfg-close-x:hover { background: #e3372e !important; transform: scale(1.04); }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="cfg-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'4px 20px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button className="cfg-close-x" onClick={() => navigate('perfil')}>×</button>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Configurações</div>
          <div style={{ width:36 }}></div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px' }}>
          {innerContent}
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="cfg-desktop">
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      active:false, page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      active:false, page:'agenda'      },
            { icon:<IconRobot/>,    label:'Assistente IA', active:false, page:'ia' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item active"><IconSettings />Configurações</div>
          <SidebarUser />
        </nav>

        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:680 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button className="cfg-close-x" onClick={() => navigate('perfil')} style={{ width:40, height:40, background:'#ff5b50' }}>×</button>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Configurações</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Preferências e suporte</div>
              </div>
            </div>
            {innerContent}
          </div>
        </div>
      </div>
    </>
  );
}
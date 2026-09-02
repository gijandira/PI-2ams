import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';

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
  const [narrator, setNarrator]   = useState(true);
  const [darkMode, setDarkMode]   = useState(false);
  const [vibration, setVibration] = useState(true);
  const [notifs, setNotifs]       = useState(true);
  const [speed, setSpeed]         = useState(50);
  const [voice, setVoice]         = useState('Feminina');
  const [openFaq, setOpenFaq]     = useState(null);

  const faqs = [
    { q:'Como funciona o sistema de lições?', a:'As lições são divididas em categorias e fases. Cada fase apresenta uma palavra ou frase para o aluno aprender. O responsável avalia o desempenho após cada fase.' },
    { q:'Como afiliar a uma instituição?',    a:'Vá em Perfil → Afiliação e insira o código fornecido pela sua instituição. Após aprovação, os profissionais poderão acompanhar o progresso do aluno.' },
    { q:'Como entrar em contato com o suporte?', a:'Envie um e-mail para suporte@autimm.com.br ou acesse nosso chat de atendimento de segunda a sexta, das 8h às 18h.' },
  ];

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'8px 4px 4px' }}>{children}</div>
  );

  const ConfigItem = ({ icon, bg, title, desc, right }) => (
    <div style={{ background:'#fff', borderRadius:16, padding:'15px 18px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 3px 10px rgba(0,0,0,.06)' }}>
      <div style={{ width:40, height:40, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{title}</div>
        {desc && <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );

  const innerContent = (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <SectionLabel>🔊 Voz do Narrador</SectionLabel>

      <ConfigItem icon="🔊" bg="#fff8e1" title="Narrador ativo" desc="Lê palavras e instruções em voz alta"
        right={<Toggle on={narrator} onChange={() => setNarrator(v => !v)} />} />

      <div style={{ background:'#fff', borderRadius:16, padding:'15px 18px', boxShadow:'0 3px 10px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#fff8e1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🐢</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)', marginBottom:8 }}>Velocidade da voz</div>
          <input type="range" min="0" max="100" value={speed} onChange={e => setSpeed(+e.target.value)}
            style={{ width:'100%', accentColor:'var(--blue)', height:6, borderRadius:99, outline:'none', cursor:'pointer' }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'#aaa', marginTop:4 }}>
            <span>Lento</span><span>Normal</span><span>Rápido</span>
          </div>
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:16, padding:'15px 18px', boxShadow:'0 3px 10px rgba(0,0,0,.06)', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'#fff8e1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🎙️</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Tipo de voz</div>
            <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>Escolha a voz do narrador</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Feminina','Masculina','Infantil'].map(v => (
            <div key={v} onClick={() => setVoice(v)} style={{
              padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:800, cursor:'pointer', transition:'all .2s',
              background: voice===v ? 'var(--blue)' : '#f0f6ff',
              color:       voice===v ? '#fff'         : '#888',
              border:      voice===v ? '2px solid var(--blue)' : '2px solid #e0e8f0',
            }}>{v}</div>
          ))}
        </div>
      </div>

      <SectionLabel>⚙️ Preferências</SectionLabel>
      <ConfigItem icon="🌙" bg="#e8f4ff" title="Modo escuro"   desc="Tema escuro no app"
        right={<Toggle on={darkMode}   onChange={() => setDarkMode(v => !v)} />} />
      <ConfigItem icon="📳" bg="#edfaf3" title="Vibração"      desc="Feedback tátil ao tocar"
        right={<Toggle on={vibration}  onChange={() => setVibration(v => !v)} />} />
      <ConfigItem icon="🔔" bg="#f0f0ff" title="Notificações"  desc="Lembretes de lições e agenda"
        right={<Toggle on={notifs}     onChange={() => setNotifs(v => !v)} />} />

      <SectionLabel>🆘 Suporte</SectionLabel>
      {faqs.map((faq, i) => (
        <div key={i} onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{
          background:'#fff', borderRadius:16, padding:'14px 18px',
          boxShadow:'0 3px 10px rgba(0,0,0,.06)', cursor:'pointer',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)', flex:1, paddingRight:8 }}>{faq.q}</div>
            <div style={{ fontSize:16, color:'#ccc', transition:'transform .2s', transform: openFaq===i ? 'rotate(90deg)' : 'none', flexShrink:0 }}>›</div>
          </div>
          {openFaq === i && (
            <div style={{ fontSize:12, color:'#666', fontWeight:600, lineHeight:1.6, marginTop:10 }}>{faq.a}</div>
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
      `}</style>

      {/* ── MOBILE ── */}
      <div className="cfg-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'4px 20px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={() => navigate('perfil')} style={{ background:'rgba(255,255,255,.2)', border:'none', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>‹</button>
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
      <div className="cfg-desktop" style={{ display:'none' }}>
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
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item active"><IconSettings />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">J</div>
            <div><div className="sidebar-user-name">João Pedro</div><div className="sidebar-user-role">Responsável</div></div>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:680 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button onClick={() => navigate('perfil')} style={{ width:40, height:40, borderRadius:'50%', background:'#fff', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-card)', flexShrink:0 }}>‹</button>
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
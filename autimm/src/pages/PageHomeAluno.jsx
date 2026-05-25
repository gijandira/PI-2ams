import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconRobot, IconSettings } from '../components/icons';

export default function PageHomeAluno({ navigate }) {
  const modules = [
    { href:'comunicacao', icon:'💬', label:'Comunicação', color:'card-blue' },
    { href:'licoes',      icon:'🎓', label:'Lições',      color:'card-green' },
    { href:'agenda',      icon:'📅', label:'Agenda',      color:'card-pink' },
    { href:'perfil',      icon:'👤', label:'Perfil',       color:'card-red' },
    { href:'config',      icon:'⚙️', label:'Configurações',color:'card-yellow' },
    { href:'ia',          icon:'🤖', label:'Assistente IA',color:'card-dark' },
  ];

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .ha-mobile { display: none !important; } }
        .ha-desktop { display: none; }
        @media (min-width: 768px) { .ha-desktop { display: block !important; } }
        .ia-btn-desktop:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(56,167,251,.5) !important; }
        .module-card-desktop:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.12) !important; }
        .activity-item-row:hover { background: #f8faff; }
      `}</style>

      {/* MOBILE */}
      <div className="ha-mobile" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ display:'flex', alignItems:'center', padding:'6px 20px 14px', gap:14 }}>
          <img src={logoIcone} alt="Autim" style={{ width:42, height:42, objectFit:'contain', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1 }}>Olá, responsável 👋</div>
            <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>João Pedro</div>
          </div>
          <button style={{ width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,var(--blue),#1a6ecc)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(56,167,251,.5)', cursor:'pointer', fontSize:22, flexShrink:0, border:'none' }}>🤖</button>
        </div>
        <div style={{ flex:1, padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, alignContent:'center' }}>
          {modules.map((m, i) => (
            <div key={i} className={`module-card ${m.color}`} style={{ cursor:'pointer' }} onClick={() => navigate(m.href)}>
              <div className="icon-bg">{m.icon}</div>
              <div className="card-label">{m.label}</div>
            </div>
          ))}
        </div>
        <nav className="bottom-nav">
          <div className="nav-item active"><div className="nav-icon active"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" style={{ cursor:'pointer' }} onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" style={{ cursor:'pointer' }} onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item"><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* DESKTOP */}
      <div className="ha-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',        active:true,  href:null           },
            { icon:<IconChat/>,     label:'Comunicação',   active:false, href:'comunicacao'  },
            { icon:<IconSchool/>,   label:'Lições',        active:false, href:null           },
            { icon:<IconCalendar/>, label:'Agenda',        active:false, href:'agenda'       },
            { icon:<IconRobot/>,    label:'Assistente IA', active:false, href:null           },
          ].map((item, i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} style={{ cursor: item.href ? 'pointer' : 'default' }} onClick={() => item.href && navigate(item.href)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item"><IconSettings />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">J</div>
            <div><div className="sidebar-user-name">João Pedro</div><div className="sidebar-user-role">Responsável</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Bom dia, responsável 👋</div>
                <div style={{ fontSize:30, fontWeight:900, color:'var(--dark)' }}>Olá, João Pedro</div>
              </div>
              <button className="ia-btn-desktop" style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 20px', background:'linear-gradient(135deg,var(--blue),#1a6ecc)', borderRadius:14, color:'#fff', fontSize:14, fontWeight:800, border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(56,167,251,.4)', transition:'transform var(--transition), box-shadow var(--transition)' }}>🤖 Assistente IA</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
              {[
                { num:'12', label:'Lições concluídas', color:'var(--blue)' },
                { num:'78%', label:'Taxa de acerto', color:'var(--green)' },
                { num:'⭐ 340', label:'XP acumulado', color:'var(--yellow)' },
                { num:'5', label:'Dias consecutivos', color:'var(--pink)' },
              ].map((s, i) => (
                <div key={i} style={{ background:'var(--white)', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)', borderLeft:`4px solid ${s.color}` }}>
                  <div style={{ fontSize:26, fontWeight:900, color:s.color }}>{s.num}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:'var(--dark)', marginBottom:16 }}>Módulos</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:32 }}>
              {modules.map((m, i) => (
                <div key={i} className={`module-card module-card-desktop ${m.color}`} style={{ padding:'28px 16px 22px', cursor:'pointer' }} onClick={() => navigate(m.href)}>
                  <div className="icon-bg" style={{ width:64, height:64, fontSize:34 }}>{m.icon}</div>
                  <div className="card-label" style={{ fontSize:14 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:'var(--dark)', marginBottom:16 }}>Atividade recente</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { icon:'🎓', bg:'#e8f4ff', title:'Lição "Cores e Formas" concluída', sub:'Lucas obteve 90% de acerto', time:'há 2h' },
                { icon:'💬', bg:'#e8f9ef', title:'Nova mensagem da professora Ana', sub:'Escola Inclusiva Arco-Íris', time:'há 4h' },
                { icon:'📅', bg:'#fff0f7', title:'Lembrete: Consulta com especialista', sub:'Amanhã às 14h00', time:'hoje' },
              ].map((a, i) => (
                <div key={i} className="activity-item-row" style={{ background:'var(--white)', borderRadius:16, padding:'14px 18px', display:'flex', alignItems:'center', gap:14, boxShadow:'var(--shadow-card)', cursor:'pointer', transition:'background var(--transition)' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:a.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{a.title}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{a.sub}</div>
                  </div>
                  <div style={{ marginLeft:'auto', fontSize:12, color:'#aaa', fontWeight:700, flexShrink:0 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
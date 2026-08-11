import { useState, useEffect } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings, IconRobot } from '../components/icons';
import SidebarUser from '../components/SidebarUser';

export default function PagePerfil({ navigate }) {
  const handleLogout = () => {
    localStorage.clear();
    navigate('login');
  };

  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({
    nome: 'Carregando...',
    responsavel: 'Carregando...',
    avatarUrl: null,
    diasSeguidos: 0,
    xpTotal: 0,
    licoes: 0
  });

  useEffect(() => {
    console.log("--- DEBUG: O useEffect do Perfil iniciou ---");
    
    const token = localStorage.getItem('token');
    console.log("DEBUG: Token encontrado no localStorage:", token);

    if (!token) {
      console.warn("DEBUG: Nenhum token encontrado! A redirecionar para index.");
      navigate('index');
      return;
    }

    console.log("DEBUG: Token existe. A preparar para fazer o fetch...");
    
fetch('http://localhost:3001/auth/perfil-usuario', { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log("DEBUG: Resposta do servidor recebida com status:", res.status);
      if (!res.ok) throw new Error('Status do servidor: ' + res.status);
      return res.json();
    })

  .then(data => {
  console.log("DEBUG: Dados recebidos do servidor:", data);
  
  const user = data.usuario || {}; // O Responsável (Mota)
  const aluno = data.aluno || {};  // A Criança (Patrick/Aluno)

  setUsuario({
          nome: aluno.ALU_NOME || aluno.nome || 'Aluno sem nome',
          responsavel: user.USU_NOME || user.nome || 'Não informado',
          avatarUrl: aluno.ALU_URLAVATAR || null,
          diasSeguidos: aluno.ALU_DIAS_OFENSIVA ?? aluno.diasSeguidos ?? 0,
          xpTotal: aluno.ALU_XP_TOTAL ?? aluno.xpTotal ?? 0,
          licoes: aluno.licoes || 0
  });
})

    .catch(err => {
      console.error("DEBUG: Ocorreu um erro no bloco CATCH:", err);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [navigate]);

  const avatarImage = usuario.avatarUrl ? `http://localhost:3001${usuario.avatarUrl}` : null;
  const avatarInitial = usuario.nome ? usuario.nome.trim().charAt(0).toUpperCase() : '👦';

  const menuItems = [
    { icon:'📊', bg:'#e8f4ff',  title:'Ver Progresso',   desc:'Acompanhe a evolução do aluno',    page:null,       danger:false },
    { icon:'🔊', bg:'#fff8e1',  title:'Voz do Narrador', desc:'Ajuste velocidade e voz',          page:'config',   danger:false },
    { icon:'🏫', bg:'#edfaf3',  title:'Afiliação',       desc:'Vincular a uma instituição',        page:null,       danger:false },
    { icon:'⚙️', bg:'#f0f0ff',  title:'Configurações',   desc:'Preferências do aplicativo',        page:'config',   danger:false },
    { icon:'🆘', bg:'#f0f0ff',  title:'Suporte',         desc:'Ajuda e dúvidas frequentes',         page:'config',   danger:false },
    { icon:'🚪', bg:'#ffecec',  title:'Sair da conta',   desc:'Fazer logout',                      page:'index',    danger:true, action: 'logout' },
  ];

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      localStorage.clear();
      navigate('index');
      return;
    }
    if (item.page) {
      navigate(item.page);
    }
  };

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .pf-mobile { display: none !important; } }
        .pf-desktop { display: none; }
        @media (min-width: 768px) { .pf-desktop { display: block !important; } }

        .pf-hero { background: var(--blue); padding: 8px 24px 36px; display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; flex-shrink: 0; }
        .pf-hero::after { content:''; position:absolute; bottom:-20px; left:0; right:0; height:40px; background:var(--bg); border-radius:32px 32px 0 0; }
        .pf-avatar { width:84px; height:84px; border-radius:50%; background:#fff; border:4px solid rgba(255,255,255,.5); display:flex; align-items:center; justify-content:center; font-size:40px; box-shadow:0 4px 16px rgba(0,0,0,.2); position:relative; z-index:1; }
        .pf-name { font-size:22px; font-weight:900; color:#fff; position:relative; z-index:1; }
        .pf-sub { font-size:13px; color:rgba(255,255,255,.8); font-weight:600; position:relative; z-index:1; }
        .pf-edit-btn { background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.5); border-radius:20px; padding:6px 16px; font-family:'Nunito',sans-serif; font-size:12px; font-weight:800; color:#fff; cursor:pointer; position:relative; z-index:1; transition:background .2s; }
        .pf-edit-btn:hover { background:rgba(255,255,255,.35); }

        .pf-stat-card { flex:1; background:#fff; border-radius:18px; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:4px; box-shadow:0 3px 10px rgba(0,0,0,.07); }
        .pf-stat-num { font-size:22px; font-weight:900; color:var(--dark); }
        .pf-stat-label { font-size:10px; font-weight:800; color:#888; text-transform:uppercase; letter-spacing:.5px; text-align:center; }

        .pf-menu-item { background:#fff; border-radius:16px; padding:15px 18px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:transform .15s; box-shadow:0 3px 10px rgba(0,0,0,.06); }
        .pf-menu-item:hover { transform:translateX(3px); }
        .pf-menu-item:active { transform:scale(.97); }
        .pf-menu-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
        .pf-menu-arrow { font-size:18px; color:#ccc; }
        .pf-menu-item.danger .pf-menu-title { color:var(--red); }
        .pf-menu-item.danger .pf-menu-arrow { color:var(--red); }
        .pf-loading { padding: 36px 16px; text-align:center; color:#7a8a9c; font-weight:900; }
      `}</style>

      {loading ? (
        <div className="pf-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', justifyContent:'center', paddingTop:20 }}>
          <div className="pf-loading">Carregando perfil...</div>
        </div>
      ) : (
        <>
          {/* ── MOBILE ── */}
          <div className="pf-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop: 'calc(env(safe-area-inset-top, 12px) + 5px)' }}>
            <div className="pf-hero" style={{ marginTop:0, paddingTop: 'calc(env(safe-area-inset-top, 12px) + 10px)', zIndex:1001 }}>
              <div className="pf-avatar" style={{ overflow:'hidden' }}>
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  avatarInitial
                )}
              </div>
              <div className="pf-name">{usuario.nome}</div>
              <div className="pf-sub">Responsável: {usuario.responsavel}</div>
              <button className="pf-edit-btn" onClick={() => navigate('editar-perfil')}>✏️ Editar perfil</button>
            </div>

            {/* stats */}
            <div style={{ display:'flex', gap:10, padding:'28px 16px 6px', flexShrink:0 }}>
              {[
                { num: `🔥 ${usuario.diasSeguidos}`, label: 'Dias seguidos' },
                { num: `⭐ ${usuario.xpTotal}`, label: 'XP Total' },
                { num: `🎓 ${usuario.licoes}`, label: 'Lições' }
              ].map((s,i) => (
                <div key={i} className="pf-stat-card">
                  <div className="pf-stat-num">{s.num}</div>
                  <div className="pf-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* menu */}
            <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px', display:'flex', flexDirection:'column', gap:8 }}>
              {menuItems.map((item, i) => (
                <div key={i} className={`pf-menu-item ${item.danger?'danger':''}`} onClick={() => handleMenuClick(item)}>
                  <div className="pf-menu-icon" style={{ background: item.bg }}>{item.icon}</div>
                  <div style={{ flex:1 }}>
                    <div className="pf-menu-title" style={{ fontSize:14, fontWeight:800, color: item.danger ? 'var(--red)' : 'var(--dark)' }}>{item.title}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{item.desc}</div>
                  </div>
                  <div className="pf-menu-arrow">›</div>
                </div>
              ))}
            </div>

            <nav className="bottom-nav">
              <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
              <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
              <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
              <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
              <div className="nav-item active"><div className="nav-icon active"><IconPerson /></div><div className="nav-label">Perfil</div></div>
            </nav>
          </div>

          {/* ── DESKTOP ── */}
          <div className="pf-desktop">
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
              <div className="sidebar-nav-item active"><IconPerson />Perfil</div>
              <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
              <div className="sidebar-nav-item" onClick={handleLogout} style={{ cursor:'pointer', color:'#e94542' }}>🚪 Sair</div>
              <SidebarUser />
            </nav>

            <div className="main-content">
              <div className="page-wrapper" style={{ maxWidth:720 }}>
                {/* profile card */}
                <div style={{ background:'linear-gradient(135deg,#0e2d52 0%,var(--blue) 100%)', borderRadius:24, padding:'32px 36px', display:'flex', alignItems:'center', gap:24, marginBottom:28, color:'#fff', boxShadow:'0 8px 24px rgba(56,167,251,.3)' }}>
                  <div style={{ width:88, height:88, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, border:'4px solid rgba(255,255,255,.4)', flexShrink:0, overflow:'hidden' }}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      avatarInitial
                    )}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:24, fontWeight:900 }}>{usuario.nome}</div>
                    <div style={{ fontSize:14, opacity:.8, fontWeight:600, marginTop:4 }}>Responsável: {usuario.responsavel}</div>
                  </div>
                  <button onClick={() => navigate('editar-perfil')} style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.5)', borderRadius:20, padding:'8px 20px', fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, color:'#fff', cursor:'pointer' }}>✏️ Editar perfil</button>
                </div>

                {/* stats */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
                  {[
                    { num: `🔥 ${usuario.diasSeguidos}`, label: 'Dias seguidos', color: 'var(--red)' },
                    { num: `⭐ ${usuario.xpTotal}`, label: 'XP Total', color: 'var(--yellow)' },
                    { num: `🎓 ${usuario.licoes}`, label: 'Lições concluídas', color: 'var(--blue)' }
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#fff', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)', textAlign:'center' }}>
                      <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.num}</div>
                      <div style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:6 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* menu grid */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {menuItems.map((item, i) => (
                    <div key={i} className={`pf-menu-item ${item.danger?'danger':''}`} onClick={() => handleMenuClick(item)} style={{ borderRadius:18, padding:'18px 20px' }}>
                      <div className="pf-menu-icon" style={{ background: item.bg, width:48, height:48, borderRadius:14, fontSize:24 }}>{item.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:800, color: item.danger ? 'var(--red)' : 'var(--dark)' }}>{item.title}</div>
                        <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{item.desc}</div>
                      </div>
                      <div className="pf-menu-arrow" style={{ color: item.danger ? 'var(--red)' : '#ccc' }}>›</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
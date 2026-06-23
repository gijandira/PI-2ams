import { useEffect, useState } from 'react';

import logoIcone from '../assets/logo-icone.png';

import {
  IconHome,
  IconChat,
  IconSchool,
  IconCalendar,
  IconPerson,
  IconRobot,
  IconSettings
} from '../components/icons';

export default function PageHomeAluno({ navigate }) {
const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('login');

  };
  const [usuario, setUsuario] = useState(null);
const [aluno, setAluno] = useState(null);
const [perfil, setPerfil] = useState(null);

const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
  try {

    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://localhost:3001/auth/perfil-usuario',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      setUsuario(data.usuario);
      setAluno(data.aluno);
      setPerfil(data.perfil);

    } else {

      console.log('Erro da API:', data);

    }

  } catch (error) {

    console.log('Erro fetch:', error);

  } finally {

    setLoading(false);

  }
};

  const modules = [
    { href:'comunicacao', icon:'💬', label:'Comunicação', color:'card-blue' },
    { href:'licoes',      icon:'🎓', label:'Lições',      color:'card-green' },
    { href:'agenda',      icon:'📅', label:'Agenda',      color:'card-pink' },
    { href:'perfil',      icon:'👤', label:'Perfil',       color:'card-red' },
    { href:'config',      icon:'⚙️', label:'Configurações',color:'card-yellow' },
    { href:'ia',          icon:'🤖', label:'Assistente IA',color:'card-dark' },
  ];

  if (loading) {
  return (
    <div
      style={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontSize:22,
        fontWeight:800
      }}
    >
      Carregando...
    </div>
  );

  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .ha-mobile {
            display: none !important;
          }
        }

        .ha-desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .ha-desktop {
            display: block !important;
          }
        }

        .ia-btn-desktop:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(56,167,251,.5) !important;
        }

        .module-card-desktop:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,.12) !important;
        }

        .activity-item-row:hover {
          background: #f8faff;
        }
      `}</style>

      {/* MOBILE */}
      <div
        className="ha-mobile"
        style={{
          minHeight:'100vh',
          display:'flex',
          flexDirection:'column',
          paddingTop:60
        }}
      >

        <div
          style={{
            display:'flex',
            alignItems:'center',
            padding:'6px 20px 14px',
            gap:14
          }}
        >
          <img
            src={logoIcone}
            alt="Autim"
            style={{
              width:42,
              height:42,
              objectFit:'contain',
              flexShrink:0
            }}
          />

          <div style={{ flex:1 }}>
            <div
              style={{
                fontSize:12,
                fontWeight:700,
                color:'#888',
                textTransform:'uppercase',
                letterSpacing:1
              }}
            >
              Olá, responsável 👋
            </div>

            <div
              style={{
                fontSize:20,
                fontWeight:900,
                color:'var(--dark)'
              }}
            >
            {usuario?.USU_NOME}
            </div>
          </div>

          <button
            style={{
              width:46,
              height:46,
              borderRadius:'50%',
              background:'linear-gradient(135deg,var(--blue),#1a6ecc)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              boxShadow:'0 4px 14px rgba(56,167,251,.5)',
              cursor:'pointer',
              fontSize:22,
              flexShrink:0,
              border:'none'
            }}
          >
            🤖
          </button>
        </div>

        <button
  onClick={handleLogout}
  style={{
    width:46,
    height:46,
    borderRadius:'50%',
    background:'linear-gradient(135deg,#ff5f5f,#d93636)',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    boxShadow:'0 4px 14px rgba(255,0,0,.25)',
    cursor:'pointer',
    fontSize:20,
    flexShrink:0,
    border:'none',
    color:'#fff'
  }}
>
  🚪
</button>

        <div
          style={{
            flex:1,
            padding:'0 16px',
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:12,
            alignContent:'center'
          }}
        >
          {modules.map((m, i) => (
            <div
              key={i}
              className={`module-card ${m.color}`}
              onClick={() => navigate(m.href)}
            >
              <div className="icon-bg">{m.icon}</div>
              <div className="card-label">{m.label}</div>
            </div>
          ))}
        </div>

        <nav className="bottom-nav">

          <div className="nav-item active">
            <div className="nav-icon active">
              <IconHome />
            </div>
            <div className="nav-label">Início</div>
          </div>

          <div className="nav-item" onClick={() => navigate('comunicacao')}>
            <div className="nav-icon">
              <IconChat />
            </div>
            <div className="nav-label">Comunicar</div>
          </div>

          <div className="nav-item">
            <div className="nav-icon">
              <IconSchool />
            </div>
            <div className="nav-label">Lições</div>
          </div>

          <div className="nav-item" onClick={() => navigate('agenda')}>
            <div className="nav-icon">
              <IconCalendar />
            </div>
            <div className="nav-label">Agenda</div>
          </div>

          <div className="nav-item">
            <div className="nav-icon">
              <IconPerson />
            </div>
            <div className="nav-label">Perfil</div>
          </div>

        </nav>
      </div>

      {/* DESKTOP */}
      <div className="ha-desktop" style={{ display:'none' }}>

        <nav className="desktop-sidebar">

          <div className="sidebar-logo">
            <img
              src={logoIcone}
              alt="Autim"
              style={{
                width:28,
                height:28,
                objectFit:'contain'
              }}
            />

            <span className="sidebar-logo-name">
              Autim
            </span>
          </div>

          {[
            { icon:<IconHome/>,     label:'Início',        active:true  },
            { icon:<IconChat/>,     label:'Comunicação',   active:false, page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',        active:false },
            { icon:<IconCalendar/>, label:'Agenda',        active:false, page:'agenda' },
            { icon:<IconRobot/>,    label:'Assistente IA', active:false },
          ].map((item, i) => (
            <div
  key={i}
  className={`sidebar-nav-item ${item.active?'active':''}`}
  onClick={() => item.page && navigate(item.page)}
  style={{ cursor:'pointer' }}
>
              {item.icon}
              {item.label}
            </div>
          ))}

          <div className="sidebar-spacer"></div>

          <div className="sidebar-nav-item">
            <IconPerson />
            Perfil
          </div>

          <div className="sidebar-nav-item">
            <IconSettings />
            Configurações
          </div>

          <div className="sidebar-nav-item" onClick={handleLogout} style={{ cursor:'pointer', color:'var(--red)'}}>
           🚪
            Sair
          </div>

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {usuario?.USU_NOME?.charAt(0)}
            </div>

            <div>
              <div className="sidebar-user-name">
                {usuario?.USU_NOME}
              </div>

              <div className="sidebar-user-role">
                {usuario?.USU_CARGO}
              </div>
            </div>

          </div>

        </nav>

        <div className="main-content">

          <div className="page-wrapper">

            <div
              style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between',
                marginBottom:28
              }}
            >
              <div>

                <div
                  style={{
                    fontSize:14,
                    fontWeight:700,
                    color:'#888',
                    textTransform:'uppercase',
                    letterSpacing:1,
                    marginBottom:4
                  }}
                >
                  Bom dia, responsável 👋
                </div>

                <div
                  style={{
                    fontSize:30,
                    fontWeight:900,
                    color:'var(--dark)'
                  }}
                >
                  Olá, {usuario?.USU_NOME}
                </div>

              </div>

              <button
                className="ia-btn-desktop"
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:10,
                  padding:'12px 20px',
                  background:'linear-gradient(135deg,var(--blue),#1a6ecc)',
                  borderRadius:14,
                  color:'#fff',
                  fontSize:14,
                  fontWeight:800,
                  border:'none',
                  cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(56,167,251,.4)',
                  transition:'transform var(--transition), box-shadow var(--transition)'
                }}
              >
                🤖 Assistente IA
              </button>

            </div>

            <div
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(4,1fr)',
                gap:16,
                marginBottom:28
              }}
            >

              {[
                {
                  num: aluno?.ALU_XP_TOTAL || 0,
                  label:'XP acumulado',
                  color:'var(--yellow)'
                },

                {
                  num: aluno?.ALU_DIAS_OFENSIVA || 0,
                  label:'Dias consecutivos',
                  color:'var(--pink)'
                },

                {
                  num: perfil?.PER_NIVEL || 'iniciante',
                  label:'Nível',
                  color:'var(--green)'
                },

                {
                  num: usuario?.USU_CARGO || '',
                  label:'Cargo',
                  color:'var(--blue)'
                },

              ].map((s, i) => (

                <div
                  key={i}
                  style={{
                    background:'var(--white)',
                    borderRadius:18,
                    padding:20,
                    boxShadow:'var(--shadow-card)',
                    borderLeft:`4px solid ${s.color}`
                  }}
                >
                  <div
                    style={{
                      fontSize:26,
                      fontWeight:900,
                      color:s.color
                    }}
                  >
                    {s.num}
                  </div>

                  <div
                    style={{
                      fontSize:11,
                      fontWeight:800,
                      color:'#888',
                      textTransform:'uppercase',
                      letterSpacing:.5,
                      marginTop:4
                    }}
                  >
                    {s.label}
                  </div>

                </div>

              ))}

            </div>

            <div
              style={{
                fontSize:16,
                fontWeight:900,
                color:'var(--dark)',
                marginBottom:16
              }}
            >
              Módulos
            </div>

            <div
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(3,1fr)',
                gap:20,
                marginBottom:32
              }}
            >
              {modules.map((m, i) => (
                <div
                  key={i}
                  className={`module-card module-card-desktop ${m.color}`}
                  style={{
                    padding:'28px 16px 22px'
                  }}
                  onClick={() => navigate(m.href)}
                >
                  <div
                    className="icon-bg"
                    style={{
                      width:64,
                      height:64,
                      fontSize:34
                    }}
                  >
                    {m.icon}
                  </div>

                  <div
                    className="card-label"
                    style={{ fontSize:14 }}
                  >
                    {m.label}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
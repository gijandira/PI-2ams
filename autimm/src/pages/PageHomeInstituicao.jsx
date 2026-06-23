import { useState, useEffect } from 'react';

import logoIcone from '../assets/logo-icone.png';

import {
  IconHome,
  IconChat,
  IconCalendar,
  IconPerson,
  IconSettings
} from '../components/icons';

export default function PageHomeInstituicao({ navigate }) {

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('login');

  };
  
  const [tabMob, setTabMob] = useState('alunos');

  const [tabDesk, setTabDesk] = useState('alunos');

  const [instituicao, setInstituicao] = useState(null);

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  const [reqsMob, setReqsMob] = useState([]);

  const [reqsDesk, setReqsDesk] = useState([]);

  const [stats, setStats] = useState({
    totalAlunos: 0,
    media: 0,
    solicitacoes: 0,
    ativosHoje: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {

    try {

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:3001/auth/perfil-instituicao',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(data);
      console.log(data.instituicao);

      if (response.ok) {

        setInstituicao(data.instituicao);

      } else {

        console.log(data);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

   if (loading) {
  return (
    <div style={{ color: '#000', fontSize: 30 }}>
      Carregando...
    </div>
  );
}

if (!instituicao) {
  return (
    <div style={{ color: '#000' }}>
      Nenhuma instituição encontrada
    </div>
  );
}

  const doActionMob = async (id, action) => {

    setReqsMob(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: action }
          : r
      )
    );

  };

  const doActionDesk = async (id, action) => {

    setReqsDesk(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: action }
          : r
      )
    );

  };


  return (
    <>
      <style>{`
  .hi-mobile {
    display: flex;
    flex-direction: column;
  }

  .hi-desktop {
    display: none;
  }

  @media (max-width: 767px) {
    .hi-mobile {
      display: flex;
    }
  }

  .student-card-mob:hover,
  .student-card-d:hover {
    transform: translateX(3px);
  }

  .tab-btn-green {
    flex:1;
    padding:10px 6px;
    border:none;
    border-radius:14px;
    font-family:'Nunito',sans-serif;
    font-size:12px;
    font-weight:800;
    cursor:pointer;
    transition:all .2s;
    background:#e0eaf0;
    color:#888;
    position:relative;
    white-space:nowrap;
  }

  .tab-btn-green.active {
    background:#48c378;
    color:#fff;
    box-shadow:0 4px 12px rgba(72,195,120,.4);
  }
`}</style>

      {/* MOBILE */}
      <div
        className="hi-mobile"
        style={{
          minHeight:'100vh',
          display:'flex',
          flexDirection:'column',
          paddingTop:60
        }}
      >

        <div
          style={{
            marginTop:-55,
            background:'var(--green)',
            padding:'6px 20px 18px',
            display:'flex',
            alignItems:'center',
            gap:14
          }}
        >
<button
  onClick={handleLogout}
  style={{
    width:42,
    height:42,
    borderRadius:'50%',
    background:'rgba(255,0,0,.22)',
    border:'none',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
    fontSize:18,
    position:'relative',
    flexShrink:0,
    color:'#fff'
  }}
>
  🚪
</button>
          <div
            style={{
              width:58,
              height:58,
              borderRadius:16,
              background:'#fff',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:30,
              boxShadow:'0 3px 12px rgba(0,0,0,.18)',
              flexShrink:0
            }}
          >
            🏫
          </div>

          <div style={{ flex:1 }}>

            <div
              style={{
                fontSize:18,
                fontWeight:900,
                color:'#fff'
              }}
            >
             {instituicao?.INS_NOME || instituicao?.ins_nome || 'Instituição'}
            </div>

            <div
              style={{
                fontSize:12,
                color:'rgba(255,255,255,.8)',
                fontWeight:600,
                marginTop:2
              }}
            >
              {stats.totalAlunos} alunos cadastrados
            </div>

          </div>

          <button
            style={{
              width:42,
              height:42,
              borderRadius:'50%',
              background:'rgba(255,255,255,.2)',
              border:'none',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              cursor:'pointer',
              fontSize:20,
              position:'relative',
              flexShrink:0
            }}
          >
            🔔

            <span
              style={{
                position:'absolute',
                top:-2,
                right:-2,
                width:17,
                height:17,
                borderRadius:'50%',
                background:'var(--red)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:9,
                fontWeight:900,
                color:'#fff'
              }}
            >
              {stats.solicitacoes}
            </span>

          </button>

        </div>
              
        <div
          style={{
            display:'flex',
            gap:10,
            padding:'14px 16px 8px'
          }}
        >

          {[
            {
              num:stats.totalAlunos,
              label:'Alunos'
            },

            {
              num:`${stats.media}%`,
              label:'Média'
            },

            {
              num:stats.solicitacoes,
              label:'Solicit.'
            }

          ].map((s,i) => (

            <div
              key={i}
              style={{
                flex:1,
                background:'#fff',
                borderRadius:16,
                padding:'12px 8px',
                textAlign:'center',
                boxShadow:'0 3px 10px rgba(0,0,0,.07)'
              }}
            >

              <div
                style={{
                  fontSize:20,
                  fontWeight:900,
                  color:'var(--dark)'
                }}
              >
                {s.num}
              </div>

              <div
                style={{
                  fontSize:9,
                  fontWeight:800,
                  color:'#888',
                  textTransform:'uppercase',
                  letterSpacing:.5,
                  marginTop:2
                }}
              >
                {s.label}
              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
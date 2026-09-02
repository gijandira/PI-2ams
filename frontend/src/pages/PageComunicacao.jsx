import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';

const CATEGORIES = [
  { id: 'sentimentos',  label: '😊 Sentimentos'  },
  { id: 'necessidades', label: '🍽️ Necessidades' },
  { id: 'acoes',        label: '🏃 Ações'         },
  { id: 'lugares',      label: '📍 Lugares'       },
  { id: 'pessoas',      label: '👨‍👩‍👧 Pessoas'  },
];

const CARDS = {
  sentimentos: [
    { emoji:'😄', label:'Feliz',     bg:'#fdbe2d', shadow:'rgba(253,190,45,.45)'  },
    { emoji:'😢', label:'Triste',    bg:'#38a7fb', shadow:'rgba(56,167,251,.45)'  },
    { emoji:'😠', label:'Bravo',     bg:'#e94542', shadow:'rgba(233,69,66,.45)'   },
    { emoji:'😨', label:'Assustado', bg:'#e9589a', shadow:'rgba(233,88,154,.45)'  },
    { emoji:'😴', label:'Cansado',   bg:'#a1887f', shadow:'rgba(161,136,127,.4)'  },
    { emoji:'😤', label:'Frustrado', bg:'#48c378', shadow:'rgba(72,195,120,.45)'  },
  ],
  necessidades: [
    { emoji:'🍔', label:'Fome',      bg:'#fdbe2d', shadow:'rgba(253,190,45,.45)'  },
    { emoji:'💧', label:'Sede',      bg:'#38a7fb', shadow:'rgba(56,167,251,.45)'  },
    { emoji:'🚽', label:'Banheiro',  bg:'#48c378', shadow:'rgba(72,195,120,.45)'  },
    { emoji:'😴', label:'Dormir',    bg:'#5c6bc0', shadow:'rgba(92,107,192,.4)'   },
    { emoji:'🤕', label:'Dor',       bg:'#e94542', shadow:'rgba(233,69,66,.45)'   },
    { emoji:'🤗', label:'Abraço',    bg:'#e9589a', shadow:'rgba(233,88,154,.45)'  },
  ],
  acoes: [
    { emoji:'🏃', label:'Correr',    bg:'#48c378', shadow:'rgba(72,195,120,.45)'  },
    { emoji:'🎮', label:'Brincar',   bg:'#38a7fb', shadow:'rgba(56,167,251,.45)'  },
    { emoji:'📚', label:'Estudar',   bg:'#fdbe2d', shadow:'rgba(253,190,45,.45)'  },
    { emoji:'🎵', label:'Música',    bg:'#e9589a', shadow:'rgba(233,88,154,.45)'  },
    { emoji:'🍽️', label:'Comer',    bg:'#a1887f', shadow:'rgba(161,136,127,.4)'  },
    { emoji:'🛁', label:'Banho',     bg:'#5c6bc0', shadow:'rgba(92,107,192,.4)'   },
  ],
  lugares: [
    { emoji:'🏫', label:'Escola',    bg:'#38a7fb', shadow:'rgba(56,167,251,.45)'  },
    { emoji:'🏠', label:'Casa',      bg:'#48c378', shadow:'rgba(72,195,120,.45)'  },
    { emoji:'🏥', label:'Hospital',  bg:'#e94542', shadow:'rgba(233,69,66,.45)'   },
    { emoji:'🛒', label:'Mercado',   bg:'#fdbe2d', shadow:'rgba(253,190,45,.45)'  },
    { emoji:'🌳', label:'Parque',    bg:'#a1887f', shadow:'rgba(161,136,127,.4)'  },
    { emoji:'🏊', label:'Piscina',   bg:'#5c6bc0', shadow:'rgba(92,107,192,.4)'   },
  ],
  pessoas: [
    { emoji:'👩',   label:'Mãe',        bg:'#e9589a', shadow:'rgba(233,88,154,.45)'  },
    { emoji:'👨',   label:'Pai',         bg:'#38a7fb', shadow:'rgba(56,167,251,.45)'  },
    { emoji:'👧',   label:'Irmã',        bg:'#fdbe2d', shadow:'rgba(253,190,45,.45)'  },
    { emoji:'👦',   label:'Irmão',       bg:'#48c378', shadow:'rgba(72,195,120,.45)'  },
    { emoji:'👩‍🏫', label:'Professora', bg:'#a1887f', shadow:'rgba(161,136,127,.4)'  },
    { emoji:'👨‍⚕️', label:'Médico',    bg:'#5c6bc0', shadow:'rgba(92,107,192,.4)'   },
  ],
};

function ECard({ card, size = 'mobile' }) {
  const [pressed, setPressed] = useState(false);
  const big = size === 'desktop';
  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        borderRadius: 22, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding: big ? '28px 16px 20px' : '18px 10px 14px',
        cursor:'pointer', gap: big ? 14 : 12,
        position:'relative', overflow:'hidden',
        background: card.bg,
        boxShadow: `0 6px 20px ${card.shadow}`,
        transform: pressed ? 'scale(.97)' : 'none',
        transition:'transform .15s',
      }}
    >
      {/* gloss */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'linear-gradient(180deg,rgba(255,255,255,.18) 0%,transparent 100%)', pointerEvents:'none' }} />
      <div style={{
        width: big ? 90 : 76, height: big ? 90 : 76,
        borderRadius:'50%', background:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 16px rgba(0,0,0,.15)', position:'relative', zIndex:1,
      }}>
        <span style={{ fontSize: big ? 50 : 42, lineHeight:1 }}>{card.emoji}</span>
      </div>
      <div style={{ background:'rgba(0,0,0,.15)', borderRadius:20, padding:'4px 14px', position:'relative', zIndex:1 }}>
        <span style={{ fontSize: big ? 13 : 12, fontWeight:900, letterSpacing:'1.4px', textTransform:'uppercase', color:'#fff' }}>{card.label}</span>
      </div>
    </div>
  );
}

export default function PageComunicacao({ navigate }) {
  const [activeCat, setActiveCat] = useState('sentimentos');
  const cards = CARDS[activeCat];

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .com-mobile { display: none !important; } }
        .com-desktop { display: none; }
        @media (min-width: 768px) { .com-desktop { display: block !important; } }

        .cat-tabs-scroll { display:flex; gap:8px; overflow-x:auto; }
        .cat-tabs-scroll::-webkit-scrollbar { display:none; }
        .cat-pill { padding:7px 16px; border-radius:20px; background:#fff; border:2px solid #e0e8f0; font-size:12px; font-weight:800; color:#888; white-space:nowrap; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .cat-pill.active { background:var(--blue); border-color:var(--blue); color:#fff; }
        .cat-pill:hover:not(.active) { border-color:var(--blue); color:var(--blue); }
        .com-cards-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
        .com-cards-grid-desk { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="com-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* header azul */}
        <div style={{ marginTop: -55, background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 12px rgba(0,0,0,.2)', overflow:'hidden' }}>
            <img src={logoIcone} alt="Autim" style={{ width:46, height:46, objectFit:'contain' }} />
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Comunicação</div>
        </div>

        {/* category pills */}
        <div className="cat-tabs-scroll" style={{ padding:'14px 16px 0', flexShrink:0 }}>
          {CATEGORIES.map(c => (
            <div key={c.id} className={`cat-pill ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>{c.label}</div>
          ))}
        </div>

        {/* cards */}
        <div style={{ flex:1, padding:'12px 14px 6px', overflowY:'auto' }}>
          <div className="com-cards-grid">
            {cards.map((card, i) => <ECard key={i} card={card} size="mobile" />)}
          </div>
        </div>

        {/* bottom nav */}
        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item active"><div className="nav-icon active"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item"><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="com-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',        active:false, page:'home-aluno' },
            { icon:<IconChat/>,     label:'Comunicação',   active:true,  page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',        active:false, page:null },
            { icon:<IconCalendar/>, label:'Agenda',        active:false, page:'agenda' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>
              {item.icon}{item.label}
            </div>
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
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Comunicação</div>
              <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Toque em um card para comunicar como você está</div>
            </div>

            {/* category pills */}
            <div className="cat-tabs-scroll" style={{ marginBottom:24 }}>
              {CATEGORIES.map(c => (
                <div key={c.id} className={`cat-pill ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>{c.label}</div>
              ))}
            </div>

            {/* cards grid 3 cols */}
            <div className="com-cards-grid-desk">
              {cards.map((card, i) => <ECard key={i} card={card} size="desktop" />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

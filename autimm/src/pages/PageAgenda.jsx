import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';

const DAYS = [
  { name:'Seg', num:14, hasEvent:false },
  { name:'Ter', num:15, hasEvent:true  },
  { name:'Qua', num:16, hasEvent:true  },
  { name:'Qui', num:17, hasEvent:false },
  { name:'Sex', num:18, hasEvent:false },
  { name:'Sáb', num:19, hasEvent:false },
  { name:'Dom', num:20, hasEvent:false },
];

const EVENTS_TODAY = [
  { hour:'08', min:'00', icon:'🏫', iconBg:'#e8f4ff', title:'Terapia ABA',        sub:'Instituto Inclusão — Sala 3',   tag:'Terapia', tagBg:'#e8f4ff', tagColor:'#38a7fb', accent:'#38a7fb' },
  { hour:'10', min:'30', icon:'🎓', iconBg:'#edfaf3', title:'Lição: Sentimentos', sub:'Fase 4 — Assustado',            tag:'Lição',   tagBg:'#edfaf3', tagColor:'#48c378', accent:'#48c378' },
  { hour:'14', min:'00', icon:'🏥', iconBg:'#fff8e1', title:'Consulta médica',    sub:'Dr. Carlos — Neuropediatria',   tag:'Saúde',   tagBg:'#fff8e1', tagColor:'#e0a000', accent:'#fdbe2d' },
];

const EVENTS_TOMORROW = [
  { hour:'09', min:'00', icon:'🎨', iconBg:'#fff0f7', title:'Oficina de Arte',    sub:'Centro de Convivência',         tag:'Lazer',   tagBg:'#fff0f7', tagColor:'#e9589a', accent:'#e9589a' },
  { hour:'16', min:'00', icon:'🏊', iconBg:'#f5eeec', title:'Natação',            sub:'Piscina Municipal',             tag:'Esporte', tagBg:'#f5eeec', tagColor:'#a1887f', accent:'#a1887f' },
];

function EventCard({ ev }) {
  return (
    <div style={{
      background:'#fff', borderRadius:18, padding:'14px 16px',
      display:'flex', alignItems:'center', gap:14,
      boxShadow:'0 3px 12px rgba(0,0,0,.07)', cursor:'pointer',
      borderLeft:`5px solid ${ev.accent}`,
      transition:'transform .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
      onMouseLeave={e => e.currentTarget.style.transform='none'}
    >
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', fontSize:12, fontWeight:900, color:'#888', flexShrink:0, width:42 }}>
        <span style={{ fontSize:16, fontWeight:900, color:'var(--dark)' }}>{ev.hour}</span>
        <span>:{ev.min}</span>
      </div>
      <div style={{ width:42, height:42, borderRadius:14, background:ev.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{ev.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{ev.title}</div>
        <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{ev.sub}</div>
        <span style={{ fontSize:10, fontWeight:800, borderRadius:8, padding:'2px 8px', marginTop:4, display:'inline-block', background:ev.tagBg, color:ev.tagColor }}>{ev.tag}</span>
      </div>
    </div>
  );
}

export default function PageAgenda({ navigate }) {
  const [activeDay, setActiveDay] = useState(2); // index 2 = Qua 16

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .ag-mobile { display: none !important; } }
        .ag-desktop { display: none; }
        @media (min-width: 768px) { .ag-desktop { display: block !important; } }

        .day-pill { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 12px; border-radius:16px; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .day-pill.active { background:#fff; }
        .day-name-txt { font-size:10px; font-weight:800; color:rgba(255,255,255,.7); text-transform:uppercase; letter-spacing:.5px; }
        .day-pill.active .day-name-txt { color:var(--blue); }
        .day-num-txt { font-size:18px; font-weight:900; color:#fff; }
        .day-pill.active .day-num-txt { color:var(--dark); }
        .day-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.4); }
        .day-pill.has-event .day-dot { background:var(--yellow); }

        .day-pill-desk { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 16px; border-radius:16px; cursor:pointer; transition:all .2s; flex-shrink:0; border:2px solid transparent; }
        .day-pill-desk.active { background:var(--blue); }
        .day-pill-desk:not(.active):hover { border-color:var(--border); background:#f8fafd; }
        .day-name-desk { font-size:11px; font-weight:800; color:#aaa; text-transform:uppercase; }
        .day-pill-desk.active .day-name-desk { color:rgba(255,255,255,.8); }
        .day-num-desk { font-size:20px; font-weight:900; color:var(--dark); }
        .day-pill-desk.active .day-num-desk { color:#fff; }
        .day-dot-desk { width:6px; height:6px; border-radius:50%; background:transparent; }
        .day-pill-desk.has-event .day-dot-desk { background:var(--yellow); }
        .day-pill-desk.active.has-event .day-dot-desk { background:rgba(255,255,255,.8); }

        .date-label { font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#888; padding:0 4px; }
        .fab-btn { position:fixed; bottom:88px; right:20px; width:52px; height:52px; border-radius:50%; background:var(--blue); border:none; display:flex; align-items:center; justify-content:center; font-size:26px; cursor:pointer; box-shadow:0 6px 20px rgba(56,167,251,.5); transition:transform .15s; z-index:5; color:#fff; line-height:1; }
        .fab-btn:hover { transform:scale(1.08); }
        .fab-btn-desk { display:flex; align-items:center; gap:8px; padding:12px 20px; background:var(--blue); border:none; border-radius:14px; color:#fff; font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 4px 14px rgba(56,167,251,.4); transition:transform .15s,box-shadow .15s; }
        .fab-btn-desk:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(56,167,251,.5); }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="ag-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* header azul com mini calendário */}
        <div style={{ marginTop:-55, background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 3px 12px rgba(0,0,0,.2)' }}>
            <img src={logoIcone} alt="Autim" style={{ width:42, height:42, objectFit:'contain' }} />
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Agenda</div>
          {/* mini cal */}
          <div style={{ display:'flex', gap:6, overflowX:'auto', width:'100%', justifyContent:'center' }}>
            {DAYS.map((d, i) => (
              <div key={i} className={`day-pill ${i===activeDay?'active':''} ${d.hasEvent?'has-event':''}`} onClick={() => setActiveDay(i)}>
                <div className="day-name-txt">{d.name}</div>
                <div className="day-num-txt">{d.num}</div>
                <div className="day-dot"></div>
              </div>
            ))}
          </div>
        </div>

        {/* events list */}
        <p style={{ textAlign: 'left' }}>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px', display:'flex', flexDirection:'column', gap:10 }}>
          <div className="date-label">Hoje — Quarta, 16 de Abril</div>
          {EVENTS_TODAY.map((ev,i) => <EventCard key={i} ev={ev} />)}
          <div className="date-label" style={{ marginTop:6 }}>Amanhã — Quinta, 17 de Abril</div>
          {EVENTS_TOMORROW.map((ev,i) => <EventCard key={i} ev={ev} />)}
        </div>
        </p>

        <button className="fab-btn">＋</button>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item active"><div className="nav-icon active"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item"><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="ag-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'   },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao'  },
            { icon:<IconSchool/>,   label:'Lições',      active:false, page:null           },
            { icon:<IconCalendar/>, label:'Agenda',      active:true,  page:'agenda'       },
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

            {/* top row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Agenda</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Acompanhe compromissos e atividades</div>
              </div>
              <button className="fab-btn-desk">＋ Novo evento</button>
            </div>

            {/* week strip */}
            <div style={{ background:'#fff', borderRadius:20, padding:'20px 24px', boxShadow:'var(--shadow-card)', marginBottom:24 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Semana atual</div>
              <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
                {DAYS.map((d, i) => (
                  <div key={i} className={`day-pill-desk ${i===activeDay?'active':''} ${d.hasEvent?'has-event':''}`} onClick={() => setActiveDay(i)}>
                    <div className="day-name-desk">{d.name}</div>
                    <div className="day-num-desk">{d.num}</div>
                    <div className="day-dot-desk"></div>
                  </div>
                ))}
              </div>
            </div>

          <p style={{ textAlign: 'left' }}>
            {/* two-column layout */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div>
                <div className="date-label" style={{ marginBottom:12 }}>Hoje — Quarta, 16 de Abril</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {EVENTS_TODAY.map((ev,i) => <EventCard key={i} ev={ev} />)}
                </div>
              </div>
              <div>
                <div className="date-label" style={{ marginBottom:12 }}>Amanhã — Quinta, 17 de Abril</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {EVENTS_TOMORROW.map((ev,i) => <EventCard key={i} ev={ev} />)}
                </div>
              </div>
            </div>
          </p>

          </div>
        </div>
      </div>
    </>
  );
}

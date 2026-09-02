import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson } from '../components/icons';

const CATEGORIES = [
  {
    id: 'sentimentos', name: 'Sentimentos', icon: '😊', bg: '#fff8e1', accent: '#fdbe2d',
    desc: 'Aprenda a expressar emoções', done: 3, total: 5,
    phases: [
      { emoji:'😄', label:'Fase 1', state:'done',   offset:''        },
      { emoji:'😢', label:'Fase 2', state:'done',   offset:'right'   },
      { emoji:'😠', label:'Fase 3', state:'done',   offset:'left'    },
      { emoji:'😨', label:'Fase 4', state:'active', offset:''        },
      { emoji:'🔒', label:'Fase 5', state:'locked', offset:'right'   },
    ],
  },
  {
    id: 'necessidades', name: 'Necessidades', icon: '🍽️', bg: '#e8f4ff', accent: '#38a7fb',
    desc: 'Comida, água, sono e mais', done: 1, total: 5,
    phases: [],
  },
  {
    id: 'acoes', name: 'Ações', icon: '🔒', bg: '#f0f2f4', accent: '#e0e8f0',
    desc: 'Complete Necessidades para desbloquear', done: 0, total: 5,
    locked: true, phases: [],
  },
];

// ── Config geométrica da trilha ──
const NODE = 64;
const RADIUS = NODE / 2;
const OFFSET = 58;     // quanto uma fase "right"/"left" se desloca do centro
const ROW = 88;        // distância vertical entre o centro de duas fases
const TRACK_W = 226;   // largura fixa do trilho (centro + folga dos offsets)
const CENTER_X = TRACK_W / 2;

function offsetX(offset) {
  return offset === 'right' ? OFFSET : offset === 'left' ? -OFFSET : 0;
}

function buildPath(points) {
  if (points.length < 2) return '';
  return points.reduce((d, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + pt.y) / 2;
    // curva em S suave entre um nó e o próximo
    return `${d} C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
  }, '');
}

function PhaseNode({ phase, navigate }) {
  const colors = {
    done:   { bg:'#48c378', border:'#34a363', shadow:'rgba(72,195,120,.5)'   },
    active: { bg:'#38a7fb', border:'#2090e0', shadow:'rgba(56,167,251,.6)'   },
    locked: { bg:'#e0e8f0', border:'#c8d5e0', shadow:'rgba(0,0,0,.08)'       },
  };
  const c = colors[phase.state];

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      {phase.state === 'active' && (
        <div className="phase-flag" style={{ '--flag-bg': c.bg }}>
          Continuar
          <span className="phase-flag-arrow" style={{ '--flag-bg': c.bg }} />
        </div>
      )}

      <div
        onClick={() => phase.state !== 'locked' && navigate('licao-atividade')}
        className={`phase-node ${phase.state === 'locked' ? 'locked' : ''} ${phase.state === 'active' ? 'active' : ''}`}
        style={{
          '--node-bg': c.bg,
          '--node-border': c.border,
          '--node-glow': c.shadow,
        }}
      >
        <span style={{ fontSize:24, lineHeight:1, filter: phase.state === 'locked' ? 'grayscale(1) opacity(.5)' : 'none' }}>{phase.emoji}</span>
        <span style={{ fontSize:10, fontWeight:900, color: phase.state === 'locked' ? '#aaa' : 'rgba(255,255,255,.85)', letterSpacing:.5 }}>{phase.label}</span>
        {phase.state === 'done' && (
          <div style={{ position:'absolute', bottom:-6, right:-6, width:20, height:20, background:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, boxShadow:'0 1px 4px rgba(0,0,0,.15)' }}>✅</div>
        )}
      </div>
    </div>
  );
}

function PhaseTrack({ phases, navigate }) {
  if (!phases.length) return null;

  const points = phases.map((p, i) => ({
    x: CENTER_X + offsetX(p.offset),
    y: RADIUS + i * ROW,
    phase: p,
  }));

  // até onde o trilho já foi percorrido (fases 'done' seguidas, incluindo a 'active' logo em seguida)
  let doneUpTo = -1;
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].state === 'done') doneUpTo = i;
    else if (phases[i].state === 'active') { doneUpTo = i; break; }
    else break;
  }

  const height = RADIUS * 2 + (phases.length - 1) * ROW;
  const fullPath = buildPath(points);
  const donePath = doneUpTo > 0 ? buildPath(points.slice(0, doneUpTo + 1)) : '';

  return (
    <div style={{ position:'relative', width: TRACK_W, height, margin:'0 auto' }}>
      <svg width={TRACK_W} height={height} style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }}>
        <path d={fullPath} fill="none" stroke="#d0dce8" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 13" />
        {donePath && (
          <path d={donePath} fill="none" stroke="#48c378" strokeWidth="5" strokeLinecap="round" />
        )}
      </svg>

      {points.map((pt, i) => (
        <div key={i} style={{ position:'absolute', left: pt.x - RADIUS, top: pt.y - RADIUS }}>
          <PhaseNode phase={pt.phase} navigate={navigate} />
        </div>
      ))}
    </div>
  );
}

export default function PageLicoes({ navigate }) {
  const [expanded, setExpanded] = useState('sentimentos');

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .lic-mobile { display: none !important; } }
        .lic-desktop { display: none; }
        @media (min-width: 768px) { .lic-desktop { display: block !important; } }
        .cat-card { background:#fff; border-radius:20px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,.07); cursor:pointer; transition:transform .15s; border-left:5px solid transparent; }
        .cat-card:hover { transform:translateY(-2px); }

        .phase-node {
          width:${NODE}px; height:${NODE}px; border-radius:50%;
          background:var(--node-bg); border:4px solid var(--node-border);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
          box-shadow: 0 3px 8px var(--node-glow), 0 6px 0 var(--node-border);
          cursor:pointer; transition: transform .12s ease, box-shadow .12s ease;
        }
        .phase-node.locked { cursor:not-allowed; }
        .phase-node:not(.locked):hover { transform: translateY(-2px); }
        .phase-node:not(.locked):active { transform: translateY(5px); box-shadow: 0 1px 4px var(--node-glow), 0 1px 0 var(--node-border); }
        .phase-node.active { animation: pulse-glow 2s infinite; }

        .phase-flag {
          position:absolute; top:-34px; left:50%; transform:translateX(-50%);
          background:var(--flag-bg); color:#fff; font-size:11px; font-weight:900;
          padding:5px 10px; border-radius:10px; white-space:nowrap;
          box-shadow:0 3px 8px rgba(0,0,0,.15);
        }
        .phase-flag-arrow {
          position:absolute; bottom:-5px; left:50%; transform:translateX(-50%) rotate(45deg);
          width:9px; height:9px; background:var(--flag-bg);
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="lic-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, flexShrink:0 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 3px 12px rgba(0,0,0,.2)' }}>
            <img src={logoIcone} alt="Autim" style={{ width:42, height:42, objectFit:'contain' }} />
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Lições</div>
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%' }}>
            <div style={{ background:'rgba(255,255,255,.2)', borderRadius:20, padding:'4px 12px', fontSize:13, fontWeight:800, color:'#fff' }}>🔥 5 dias</div>
            <div style={{ flex:1, background:'rgba(255,255,255,.25)', borderRadius:99, height:8, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#fdbe2d', borderRadius:99, width:'40%' }}></div>
            </div>
            <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>⭐ 120 XP</div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px', display:'flex', flexDirection:'column', gap:20 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id}>
              <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'0 4px', marginBottom:8 }}>
                {cat.icon} {cat.name}
              </div>
              <div className="cat-card" style={{ borderLeftColor: cat.accent, opacity: cat.locked ? .6 : 1 }}
                onClick={() => !cat.locked && setExpanded(expanded === cat.id ? null : cat.id)}>
                <div style={{ width:52, height:52, borderRadius:16, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{cat.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:900, color: cat.locked ? '#aaa' : 'var(--dark)' }}>{cat.name}</div>
                  <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{cat.desc}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                    <div style={{ flex:1, height:6, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(cat.done/cat.total)*100}%`, background:cat.accent, borderRadius:99 }}></div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{cat.done}/{cat.total}</div>
                  </div>
                </div>
                <div style={{ fontSize:18, color:'#ccc' }}>{cat.locked ? '🔒' : '›'}</div>
              </div>

              {expanded === cat.id && cat.phases.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <PhaseTrack phases={cat.phases} navigate={navigate} />
                </div>
              )}
            </div>
          ))}
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item active"><div className="nav-icon active"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="lic-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      active:true,  page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      active:false, page:'agenda'      },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">J</div>
            <div><div className="sidebar-user-name">João Pedro</div><div className="sidebar-user-role">Responsável</div></div>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-wrapper">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Lições</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Continue seu progresso</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, background:'#fff', borderRadius:16, padding:'12px 20px', boxShadow:'var(--shadow-card)' }}>
                <span style={{ fontSize:16 }}>🔥 5 dias</span>
                <div style={{ width:120, height:8, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'40%', background:'#fdbe2d', borderRadius:99 }}></div>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>⭐ 120 XP</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              {/* coluna esquerda: categorias */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ fontSize:13, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Categorias</div>
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="cat-card" style={{ borderLeftColor: cat.accent, opacity: cat.locked ? .6 : 1, borderRadius:18 }}
                    onClick={() => !cat.locked && setExpanded(cat.id)}>
                    <div style={{ width:52, height:52, borderRadius:16, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{cat.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:900, color: cat.locked ? '#aaa' : 'var(--dark)' }}>{cat.name}</div>
                      <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{cat.desc}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                        <div style={{ flex:1, height:6, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${(cat.done/cat.total)*100}%`, background:cat.accent, borderRadius:99 }}></div>
                        </div>
                        <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{cat.done}/{cat.total}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:18, color:'#ccc' }}>{cat.locked ? '🔒' : '›'}</div>
                  </div>
                ))}
              </div>

              {/* coluna direita: trilha de fases */}
              <div style={{ background:'#fff', borderRadius:24, padding:24, boxShadow:'var(--shadow-card)' }}>
                <div style={{ fontSize:13, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', marginBottom:20 }}>
                  {CATEGORIES.find(c => c.id === expanded)?.icon} {CATEGORIES.find(c => c.id === expanded)?.name} — Fases
                </div>
                {(CATEGORIES.find(c => c.id === expanded)?.phases || []).length > 0 ? (
                  <PhaseTrack phases={CATEGORIES.find(c => c.id === expanded)?.phases || []} navigate={navigate} />
                ) : (
                  <div style={{ textAlign:'center', color:'#aaa', fontSize:14, fontWeight:600, paddingTop:40 }}>Selecione uma categoria para ver as fases</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
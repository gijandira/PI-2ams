import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconCalendar, IconPerson, IconSettings } from '../components/icons';

export default function PageHomeInstituicao({ navigate }) {
  const [tabMob, setTabMob] = useState('alunos');
  const [tabDesk, setTabDesk] = useState('alunos');
  const [reqsMob, setReqsMob] = useState([
    { id:1, icon:'👦', bg:'#fff8e1', name:'Pedro Lima',  sub:'Resp.: José Lima · Solicitou ingresso há 1h',  time:'1h',  status:'pending' },
    { id:2, icon:'👧', bg:'#e8f4ff', name:'Sofia Alves', sub:'Resp.: Rita Alves · Solicitou ingresso há 3h', time:'3h',  status:'pending' },
  ]);
  const [reqsDesk, setReqsDesk] = useState([
    { id:1, icon:'👦', bg:'#fff8e1', name:'Pedro Lima',  sub:'Resp.: José Lima · Solicitou ingresso há 1h',  status:'pending' },
    { id:2, icon:'👧', bg:'#e8f4ff', name:'Sofia Alves', sub:'Resp.: Rita Alves · Solicitou ingresso há 3h', status:'pending' },
  ]);
  const doActionMob  = (id, action) => setReqsMob(prev  => prev.map(r  => r.id===id  ? {...r,  status:action} : r));
  const doActionDesk = (id, action) => setReqsDesk(prev => prev.map(r => r.id===id ? {...r, status:action} : r));
  const students = [
    { icon:'👦', bg:'#e8f4ff', name:'Lucas Souza',     sub:'Resp.: João Pedro',    prog:85, online:true  },
    { icon:'👧', bg:'#fff0f7', name:'Ana Clara',        sub:'Resp.: Carla Santos',  prog:72, online:true  },
    { icon:'👦', bg:'#e8f9ef', name:'Gabriel Ferreira', sub:'Resp.: Paulo Ferreira',prog:60, online:false },
    { icon:'👧', bg:'#fff8e1', name:'Isabela Martins',  sub:'Resp.: Fernanda M.',   prog:91, online:true  },
    { icon:'👦', bg:'#ffecec', name:'Mateus Lima',      sub:'Resp.: André Lima',    prog:78, online:false },
    { icon:'👧', bg:'#eef0f5', name:'Julia Costa',      sub:'Resp.: Mariana Costa', prog:82, online:false },
  ];

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .hi-mobile { display: none !important; } }
        .hi-desktop { display: none; }
        @media (min-width: 768px) { .hi-desktop { display: block !important; } }
        .student-card-mob:hover, .student-card-d:hover { transform: translateX(3px); }
        .tab-btn-green { flex:1; padding:10px 6px; border:none; border-radius:14px; font-family:'Nunito',sans-serif; font-size:12px; font-weight:800; cursor:pointer; transition:all .2s; background:#e0eaf0; color:#888; position:relative; white-space:nowrap; }
        .tab-btn-green.active { background:var(--green); color:#fff; box-shadow:0 4px 12px rgba(72,195,120,.4); }
      `}</style>

      {/* MOBILE */}
      <div className="hi-mobile" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ marginTop: -55, background:'var(--green)', padding:'6px 20px 18px', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:58, height:58, borderRadius:16, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, boxShadow:'0 3px 12px rgba(0,0,0,.18)', flexShrink:0 }}>🏫</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>Escola Inclusiva</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:2 }}>Arco-Íris · 6 alunos</div>
          </div>
          <button style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:20, position:'relative', flexShrink:0 }}>
            🔔<span style={{ position:'absolute', top:-2, right:-2, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>2</span>
          </button>
        </div>
        <div style={{ display:'flex', gap:10, padding:'14px 16px 8px' }}>
          {[{num:'6',label:'Alunos'},{num:'78%',label:'Média'},{num:'2',label:'Solicit.'}].map((s,i) => (
            <div key={i} style={{ flex:1, background:'#fff', borderRadius:16, padding:'12px 8px', textAlign:'center', boxShadow:'0 3px 10px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>{s.num}</div>
              <div style={{ fontSize:9, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', padding:'0 16px 8px', gap:8 }}>
          <button className={`tab-btn-green ${tabMob==='alunos'?'active':''}`} onClick={() => setTabMob('alunos')}>👤 Alunos</button>
          <button className={`tab-btn-green ${tabMob==='solicit'?'active':''}`} onClick={() => setTabMob('solicit')} style={{ position:'relative' }}>📥 Solicitações<span style={{ position:'absolute', top:-6, right:-6, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>2</span></button>
          <button className={`tab-btn-green ${tabMob==='relatorio'?'active':''}`} onClick={() => setTabMob('relatorio')}>📊 Relatório</button>
        </div>
        {tabMob === 'alunos' && (
          <>
            <div style={{ padding:'0 16px 4px' }}>
              <input style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--border)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, color:'var(--dark)', background:'#fff', outline:'none' }} placeholder="Buscar aluno..." />
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px', display:'flex', flexDirection:'column', gap:10 }}>
              {students.map((s,i) => (
                <div key={i} className="student-card-mob" style={{ background:'#fff', borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 3px 12px rgba(0,0,0,.07)', cursor:'pointer', transition:'transform .15s' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{s.sub}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                      <div style={{ width:70, height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${s.prog}%`, background:'var(--green)', borderRadius:99 }}></div></div>
                      <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{s.prog}%</div>
                    </div>
                  </div>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:s.online?'var(--green)':'var(--border)', flexShrink:0 }}></div>
                </div>
              ))}
            </div>
          </>
        )}
        {tabMob === 'solicit' && (
          <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px', display:'flex', flexDirection:'column', gap:10 }}>
            {reqsMob.map(r => (
              <div key={r.id} style={{ background:'#fff', borderRadius:18, padding:'14px 16px', boxShadow:'0 3px 12px rgba(0,0,0,.07)', borderLeft:`4px solid ${r.status==='accept'?'var(--green)':r.status==='reject'?'var(--red)':'var(--yellow)'}`, display:'flex', flexDirection:'column', gap:12, opacity:r.status==='reject'?.5:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{r.icon}</div>
                  <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{r.name}</div><div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{r.sub}</div></div>
                  <div style={{ fontSize:11, color:'#aaa', fontWeight:700 }}>{r.time}</div>
                </div>
                {r.status==='pending' ? (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => doActionMob(r.id,'accept')} style={{ flex:1, padding:11, background:'var(--green)', color:'#fff', border:'none', borderRadius:12, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer' }}>✅ Aceitar</button>
                    <button onClick={() => doActionMob(r.id,'reject')} style={{ flex:1, padding:11, background:'#fff', color:'var(--red)', border:'2px solid var(--red)', borderRadius:12, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer' }}>❌ Recusar</button>
                  </div>
                ) : (
                  <div style={{ fontSize:13, fontWeight:900, color:r.status==='accept'?'var(--green)':'var(--red)' }}>{r.status==='accept'?'✅ Aceita!':'❌ Recusada'}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {tabMob === 'relatorio' && (
          <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px' }}>
            <div style={{ background:'#fff', borderRadius:18, padding:'18px 16px', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)', marginBottom:12 }}>📊 Resumo — Maio 2025</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[{v:'78%',l:'Taxa acerto',bg:'#edfaf3',c:'var(--green)'},{v:'64',l:'Lições feitas',bg:'#e8f4ff',c:'var(--blue)'},{v:'4.2',l:'Média dias/sem',bg:'#fff8e1',c:'#d4a000'},{v:'⭐960',l:'XP coletivo',bg:'#fff0f7',c:'var(--pink)'}].map((s,i) => (
                  <div key={i} style={{ background:s.bg, borderRadius:14, padding:14, textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, fontWeight:800, color:'#888', textTransform:'uppercase' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <nav className="bottom-nav">
          <div className="nav-item active"><div className="nav-icon active"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item"><div className="nav-icon"><IconChat /></div><div className="nav-label">Mensagens</div></div>
          <div className="nav-item"><div className="nav-icon"><IconPerson /></div><div className="nav-label">Alunos</div></div>
          <div className="nav-item"><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSettings /></div><div className="nav-label">Config.</div></div>
        </nav>
      </div>

      {/* DESKTOP */}
      <div className="hi-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Dashboard', active:true  },
            { icon:<IconChat/>,     label:'Mensagens', active:false },
            { icon:<IconPerson/>,   label:'Alunos',    active:false },
            { icon:<IconCalendar/>, label:'Agenda',    active:false },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item"><IconSettings />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background:'var(--green)' }}>E</div>
            <div><div className="sidebar-user-name">Escola Inclusiva</div><div className="sidebar-user-role">Instituição</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper">
            <div style={{ background:'linear-gradient(135deg,#0a3d25 0%,var(--green) 100%)', borderRadius:24, padding:'24px 28px', display:'flex', alignItems:'center', gap:18, marginBottom:24, color:'#fff', boxShadow:'0 8px 24px rgba(72,195,120,.3)' }}>
              <div style={{ width:64, height:64, borderRadius:16, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, flexShrink:0 }}>🏫</div>
              <div>
                <div style={{ fontSize:22, fontWeight:900 }}>Escola Inclusiva Arco-Íris</div>
                <div style={{ fontSize:13, opacity:.8, fontWeight:600, marginTop:3 }}>Gerenciamento de alunos e responsáveis</div>
              </div>
              <div style={{ flex:1 }}></div>
              <button style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:22, position:'relative' }}>🔔<span style={{ position:'absolute', top:-2, right:-2, width:16, height:16, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>2</span></button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {[{num:'6',label:'Alunos',color:'var(--green)'},{num:'78%',label:'Média de acerto',color:'var(--blue)'},{num:'2',label:'Solicitações',color:'var(--yellow)'},{num:'5',label:'Ativos hoje',color:'var(--pink)'}].map((s,i) => (
                <div key={i} style={{ background:'#fff', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:s.color }}>{s.num}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {['alunos','solicit','relatorio'].map(t => (
                <button key={t} onClick={() => setTabDesk(t)} style={{ padding:'10px 20px', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer', transition:'all .2s', background:tabDesk===t?'var(--green)':'#e0eaf0', color:tabDesk===t?'#fff':'#888', boxShadow:tabDesk===t?'0 4px 12px rgba(72,195,120,.4)':'none', position:'relative' }}>
                  {t==='alunos'?'👤 Alunos':t==='solicit'?'📥 Solicitações':'📊 Relatório'}
                  {t==='solicit' && <span style={{ position:'absolute', top:-6, right:-6, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>2</span>}
                </button>
              ))}
            </div>
            {tabDesk === 'alunos' && (
              <>
                <div style={{ marginBottom:16 }}>
                  <input style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--border)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, color:'var(--dark)', background:'#fff', outline:'none' }} placeholder="Buscar aluno..." />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {students.map((s,i) => (
                    <div key={i} className="student-card-d" style={{ background:'#fff', borderRadius:18, padding:'16px 20px', display:'flex', alignItems:'center', gap:14, boxShadow:'var(--shadow-card)', cursor:'pointer', transition:'transform .15s' }}>
                      <div style={{ width:46, height:46, borderRadius:'50%', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{s.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{s.name}</div>
                        <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{s.sub}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                          <div style={{ width:100, height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${s.prog}%`, background:'var(--green)', borderRadius:99 }}></div></div>
                          <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{s.prog}%</div>
                        </div>
                      </div>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:s.online?'var(--green)':'var(--border)' }}></div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {tabDesk === 'solicit' && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {reqsDesk.map(r => (
                  <div key={r.id} style={{ background:'#fff', borderRadius:18, padding:'16px 20px', boxShadow:'var(--shadow-card)', borderLeft:`4px solid ${r.status==='accept'?'var(--green)':r.status==='reject'?'var(--red)':'var(--yellow)'}`, display:'flex', alignItems:'center', gap:14, opacity:r.status==='reject'?.5:1 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{r.icon}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{r.name}</div><div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{r.sub}</div></div>
                    {r.status==='pending' ? (
                      <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                        <button onClick={() => doActionDesk(r.id,'accept')} style={{ padding:'10px 20px', background:'var(--green)', color:'#fff', border:'none', borderRadius:12, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer' }}>✅ Aceitar</button>
                        <button onClick={() => doActionDesk(r.id,'reject')} style={{ padding:'10px 20px', background:'#fff', color:'var(--red)', border:'2px solid var(--red)', borderRadius:12, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer' }}>❌ Recusar</button>
                      </div>
                    ) : (
                      <span style={{ fontSize:14, fontWeight:900, color:r.status==='accept'?'var(--green)':'var(--red)', marginLeft:'auto' }}>{r.status==='accept'?'✅ Aceita!':'❌ Recusada'}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {tabDesk === 'relatorio' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)', marginBottom:16 }}>📊 Resumo — Maio 2025</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[{v:'78%',l:'Taxa acerto',bg:'#edfaf3',c:'var(--green)'},{v:'64',l:'Lições feitas',bg:'#e8f4ff',c:'var(--blue)'},{v:'4.2',l:'Média dias/sem',bg:'#fff8e1',c:'#d4a000'},{v:'⭐ 960',l:'XP coletivo',bg:'#fff0f7',c:'var(--pink)'}].map((s,i) => (
                      <div key={i} style={{ background:s.bg, borderRadius:14, padding:14, textAlign:'center' }}>
                        <div style={{ fontSize:24, fontWeight:900, color:s.c }}>{s.v}</div>
                        <div style={{ fontSize:10, fontWeight:800, color:'#888', textTransform:'uppercase' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)', marginBottom:16 }}>🏆 Top alunos do mês</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {[{medal:'🥇',name:'Isabela Martins',w:'100%',bg:'var(--yellow)',score:'5/5'},{medal:'🥈',name:'Ana Clara',w:'80%',bg:'#78909c',score:'4/5'},{medal:'🥉',name:'João Pedro',w:'60%',bg:'#a1887f',score:'3/5'}].map((t,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ fontSize:22 }}>{t.medal}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{t.name}</div>
                          <div style={{ height:6, background:'var(--border)', borderRadius:99, marginTop:5, overflow:'hidden' }}><div style={{ height:'100%', width:t.w, background:t.bg, borderRadius:99 }}></div></div>
                        </div>
                        <div style={{ fontSize:13, fontWeight:900, color:'#888' }}>{t.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
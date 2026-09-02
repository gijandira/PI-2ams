import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconPerson, IconSettings } from '../components/icons';

const IconMsg = () => <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>;
const IconCfg = () => <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"/></svg>;

export default function PageDashboardAluno({ navigate }) {
  const [period, setPeriod] = useState('Semana');

  const progRows = [
    { cat:'😊 Sentimentos', done:3, total:5, pct:60,  color:'#fdbe2d' },
    { cat:'🍽️ Necessidades', done:1, total:5, pct:20, color:'#38a7fb' },
    { cat:'🏃 Ações',        done:0, total:5, pct:0,  color:'#48c378' },
  ];

  const feedback = [
    { emoji:'✅', label:'Sim (correto)',   pct:50, bar:'var(--green)'  },
    { emoji:'👍', label:'Parcialmente',    pct:25, bar:'var(--blue)'   },
    { emoji:'🤏', label:'Quase',           pct:15, bar:'var(--yellow)' },
    { emoji:'❌', label:'Não',             pct:10, bar:'var(--red)'    },
  ];

  const activities = [
    { icon:'😨', title:'Sentimentos — Fase 4', sub:'Hoje, 10:30 · Responsável presente', resBg:'#edfaf3', resColor:'#48c378', res:'Sim ✅' },
    { icon:'😠', title:'Sentimentos — Fase 3', sub:'Ontem, 09:15',                        resBg:'#e8f4ff', resColor:'#38a7fb', res:'Parcial 👍' },
    { icon:'🍽️', title:'Necessidades — Fase 1',sub:'Seg, 14:00',                          resBg:'#fff8e1', resColor:'#d4a000', res:'Quase 🤏' },
  ];

  const innerContent = (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* stats grid */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Resumo da semana</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[{icon:'🎓',num:'8',label:'Lições'},{icon:'⭐',num:'120',label:'XP'},{icon:'🔥',num:'5',label:'Dias seguidos'},{icon:'✅',num:'75%',label:'Taxa de acerto'}].map((s,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:18, padding:14, textAlign:'center', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}>
            <div style={{ fontSize:28, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:'var(--dark)' }}>{s.num}</div>
            <div style={{ fontSize:10, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* progresso por categoria */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Progresso por categoria</div>
      <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 3px 12px rgba(0,0,0,.07)', display:'flex', flexDirection:'column', gap:14 }}>
        {progRows.map((p,i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)' }}>{p.cat}</div>
              <div style={{ fontSize:12, fontWeight:900, color:'#888' }}>{p.done} / {p.total} fases</div>
            </div>
            <div style={{ height:10, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${p.pct}%`, background:p.color, borderRadius:99 }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* avaliação do responsável */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Avaliação do responsável</div>
      <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 3px 12px rgba(0,0,0,.07)', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ fontSize:12, color:'#888', fontWeight:700 }}>Como o aluno respondeu nas últimas lições:</div>
        {feedback.map((f,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:20, flexShrink:0 }}>{f.emoji}</div>
            <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)', width:100, flexShrink:0 }}>{f.label}</div>
            <div style={{ flex:1, height:8, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${f.pct}%`, background:f.bar, borderRadius:99 }}></div>
            </div>
            <div style={{ fontSize:11, fontWeight:900, color:'#888', width:32, textAlign:'right', flexShrink:0 }}>{f.pct}%</div>
          </div>
        ))}
      </div>

      {/* atividade recente */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Atividade recente</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {activities.map((a,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize:20, flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)' }}>{a.title}</div>
              <div style={{ fontSize:11, color:'#888', fontWeight:600, marginTop:1 }}>{a.sub}</div>
            </div>
            <div style={{ fontSize:11, fontWeight:900, padding:'3px 10px', borderRadius:10, background:a.resBg, color:a.resColor, flexShrink:0 }}>{a.res}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .da-mobile { display: none !important; } }
        .da-desktop { display: none; }
        @media (min-width: 768px) { .da-desktop { display: block !important; } }
        .period-tab { flex:1; padding:7px; border:none; border-radius:10px; font-family:'Nunito',sans-serif; font-size:12px; font-weight:800; cursor:pointer; background:transparent; color:rgba(255,255,255,.7); transition:all .2s; }
        .period-tab.active { background:#fff; color:var(--dark); }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="da-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--green)', padding:'4px 20px 24px', display:'flex', flexDirection:'column', gap:14, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate('home-instituicao')} style={{ background:'rgba(255,255,255,.2)', border:'none', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
            <div style={{ fontSize:17, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Dashboard do Aluno</div>
            <div style={{ width:36 }}></div>
          </div>
          {/* student hero */}
          <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,.15)', borderRadius:20, padding:'14px 16px' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0, boxShadow:'0 3px 10px rgba(0,0,0,.15)' }}>👦</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>João Pedro</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:2 }}>Resp.: Maria Silva · (11) 99999-0000</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(255,255,255,.2)', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:800, color:'#fff', marginTop:4 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }}></div>Ativo hoje
              </div>
            </div>
          </div>
          {/* period tabs */}
          <div style={{ display:'flex', background:'rgba(255,255,255,.2)', borderRadius:14, padding:3 }}>
            {['Semana','Mês','Total'].map(p => (
              <button key={p} className={`period-tab ${period===p?'active':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 88px' }}>{innerContent}</div>

        <nav className="bottom-nav">
          <div className="nav-item active" onClick={() => navigate('home-instituicao')}><div className="nav-icon active" style={{ background:'var(--green)' }}><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('solicitacoes-inst')}><div className="nav-icon"><IconMsg /></div><div className="nav-label">Solicitações</div></div>
          <div className="nav-item" onClick={() => navigate('config-inst')}><div className="nav-icon"><IconCfg /></div><div className="nav-label">Config.</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="da-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>, label:'Dashboard', active:true,  page:'home-instituicao'    },
            { icon:<IconMsg/>,  label:'Solicitações', active:false, page:'solicitacoes-inst' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil-inst')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config-inst')}><IconCfg />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background:'var(--green)' }}>E</div>
            <div><div className="sidebar-user-name">Escola Inclusiva</div><div className="sidebar-user-role">Instituição</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:780 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <button onClick={() => navigate('home-instituicao')} style={{ width:40, height:40, borderRadius:'50%', background:'#fff', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-card)' }}>‹</button>
              <div style={{ fontSize:24, fontWeight:900, color:'var(--dark)' }}>Dashboard do Aluno</div>
            </div>
            {/* student hero desktop */}
            <div style={{ background:'linear-gradient(135deg,#0a3d25 0%,var(--green) 100%)', borderRadius:20, padding:'20px 24px', display:'flex', alignItems:'center', gap:18, marginBottom:20, color:'#fff', boxShadow:'0 6px 20px rgba(72,195,120,.3)' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>👦</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:20, fontWeight:900 }}>João Pedro</div>
                <div style={{ fontSize:13, opacity:.8, fontWeight:600, marginTop:3 }}>Resp.: Maria Silva · (11) 99999-0000</div>
              </div>
              <div style={{ display:'flex', background:'rgba(255,255,255,.2)', borderRadius:14, padding:3, gap:2 }}>
                {['Semana','Mês','Total'].map(p => (
                  <button key={p} className={`period-tab ${period===p?'active':''}`} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
            </div>
            {innerContent}
          </div>
        </div>
      </div>
    </>
  );
}

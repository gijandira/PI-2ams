import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconPerson, IconSettings } from '../components/icons';

const IconMsg = () => <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>;
const IconCfg = () => <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"/></svg>;

const INITIAL = [
  { id:1, emoji:'👦', bg:'linear-gradient(135deg,#fff8e1,#ffe082)', name:'Matheus Alves',   resp:'Fernanda Alves',    tel:'(11) 98888-1111', email:'fernanda@email.com', time:'Hoje 08:45',   age:'8 anos', diag:'TEA Nível 2', code:'INCLUSÃO-2024', status:'pending'  },
  { id:2, emoji:'👧', bg:'linear-gradient(135deg,#e8f4ff,#bee3ff)', name:'Sofia Rodrigues', resp:'Marcelo Rodrigues', tel:'(11) 97777-2222', email:'marcelo@email.com',  time:'Ontem 15:30',  age:'6 anos', diag:'TEA Nível 1', code:'INCLUSÃO-2024', status:'pending'  },
  { id:3, emoji:'👦', bg:'linear-gradient(135deg,#edfaf3,#b2f0d4)', name:'Gabriel Costa',  resp:'Ana Costa',         tel:'(11) 96666-3333', email:'',                    time:'Seg 10:00',    age:'7 anos', diag:'TEA Nível 1', code:'INCLUSÃO-2024', status:'accepted' },
];

const FILTERS = ['Todas','⏳ Pendentes','✅ Aceitas','❌ Recusadas'];

export default function PageSolicitacoesInst({ navigate }) {
  const [reqs, setReqs]       = useState(INITIAL);
  const [filter, setFilter]   = useState('Todas');

  const handle = (id, action) => setReqs(prev => prev.map(r => r.id===id ? {...r, status:action} : r));

  const visible = reqs.filter(r => {
    if (filter === 'Todas') return true;
    if (filter === '⏳ Pendentes') return r.status === 'pending';
    if (filter === '✅ Aceitas')   return r.status === 'accepted';
    if (filter === '❌ Recusadas') return r.status === 'rejected';
    return true;
  });

  const pending = reqs.filter(r => r.status === 'pending').length;

  const Card = ({ r }) => (
    <div style={{
      background:'#fff', borderRadius:20, padding:16, boxShadow:'0 4px 14px rgba(0,0,0,.08)',
      display:'flex', flexDirection:'column', gap:14,
      borderLeft:`5px solid ${r.status==='accepted'?'var(--green)':r.status==='rejected'?'var(--red)':'var(--yellow)'}`,
      opacity: r.status==='rejected' ? .55 : 1,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:50, height:50, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}>{r.emoji}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)' }}>{r.name}</div>
          <div style={{ fontSize:12, color:'#555', fontWeight:700, marginTop:2 }}>Responsável: {r.resp}</div>
          {r.tel && <div style={{ fontSize:11, color:'#888', fontWeight:600, marginTop:1 }}>📞 {r.tel}{r.email ? ` · ${r.email}` : ''}</div>}
        </div>
        <div style={{ fontSize:11, color:'#aaa', fontWeight:700, textAlign:'right', flexShrink:0 }}>{r.time}</div>
      </div>
      {r.status === 'pending' && (
        <div style={{ background:'#f8fafd', borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', gap:6 }}>
          {[['Idade do aluno', r.age],['Diagnóstico', r.diag],['Código usado', r.code]].map(([l,v],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#888' }}>{l}</span>
              <span style={{ fontSize:12, fontWeight:800, color:'var(--dark)' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      {r.status === 'pending' ? (
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => handle(r.id,'accepted')} style={{ flex:1, padding:12, background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 12px rgba(72,195,120,.4)' }}>✅ Aceitar</button>
          <button onClick={() => handle(r.id,'rejected')} style={{ flex:1, padding:12, background:'#fff', color:'var(--red)', border:'2px solid var(--red)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer' }}>❌ Recusar</button>
        </div>
      ) : (
        <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:900, background: r.status==='accepted'?'#edfaf3':'#ffecec', color: r.status==='accepted'?'var(--green)':'var(--red)' }}>
          {r.status==='accepted' ? '✅ Aceito' : '❌ Recusado'}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .si-mobile { display: none !important; } }
        .si-desktop { display: none; }
        @media (min-width: 768px) { .si-desktop { display: block !important; } }
        .filter-pill-si { padding:7px 16px; border-radius:20px; background:#fff; border:2px solid #e0e8f0; font-size:12px; font-weight:800; color:#888; cursor:pointer; transition:all .2s; white-space:nowrap; flex-shrink:0; }
        .filter-pill-si.active { background:var(--green); border-color:var(--green); color:#fff; }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="si-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--green)', padding:'4px 20px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={() => navigate('home-instituicao')} style={{ background:'rgba(255,255,255,.2)', border:'none', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Solicitações</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:2 }}>{pending} aguardando aprovação</div>
          </div>
          <div style={{ width:36 }}></div>
        </div>

        <div style={{ display:'flex', gap:8, padding:'12px 16px 4px', overflowX:'auto', flexShrink:0 }}>
          {FILTERS.map(f => <div key={f} className={`filter-pill-si ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</div>)}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'10px 16px 88px', display:'flex', flexDirection:'column', gap:12 }}>
          {visible.map(r => <Card key={r.id} r={r} />)}
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-instituicao')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item active"><div className="nav-icon active" style={{ background:'var(--green)' }}><IconMsg /></div><div className="nav-label">Solicitações</div></div>
          <div className="nav-item" onClick={() => navigate('config-inst')}><div className="nav-icon"><IconCfg /></div><div className="nav-label">Config.</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="si-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>, label:'Dashboard',    active:false, page:'home-instituicao'   },
            { icon:<IconMsg/>,  label:'Solicitações', active:true,  page:'solicitacoes-inst'  },
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
          <div className="page-wrapper" style={{ maxWidth:700 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Solicitações</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>{pending} aguardando aprovação</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
              {FILTERS.map(f => <div key={f} className={`filter-pill-si ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</div>)}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {visible.map(r => <Card key={r.id} r={r} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

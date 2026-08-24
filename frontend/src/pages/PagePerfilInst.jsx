import { useEffect, useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconPerson } from '../components/icons';

const IconMsg = () => <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>;
const IconCfg = () => <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"/></svg>;
const IconAlunos = () => <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;

export default function PagePerfilInst({ navigate }) {
  const [perfil, setPerfil] = useState(null);
  const [estatisticas, setEstatisticas] = useState({ alunos:0, pendentes:0, xpTotal:0, taxaAcerto:0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nome:'', telefone:'', email:'' });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const carregarPerfil = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('login'); return; }
    try {
      const response = await fetch('http://localhost:3001/auth/perfil-instituicao', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar o perfil.');
      setPerfil(data.instituicao);
      setEstatisticas(data.estatisticas || estatisticas);
      setForm({ nome:data.instituicao.nome, telefone:data.instituicao.telefone || '', email:data.instituicao.email });
    } catch (error) {
      setFeedback({ type:'error', text:error.message });
    } finally { setLoading(false); }
  };

  useEffect(() => { carregarPerfil(); }, []);

  const salvarPerfil = async event => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/perfil-instituicao', {
        method:'PUT',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
        body:JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível atualizar o perfil.');
      setEditing(false);
      setFeedback({ type:'success', text:data.mensagem });
      await carregarPerfil();
    } catch (error) { setFeedback({ type:'error', text:error.message }); }
  };

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('instituicao');
    navigate('index');
  };

  const menuItems = [
    { icon:'👥', bg:'#edfaf3', title:'Gerenciar Alunos',  desc:'Ver lista e dashboards individuais',   page:'home-instituicao',    badge:null,  danger:false },
    { icon:'📩', bg:'#fff8e1', title:'Solicitações',       desc:`${estatisticas.pendentes} pendentes de aprovação`, page:'solicitacoes-inst', badge:estatisticas.pendentes ? String(estatisticas.pendentes) : null, danger:false },
    { icon:'📊', bg:'#e8f4ff', title:'Ver Progresso',      desc:'Acompanhar evolução dos alunos',       page:'home-instituicao',    badge:null,  danger:false },
    { icon:'⚙️', bg:'#f0f0ff', title:'Configurações',      desc:'Preferências da instituição',          page:'config-inst',         badge:null,  danger:false },
    { icon:'🔑', bg:'#fff0f7', title:'Código de Acesso',   desc:`${perfil?.codAcesso || 'Carregando...' } · Compartilhar`, page:null, badge:null, danger:false },
    { icon:'🆘', bg:'#f0f0ff', title:'Suporte',            desc:'Ajuda e dúvidas frequentes',           page:'config-inst',         badge:null,  danger:false },
    { icon:'🚪', bg:'#ffecec', title:'Sair da conta',      desc:'Fazer logout',                         page:null,                  badge:null,  danger:true  },
  ];

  return (
    <>
      {editing && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, zIndex:20 }}>
        <form onSubmit={salvarPerfil} style={{ width:'100%', maxWidth:420, background:'#fff', borderRadius:20, padding:24, display:'flex', flexDirection:'column', gap:12, boxShadow:'0 10px 35px rgba(0,0,0,.25)' }}>
          <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>Editar perfil</div>
          {['nome','telefone','email'].map(field => <label key={field} style={{ display:'flex', flexDirection:'column', gap:5, fontSize:12, fontWeight:800, color:'#666' }}>
            {field === 'nome' ? 'Nome da instituição' : field === 'telefone' ? 'Telefone' : 'E-mail'}
            <input required={field !== 'telefone'} type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={event => setForm({ ...form, [field]:event.target.value })} style={{ padding:11, border:'1.5px solid var(--border)', borderRadius:10, fontFamily:'Nunito,sans-serif', fontSize:14 }} />
          </label>)}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:6 }}>
            <button type="button" onClick={() => setEditing(false)} style={{ padding:'10px 16px', border:'1px solid var(--border)', borderRadius:10, background:'#fff', cursor:'pointer', fontWeight:800 }}>Cancelar</button>
            <button type="submit" style={{ padding:'10px 16px', border:'none', borderRadius:10, background:'var(--green)', color:'#fff', cursor:'pointer', fontWeight:800 }}>Salvar</button>
          </div>
        </form>
      </div>}
      {feedback && <div style={{ position:'fixed', top:20, right:20, zIndex:30, maxWidth:320, padding:'12px 16px', borderRadius:12, background:feedback.type === 'error' ? '#ffecec' : '#edfaf3', color:feedback.type === 'error' ? 'var(--red)' : 'var(--green)', fontWeight:800, fontSize:13 }}>{feedback.text}</div>}
      <style>{`
        @media (min-width: 1024px) { .pi-mobile { display: none !important; } }
        .pi-desktop { display: none; }
        @media (min-width: 1024px) { .pi-desktop { display: block !important; } }
        .pi-menu-item { width:100%; min-width:0; background:#fff; border-radius:16px; padding:14px 16px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:transform .15s; box-shadow:0 3px 10px rgba(0,0,0,.06); }
        .pi-menu-item:hover { transform:translateX(3px); }
        @media (min-width:768px) and (max-width:1023px) {
          .pi-mobile { max-width:760px; margin:0 auto; box-shadow:0 0 28px rgba(0,0,0,.12); }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="pi-mobile" style={{ minHeight:'100vh', width:'100%', overflowX:'hidden', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'var(--green)', padding:'8px 24px 36px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, position:'relative', flexShrink:0 }}>
          <div style={{ position:'absolute', bottom:-20, left:0, right:0, height:40, background:'var(--bg)', borderRadius:'32px 32px 0 0' }}></div>
          <div style={{ width:86, height:86, borderRadius:22, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, boxShadow:'0 4px 16px rgba(0,0,0,.2)', position:'relative', zIndex:1 }}>🏫</div>
          <div style={{ fontSize:20, fontWeight:900, color:'#fff', position:'relative', zIndex:1, textAlign:'center' }}>{perfil?.nome || (loading ? 'Carregando...' : 'Instituição')}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.85)', fontWeight:600, position:'relative', zIndex:1 }}>{perfil?.email || ''}</div>
          <div style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', borderRadius:20, padding:'5px 16px', fontSize:13, fontWeight:900, color:'#fff', position:'relative', zIndex:1, letterSpacing:2 }}>🔑 {perfil?.codAcesso || '...'}</div>
          <button onClick={() => setEditing(true)} style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.5)', borderRadius:20, padding:'6px 16px', fontFamily:'Nunito,sans-serif', fontSize:12, fontWeight:800, color:'#fff', cursor:'pointer', position:'relative', zIndex:1 }}>✏️ Editar perfil</button>
        </div>

        <div style={{ display:'flex', gap:10, padding:'28px 16px 6px', flexShrink:0 }}>
          {[{num:estatisticas.alunos,label:'Alunos'},{num:`⭐ ${estatisticas.xpTotal}`,label:'XP total'},{num:`${estatisticas.taxaAcerto}%`,label:'Acertos'}].map((s,i) => (
            <div key={i} style={{ flex:1, background:'#fff', borderRadius:16, padding:'12px 8px', textAlign:'center', boxShadow:'0 3px 10px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>{s.num}</div>
              <div style={{ fontSize:9, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ flex:1, width:'100%', minWidth:0, overflowY:'auto', padding:'6px 16px 80px', display:'flex', flexDirection:'column', gap:8 }}>
          {menuItems.map((item,i) => (
            <div key={i} className="pi-menu-item" onClick={() => item.danger ? sair() : item.page && navigate(item.page)}>
              <div style={{ width:40, height:40, borderRadius:12, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1, minWidth:0, textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:800, color: item.danger ? 'var(--red)' : 'var(--dark)' }}>{item.title}</div>
                <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{item.desc}</div>
              </div>
              {item.badge ? <div style={{ background:'var(--red)', color:'#fff', fontSize:11, fontWeight:900, borderRadius:20, padding:'3px 10px' }}>{item.badge}</div>
                : <div style={{ fontSize:18, color: item.danger ? 'var(--red)' : '#ccc' }}>›</div>}
            </div>
          ))}
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-instituicao')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('home-instituicao')}><div className="nav-icon"><IconAlunos /></div><div className="nav-label">Alunos</div></div>
          <div className="nav-item" onClick={() => navigate('solicitacoes-inst')}><div className="nav-icon"><IconMsg /></div><div className="nav-label">Solicitações</div></div>
          <div className="nav-item" onClick={() => navigate('config-inst')}><div className="nav-icon"><IconCfg /></div><div className="nav-label">Config.</div></div>
          <div className="nav-item active"><div className="nav-icon active" style={{ background:'var(--green)' }}><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="pi-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,    label:'Início',       active:false, page:'home-instituicao'  },
            { icon:<IconMsg/>,     label:'Solicitações', active:false, page:'solicitacoes-inst' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item active"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config-inst')}><IconCfg />Configurações</div>
          <div className="sidebar-nav-item" onClick={sair} style={{ cursor:'pointer', color:'var(--red)' }}>🚪 Sair</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background:'var(--green)' }}>E</div>
            <div><div className="sidebar-user-name">{perfil?.nome || 'Instituição'}</div><div className="sidebar-user-role">Instituição</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:700 }}>
            <div style={{ background:'linear-gradient(135deg,#0a3d25 0%,var(--green) 100%)', borderRadius:24, padding:'28px 32px', display:'flex', alignItems:'center', gap:20, marginBottom:28, color:'#fff', boxShadow:'0 8px 24px rgba(72,195,120,.3)' }}>
              <div style={{ width:80, height:80, borderRadius:22, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🏫</div>
              <div style={{ flex:1, minWidth:0, textAlign:'center' }}>
                  <div style={{ fontSize:22, fontWeight:900 }}>{perfil?.nome || (loading ? 'Carregando...' : 'Instituição')}</div>
                  <div style={{ fontSize:13, opacity:.8, fontWeight:600, marginTop:4 }}>{perfil?.email || ''} · {perfil?.telefone || ''}</div>
                  <div style={{ display:'inline-block', background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:20, padding:'4px 14px', fontSize:12, fontWeight:900, letterSpacing:2, marginTop:8 }}>🔑 {perfil?.codAcesso || '...'}</div>
              </div>
              <button onClick={() => setEditing(true)} style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.5)', borderRadius:20, padding:'8px 20px', fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, color:'#fff', cursor:'pointer' }}>✏️ Editar perfil</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
              {[{num:estatisticas.alunos,label:'Alunos',color:'var(--green)'},{num:`⭐ ${estatisticas.xpTotal}`,label:'XP total',color:'var(--yellow)'},{num:`${estatisticas.taxaAcerto}%`,label:'Acertos',color:'var(--blue)'}].map((s,i) => (
                <div key={i} style={{ background:'#fff', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)', textAlign:'center' }}>
                  <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.num}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {menuItems.map((item,i) => (
                <div key={i} className="pi-menu-item" onClick={() => item.danger ? sair() : item.page && navigate(item.page)} style={{ borderRadius:18, padding:'18px 20px' }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{item.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color: item.danger ? 'var(--red)' : 'var(--dark)' }}>{item.title}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{item.desc}</div>
                  </div>
                  {item.badge ? <div style={{ background:'var(--red)', color:'#fff', fontSize:11, fontWeight:900, borderRadius:20, padding:'3px 10px' }}>{item.badge}</div>
                    : <div style={{ fontSize:18, color: item.danger ? 'var(--red)' : '#ccc' }}>›</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconPerson } from '../components/icons';

const IconMsg = () => <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>;
const IconCfg = () => <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"/></svg>;

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ width:48, height:26, borderRadius:99, flexShrink:0, cursor:'pointer', position:'relative', background: on ? 'var(--green)' : '#f87171', transition:'background .2s' }}>
      <div style={{ position:'absolute', top:3, left: on ? 25 : 3, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.2)', transition:'left .2s', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {on
          ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#48c378" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </div>
    </div>
  );
}

export default function PageConfigInst({ navigate }) {
  const [perfil, setPerfil] = useState(null);
  const [notifReq,     setNotifReq]     = useState(true);
  const [notifWeekly,  setNotifWeekly]  = useState(true);
  const [notifInactive,setNotifInactive]= useState(true);
  const [permReports,  setPermReports]  = useState(true);
  const [permAuto,     setPermAuto]     = useState(false);
  const [openFaq,      setOpenFaq]      = useState(null);
  const [copied,       setCopied]       = useState(false);
  const [gerandoCodigo, setGerandoCodigo] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('instituicao');
    navigate('login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('login'); return; }
    fetch('http://localhost:3001/auth/perfil-instituicao', { headers:{ Authorization:`Bearer ${token}` } })
      .then(response => response.json().then(data => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar a instituição.');
        setPerfil(data.instituicao);
      })
      .catch(error => console.error('Erro ao carregar configurações:', error));
  }, [navigate]);

  const gerarNovoCodigo = async () => {
    setGerandoCodigo(true);
    setFeedback(null);
    try {
      const response = await fetch('http://localhost:3001/auth/gerar-codigo-instituicao', {
        method:'POST',
        headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível gerar um novo código.');
      setPerfil(prev => ({ ...prev, codAcesso:data.codAcesso }));
      setFeedback({ type:'success', text:data.mensagem });
    } catch (error) {
      setFeedback({ type:'error', text:error.message });
    } finally {
      setGerandoCodigo(false);
    }
  };

  const copiarCodigo = async () => {
    const codigo = perfil?.codAcesso;
    if (!codigo) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(codigo);
      } else {
        const campo = document.createElement('textarea');
        campo.value = codigo;
        campo.style.position = 'fixed';
        campo.style.opacity = '0';
        document.body.appendChild(campo);
        campo.focus();
        campo.select();
        document.execCommand('copy');
        campo.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setFeedback({ type:'error', text:'Não foi possível copiar o código.' });
    }
  };

  const faqs = [
    { q:'Como gerenciar o acesso dos alunos?', a:'Vá na aba "Solicitações" para aceitar ou recusar alunos. Você pode remover um aluno a qualquer momento acessando o dashboard individual.' },
    { q:'Como exportar relatórios?',           a:'Na aba "Relatório" da tela inicial, toque no botão "Exportar PDF" para gerar um relatório completo da turma.' },
  ];

  const SectionLabel = ({ children, danger }) => (
    <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color: danger ? 'var(--red)' : '#888', padding:'8px 4px 4px' }}>{children}</div>
  );

  const ConfigItem = ({ icon, bg, title, desc, right }) => (
    <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 3px 10px rgba(0,0,0,.06)' }}>
      <div style={{ width:40, height:40, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{title}</div>
        {desc && <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );

  const innerContent = (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <SectionLabel>🔑 Código de acesso</SectionLabel>
      <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 4px 14px rgba(0,0,0,.08)', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>Este código permite que responsáveis se afiliem à sua instituição:</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#edfaf3', borderRadius:14, padding:'14px 16px', border:'2px solid var(--green)' }}>
          <div style={{ fontSize:18, fontWeight:900, color:'var(--dark)', letterSpacing:3 }}>{perfil?.codAcesso || 'Carregando...'}</div>
          <button onClick={copiarCodigo} style={{ background:'var(--green)', color:'#fff', border:'none', borderRadius:10, padding:'7px 14px', fontFamily:'Nunito,sans-serif', fontSize:12, fontWeight:800, cursor:'pointer' }}>{copied ? '✅ Copiado!' : '📋 Copiar'}</button>
        </div>
        <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>💡 Compartilhe este código com os responsáveis dos alunos.</div>
          <button onClick={gerarNovoCodigo} disabled={gerandoCodigo} style={{ background:'#fff', color:'var(--green)', border:'2px solid var(--green)', borderRadius:12, padding:10, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:gerandoCodigo ? 'wait' : 'pointer', opacity:gerandoCodigo ? .6 : 1 }}>{gerandoCodigo ? '⏳ Gerando...' : '🔄 Gerar novo código'}</button>
      </div>

      <SectionLabel>🔔 Notificações</SectionLabel>
      <ConfigItem icon="📩" bg="#edfaf3" title="Novas solicitações"   desc="Alerta ao receber pedido de afiliação"   right={<Toggle on={notifReq}      onChange={() => setNotifReq(v=>!v)} />} />
      <ConfigItem icon="📊" bg="#e8f4ff" title="Resumo semanal"       desc="Relatório de progresso dos alunos"       right={<Toggle on={notifWeekly}   onChange={() => setNotifWeekly(v=>!v)} />} />
      <ConfigItem icon="⚠️" bg="#fff8e1" title="Alertas de inatividade" desc="Quando um aluno não acessa por 7 dias" right={<Toggle on={notifInactive} onChange={() => setNotifInactive(v=>!v)} />} />

      <SectionLabel>🔐 Permissões dos alunos</SectionLabel>
      <ConfigItem icon="👁️" bg="#fff0f7" title="Responsáveis veem relatórios" desc="Permitir acesso ao dashboard do aluno"      right={<Toggle on={permReports} onChange={() => setPermReports(v=>!v)} />} />
      <ConfigItem icon="✏️" bg="#edfaf3" title="Auto-aprovação de alunos"      desc="Aceitar solicitações automaticamente"       right={<Toggle on={permAuto}    onChange={() => setPermAuto(v=>!v)} />} />

      <SectionLabel>🏫 Dados da instituição</SectionLabel>
      <ConfigItem icon="🏫" bg="#edfaf3" title={perfil?.nome || 'Instituição'} desc="Nome, logo e informações" right={<div style={{ fontSize:18, color:'#ccc' }}>›</div>} />
      <ConfigItem icon="📧" bg="#e8f4ff" title="E-mail institucional" desc={perfil?.email || 'Carregando...'} right={<div style={{ fontSize:18, color:'#ccc' }}>›</div>} />

      <SectionLabel>🆘 Suporte</SectionLabel>
      {faqs.map((faq,i) => (
        <div key={i} onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ background:'#fff', borderRadius:16, padding:'14px 16px', boxShadow:'0 3px 10px rgba(0,0,0,.06)', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)', flex:1, paddingRight:8 }}>{faq.q}</div>
            <div style={{ fontSize:16, color:'#ccc', transition:'transform .2s', transform: openFaq===i ? 'rotate(90deg)' : 'none' }}>›</div>
          </div>
          {openFaq===i && <div style={{ fontSize:12, color:'#666', fontWeight:600, lineHeight:1.6, marginTop:10 }}>{faq.a}</div>}
        </div>
      ))}

      <SectionLabel danger>⚠️ Zona de perigo</SectionLabel>
      <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 3px 10px rgba(0,0,0,.06)', border:'1.5px solid #ffecec', cursor:'pointer' }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#ffecec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🗑️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--red)' }}>Excluir instituição</div>
          <div style={{ fontSize:12, color:'#aaa', fontWeight:600, marginTop:2 }}>Remove todos os dados permanentemente</div>
        </div>
        <div style={{ fontSize:18, color:'var(--red)' }}>›</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 1024px) { .ci-mobile { display: none !important; } }
        .ci-desktop { display: none; }
        @media (min-width: 1024px) { .ci-desktop { display: block !important; } }
        @media (min-width:768px) and (max-width:1023px) {
          .ci-mobile { max-width:760px; margin:0 auto; box-shadow:0 0 28px rgba(0,0,0,.12); }
        }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="ci-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'var(--green)', padding:'4px 20px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button className="autim-close-button" onClick={() => navigate('perfil-inst')} aria-label="Fechar">×</button>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Configurações</div>
          <div style={{ width:36 }}></div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px' }}>{innerContent}</div>
        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-instituicao')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('home-instituicao')}><div className="nav-icon" style={{ fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}><svg viewBox="0 0 24 24" style={{ width:16, height:16, fill:'#aaa' }}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div><div className="nav-label">Alunos</div></div>
          <div className="nav-item" onClick={() => navigate('solicitacoes-inst')}><div className="nav-icon"><IconMsg /></div><div className="nav-label">Solicitações</div></div>
          <div className="nav-item active"><div className="nav-icon active" style={{ background:'var(--green)' }}><IconCfg /></div><div className="nav-label">Config.</div></div>
          <div className="nav-item" onClick={() => navigate('perfil-inst')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="ci-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>, label:'Início',       active:false, page:'home-instituicao'  },
            { icon:<IconMsg/>,  label:'Solicitações', active:false, page:'solicitacoes-inst' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil-inst')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item active"><IconCfg />Configurações</div>
          <div className="sidebar-nav-item" onClick={sair} style={{ cursor:'pointer', color:'var(--red)' }}>🚪 Sair</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background:'var(--green)' }}>E</div>
            <div><div className="sidebar-user-name">{perfil?.nome || 'Instituição'}</div><div className="sidebar-user-role">Instituição</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:680 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button className="autim-close-button" onClick={() => navigate('perfil-inst')} aria-label="Fechar">×</button>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Configurações</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Preferências da instituição</div>
              </div>
            </div>
            {innerContent}
          </div>
        </div>
      </div>
    </>
  );
}

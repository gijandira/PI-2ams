import { useEffect, useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';
import SidebarUser from '../components/SidebarUser';

export default function PageAfiliacao({ navigate }) {
  const [code, setCode] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const token = localStorage.getItem('token');
  const linkedInstitution = solicitacoes.find(item => item.status === 'aceito');
  const pendingInstitution = solicitacoes.find(item => item.status === 'pendente');

  const formatDate = date => date
    ? new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : '';

  const carregarAfiliacoes = async () => {
    if (!token) {
      navigate('login');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/afiliacao', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar as afiliações.');
      setSolicitacoes(data.solicitacoes || []);
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarAfiliacoes(); }, []);

  const conectar = async () => {
    if (!code.trim()) {
      setFeedback({ type: 'error', text: 'Informe o código da instituição.' });
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/afiliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigo: code.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível enviar a solicitação.');
      setCode('');
      setFeedback({ type: 'success', text: 'Solicitação enviada. Aguarde a aprovação da instituição.' });
      await carregarAfiliacoes();
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    }
  };

  const remover = async solicitacaoId => {
    try {
      const response = await fetch(`http://localhost:3001/afiliacao/${solicitacaoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível remover a afiliação.');
      setFeedback({ type: 'success', text: 'Afiliação removida.' });
      await carregarAfiliacoes();
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <style>{`
        @media (min-width: 1024px) { .af-mobile { display: none !important; } }
        .af-desktop { display: none; }
        @media (min-width: 1024px) { .af-desktop { display: block !important; } }
        .code-input-af { flex:1; padding:14px 16px; border:2px solid var(--border); border-radius:14px; font-family:'Nunito',sans-serif; font-size:16px; font-weight:800; letter-spacing:3px; text-align:center; outline:none; background:var(--input-bg); color:var(--dark); caret-color:var(--green); text-transform:uppercase; transition:border-color .2s; }
        .code-input-af::placeholder { color:var(--text-muted); opacity:1; }
        .code-input-af:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(72,195,120,.12); }
        .af-mobile-content { width:100%; max-width:620px; align-self:center; }
        .af-mobile .af-intro { padding-top:0; }
        .af-mobile .af-intro-icon { height:55px; display:flex; align-items:flex-start; line-height:1; font-size:44px; }
        .af-mobile-header .autim-close-button { width:36px; height:36px; font-size:22px; background:rgba(255,255,255,.2); }
        .af-mobile .af-intro-icon { height:62px; font-size:52px; }
        .af-mobile .af-intro-title { margin-top:2px; font-size:15px !important; }
        .af-mobile .af-intro-description { max-width:300px; font-size:11px !important; line-height:1.45 !important; }
        .af-mobile .af-linked-card { padding:10px !important; border-radius:14px !important; gap:8px !important; }
        .af-mobile .af-linked-icon { width:36px !important; height:36px !important; border-radius:11px !important; font-size:20px !important; }
        .af-mobile .af-linked-copy { min-width:0; }
        .af-mobile .af-linked-name { font-size:12px !important; }
        .af-mobile .af-linked-date { font-size:10px !important; }
        .af-mobile .af-linked-status { font-size:9px !important; padding:2px 7px !important; margin-top:3px !important; }
        .af-mobile .af-unlink { font-size:10px !important; white-space:nowrap; }
        .af-mobile .af-code-card { padding:12px !important; border-radius:14px !important; gap:8px !important; }
        .af-mobile .af-code-label { font-size:11px !important; }
        .af-mobile .af-code-row { gap:6px; }
        .af-mobile .af-code-row .code-input-af { padding:10px 8px; font-size:13px; border-radius:10px; }
        .af-mobile .af-code-row button { padding:11px 14px !important; border-radius:10px !important; font-size:12px !important; }
        .af-mobile .af-pending,
        .af-mobile .af-feedback { padding:11px 12px !important; border-radius:12px !important; font-size:11px !important; }
        .af-mobile .af-info { padding:11px 12px !important; border-radius:12px !important; gap:8px !important; }
        .af-mobile .af-info-icon { font-size:17px !important; }
        .af-mobile .af-info-text { font-size:10px !important; line-height:1.4 !important; }
        .af-code-row { display:grid !important; grid-template-columns:minmax(0,1fr) auto; align-items:stretch; }
        .af-mobile .code-input-af { min-width:0; width:100%; }
        .af-mobile .af-info-text { min-width:0; }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="af-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
        <div className="af-mobile-header" style={{ background:'var(--green)', padding:'4px 10px 8px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button className="autim-close-button" onClick={() => navigate('perfil')} aria-label="Voltar">‹</button>
          <div style={{ fontSize:14, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Afiliação</div>
          <div style={{ width:36 }}></div>
        </div>

        <div className="af-mobile-content" style={{ flex:1, overflowY:'auto', padding:'16px 10px 88px', display:'flex', flexDirection:'column', gap:12 }}>
          {/* ilustração */}
          <div className="af-intro" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, paddingTop:0 }}>
            <div className="af-intro-icon">🏫</div>
            <div className="af-intro-title" style={{ fontSize:17, fontWeight:900, color:'var(--dark)', textAlign:'center' }}>Conecte-se à sua instituição</div>
            <div className="af-intro-description" style={{ fontSize:13, color:'#888', fontWeight:600, textAlign:'center', lineHeight:1.5 }}>Insira o código fornecido pela escola, clínica ou terapeuta para vinculá-los ao perfil do aluno.</div>
          </div>

          {/* vinculada */}
          {linkedInstitution && (
            <div className="af-linked-card" style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 4px 14px rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:14, border:'2px solid var(--green)' }}>
              <div className="af-linked-icon" style={{ width:52, height:52, borderRadius:16, background:'#edfaf3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>🏥</div>
              <div className="af-linked-copy" style={{ flex:1 }}>
                <div className="af-linked-name" style={{ fontSize:15, fontWeight:900, color:'var(--dark)' }}>{linkedInstitution.instituicaoNome}</div>
                <div className="af-linked-date" style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>Vinculado desde {formatDate(linkedInstitution.dataResposta || linkedInstitution.dataSolicitacao)}</div>
                <span className="af-linked-status" style={{ display:'inline-block', background:'#edfaf3', color:'var(--green)', fontSize:11, fontWeight:900, borderRadius:10, padding:'2px 10px', marginTop:4 }}>✅ Ativo</span>
              </div>
              <button className="af-unlink" onClick={() => remover(linkedInstitution.id)} style={{ fontSize:12, color:'var(--red)', fontWeight:800, background:'none', border:'none', cursor:'pointer' }}>Desvincular</button>
            </div>
          )}

          {/* campo de código */}
          <div className="af-code-card" style={{ background:'#fff', borderRadius:20, padding:20, boxShadow:'0 4px 14px rgba(0,0,0,.08)', display:'flex', flexDirection:'column', gap:12 }}>
            <div className="af-code-label" style={{ fontSize:13, fontWeight:800, color:'#555' }}>Adicionar nova instituição:</div>
            <div className="af-code-row" style={{ display:'flex', gap:8 }}>
              <input className="code-input-af" type="text" placeholder="CÓDIGO" maxLength={12} value={code} onChange={e => setCode(e.target.value.toUpperCase())} />
              <button onClick={conectar} disabled={loading || Boolean(pendingInstitution)} style={{ padding:'14px 20px', background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(72,195,120,.4)', whiteSpace:'nowrap', opacity: loading || pendingInstitution ? .6 : 1 }}>Conectar</button>
            </div>
          </div>

          {/* info */}
          {pendingInstitution && <div className="af-pending" style={{ background:'#fff8e1', borderRadius:16, padding:'14px 16px', fontSize:12, color:'#856404', fontWeight:700 }}>Solicitação para {pendingInstitution.instituicaoNome} aguardando aprovação.</div>}
          {feedback && <div className="af-feedback" style={{ background: feedback.type === 'error' ? '#ffecec' : '#edfaf3', borderRadius:16, padding:'14px 16px', fontSize:12, color: feedback.type === 'error' ? 'var(--red)' : 'var(--green)', fontWeight:800 }}>{feedback.text}</div>}
          <div className="af-info" style={{ background:'#e8f4ff', borderRadius:16, padding:'14px 16px', display:'flex', gap:10 }}>
            <div className="af-info-icon" style={{ fontSize:20, flexShrink:0 }}>ℹ️</div>
            <div className="af-info-text" style={{ fontSize:12, color:'#1a5e8a', fontWeight:700, lineHeight:1.5 }}>Ao se afiliar, os profissionais da instituição poderão acompanhar o progresso do aluno e enviar atividades personalizadas.</div>
          </div>
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="af-desktop">
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      page:'agenda'      },
          ].map((item,i) => (
            <div key={i} className="sidebar-nav-item" onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item active"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
          <SidebarUser />
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:640 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button className="autim-close-button" onClick={() => navigate('perfil')} aria-label="Fechar">×</button>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Afiliação</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Vincule o aluno a uma instituição</div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fff', borderRadius:24, padding:32, boxShadow:'var(--shadow-card)', display:'flex', flexDirection:'column', alignItems:'center', gap:12, textAlign:'center' }}>
                <div style={{ fontSize:64 }}>🏫</div>
                <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>Conecte-se à sua instituição</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, lineHeight:1.6, maxWidth:420 }}>Insira o código fornecido pela escola, clínica ou terapeuta para vinculá-los ao perfil do aluno.</div>
              </div>

              {linkedInstitution && (
                <div style={{ background:'#fff', borderRadius:20, padding:20, boxShadow:'var(--shadow-card)', display:'flex', alignItems:'center', gap:16, border:'2px solid var(--green)' }}>
                  <div style={{ width:60, height:60, borderRadius:18, background:'#edfaf3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>🏥</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:900, color:'var(--dark)' }}>{linkedInstitution.instituicaoNome}</div>
                    <div style={{ fontSize:13, color:'#888', fontWeight:600, marginTop:3 }}>Vinculado desde {formatDate(linkedInstitution.dataResposta || linkedInstitution.dataSolicitacao)}</div>
                    <span style={{ display:'inline-block', background:'#edfaf3', color:'var(--green)', fontSize:12, fontWeight:900, borderRadius:10, padding:'3px 12px', marginTop:6 }}>✅ Ativo</span>
                  </div>
                  <button onClick={() => remover(linkedInstitution.id)} style={{ fontSize:13, color:'var(--red)', fontWeight:800, background:'none', border:'2px solid var(--red)', borderRadius:12, padding:'8px 16px', cursor:'pointer' }}>Desvincular</button>
                </div>
              )}

              <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'var(--shadow-card)', display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#555' }}>Adicionar nova instituição:</div>
                <div style={{ display:'flex', gap:10 }}>
                  <input className="code-input-af" type="text" placeholder="CÓDIGO DA INSTITUIÇÃO" maxLength={12} value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ flex:1 }} />
                  <button onClick={conectar} disabled={loading || Boolean(pendingInstitution)} style={{ padding:'14px 24px', background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(72,195,120,.4)', whiteSpace:'nowrap', opacity: loading || pendingInstitution ? .6 : 1 }}>Conectar</button>
                </div>
              </div>

              {pendingInstitution && <div style={{ background:'#fff8e1', borderRadius:16, padding:'14px 20px', fontSize:13, color:'#856404', fontWeight:700 }}>Solicitação para {pendingInstitution.instituicaoNome} aguardando aprovação.</div>}
              {feedback && <div style={{ background: feedback.type === 'error' ? '#ffecec' : '#edfaf3', borderRadius:16, padding:'14px 20px', fontSize:13, color: feedback.type === 'error' ? 'var(--red)' : 'var(--green)', fontWeight:800 }}>{feedback.text}</div>}
              <div style={{ background:'#e8f4ff', borderRadius:16, padding:'16px 20px', display:'flex', gap:12 }}>
                <div style={{ fontSize:22 }}>ℹ️</div>
                <div style={{ fontSize:13, color:'#1a5e8a', fontWeight:700, lineHeight:1.6 }}>Ao se afiliar, os profissionais da instituição poderão acompanhar o progresso do aluno e enviar atividades personalizadas.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
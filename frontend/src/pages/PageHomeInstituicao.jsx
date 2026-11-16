import { useCallback, useEffect, useRef, useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import logoIconeBranco from '../assets/logo-icone-branco.png';
import { IconHome, IconChat, IconPerson, IconSettings } from '../components/icons';

const getInitialDashboardTab = () => {
  const tab = localStorage.getItem('autim.home-instituicao-tab');
  return ['inicio', 'alunos', 'solicit', 'relatorio'].includes(tab) ? tab : 'inicio';
};

export default function PageHomeInstituicao({ navigate }) {
  const logoTema = document.body.classList.contains('autim-dark-theme')
    ? logoIconeBranco
    : logoIcone;

  const [activeTab, setActiveTab] = useState(getInitialDashboardTab);
  const [tabLoading, setTabLoading] = useState(false);
  const tabLoadingTimer = useRef(null);
  const [reqsMob, setReqsMob] = useState([]);
  const [reqsDesk, setReqsDesk] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [dashboardErro, setDashboardErro] = useState('');
  const responderSolicitacao = async (id, action) => {
    const response = await fetch(`http://localhost:3001/afiliacao/instituicao/${id}`, {
      method:'PATCH',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
      body:JSON.stringify({ status: action === 'accept' ? 'aceito' : 'recusado' })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || 'Não foi possível responder à solicitação.');
    return action;
  };
  const [students, setStudents] = useState([]);
  const [instituicao, setInstituicao] = useState(null);
  const [estatisticas, setEstatisticas] = useState({ alunos:0, pendentes:0, taxaAcerto:0 });
  const [relatorio, setRelatorio] = useState({ periodo:'Últimos 30 dias', resumo:{ taxaAcerto:0, licoes:0, mediaDiasSemana:0, xpColetivo:0 }, ranking:[] });
  const [loading, setLoading] = useState(true);
  const [alunoParaRemover, setAlunoParaRemover] = useState(null);

  const carregarDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('login'); return; }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.tipo !== 'instituicao') {
        localStorage.removeItem('token');
        localStorage.removeItem('instituicao');
        navigate('login');
        return;
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('instituicao');
      navigate('login');
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [perfilResponse, solicitacoesResponse, alunosResponse, relatorioResponse] = await Promise.all([
        fetch('http://localhost:3001/auth/perfil-instituicao', { headers }),
        fetch('http://localhost:3001/afiliacao/instituicao', { headers }),
        fetch('http://localhost:3001/afiliacao/instituicao/alunos', { headers }),
        fetch('http://localhost:3001/afiliacao/instituicao/relatorio', { headers })
      ]);
      const [perfilData, solicitacoesData, alunosData, relatorioData] = await Promise.all([
        perfilResponse.json(), solicitacoesResponse.json(), alunosResponse.json(), relatorioResponse.json()
      ]);
      if (!perfilResponse.ok) throw new Error(perfilData.erro || 'Não foi possível carregar a instituição.');
      if (!solicitacoesResponse.ok) throw new Error(solicitacoesData.erro || 'Não foi possível carregar as solicitações.');
      if (!alunosResponse.ok) throw new Error(alunosData.erro || 'Não foi possível carregar os alunos.');
      if (!relatorioResponse.ok) throw new Error(relatorioData.erro || 'Não foi possível carregar o relatório.');

      const solicitacoes = (solicitacoesData.solicitacoes || []).map(item => ({
        id:item.id, icon:'👤', bg:'#e8f4ff', name:item.alunoNome,
        sub:`Resp.: ${item.responsavelNome || 'Não informado'}`,
        age:item.age == null ? 'Não informado' : `${item.age} anos`,
        diag:item.diag || 'Não informado',
        code:item.code || 'Não informado',
        time:new Date(item.dataSolicitacao).toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' }),
        status:item.status === 'aceito' ? 'accept' : item.status === 'recusado' ? 'reject' : 'pending'
      }));
      const alunos = (alunosData.alunos || []).map(item => ({
        id:item.id, solicitacaoId:item.solicitacaoId, icon:'👤', bg:'#e8f4ff', name:item.nome,
        sub:`Resp.: ${item.responsavelNome || 'Não informado'}`,
        prog:item.progresso, online:item.online
      }));
      setInstituicao(perfilData.instituicao);
      setEstatisticas(perfilData.estatisticas || { alunos:0, pendentes:0, taxaAcerto:0 });
      setReqsMob(solicitacoes);
      setReqsDesk(solicitacoes);
      setStudents(alunos);
      setRelatorio(relatorioData);
      setDashboardErro('');
    } catch (error) {
      console.error('Erro ao carregar dashboard institucional:', error);
      setDashboardErro(error.message || 'Não foi possível atualizar o painel.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.removeItem('autim.home-instituicao-tab');
    const timer = window.setTimeout(() => { void carregarDashboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [carregarDashboard]);

  useEffect(() => () => {
    window.clearTimeout(tabLoadingTimer.current);
  }, []);

  const changeTab = nextTab => {
    if (nextTab === activeTab) return;
    window.clearTimeout(tabLoadingTimer.current);
    setTabLoading(true);
    tabLoadingTimer.current = window.setTimeout(() => {
      setActiveTab(nextTab);
      setTabLoading(false);
      tabLoadingTimer.current = null;
    }, 400);
  };

  const doAction = async (id, action, setRequests) => {
    try {
      await responderSolicitacao(id, action);
      setRequests(prev => prev.map(request => request.id === id ? { ...request, status:action } : request));
      if (action === 'accept') {
        changeTab('alunos');
      }
      await carregarDashboard();
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      setDashboardErro(error.message || 'Não foi possível responder à solicitação.');
    }
  };
  const doActionMob = (id, action) => doAction(id, action, setReqsMob);
  const doActionDesk = (id, action) => doAction(id, action, setReqsDesk);

  const filteredStudents = students.filter(student => (
    student.name.toLocaleLowerCase().includes(studentSearch.trim().toLocaleLowerCase())
  ));

  const abrirDashboard = alunoId => {
    localStorage.setItem('dashboardAlunoId', alunoId);
    navigate('progresso-inst');
  };

  const removerAluno = async () => {
    if (!alunoParaRemover) return;
    try {
      const response = await fetch(`http://localhost:3001/afiliacao/instituicao/${alunoParaRemover.solicitacaoId}`, {
        method:'DELETE',
        headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Não foi possível remover o aluno.');
      setStudents(prev => prev.filter(student => student.id !== alunoParaRemover.id));
      setAlunoParaRemover(null);
      await carregarDashboard();
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      setDashboardErro(error.message || 'Não foi possível remover o aluno.');
    }
  };

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('instituicao');
    navigate('login');
  };

  return (
    <>
      {tabLoading && (
        <div className="autim-loading-layer" role="status" aria-live="polite">
          <div className="autim-loading-card">
            <div className="autim-loading-orb">
              <img src={logoTema} alt="Autim" className="autim-loading-logo" />
            </div>
            <div className="autim-loading-title">Carregando...</div>
            <div className="autim-loading-bar"><span></span></div>
          </div>
        </div>
      )}
      {dashboardErro && <div role="alert" style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:1001, maxWidth:'90vw', padding:'10px 16px', borderRadius:12, background:'#ffecec', color:'var(--red)', fontWeight:800, fontSize:13 }}>{dashboardErro}</div>}
      {alunoParaRemover && <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ width:'100%', maxWidth:380, background:'#fff', borderRadius:20, padding:24, boxShadow:'0 12px 40px rgba(0,0,0,.25)', textAlign:'center' }}>
          <div style={{ fontSize:34, marginBottom:8 }}>⚠️</div>
          <div style={{ fontSize:18, fontWeight:900, color:'var(--dark)', marginBottom:8 }}>Remover aluno?</div>
          <div style={{ fontSize:13, color:'#666', fontWeight:600, lineHeight:1.5 }}>Tem certeza que deseja remover {alunoParaRemover.name} da instituição?</div>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <button onClick={() => setAlunoParaRemover(null)} style={{ flex:1, padding:11, border:'2px solid var(--border)', borderRadius:12, background:'#fff', color:'#666', fontWeight:800, cursor:'pointer' }}>Não</button>
            <button onClick={removerAluno} style={{ flex:1, padding:11, border:'none', borderRadius:12, background:'var(--red)', color:'#fff', fontWeight:800, cursor:'pointer' }}>Sim, remover</button>
          </div>
        </div>
      </div>}
      <style>{`
        @media (min-width: 1024px) { .hi-mobile { display: none !important; } }
        .hi-desktop { display: none; }
        @media (min-width: 1024px) { .hi-desktop { display: block !important; } }
        .student-card-mob:hover, .student-card-d:hover { transform: translateX(3px); }
        .tab-btn-green { flex:1; padding:10px 6px; border:none; border-radius:14px; font-family:'Nunito',sans-serif; font-size:12px; font-weight:800; cursor:pointer; transition:all .2s; background:#e0eaf0; color:#888; position:relative; white-space:nowrap; }
        .tab-btn-green.active { background:var(--green); color:#fff; box-shadow:0 4px 12px rgba(72,195,120,.4); }
        @media (min-width:768px) and (max-width:1023px) {
          .hi-mobile { max-width:760px; margin:0 auto; box-shadow:0 0 28px rgba(0,0,0,.12); }
          .hi-mobile > div:first-child { padding-left:32px !important; padding-right:32px !important; }
        }
      `}</style>

      {/* MOBILE */}
      <div className="hi-mobile" style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'var(--green)', padding:'6px 20px 18px', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:58, height:58, borderRadius:16, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, boxShadow:'0 3px 12px rgba(0,0,0,.18)', flexShrink:0 }}>🏫</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{instituicao?.nome || 'Instituição'}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:2 }}>{estatisticas.alunos} alunos</div>
          </div>
          <button onClick={() => changeTab('solicit')} style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:20, position:'relative', flexShrink:0 }}>
            🔔{estatisticas.pendentes > 0 && <span style={{ position:'absolute', top:-2, right:-2, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{estatisticas.pendentes}</span>}
          </button>
        </div>
        <div style={{ display:'flex', gap:10, padding:'14px 16px 8px' }}>
          {[{num:estatisticas.alunos,label:'Alunos'},{num:`${estatisticas.taxaAcerto}%`,label:'Média'},{num:estatisticas.pendentes,label:'Solicit.'}].map((s,i) => (
            <div key={i} style={{ flex:1, background:'#fff', borderRadius:16, padding:'12px 8px', textAlign:'center', boxShadow:'0 3px 10px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>{s.num}</div>
              <div style={{ fontSize:9, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', padding:'0 16px 8px', gap:8 }}>
          <button className={`tab-btn-green ${activeTab==='alunos'?'active':''}`} onClick={() => changeTab('alunos')}>👤 Alunos</button>
          <button className={`tab-btn-green ${activeTab==='solicit'?'active':''}`} onClick={() => changeTab('solicit')} style={{ position:'relative' }}>📥 Solicitações{estatisticas.pendentes > 0 && <span style={{ position:'absolute', top:-6, right:-6, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{estatisticas.pendentes}</span>}</button>
          <button className={`tab-btn-green ${activeTab==='relatorio'?'active':''}`} onClick={() => changeTab('relatorio')}>📊 Relatório</button>
        </div>
        {activeTab === 'alunos' && (
          <>
            <div style={{ padding:'0 16px 4px' }}>
              <input value={studentSearch} onChange={event => setStudentSearch(event.target.value)} style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--border)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, color:'var(--dark)', background:'#fff', outline:'none' }} placeholder="Buscar aluno..." />
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px', display:'flex', flexDirection:'column', gap:10 }}>
              {loading && <div style={{ textAlign:'center', color:'#888', fontWeight:700 }}>Carregando alunos...</div>}
              {!loading && filteredStudents.length === 0 && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>{studentSearch.trim() ? `Nenhum aluno encontrado com o nome "${studentSearch.trim()}".` : 'Nenhum aluno afiliado à instituição.'}</div>}
              {filteredStudents.map((s,i) => (
                <div key={i} className="student-card-mob" onClick={() => abrirDashboard(s.id)} style={{ background:'#fff', borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 3px 12px rgba(0,0,0,.07)', cursor:'pointer', transition:'transform .15s' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{s.sub}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                      <div style={{ width:70, height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${s.prog}%`, background:'var(--green)', borderRadius:99 }}></div></div>
                      <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{s.prog}%</div>
                    </div>
                  </div>
                  <button onClick={event => { event.stopPropagation(); setAlunoParaRemover(s); }} aria-label={`Remover ${s.name}`} style={{ width:24, height:24, border:'none', borderRadius:'50%', background:'#ffecec', color:'var(--red)', fontWeight:900, fontSize:16, lineHeight:1, cursor:'pointer', flexShrink:0 }}>×</button>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'solicit' && (
          <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px', display:'flex', flexDirection:'column', gap:10 }}>
            {loading && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>Carregando solicitações...</div>}
            {reqsMob.map(r => (
              <div key={r.id} style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 4px 14px rgba(0,0,0,.08)', borderLeft:`5px solid ${r.status==='accept'?'var(--green)':r.status==='reject'?'var(--red)':'var(--yellow)'}`, display:'flex', flexDirection:'column', gap:14, opacity:r.status==='reject'?.55:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:50, height:50, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}>{r.icon}</div>
                  <div style={{ flex:1, minWidth:0, textAlign:'center' }}>
                    <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)' }}>{r.name}</div>
                    <div style={{ fontSize:12, color:'#555', fontWeight:700, marginTop:2 }}>{r.sub}</div>
                  </div>
                  <div style={{ fontSize:11, color:'#aaa', fontWeight:700, textAlign:'right', flexShrink:0 }}>{r.time}</div>
                </div>
                {r.status==='pending' && (
                  <div style={{ background:'#f8fafd', borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
                    {[['Idade do aluno', r.age],['Diagnóstico', r.diag],['Código usado', r.code]].map(([label, value]) => (
                      <div key={label} style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'#888' }}>{label}</span>
                        <span style={{ fontSize:12, fontWeight:800, color:'var(--dark)', textAlign:'right' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.status==='pending' ? (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => doActionMob(r.id,'accept')} style={{ flex:1, padding:12, background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 12px rgba(72,195,120,.4)' }}>✅ Aceitar</button>
                    <button onClick={() => doActionMob(r.id,'reject')} style={{ flex:1, padding:12, background:'#fff', color:'var(--red)', border:'2px solid var(--red)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer' }}>❌ Recusar</button>
                  </div>
                ) : (
                  <div style={{ fontSize:13, fontWeight:900, color:r.status==='accept'?'var(--green)':'var(--red)' }}>{r.status==='accept'?'✅ Aceita!':'❌ Recusada'}</div>
                )}
              </div>
            ))}
            {!loading && reqsMob.length === 0 && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>Nenhuma solicitação encontrada.</div>}
          </div>
        )}
        {activeTab === 'relatorio' && (
          <div style={{ flex:1, overflowY:'auto', padding:'8px 16px 80px' }}>
            <div style={{ background:'#fff', borderRadius:18, padding:'18px 16px', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)', marginBottom:12 }}>📊 Resumo — {relatorio.periodo}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[{v:`${relatorio.resumo.taxaAcerto}%`,l:'Taxa acerto',bg:'#edfaf3',c:'var(--green)'},{v:relatorio.resumo.licoes,l:'Lições feitas',bg:'#e8f4ff',c:'var(--blue)'},{v:relatorio.resumo.mediaDiasSemana,l:'Média dias/sem',bg:'#fff8e1',c:'#d4a000'},{v:`⭐ ${relatorio.resumo.xpColetivo}`,l:'XP coletivo',bg:'#fff0f7',c:'var(--pink)'}].map((s,i) => (
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
          <div className={`nav-item ${activeTab==='inicio'?'active':''}`} onClick={() => changeTab('inicio')}><div className={`nav-icon ${activeTab==='inicio'?'active':''}`}><IconHome /></div><div className="nav-label">Início</div></div>
          <div className={`nav-item ${activeTab==='solicit'?'active':''}`} onClick={() => changeTab('solicit')}><div className={`nav-icon ${activeTab==='solicit'?'active':''}`}><IconChat /></div><div className="nav-label">Solicitações</div></div>
          <div className="nav-item" onClick={() => navigate('perfil-inst')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
          <div className="nav-item" onClick={() => navigate('config-inst')}><div className="nav-icon"><IconSettings /></div><div className="nav-label">Config.</div></div>
        </nav>
      </div>

      {/* DESKTOP */}
      <div className="hi-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoTema} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,   label:'Início',       tab:'inicio'  },
            { icon:<IconPerson/>, label:'Alunos',       tab:'alunos' },
            { icon:<IconChat/>,   label:'Solicitações', tab:'solicit' },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${activeTab===item.tab?'active':''}`} onClick={() => changeTab(item.tab)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil-inst')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config-inst')}><IconSettings />Configurações</div>
          <div className="sidebar-nav-item" onClick={sair} style={{ cursor:'pointer', color:'var(--red)' }}>🚪 Sair</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background:'var(--green)' }}>E</div>
            <div><div className="sidebar-user-name">{instituicao?.nome || 'Instituição'}</div><div className="sidebar-user-role">Instituição</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper">
            <div style={{ background:'linear-gradient(135deg,#0a3d25 0%,var(--green) 100%)', borderRadius:24, padding:'24px 28px', display:'flex', alignItems:'center', gap:18, marginBottom:24, color:'#fff', boxShadow:'0 8px 24px rgba(72,195,120,.3)' }}>
              <div style={{ width:64, height:64, borderRadius:16, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, flexShrink:0 }}>🏫</div>
              <div>
                <div style={{ fontSize:22, fontWeight:900 }}>{instituicao?.nome || 'Instituição'}</div>
                <div style={{ fontSize:13, opacity:.8, fontWeight:600, marginTop:3 }}>Gerenciamento de alunos e responsáveis</div>
              </div>
              <div style={{ flex:1 }}></div>
              <button onClick={() => changeTab('solicit')} style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:22, position:'relative' }}>🔔{estatisticas.pendentes > 0 && <span style={{ position:'absolute', top:-2, right:-2, width:16, height:16, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{estatisticas.pendentes}</span>}</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {[{num:estatisticas.alunos,label:'Alunos',color:'var(--green)'},{num:`${estatisticas.taxaAcerto}%`,label:'Média de acerto',color:'var(--blue)'},{num:estatisticas.pendentes,label:'Solicitações',color:'var(--yellow)'},{num:students.filter(student => student.online).length,label:'Ativos hoje',color:'var(--pink)'}].map((s,i) => (
                <div key={i} style={{ background:'#fff', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:s.color }}>{s.num}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:.5, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {['alunos','solicit','relatorio'].map(t => (
                <button key={t} onClick={() => changeTab(t)} style={{ padding:'10px 20px', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:800, cursor:'pointer', transition:'all .2s', background:activeTab===t?'var(--green)':'#e0eaf0', color:activeTab===t?'#fff':'#888', boxShadow:activeTab===t?'0 4px 12px rgba(72,195,120,.4)':'none', position:'relative' }}>
                  {t==='alunos'?'👤 Alunos':t==='solicit'?'📥 Solicitações':'📊 Relatório'}
                  {t==='solicit' && estatisticas.pendentes > 0 && <span style={{ position:'absolute', top:-6, right:-6, width:17, height:17, borderRadius:'50%', background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{estatisticas.pendentes}</span>}
                </button>
              ))}
            </div>
            {activeTab === 'alunos' && (
              <>
                <div style={{ marginBottom:16 }}>
                  <input value={studentSearch} onChange={event => setStudentSearch(event.target.value)} style={{ width:'100%', padding:'11px 16px', border:'1.5px solid var(--border)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, color:'var(--dark)', background:'#fff', outline:'none' }} placeholder="Buscar aluno..." />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {loading && <div style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>Carregando alunos...</div>}
                  {!loading && filteredStudents.length === 0 && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>{studentSearch.trim() ? `Nenhum aluno encontrado com o nome "${studentSearch.trim()}".` : 'Nenhum aluno afiliado à instituição.'}</div>}
                  {filteredStudents.map((s,i) => (
                    <div key={i} className="student-card-d" onClick={() => abrirDashboard(s.id)} style={{ background:'#fff', borderRadius:18, padding:'16px 20px', display:'flex', alignItems:'center', gap:14, boxShadow:'var(--shadow-card)', cursor:'pointer', transition:'transform .15s' }}>
                      <div style={{ width:46, height:46, borderRadius:'50%', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{s.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:'var(--dark)' }}>{s.name}</div>
                        <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>{s.sub}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                          <div style={{ width:100, height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${s.prog}%`, background:'var(--green)', borderRadius:99 }}></div></div>
                          <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{s.prog}%</div>
                        </div>
                      </div>
                      <button onClick={event => { event.stopPropagation(); setAlunoParaRemover(s); }} aria-label={`Remover ${s.name}`} style={{ width:24, height:24, border:'none', borderRadius:'50%', background:'#ffecec', color:'var(--red)', fontWeight:900, fontSize:16, lineHeight:1, cursor:'pointer', flexShrink:0 }}>×</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'solicit' && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {loading && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>Carregando solicitações...</div>}
                {reqsDesk.map(r => (
                  <div key={r.id} style={{ background:'#fff', borderRadius:20, padding:18, boxShadow:'var(--shadow-card)', borderLeft:`5px solid ${r.status==='accept'?'var(--green)':r.status==='reject'?'var(--red)':'var(--yellow)'}`, display:'flex', flexDirection:'column', gap:14, opacity:r.status==='reject'?.55:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:54, height:54, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>{r.icon}</div>
                      <div style={{ flex:1, minWidth:0, textAlign:'center' }}>
                        <div style={{ fontSize:16, fontWeight:900, color:'var(--dark)' }}>{r.name}</div>
                        <div style={{ fontSize:13, color:'#555', fontWeight:700, marginTop:3 }}>{r.sub}</div>
                      </div>
                      <div style={{ fontSize:12, color:'#aaa', fontWeight:700, textAlign:'right', flexShrink:0 }}>{r.time}</div>
                    </div>
                    {r.status==='pending' && (
                      <div style={{ background:'#f8fafd', borderRadius:14, padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
                        {[['Idade do aluno', r.age],['Diagnóstico', r.diag],['Código usado', r.code]].map(([label, value]) => (
                          <div key={label} style={{ display:'flex', justifyContent:'space-between', gap:16 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:'#888' }}>{label}</span>
                            <span style={{ fontSize:13, fontWeight:800, color:'var(--dark)', textAlign:'right' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {r.status==='pending' ? (
                      <div style={{ display:'flex', gap:10 }}>
                        <button onClick={() => doActionDesk(r.id,'accept')} style={{ flex:1, padding:12, background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 12px rgba(72,195,120,.4)' }}>✅ Aceitar</button>
                        <button onClick={() => doActionDesk(r.id,'reject')} style={{ flex:1, padding:12, background:'#fff', color:'var(--red)', border:'2px solid var(--red)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer' }}>❌ Recusar</button>
                      </div>
                    ) : (
                      <span style={{ fontSize:14, fontWeight:900, color:r.status==='accept'?'var(--green)':'var(--red)' }}>{r.status==='accept'?'✅ Aceita!':'❌ Recusada'}</span>
                    )}
                  </div>
                ))}
                {!loading && reqsDesk.length === 0 && <div role="status" style={{ textAlign:'center', color:'var(--text-muted)', fontWeight:700 }}>Nenhuma solicitação encontrada.</div>}
              </div>
            )}
            {activeTab === 'relatorio' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)', marginBottom:16 }}>📊 Resumo — {relatorio.periodo}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[{v:`${relatorio.resumo.taxaAcerto}%`,l:'Taxa acerto',bg:'#edfaf3',c:'var(--green)'},{v:relatorio.resumo.licoes,l:'Lições feitas',bg:'#e8f4ff',c:'var(--blue)'},{v:relatorio.resumo.mediaDiasSemana,l:'Média dias/sem',bg:'#fff8e1',c:'#d4a000'},{v:`⭐ ${relatorio.resumo.xpColetivo}`,l:'XP coletivo',bg:'#fff0f7',c:'var(--pink)'}].map((s,i) => (
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
                    {relatorio.ranking.map((t,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ fontSize:22 }}>{t.medalha}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{t.nome}</div>
                          <div style={{ height:6, background:'var(--border)', borderRadius:99, marginTop:5, overflow:'hidden' }}><div style={{ height:'100%', width:`${relatorio.ranking[0]?.pontuacao ? (t.pontuacao / relatorio.ranking[0].pontuacao) * 100 : 0}%`, background:['var(--yellow)','#78909c','#a1887f'][i], borderRadius:99 }}></div></div>
                        </div>
                        <div style={{ fontSize:13, fontWeight:900, color:'#888' }}>{t.pontuacao}</div>
                      </div>
                    ))}
                    {relatorio.ranking.length === 0 && <div style={{ color:'#888', fontWeight:700, fontSize:13 }}>Nenhum aluno aceito com atividade no período.</div>}
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
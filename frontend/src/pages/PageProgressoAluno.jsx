import { useEffect, useState } from 'react';

const feedbackLabels = {
  sim: { emoji:'✅', label:'Sim (correto)' }, parcialmente: { emoji:'👍', label:'Parcialmente' },
  quase: { emoji:'🤏', label:'Quase' }, nao: { emoji:'❌', label:'Não' }
};

export default function PageProgressoAluno({ navigate }) {
  const [period, setPeriod] = useState('Semana');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(
    localStorage.getItem('token') &&
    (localStorage.getItem('dashboardAlunoId') || localStorage.getItem('alunoId'))
  ));
  const [error, setError] = useState(() => (
    localStorage.getItem('token') &&
    (localStorage.getItem('dashboardAlunoId') || localStorage.getItem('alunoId'))
      ? null
      : 'Não foi possível identificar o aluno.'
  ));

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    const alunoId = localStorage.getItem('dashboardAlunoId') || localStorage.getItem('alunoId');
    if (!token || !alunoId) {
      return () => { cancelled = true; };
    }
    const periodo = period === 'Mês' ? 'mes' : period === 'Total' ? 'total' : 'semana';
    fetch(`http://localhost:3001/dashboard/aluno?alunoId=${alunoId}&periodo=${periodo}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(response => response.json().then(data => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar o progresso.');
        if (!cancelled) {
          setDashboard(data);
          setError(null);
        }
      })
      .catch(requestError => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [period]);

  const changePeriod = nextPeriod => {
    if (nextPeriod === period) return;
    setLoading(true);
    setError(null);
    setDashboard(null);
    setPeriod(nextPeriod);
  };

  const resumo = dashboard?.resumo || { licoes:0, acertos:0, erros:0, xp:0, diasOfensiva:0, taxaAcerto:0 };
  const stats = [
    [ '🎓', resumo.licoes, 'Lições' ],
    [ '✅', resumo.acertos, 'Acertos' ],
    [ '❌', resumo.erros, 'Erros' ],
    [ '⭐', resumo.xp, 'XP' ],
    [ '🔥', resumo.diasOfensiva, 'Dias seguidos' ],
    [ '📊', `${resumo.taxaAcerto}%`, 'Taxa de acerto' ]
  ];
  const categorias = dashboard?.categorias || [];
  const recentes = dashboard?.recentes || [];
  const evolucao = dashboard?.evolucao || [];
  const nomeCategoria = category => {
    let nome = String(category.nome || '').trim();
    const icone = String(category.icone || '').trim();
    while (icone && nome.startsWith(icone)) nome = nome.slice(icone.length).trim();
    return nome;
  };

  return <main className="progresso-page aluno-page">
    <style>{`.progresso-page{width:100%;min-height:100vh;background:var(--bg);color:var(--dark);font-family:'Nunito',sans-serif;overflow:hidden}.progresso-top{padding:5px 16px 14px;color:#fff}.progresso-title{font-size:17px;font-weight:900;text-align:center;flex:1}.progresso-back{width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;font-size:20px;line-height:20px}.progresso-tabs{display:flex;gap:4px;padding:3px;border-radius:14px}.progresso-tabs button{flex:1;min-width:0;border:0;border-radius:10px;padding:7px;background:transparent;color:rgba(255,255,255,.75);font:800 11px Nunito,sans-serif}.progresso-tabs button.active{background:var(--white);color:var(--dark)}.progresso-body{width:100%;max-width:780px;margin:auto;padding:12px 16px 80px;box-sizing:border-box}.progresso-section-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);font-weight:900;margin:18px 0 8px}.progresso-card{background:var(--white);color:var(--dark);border-radius:18px;padding:12px;box-shadow:0 3px 12px rgba(0,0,0,.07);box-sizing:border-box}.progresso-stat,.progresso-result,.progresso-recent{background:var(--white);color:var(--dark);border:1px solid var(--border)}.progresso-track{background:var(--border)}@media(min-width:768px){.progresso-top{padding:20px 24px}.progresso-body{padding:24px 32px}.progresso-back{width:38px;height:38px}.progresso-title{font-size:24px}}@media(min-width:1024px){.progresso-top{padding-left:max(40px,calc((100% - 780px)/2));padding-right:max(40px,calc((100% - 780px)/2))}.progresso-body{padding:32px 40px 80px}}`}</style>
    <header className="progresso-top" style={{ background:'var(--blue)' }}><div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}><button className="progresso-back" onClick={() => navigate('perfil')} aria-label="Voltar">‹</button><div className="progresso-title">📈 Progresso</div><div style={{ width:30 }} /></div>
    <div className="progresso-tabs" style={{ background:'rgba(255,255,255,.2)' }}>
      {['Semana','Mês','Total'].map(item => <button key={item} onClick={() => changePeriod(item)} style={{ flex:1, border:0, borderRadius:10, padding:8, background:period === item ? '#fff' : 'transparent', color:period === item ? '#1a1a2e' : '#fff', fontWeight:800 }}>{item}</button>)}
    </div></header><div className="progresso-body">
    {loading ? <p role="status" style={{ color:'var(--text-muted)', fontWeight:800 }}>Carregando o progresso...</p> : error ? <p role="alert" style={{ color:'var(--red)', fontWeight:800 }}>{error}</p> : <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>{stats.map(([icon, value, label]) => <div className="progresso-stat" key={label} style={{ borderRadius:18, padding:14, textAlign:'center', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}><div style={{ fontSize:26 }}>{icon}</div><strong style={{ fontSize:22 }}>{value}</strong><div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:800 }}>{label}</div></div>)}</div>
      <h2 className="progresso-section-title">Evolução no período</h2>
      {evolucao.length ? evolucao.map(result => <div className="progresso-result" key={result.id} style={{ borderRadius:14, padding:14, marginBottom:8, boxShadow:'0 3px 12px rgba(0,0,0,.05)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', gap:10, marginBottom:6 }}>
          <strong>{result.titulo}</strong>
          <span style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{new Date(result.data).toLocaleString('pt-BR')}</span>
        </div>
        <div style={{ display:'flex', gap:16, fontSize:13, fontWeight:800 }}>
          <span style={{ color:'var(--green)' }}>Acertos: {result.acertos}</span>
          <span style={{ color:'var(--red)' }}>Erros: {result.erros}</span>
        </div>
      </div>) : <p style={{ color:'var(--text-muted)', fontWeight:700 }}>Nenhum resultado de desempenho foi registrado neste período.</p>}
      <h2 className="progresso-section-title">Progresso por categoria</h2>
      <section className="progresso-card">{categorias.map((category, index) => <div key={category.slug || category.id} style={{ marginBottom:14 }}><div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:12 }}><span>{category.icone || '📚'} {nomeCategoria(category)}</span><span>{category.concluidas} / {category.total}</span></div><div className="progresso-track" style={{ height:9, borderRadius:99, overflow:'hidden', marginTop:5 }}><div style={{ height:'100%', width:`${category.percentual}%`, background:['#fdbe2d','#38a7fb','#48c378','#e9589a'][index % 4] }} /></div></div>)}</section>
      <h2 className="progresso-section-title">Atividade recente</h2>
      {recentes.map(activity => <div className="progresso-recent" key={`${activity.titulo}-${activity.data}`} style={{ borderRadius:14, padding:14, marginBottom:8 }}><strong>{activity.titulo}</strong><div style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(activity.data).toLocaleString('pt-BR')}</div><span style={{ fontSize:12, fontWeight:800 }}>{activity.resposta ? feedbackLabels[activity.resposta]?.label : 'Sem avaliação'}</span></div>)}
      {!recentes.length && <p style={{ color:'var(--text-muted)', fontWeight:700 }}>Nenhuma atividade registrada neste período.</p>}
    </>}</div>
  </main>;
}

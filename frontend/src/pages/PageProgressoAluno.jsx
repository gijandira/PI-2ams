import { useEffect, useState } from 'react';

const feedbackLabels = {
  sim: { emoji:'✅', label:'Sim (correto)' }, parcialmente: { emoji:'👍', label:'Parcialmente' },
  quase: { emoji:'🤏', label:'Quase' }, nao: { emoji:'❌', label:'Não' }
};

export default function PageProgressoAluno({ navigate }) {
  const [period, setPeriod] = useState('Semana');
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const alunoId = localStorage.getItem('dashboardAlunoId') || localStorage.getItem('alunoId');
    if (!token || !alunoId) { setError('Não foi possível identificar o aluno.'); return; }
    const periodo = period === 'Mês' ? 'mes' : period === 'Total' ? 'total' : 'semana';
    fetch(`http://localhost:3001/dashboard/aluno?alunoId=${alunoId}&periodo=${periodo}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(response => response.json().then(data => ({ response, data })))
      .then(({ response, data }) => { if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar o progresso.'); setDashboard(data); setError(null); })
      .catch(requestError => setError(requestError.message));
  }, [period]);

  const resumo = dashboard?.resumo || { licoes:0, xp:0, diasOfensiva:0, taxaAcerto:0 };
  const stats = [[ '🎓', resumo.licoes, 'Lições' ], [ '⭐', resumo.xp, 'XP' ], [ '🔥', resumo.diasOfensiva, 'Dias seguidos' ], [ '✅', `${resumo.taxaAcerto}%`, 'Taxa de acerto' ]];
  const categorias = dashboard?.categorias || [];
  const recentes = dashboard?.recentes || [];

  return <main className="progresso-page aluno-page">
    <style>{`.progresso-page{width:100%;min-height:100vh;background:var(--bg);color:var(--dark);font-family:'Nunito',sans-serif;overflow:hidden}.progresso-top{padding:5px 16px 14px;color:#fff}.progresso-title{font-size:17px;font-weight:900;text-align:center;flex:1}.progresso-back{width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;font-size:20px;line-height:20px}.progresso-tabs{display:flex;gap:4px;padding:3px;border-radius:14px}.progresso-tabs button{flex:1;min-width:0;border:0;border-radius:10px;padding:7px;background:transparent;color:rgba(255,255,255,.75);font:800 11px Nunito,sans-serif}.progresso-tabs button.active{background:#fff;color:var(--dark)}.progresso-body{width:100%;max-width:780px;margin:auto;padding:12px 16px 80px;box-sizing:border-box}.progresso-section-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#888;font-weight:900;margin:18px 0 8px}.progresso-card{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 12px rgba(0,0,0,.07);box-sizing:border-box}@media(min-width:768px){.progresso-top{padding:20px 24px}.progresso-body{padding:24px 32px}.progresso-back{width:38px;height:38px}.progresso-title{font-size:24px}}@media(min-width:1024px){.progresso-top{padding-left:max(40px,calc((100% - 780px)/2));padding-right:max(40px,calc((100% - 780px)/2))}.progresso-body{padding:32px 40px 80px}}`}</style>
    <header className="progresso-top" style={{ background:'var(--blue)' }}><div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}><button className="progresso-back" onClick={() => navigate('perfil')} aria-label="Voltar">‹</button><div className="progresso-title">Progresso</div><div style={{ width:30 }} /></div>
    <div className="progresso-tabs" style={{ background:'rgba(255,255,255,.2)' }}>
      {['Semana','Mês','Total'].map(item => <button key={item} onClick={() => setPeriod(item)} style={{ flex:1, border:0, borderRadius:10, padding:8, background:period === item ? '#fff' : 'transparent', color:period === item ? 'var(--dark)' : '#fff', fontWeight:800 }}>{item}</button>)}
    </div></header><div className="progresso-body">
    {error ? <p style={{ color:'var(--red)', fontWeight:800 }}>{error}</p> : <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>{stats.map(([icon, value, label]) => <div key={label} style={{ background:'#fff', borderRadius:18, padding:14, textAlign:'center', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}><div style={{ fontSize:26 }}>{icon}</div><strong style={{ fontSize:22 }}>{value}</strong><div style={{ fontSize:11, color:'#888', fontWeight:800 }}>{label}</div></div>)}</div>
      <h2 className="progresso-section-title">Progresso por categoria</h2>
      <section className="progresso-card">{categorias.map((category, index) => <div key={category.nome} style={{ marginBottom:14 }}><div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:12 }}><span>{category.icone || '📚'} {category.nome}</span><span>{category.concluidas} / {category.total}</span></div><div style={{ height:9, background:'#e0e8f0', borderRadius:99, overflow:'hidden', marginTop:5 }}><div style={{ height:'100%', width:`${category.percentual}%`, background:['#fdbe2d','#38a7fb','#48c378','#e9589a'][index % 4] }} /></div></div>)}</section>
      <h2 className="progresso-section-title">Atividade recente</h2>
      {recentes.map(activity => <div key={`${activity.titulo}-${activity.data}`} style={{ background:'#fff', borderRadius:14, padding:14, marginBottom:8 }}><strong>{activity.titulo}</strong><div style={{ fontSize:12, color:'#888' }}>{new Date(activity.data).toLocaleString('pt-BR')}</div><span style={{ fontSize:12, fontWeight:800 }}>{activity.resposta ? feedbackLabels[activity.resposta]?.label : 'Sem avaliação'}</span></div>)}
      {!recentes.length && <p style={{ color:'#888', fontWeight:700 }}>Nenhuma atividade registrada neste período.</p>}
    </>}</div>
  </main>;
}

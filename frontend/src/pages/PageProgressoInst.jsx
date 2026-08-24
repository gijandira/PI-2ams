import { useEffect, useState } from 'react';
import { IconHome, IconChat, IconSettings } from '../components/icons';

const feedbackLabels = {
  sim: { emoji:'✅', label:'Sim (correto)' }, parcialmente: { emoji:'👍', label:'Parcialmente' },
  quase: { emoji:'🤏', label:'Quase' }, nao: { emoji:'❌', label:'Não' }
};

export default function PageProgressoInst({ navigate }) {
  const [period, setPeriod] = useState('Semana');
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const alunoId = localStorage.getItem('dashboardAlunoId');
    if (!token || !alunoId) { setError('Não foi possível identificar o aluno.'); return; }
    const periodo = period === 'Mês' ? 'mes' : period === 'Total' ? 'total' : 'semana';
    fetch(`http://localhost:3001/dashboard/aluno?alunoId=${alunoId}&periodo=${periodo}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(response => response.json().then(data => ({ response, data })))
      .then(({ response, data }) => { if (!response.ok) throw new Error(data.erro || 'Não foi possível carregar o progresso.'); setDashboard(data); setError(null); })
      .catch(requestError => setError(requestError.message));
  }, [period]);

  const aluno = dashboard?.aluno || {};
  const avatarAluno = aluno.avatar ? `http://localhost:3001${aluno.avatar}` : null;
  const resumo = dashboard?.resumo || { licoes:0, xp:0, diasOfensiva:0, taxaAcerto:0 };
  const stats = [[ '🎓', resumo.licoes, 'Lições' ], [ '⭐', resumo.xp, 'XP' ], [ '🔥', resumo.diasOfensiva, 'Dias seguidos' ], [ '✅', `${resumo.taxaAcerto}%`, 'Taxa de acerto' ]];
  const categorias = dashboard?.categorias || [];
  const feedback = dashboard?.feedback || [];

  return <main className="progresso-page inst-page">
    <style>{`.progresso-page{width:100%;min-height:100vh;background:var(--bg);color:var(--dark);font-family:'Nunito',sans-serif;overflow:hidden}.progresso-top{padding:5px 16px 14px;color:#fff}.progresso-title{font-size:17px;font-weight:900;text-align:center;flex:1}.progresso-back{width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;font-size:20px;line-height:20px}.progresso-tabs{display:flex;gap:4px;padding:3px;border-radius:14px}.progresso-tabs button{flex:1;min-width:0;border:0;border-radius:10px;padding:7px;background:transparent;color:rgba(255,255,255,.75);font:800 11px Nunito,sans-serif}.progresso-tabs button.active{background:#fff;color:var(--dark)}.progresso-body{width:100%;max-width:780px;margin:auto;padding:12px 16px 80px;box-sizing:border-box}.progresso-section-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#888;font-weight:900;margin:18px 0 8px}.progresso-card{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 12px rgba(0,0,0,.07);box-sizing:border-box}@media(min-width:768px){.progresso-top{padding:20px 24px}.progresso-body{padding:24px}.progresso-back{width:38px;height:38px}.progresso-title{font-size:20px}}@media(min-width:1024px){.progresso-top{padding-left:max(40px,calc((100% - 780px)/2));padding-right:max(40px,calc((100% - 780px)/2))}.progresso-body{padding:32px 40px 80px}}`}</style>
    <header className="progresso-top" style={{ background:'var(--green)' }}><div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}><button className="progresso-back" onClick={() => navigate('home-instituicao')} aria-label="Voltar">‹</button><div className="progresso-title">Dashboard do Aluno</div><div style={{ width:30 }} /></div>
    <section style={{ background:'rgba(255,255,255,.16)', borderRadius:18, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:10 }}><div style={{ width:44, height:44, borderRadius:'50%', background:'#fff', display:'grid', placeItems:'center', fontSize:22, overflow:'hidden' }}>{avatarAluno ? <img src={avatarAluno} alt="Foto do aluno" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🧑'}</div><div><strong style={{ fontSize:16 }}>{aluno.nome || 'Aluno'}</strong><div style={{ fontSize:10, opacity:.85 }}>Resp.: {aluno.responsavelNome || 'Não informado'}{aluno.responsavelTelefone ? ` · ${aluno.responsavelTelefone}` : ''}</div><small style={{ background:'rgba(255,255,255,.2)', borderRadius:12, padding:'2px 7px', fontSize:9 }}>● Ativo hoje</small></div></section>
    <div className="progresso-tabs" style={{ background:'rgba(255,255,255,.2)' }}>{['Semana','Mês','Total'].map(item => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div></header><div className="progresso-body">
    {error ? <p style={{ color:'var(--red)', fontWeight:800 }}>{error}</p> : <>
      <h2 className="progresso-section-title" style={{ marginTop:0 }}>Resumo da semana</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>{stats.map(([icon, value, label]) => <div key={label} style={{ background:'#fff', borderRadius:18, padding:14, textAlign:'center', boxShadow:'0 3px 12px rgba(0,0,0,.07)' }}><div style={{ fontSize:26 }}>{icon}</div><strong style={{ fontSize:22 }}>{value}</strong><div style={{ fontSize:11, color:'#888', fontWeight:800 }}>{label}</div></div>)}</div>
      <h2 className="progresso-section-title">Progresso por categoria</h2>
      <section className="progresso-card">{categorias.map((category, index) => <div key={category.nome} style={{ marginBottom:14 }}><div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:12 }}><span>{category.icone || '📚'} {category.nome}</span><span>{category.concluidas} / {category.total} fases</span></div><div style={{ height:9, background:'#e0e8f0', borderRadius:99, overflow:'hidden', marginTop:5 }}><div style={{ height:'100%', width:`${category.percentual}%`, background:['#fdbe2d','#38a7fb','#48c378','#e9589a'][index % 4] }} /></div></div>)}</section>
      <h2 className="progresso-section-title">Avaliação do responsável</h2>
      <section className="progresso-card">{feedback.map(item => { const label = feedbackLabels[item.resposta] || { emoji:'❔', label:item.resposta }; return <div key={item.resposta} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10, fontSize:11 }}><span>{label.emoji}</span><strong style={{ width:100 }}>{label.label}</strong><div style={{ flex:1, height:8, background:'#e0e8f0', borderRadius:99 }}><div style={{ width:`${item.percentual}%`, height:'100%', background:'var(--green)', borderRadius:99 }} /></div><span>{item.percentual}%</span></div>; })}</section>
    </>}</div>
    <nav className="bottom-nav">
      <div className="nav-item" onClick={() => navigate('home-instituicao')}>
        <div className="nav-icon"><IconHome /></div>
        <div className="nav-label">Início</div>
      </div>
      <div className="nav-item" onClick={() => navigate('solicitacoes-inst')}>
        <div className="nav-icon"><IconChat /></div>
        <div className="nav-label">Solicitações</div>
      </div>
      <div className="nav-item" onClick={() => navigate('config-inst')}>
        <div className="nav-icon"><IconSettings /></div>
        <div className="nav-label">Config.</div>
      </div>
    </nav>
  </main>;
}

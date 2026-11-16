import { useState } from 'react';

const FB_OPTIONS = [
  { emoji:'❌', label:'Não',          desc:'Não conseguiu repetir a palavra', selColor:'#e94542', selBg:'#ffecec' },
  { emoji:'🤏', label:'Quase',        desc:'Tentou, mas com dificuldade',      selColor:'#fdbe2d', selBg:'#fff8e1' },
  { emoji:'👍', label:'Parcialmente', desc:'Falou com alguma ajuda',           selColor:'#38a7fb', selBg:'#e8f4ff' },
  { emoji:'✅', label:'Sim!',         desc:'Falou corretamente e com clareza', selColor:'#48c378', selBg:'#edfaf3' },
];

export default function PageLicaoFeedback({ navigate }) {
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [licao] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('licaoSelecionada')) || { label: 'Fase 4', emoji: '😨', categoria: 'Sentimentos' };
    } catch {
      return { label: 'Fase 4', emoji: '😨', categoria: 'Sentimentos' };
    }
  });
  const respostaResponsavel = ['nao', 'quase', 'parcialmente', 'sim'][selected];
  const aprovado = selected === 2 || selected === 3;
  const xpGanho = selected === null ? 0 : aprovado ? 20 : 5;

  const continuar = async () => {
    if (selected === null || isSubmitting) return;

    const token = localStorage.getItem('token');
    const alunoId = Number(localStorage.getItem('alunoId') || localStorage.getItem('dashboardAlunoId') || 0);
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/dashboard/registrar-sessao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          alunoId: alunoId || undefined,
          atividadeId: licao.atividadeId || 1,
          categoria: licao.categoria,
          fase: licao.fase,
          acertos: aprovado ? 1 : 0,
          totalPerguntas: 1,
          pontos: xpGanho,
          feedbackResponsavel: respostaResponsavel
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.erro || 'Não foi possível registrar a avaliação.');

      localStorage.setItem('ultimoXpGanho', String(data.xpGanho ?? 0));
      localStorage.setItem('ultimoXpTotal', String(data.xpTotal || 0));
      navigate(aprovado ? 'licoes' : 'licao-atividade');
    } catch (requestError) {
      console.error('Erro ao registrar avaliação da lição:', requestError);
      setError(requestError.message || 'Não foi possível salvar a avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .fb-opt { display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:18px; border:2.5px solid var(--fb-accent, var(--border)); background:var(--fb-background, var(--white)); color:var(--dark); cursor:pointer; transition:all .15s; box-shadow:0 3px 10px rgba(0,0,0,.05); }
        .fb-opt:hover { transform:translateX(4px); }
        .fb-opt-icon { background:var(--input-bg); }
        body.autim-dark-theme .fb-opt { --fb-background:var(--white); }
        body.autim-dark-theme .fb-opt.is-selected { --fb-background:#1c2128 !important; }
        body.autim-dark-theme .fb-opt.is-selected .fb-opt-icon { background:#30363d; }
        @keyframes bounce-in { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* result section */}
        <div style={{ background:'var(--blue)', padding:'20px 28px 32px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, flexShrink:0, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, background:'rgba(255,255,255,.1)', borderRadius:'50%' }}></div>
          <div style={{ position:'absolute', top:-20, right:-30, width:100, height:100, background:'rgba(255,255,255,.08)', borderRadius:'50%' }}></div>
          <div style={{ fontSize:64, animation:'bounce-in .6s ease-out', position:'relative', zIndex:1 }}>🎉</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff', position:'relative', zIndex:1 }}>Avaliação da lição</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.85)', fontWeight:600, textAlign:'center', position:'relative', zIndex:1 }}>{licao.label} de {licao.categoria}</div>
          <div style={{ background:'#fdbe2d', borderRadius:20, padding:'6px 18px', fontSize:14, fontWeight:900, color:'var(--dark)', position:'relative', zIndex:1 }}>+{xpGanho} XP ⭐</div>
        </div>

        {/* feedback card */}
        <div style={{ background:'var(--white)', color:'var(--dark)', borderRadius:'32px 32px 0 0', flex:1, padding:'28px 24px 20px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:28, right:28, height:3, background:'linear-gradient(90deg,var(--blue),var(--green))', borderRadius:99 }}></div>

          <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'var(--text-muted)', textAlign:'center', marginBottom:6 }}>📋 Avaliação do responsável</div>
          <div style={{ fontSize:18, fontWeight:900, color:'var(--dark)', textAlign:'center', lineHeight:1.4, marginBottom:24 }}>
            Como seu filho falou a palavra?
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
            {FB_OPTIONS.map((opt, i) => (
              <div key={i}
                className={`fb-opt${selected === i ? ' is-selected' : ''}`}
                onClick={() => setSelected(i)}
                style={{
                  '--fb-accent': selected === i ? opt.selColor : 'var(--border)',
                  '--fb-background': selected === i ? opt.selBg : 'var(--white)',
                }}
              >
                <div className="fb-opt-icon" style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{opt.emoji}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--dark)' }}>{opt.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginTop:2 }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {error && <p role="alert" style={{ marginTop:12, color:'var(--red)', fontWeight:800, textAlign:'center' }}>{error}</p>}

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:20 }}>
            <button onClick={continuar} disabled={selected === null || isSubmitting} style={{ width:'100%', padding:14, background:selected !== null && !isSubmitting ? 'var(--green)' : 'var(--border)', color:selected !== null && !isSubmitting ? '#fff' : 'var(--text-muted)', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, letterSpacing:1, textTransform:'uppercase', cursor:selected !== null && !isSubmitting ? 'pointer' : 'not-allowed', boxShadow:selected !== null && !isSubmitting ? '0 6px 18px rgba(72,195,120,.4)' : 'none' }}>
              {isSubmitting ? 'Salvando...' : aprovado ? 'Concluir lição →' : selected === null ? 'Selecione uma avaliação' : 'Repetir atividade'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

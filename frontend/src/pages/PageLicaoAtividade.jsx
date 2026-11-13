import { useState } from 'react';
import { speakText } from '../hooks/voiceUtils';

const EMOTIONS = [
  { emoji:'😄', label:'Feliz' },
  { emoji:'😢', label:'Triste' },
  { emoji:'😨', label:'Assustado' },
  { emoji:'😠', label:'Bravo' },
  { emoji:'😴', label:'Cansado' },
];

function getVoiceSettings() {
  try {
    return {
      narrator: true,
      speed: 50,
      voice: 'Feminina',
      ...JSON.parse(localStorage.getItem('autim.user-settings') || '{}')
    };
  } catch {
    return { narrator: true, speed: 50, voice: 'Feminina' };
  }
}

export default function PageLicaoAtividade({ navigate }) {
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licao] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('licaoSelecionada')) || { label: 'Fase 4', emoji: '😨', categoria: 'Sentimentos' };
    } catch {
      return { label: 'Fase 4', emoji: '😨', categoria: 'Sentimentos' };
    }
  });
  const options = licao.opcoes || [
    EMOTIONS.find(option => option.emoji === licao.emoji) || EMOTIONS[0],
    ...EMOTIONS.filter(option => option.emoji !== licao.emoji)
  ].slice(0, 4);

  const handleSelect = (i) => setSelected(i);

  const handleSubmit = async () => {
    if (selected === null || isSubmitting) return;

    const token = localStorage.getItem('token');
    const alunoId = Number(localStorage.getItem('alunoId') || localStorage.getItem('dashboardAlunoId') || 0);
    const resposta = options[selected];
    const acertou = licao.palavra
      ? resposta.label === licao.palavra
      : resposta.emoji === licao.emoji;

    setIsSubmitting(true);

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
          acertos: acertou ? 1 : 0,
          totalPerguntas: 1,
          pontos: acertou ? 20 : 5,
          feedbackResponsavel: null
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.erro || 'Não foi possível registrar a lição.');
      }

      localStorage.setItem('ultimoXpGanho', String(data.xpGanho ?? 0));
      localStorage.setItem('ultimoXpTotal', String(data.xpTotal || 0));
      navigate('licao-feedback');
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
      window.alert(error.message || 'Não foi possível salvar a lição.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .option-btn-lic { background:#fff; border:2.5px solid #e0e8f0; border-radius:18px; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer; transition:all .15s; box-shadow:0 3px 10px rgba(0,0,0,.07); }
        .option-btn-lic:hover { border-color:var(--blue); transform:translateY(-2px); }
        .option-btn-lic.correct { border-color:var(--green) !important; background:#edfaf3; }
        .option-btn-lic.wrong   { border-color:var(--red)   !important; background:#ffecec; }
        @keyframes pop-in { 0%{transform:scale(.5);opacity:0} 80%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* top bar */}
        <div style={{ padding:'4px 20px 14px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={() => navigate('licoes')} style={{ width:36, height:36, borderRadius:'50%', background:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.1)', fontSize:18 }}>✕</button>
          <div style={{ flex:1, background:'#e0e8f0', borderRadius:99, height:10, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'linear-gradient(90deg,var(--blue),var(--green))', borderRadius:99, width:'60%', transition:'width .5s' }}></div>
          </div>
          <div style={{ fontSize:18, display:'flex', gap:3 }}>❤️❤️❤️</div>
        </div>

        {/* phase tag */}
        <div style={{ textAlign:'center', padding:'0 20px 10px', flexShrink:0 }}>
          <span style={{ display:'inline-block', background:'#fff', border:'2px solid var(--blue)', borderRadius:20, padding:'4px 14px', fontSize:11, fontWeight:900, color:'var(--blue)', letterSpacing:1.5, textTransform:'uppercase' }}>{licao.emoji} {licao.categoria} — {licao.label}</span>
        </div>

        {/* question area */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 24px 0', gap:16 }}>
          <div style={{ fontSize:17, fontWeight:800, color:'var(--dark)', textAlign:'center', lineHeight:1.5 }}>
            {licao.pergunta || <>Como ele está se sentindo?<br/>Toque na resposta correta 👇</>}
          </div>

          <div style={{ width:140, height:140, borderRadius:'50%', background:'#fff', boxShadow:'0 8px 32px rgba(56,167,251,.25), 0 0 0 6px rgba(56,167,251,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, animation:'pop-in .4s ease-out' }}>
            {licao.emoji}
          </div>

          <div onClick={() => speakText(licao.palavra || options.find(option => option.emoji === licao.emoji)?.label || licao.label, getVoiceSettings())} role="button" tabIndex={0} style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', borderRadius:16, padding:'10px 18px', boxShadow:'0 3px 10px rgba(0,0,0,.07)', cursor:'pointer' }}>
            <span style={{ fontSize:22 }}>🔊</span>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--blue)' }}>Ouvir a palavra</span>
          </div>

          <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
            {options.map((opt, i) => (
              <div key={i}
                className={`option-btn-lic ${selected === i ? 'correct' : ''}`}
                onClick={() => handleSelect(i)}
              >
                <span style={{ fontSize:36, lineHeight:1 }}>{opt.emoji}</span>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--dark)', textTransform:'uppercase', letterSpacing:.5 }}>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom action */}
        <div style={{ padding:'10px 20px 32px', flexShrink:0 }}>
          <button
            onClick={handleSubmit}
            disabled={selected === null || isSubmitting}
            style={{ width:'100%', padding:15, background: selected !== null && !isSubmitting ? 'var(--blue)' : '#e0e8f0', color: selected !== null && !isSubmitting ? '#fff' : '#aaa', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:15, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', cursor: selected !== null && !isSubmitting ? 'pointer' : 'not-allowed', boxShadow: selected !== null && !isSubmitting ? '0 6px 20px rgba(56,167,251,.4)' : 'none', transition:'all .2s' }}
          >
            {isSubmitting ? 'Salvando...' : 'Verificar'}
          </button>
        </div>
      </div>
    </>
  );
}

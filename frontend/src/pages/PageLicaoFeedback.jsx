import { useState } from 'react';

const FB_OPTIONS = [
  { emoji:'❌', label:'Não',          desc:'Não conseguiu repetir a palavra', selColor:'#e94542', selBg:'#ffecec' },
  { emoji:'🤏', label:'Quase',        desc:'Tentou, mas com dificuldade',      selColor:'#fdbe2d', selBg:'#fff8e1' },
  { emoji:'👍', label:'Parcialmente', desc:'Falou com alguma ajuda',           selColor:'#38a7fb', selBg:'#e8f4ff' },
  { emoji:'✅', label:'Sim!',         desc:'Falou corretamente e com clareza', selColor:'#48c378', selBg:'#edfaf3' },
];

export default function PageLicaoFeedback({ navigate }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        .fb-opt { display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:18px; border:2.5px solid #e0e8f0; background:#fff; cursor:pointer; transition:all .15s; box-shadow:0 3px 10px rgba(0,0,0,.05); }
        .fb-opt:hover { transform:translateX(4px); }
        @keyframes bounce-in { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* result section */}
        <div style={{ background:'var(--blue)', padding:'20px 28px 32px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, flexShrink:0, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, background:'rgba(255,255,255,.1)', borderRadius:'50%' }}></div>
          <div style={{ position:'absolute', top:-20, right:-30, width:100, height:100, background:'rgba(255,255,255,.08)', borderRadius:'50%' }}></div>
          <div style={{ fontSize:64, animation:'bounce-in .6s ease-out', position:'relative', zIndex:1 }}>🎉</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff', position:'relative', zIndex:1 }}>Lição concluída!</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.85)', fontWeight:600, textAlign:'center', position:'relative', zIndex:1 }}>Fase 4 de Sentimentos finalizada</div>
          <div style={{ background:'#fdbe2d', borderRadius:20, padding:'6px 18px', fontSize:14, fontWeight:900, color:'var(--dark)', position:'relative', zIndex:1 }}>+20 XP ⭐</div>
        </div>

        {/* feedback card */}
        <div style={{ background:'#fff', borderRadius:'32px 32px 0 0', flex:1, padding:'28px 24px 20px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:28, right:28, height:3, background:'linear-gradient(90deg,var(--blue),var(--green))', borderRadius:99 }}></div>

          <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', textAlign:'center', marginBottom:6 }}>📋 Avaliação do responsável</div>
          <div style={{ fontSize:18, fontWeight:900, color:'var(--dark)', textAlign:'center', lineHeight:1.4, marginBottom:24 }}>
            Seu filho falou a palavra<br/>corretamente?
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
            {FB_OPTIONS.map((opt, i) => (
              <div key={i}
                className="fb-opt"
                onClick={() => setSelected(i)}
                style={{
                  borderColor: selected === i ? opt.selColor : '#e0e8f0',
                  background:  selected === i ? opt.selBg   : '#fff',
                }}
              >
                <div style={{ width:44, height:44, borderRadius:'50%', background: selected === i ? opt.selBg : '#f8fafd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{opt.emoji}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--dark)' }}>{opt.label}</div>
                  <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:20 }}>
            <button onClick={() => navigate('licoes')} style={{ width:'100%', padding:14, background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, letterSpacing:1, textTransform:'uppercase', cursor:'pointer', boxShadow:'0 6px 18px rgba(72,195,120,.4)' }}>
              Continuar →
            </button>
            <button onClick={() => navigate('licao-atividade')} style={{ width:'100%', padding:14, background:'#fff', color:'var(--blue)', border:'2px solid var(--blue)', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, letterSpacing:1, textTransform:'uppercase', cursor:'pointer' }}>
              Repetir lição
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

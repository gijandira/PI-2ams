import logoIcone from '../assets/logo-icone.png';
import logoIconeBranco from '../assets/logo-icone-branco.png';

export default function PageIndex({ navigate }) {
  return (
    <>
      {/* MOBILE */}
      <div style={{
        minHeight: '100vh', background: 'var(--bg)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        padding: '72px 36px 56px'
      }} className="mobile-only-block">
        <style>{`.mobile-only-block { display: flex; } @media(min-width:768px){.mobile-only-block{display:none!important;}}`}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, flex:1, justifyContent:'center' }}>
          <img src={logoIcone} alt="Autim" style={{ width:90, height:90, objectFit:'contain', animation:'float 3s ease-in-out infinite' }} />
          <div style={{ fontSize:44, fontWeight:900, letterSpacing:6, color:'var(--dark)', textTransform:'uppercase' }}>Autim</div>
          <div style={{ width:60, height:3, borderRadius:99, background:'linear-gradient(90deg,var(--blue),var(--green))' }}></div>
          <p style={{ fontSize:13, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#666', textAlign:'center', lineHeight:1.7, maxWidth:240 }}>
            Um aplicativo que vai mudar a maneira de se comunicar
          </p>
        </div>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:13 }}>
            <button className="btn btn-blue" onClick={() => navigate('cadastro-escolha')}>Criar Conta</button>
          <button className="btn btn-outline-blue" onClick={() => navigate('login')}>Fazer Login</button>
        </div>
      </div>

      {/* DESKTOP — full width, no centering wrapper */}
      <div style={{ display:'none', width:'100vw', minHeight:'100vh' }} className="splash-desk">
        <style>{`@media(min-width:768px){.splash-desk{display:flex!important;}} .feat-card{transition:transform .2s,box-shadow .2s;} .feat-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.13)!important;}`}</style>

        {/* LEFT — dark gradient panel */}
        <div style={{
          flex: '0 0 52%', minHeight:'100vh',
          background: 'linear-gradient(145deg, #061527 0%, #0e2d52 35%, #1557a6 70%, #38a7fb 100%)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding: '60px 64px', position:'relative', overflow:'hidden'
        }}>
          {/* decorative blobs */}
          <div style={{ position:'absolute', top:'8%', left:'12%', width:280, height:280, borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%', background:'rgba(72,195,120,.18)', animation:'blob 8s ease-in-out infinite', filter:'blur(2px)' }}></div>
          <div style={{ position:'absolute', bottom:'12%', right:'6%', width:220, height:220, borderRadius:'40% 60% 70% 30%/40% 50% 60% 50%', background:'rgba(253,190,45,.13)', animation:'blob 10s ease-in-out infinite reverse', filter:'blur(2px)' }}></div>
          <div style={{ position:'absolute', top:'50%', right:'18%', width:140, height:140, borderRadius:'50%', background:'rgba(233,88,154,.12)', animation:'blob 7s ease-in-out infinite 2s' }}></div>
          {/* floating dots grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize:'32px 32px' }}></div>

          <div style={{ position:'relative', zIndex:1, textAlign:'center', animation:'fadeUp .8s ease both' }}>
            <img src={logoIconeBranco} alt="Autim" style={{ width:400, height:400, objectFit:'contain', animation:'float 4s ease-in-out infinite', display:'block', margin:'0 auto 20px', filter:'drop-shadow(0 12px 24px rgba(0,0,0,.3))' }} />
            <div style={{ width:80, height:4, borderRadius:99, background:'linear-gradient(90deg,var(--green),var(--blue))', margin:'0 auto 24px' }}></div>
            <p style={{ marginLeft: 20, fontSize:17, fontWeight:600, color:'rgba(255,255,255,.8)', lineHeight:1.75, maxWidth:360 }}>
              Conectando famílias, educadores e crianças com TEA através de comunicação inclusiva e tecnologia assistiva.
            </p>

            {/* Stats row */}
            <div style={{ display:'flex', gap:20, marginTop:44, justifyContent:'center' }}>
              {[{n:'2.4k+',l:'Famílias'},{n:'98%',l:'Satisfação'},{n:'50+',l:'Instituições'}].map((s,i) => (
                <div key={i} style={{ textAlign:'center', padding:'16px 22px', background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', borderRadius:18, border:'1px solid rgba(255,255,255,.15)', animation:`fadeUp .8s ease ${.1+i*.12}s both` }}>
                  <div style={{ fontSize:24, fontWeight:900, color:'#fff' }}>{s.n}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.65)', textTransform:'uppercase', letterSpacing:1, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — light panel */}
        <div style={{
          flex: '0 0 48%', minHeight:'100vh',
          background: '#f6faff', display:'flex', alignItems:'center', justifyContent:'center',
          padding: '60px 64px', overflowY:'auto'
        }}>
          <div style={{ width:'100%', maxWidth:440 }}>
            <div style={{ animation:'fadeUp .7s ease .1s both' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(56,167,251,.1)', border:'1px solid rgba(56,167,251,.25)', borderRadius:99, padding:'6px 16px', marginBottom:24 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--blue)', display:'inline-block', animation:'pulse-glow 2s infinite' }}></span>
                <span style={{ fontSize:12, fontWeight:800, color:'var(--blue)', letterSpacing:1, textTransform:'uppercase' }}>Plataforma inclusiva para TEA</span>
              </div>
              <h1 style={{ fontSize:38, fontWeight:900, color:'var(--dark)', lineHeight:1.15, marginBottom:12, letterSpacing:-1 }}>
                Bem-vindo ao<br/><span style={{ backgroundImage:'linear-gradient(135deg,var(--blue),var(--green))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Autim</span>
              </h1>
              <p style={{ fontSize:15, color:'#666', fontWeight:600, lineHeight:1.65, marginBottom:36 }}>
                A plataforma que transforma a comunicação para crianças no espectro autista, unindo escola e família.
              </p>
            </div>

            {/* Feature cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:36 }}>
              {[
                { icon:'💬', title:'Comunicação inclusiva',     sub:'Ferramentas adaptadas para cada aluno',        color:'#e8f4ff', accent:'var(--blue)' },
                { icon:'🎓', title:'Lições personalizadas',     sub:'Conteúdo adaptado ao nível de cada criança',   color:'#e8f9ef', accent:'var(--green)' },
                { icon:'🏫', title:'Integração com instituições',sub:'Escola e família sempre conectadas',          color:'#fff0f7', accent:'var(--pink)' },
                { icon:'🤖', title:'Assistente com IA',          sub:'Apoio inteligente para responsáveis',         color:'#fff8e1', accent:'var(--yellow)' },
              ].map((f, i) => (
                <div key={i} className="feat-card" style={{
                  display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                  background:'var(--white)', borderRadius:18,
                  boxShadow:'0 2px 12px rgba(0,0,0,.06)',
                  borderLeft:`4px solid ${f.accent}`,
                  animation:`fadeUp .7s ease ${.2+i*.1}s both`
                }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{f.title}</div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeUp .7s ease .6s both' }}>
              <button className="btn btn-blue" style={{ fontSize:16, padding:'17px' }} onClick={() => navigate('cadastro-escolha')}>Criar Conta Gratuita</button>
              <button className="btn btn-outline-blue" style={{ fontSize:16, padding:'17px' }} onClick={() => navigate('login')}>Já tenho uma conta</button>
            </div>

            <p style={{ textAlign:'center', fontSize:12, color:'#bbb', fontWeight:600, marginTop:20 }}>
              Ao criar conta, você concorda com nossos Termos de Uso.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
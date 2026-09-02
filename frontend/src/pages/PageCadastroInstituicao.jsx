export default function PageCadastroInstituicao({ navigate }) {
  return (
    <>
      <style>{`
        @media (min-width: 768px) { .cadi-mobile { display: none !important; } }
        .cadi-desktop { display: none; }
        @media (min-width: 768px) { .cadi-desktop { display: flex !important; } }
        .cadi-desktop .field input:focus { border-color: var(--green) !important; box-shadow: 0 0 0 3px rgba(72,195,120,.12) !important; }
        .code-input input { letter-spacing: 3px; font-size: 16px; font-weight: 800; text-align: center; border-color: var(--green) !important; background: #edfaf3 !important; }
      `}</style>

      {/* MOBILE */}
      <div className="cadi-mobile" style={{ minHeight:'100vh', background:'var(--white)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ padding:'4px 24px 0' }}>
          <div style={{ fontSize:19, fontWeight:900, color:'var(--dark)', textAlign:'center', textTransform:'uppercase', letterSpacing:1, paddingBottom:10 }}>Cadastro da Instituição</div>
          <div className="steps" style={{ paddingBottom:12 }}>
            <div className="step-dot done"></div><div className="step-line"></div>
            <div className="step-dot active"></div><div className="step-line"></div>
            <div className="step-dot"></div>
          </div>
        </div>
        <div style={{ height:3, background:'linear-gradient(90deg,var(--green),var(--blue))' }}></div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 10px', display:'flex', flexDirection:'column', gap:13 }}>
          <div className="avatar-upload">
            <div className="avatar-circle" style={{ borderRadius:16, borderColor:'var(--green)' }}>🏫</div>
            <div className="avatar-label" style={{ color:'var(--green)' }}>Logo da instituição</div>
          </div>
          <div className="field"><label>Nome da instituição:</label><input type="text" placeholder="Nome da instituição..." /></div>
          <div className="field"><label>Telefone:</label><input type="tel" placeholder="(00) 00000-0000" /></div>
          <div className="field"><label>E-mail institucional:</label><input type="email" placeholder="email@instituicao.com" /></div>
          <div className="field"><label>Crie uma senha:</label><input type="password" placeholder="Crie uma senha..." /></div>
          <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="Confirme a senha..." /></div>
          <div className="field code-input"><label>Código de acesso:</label><input type="text" placeholder="Ex: Autim-2024" maxLength={12} /></div>
          <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, textAlign:'center', marginTop:-4 }}>🔑 Este código será usado pelos responsáveis para se afiliar à sua instituição</div>
        </div>
        <div style={{ padding:'10px 24px 28px' }}>
          <button className="btn btn-green" onClick={() => navigate('home-instituicao')}>Cadastrar Instituição</button>
          <div className="footer-link mt-12">Já tem conta? <span className="link" style={{ color:'var(--green)' }} onClick={() => navigate('login')}>Fazer login</span></div>
        </div>
      </div>

      {/* DESKTOP — full width */}
      <div className="cadi-desktop" style={{ width:'100vw', minHeight:'100vh', display:'none' }}>
        {/* LEFT */}
        <div style={{
          flex:'0 0 48%', minHeight:'100vh',
          background:'linear-gradient(145deg, #062212 0%, #0a3d25 40%, #1a7a4a 75%, #48c378 100%)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'60px 64px', position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize:'32px 32px' }}></div>
          <div style={{ position:'absolute', top:'10%', right:'12%', width:220, height:220, borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%', background:'rgba(56,167,251,.2)', animation:'blob 8s ease-in-out infinite', filter:'blur(2px)' }}></div>
          <div style={{ position:'absolute', bottom:'12%', left:'8%', width:180, height:180, borderRadius:'40% 60% 70% 30%/40% 50% 60% 50%', background:'rgba(253,190,45,.14)', animation:'blob 10s ease-in-out infinite reverse', filter:'blur(2px)' }}></div>

          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <span style={{ fontSize:80, display:'block', marginBottom:20, animation:'float4 4s ease-in-out infinite', filter:'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}>🏫</span>
            <div style={{ fontSize:48, fontWeight:900, letterSpacing:8, color:'#fff', marginBottom:12 }}>Autim</div>
            <div style={{ width:60, height:4, borderRadius:99, background:'linear-gradient(90deg,var(--blue),var(--green))', margin:'0 auto 20px' }}></div>
            <p style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,.78)', lineHeight:1.75, maxWidth:320, marginBottom:44 }}>
              Cadastre sua instituição e gerencie todos os alunos e responsáveis em um só lugar.
            </p>

            {/* Key info */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, textAlign:'left' }}>
              {[
                { icon:'✅', t:'Gerencie turmas e alunos' },
                { icon:'📊', t:'Relatórios de progresso' },
                { icon:'💬', t:'Comunicação direta com famílias' },
                { icon:'🔑', t:'Código único para afiliações' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'rgba(255,255,255,.1)', backdropFilter:'blur(6px)', borderRadius:14, border:'1px solid rgba(255,255,255,.15)' }}>
                  <span style={{ fontSize:18 }}>{item.icon}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.85)' }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex:'0 0 52%', minHeight:'100vh', background:'#f6faff', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 64px', overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:500 }}>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--green)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Passo 2 de 3</div>
              <h1 style={{ fontSize:32, fontWeight:900, color:'var(--dark)', letterSpacing:-1, marginBottom:6 }}>Criar conta — Instituição</h1>
              <p style={{ fontSize:14, color:'#888', fontWeight:600 }}>Preencha os dados da sua instituição</p>
            </div>

            <div style={{ background:'var(--white)', borderRadius:28, padding:36, boxShadow:'0 8px 40px rgba(0,0,0,.09)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:18, padding:'16px 20px', background:'#edfaf3', borderRadius:18, border:'1.5px dashed var(--green)', marginBottom:24, cursor:'pointer' }}>
                <div className="avatar-circle" style={{ width:68, height:68, fontSize:30, flexShrink:0, margin:0, borderRadius:16, borderColor:'var(--green)' }}>🏫</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Logo da instituição</div>
                  <div style={{ fontSize:12, color:'#aaa', fontWeight:600, marginTop:3 }}>Clique para enviar o logotipo (opcional)</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="field col-span-2"><label>Nome da instituição:</label><input type="text" placeholder="Nome da instituição..." /></div>
                <div className="field"><label>Telefone:</label><input type="tel" placeholder="(00) 00000-0000" /></div>
                <div className="field"><label>E-mail institucional:</label><input type="email" placeholder="email@instituicao.com" /></div>
                <div className="field"><label>Crie uma senha:</label><input type="password" placeholder="••••••••" /></div>
                <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="••••••••" /></div>
                <div className="field col-span-2 code-input"><label>Código de acesso:</label><input type="text" placeholder="Ex: Autim-2024" maxLength={12} /></div>
                <div className="col-span-2">
                  <div style={{ background:'#edfaf3', border:'1.5px solid var(--green)', borderRadius:16, padding:'14px 18px', display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                    <span style={{ fontSize:24, flexShrink:0 }}>🔑</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--dark)' }}>Como funciona o código?</div>
                      <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>Os responsáveis usam este código para se afiliar à sua instituição na plataforma.</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <button className="btn btn-green" style={{ fontSize:15, padding:16 }} onClick={() => navigate('home-instituicao')}>Cadastrar Instituição</button>
                </div>
                <div className="col-span-2">
                  <div className="footer-link">Já tem conta? <span className="link" style={{ color:'var(--green)' }} onClick={() => navigate('login')}>Fazer login</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
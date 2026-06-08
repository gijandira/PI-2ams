import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import logoIconeBranco from '../assets/logo-icone-branco.png';

export default function PageLogin({ navigate }) {
  const [tab, setTab] = useState('responsavel');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLoginUsuario = async () => {
  const response = await fetch('http://localhost:3001/auth/login-usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, senha })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    navigate('home-aluno');
  } else {
    alert(data.erro);
  }
};

const handleLoginInstituicao = async () => {

  try {

    console.log('Tentando login...');

    const response = await fetch(
      'http://localhost:3001/auth/login-instituicao',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          senha
        })
      }
    );

    console.log('Response:', response);

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem('token', data.token);

      localStorage.setItem(
        'instituicao',
        JSON.stringify(data.instituicao)
      );

      navigate('home-instituicao');

    } else {

      alert(data.erro || 'Erro no login');

    }

  } catch (error) {

    console.log('ERRO LOGIN:', error);

    alert('Erro ao conectar ao servidor');

  }

};

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .login-mobile-wrap { display: none !important; } }
        .login-desktop-wrap { display: none; }
        @media (min-width: 768px) { .login-desktop-wrap { display: flex !important; } }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .input-icon-wrap { position: relative; }
        .input-icon-wrap .field-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#aaa; }
        .login-input-focus:focus { border-color: var(--blue)!important; box-shadow: 0 0 0 3px rgba(56,167,251,.12)!important; }
        .forgot-link { font-size:12px; color:var(--blue); font-weight:800; cursor:pointer; text-align:right; }
        .forgot-link:hover { text-decoration:underline; }
      `}</style>

      {/* MOBILE */}
      <div className="login-mobile-wrap" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 28px 0' }}>
          <img src={logoIcone} alt="Autim" style={{ width:52, height:52, objectFit:'contain' }} />
          <div style={{ fontSize:20, fontWeight:900, letterSpacing:4, color:'var(--dark)', textTransform:'uppercase', marginTop:2 }}>Autim</div>
        </div>
        <div style={{ margin:'14px 24px 0' }}>
          <div className="profile-tabs">
            <button className={`tab-btn ${tab==='responsavel'?'active':''}`} onClick={() => setTab('responsavel')}>👤 Responsável</button>
            <button className={`tab-btn ${tab==='instituicao'?'active':''}`} onClick={() => setTab('instituicao')}>🏫 Instituição</button>
          </div>
        </div>
        <div style={{ background:'var(--white)', borderRadius:'32px 32px 0 0', flex:1, marginTop:14, padding:'26px 24px 80px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:28, right:28, height:3, background:'linear-gradient(90deg,var(--blue),var(--red))', borderRadius:99 }}></div>
          <div style={{ fontSize:24, fontWeight:900, color:'var(--dark)', textAlign:'center', margin:'10px 0 22px' }}>Login</div>
          {tab === 'responsavel' && (
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:22 }}>
                <div className="field"><label>E-mail:</label><input className="login-input-focus" type="email" placeholder="Digite o e-mail..." onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="field"><label>Senha:</label><input className="login-input-focus" type="password" placeholder="Digite a senha..." onChange={(e) => setSenha(e.target.value)} /></div>
              </div>
              <button className="btn btn-blue" style={{ marginBottom:18 }} onClick={handleLoginUsuario}>Fazer Login</button>
              <div className="divider-row" style={{ marginBottom:14 }}><span>Ou entre com</span></div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button className="btn-social btn-facebook"><svg viewBox="0 0 24 24" fill="white" style={{width:20,height:20}}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</button>
                <button className="btn-social btn-google"><svg viewBox="0 0 24 24" style={{width:20,height:20}}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google</button>
              </div>
              <div className="footer-link mt-16">Não tem conta? <span className="link" onClick={() => navigate('cadastro-responsavel')}>Criar conta</span></div>
            </div>
          )}
          {tab === 'instituicao' && (
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:22 }}>
                <div className="field"><label>E-mail institucional:</label><input className="login-input-focus" type="email" placeholder="Digite o e-mail..." onChange={(e) => setEmail(e.target.value)}/></div>
                <div className="field"><label>Senha:</label><input className="login-input-focus" type="password" placeholder="Digite a senha..." onChange={(e) => setSenha(e.target.value)} /></div>
              </div>
              <button className="btn btn-green" style={{ marginBottom:16 }} onClick={handleLoginInstituicao}>Entrar como Instituição</button>
              <div className="footer-link">Não tem conta? <span className="link" onClick={() => navigate('cadastro-instituicao')}>Cadastrar instituição</span></div>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP — full width */}
      <div className="login-desktop-wrap" style={{ width:'100vw', minHeight:'100vh', display:'none' }}>
        {/* LEFT */}
        <div style={{
          flex:'0 0 50%', minHeight:'100vh',
          background:'linear-gradient(145deg, #061527 0%, #0e2d52 40%, #1557a6 75%, #38a7fb 100%)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'60px 64px', position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize:'32px 32px' }}></div>
          <div style={{ position:'absolute', top:'15%', left:'10%', width:240, height:240, borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%', background:'rgba(72,195,120,.18)', animation:'blob 8s ease-in-out infinite', filter:'blur(2px)' }}></div>
          <div style={{ position:'absolute', bottom:'15%', right:'8%', width:200, height:200, borderRadius:'40% 60% 70% 30%/40% 50% 60% 50%', background:'rgba(253,190,45,.12)', animation:'blob 11s ease-in-out infinite reverse', filter:'blur(2px)' }}></div>

          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <img src={logoIconeBranco} alt="Autim" style={{ width:400, height:400, objectFit:'contain', animation:'float2 4s ease-in-out infinite', display:'block', margin:'0 auto 20px', filter:'drop-shadow(0 10px 20px rgba(0,0,0,.25))' }} />
            <div style={{ width:72, height:4, borderRadius:99, background:'linear-gradient(90deg,var(--green),var(--yellow))', margin:'0 auto 20px' }}></div>
            <p style={{ marginLeft: 35, fontSize:17, fontWeight:600, color:'rgba(255,255,255,.78)', lineHeight:1.75, maxWidth:320 }}>
              Conectando famílias, educadores e crianças com TEA.
            </p>
            <div style={{ display:'flex', gap:12, marginTop:40, justifyContent:'center', flexWrap:'wrap' }}>
              {['🔒 Dados seguros','💙 Gratuito','🌐 Web & Mobile'].map((b,i) => (
                <div key={i} style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.7)', padding:'7px 16px', background:'rgba(255,255,255,.1)', borderRadius:99, border:'1px solid rgba(255,255,255,.15)' }}>{b}</div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex:'0 0 50%', minHeight:'100vh', background:'#f6faff', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 64px', overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:440 }}>
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--blue)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Acesse sua conta</div>
              <h1 style={{ fontSize:34, fontWeight:900, color:'var(--dark)', letterSpacing:-1, marginBottom:6 }}>Entrar na plataforma</h1>
              <p style={{ fontSize:14, color:'#888', fontWeight:600 }}>Escolha o tipo de conta para continuar</p>
            </div>

            <div style={{ background:'var(--white)', borderRadius:28, padding:36, boxShadow:'0 8px 40px rgba(0,0,0,.09)', marginTop:28 }}>
              <div className="profile-tabs" style={{ marginBottom:28 }}>
                <button className={`tab-btn ${tab==='responsavel'?'active':''}`} onClick={() => setTab('responsavel')}>👤 Responsável</button>
                <button className={`tab-btn ${tab==='instituicao'?'active':''}`} onClick={() => setTab('instituicao')}>🏫 Instituição</button>
              </div>

              {tab === 'responsavel' && (
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:8 }}>
                    <div className="field"><label>E-mail:</label><input className="login-input-focus" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)}/></div>
                    <div>
                      <div className="field" style={{ marginBottom:6 }}><label>Senha:</label><input className="login-input-focus" type="password" placeholder="••••••••" onChange={(e) => setSenha(e.target.value)} /></div>
                      <div style={{ textAlign:'right' }}><span className="forgot-link">Esqueci minha senha</span></div>
                    </div>
                  </div>
                  <button className="btn btn-blue" style={{ marginTop:16, marginBottom:22, fontSize:15, padding:16 }} onClick={handleLoginUsuario}>Entrar</button>
                  <div className="divider-row" style={{ marginBottom:18 }}><span>ou continue com</span></div>
                  <div className="social-row" style={{ marginBottom:22 }}>
                    <button className="btn-social btn-google" style={{ fontSize:13 }}>
                      <svg viewBox="0 0 24 24" style={{width:18,height:18}}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </button>
                    <button className="btn-social btn-facebook" style={{ fontSize:13 }}>
                      <svg viewBox="0 0 24 24" fill="white" style={{width:18,height:18}}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </button>
                  </div>
                  <div className="footer-link">Não tem conta? <span className="link" onClick={() => navigate('cadastro-responsavel')}>Criar conta grátis</span></div>
                </div>
              )}
              {tab === 'instituicao' && (
                <div>
                  <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:16 }}>
                    <div className="field"><label>E-mail institucional:</label><input className="login-input-focus" type="email" placeholder="escola@instituicao.com"  onChange={(e) => setEmail(e.target.value)}/></div>
                    <div>
                      <div className="field" style={{ marginBottom:6 }}><label>Senha:</label><input className="login-input-focus" type="password" placeholder="••••••••" onChange={(e) => setSenha(e.target.value)}/></div>
                      <div style={{ textAlign:'right' }}><span className="forgot-link">Esqueci minha senha</span></div>
                    </div>
                  </div>
                  <button className="btn btn-green" style={{ marginTop:8, marginBottom:20, fontSize:15, padding:16 }} onClick={handleLoginInstituicao} >Entrar como Instituição</button>
                  <div className="footer-link">Não tem conta? <span className="link" style={{ color:'var(--green)' }} onClick={() => navigate('cadastro-instituicao')}>Cadastrar instituição</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
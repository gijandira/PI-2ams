import logoIconeBranco from '../assets/logo-icone-branco.png';
import { useState } from 'react';

export default function PageCadastroResponsavel({ navigate }) {

  const [tipoCadastro, setTipoCadastro] =
    useState('responsavel');

  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    nomeAluno: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const regrasSenha = {
  tamanho: form.senha.length >= 8,
  maiuscula: /[A-Z]/.test(form.senha),
  minuscula: /[a-z]/.test(form.senha),
  numero: /[0-9]/.test(form.senha),
  especial: /[^A-Za-z0-9]/.test(form.senha),

  iguais:
    form.confirmarSenha.length > 0 &&
    form.senha === form.confirmarSenha
};

  const senhaValida =
    regrasSenha.tamanho &&
    regrasSenha.maiuscula &&
    regrasSenha.minuscula &&
    regrasSenha.numero &&
    regrasSenha.especial &&
    regrasSenha.iguais;

const handleCadastro = async () => {

  try {


    if (!senhaValida) {

  setErro('Sua senha ainda não atende todos os requisitos');

  setLoading(false);

  return;
  
    }

    console.log('Enviando cadastro...', form);

    const response = await fetch(
      'http://localhost:3001/auth/cadastro-usuario',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  ...form,
  tipo: tipoCadastro
})
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      alert('Cadastro realizado com sucesso');

      navigate('login');

    } else {

      alert(data.erro || 'Erro ao cadastrar');

    }

  } catch (error) {

    console.log(error);

    alert('Erro ao conectar com servidor');

  }

};

  return (
    <>  
      <style>{`
        @media (min-width: 768px) { .cadr-mobile { display: none !important; } }
        .cadr-desktop { display: none; }
        @media (min-width: 768px) { .cadr-desktop { display: flex !important; } }
        .cadr-desktop .field input:focus { border-color: var(--blue) !important; box-shadow: 0 0 0 3px rgba(56,167,251,.12) !important; }
        .step-circle { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:900; flex-shrink:0; }
        .step-connector { width:32px; height:3px; border-radius:99px; }
      `}</style>

      {/* MOBILE */}
      <div className="cadr-mobile" style={{ minHeight:'100vh', background:'var(--white)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ padding:'4px 24px 0' }}>
          <div style={{ fontSize:19, fontWeight:900, color:'var(--dark)', textAlign:'center', textTransform:'uppercase', letterSpacing:1, paddingBottom:10 }}>Cadastro do Responsável</div>
          <div className="steps" style={{ paddingBottom:12 }}>
            <div className="step-dot done"></div><div className="step-line"></div>
            <div className="step-dot active"></div><div className="step-line"></div>
            <div className="step-dot"></div>
          </div>
        </div>
        <div style={{ height:3, background:'linear-gradient(90deg,var(--blue),var(--red))' }}></div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 10px', display:'flex', flexDirection:'column', gap:13 }}>
          <div className="avatar-upload">
            <div className="avatar-circle">📷</div>
            <div className="avatar-label">Foto de perfil do aluno</div>
          </div>

          <div className="field"><label>Nome do aluno:</label><input type="text" placeholder="Digite o nome do aluno..."value={form.nomeAluno} onChange={(e) =>setForm({...form,nomeAluno: e.target.value})}/></div>
          <div className="field"><label>Nome do responsável:</label><input type="text" placeholder="Digite o nome do responsável..." value={form.nomeResponsavel} onChange={(e) =>setForm({...form,nomeResponsavel: e.target.value})}/></div>
          <div className="field"><label>Telefone:</label><input type="tel" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) =>setForm({...form,telefone: e.target.value})}/></div>
          <div className="field"><label>E-mail:</label><input type="email" placeholder="Digite o e-mail..." value={form.email} onChange={(e) =>setForm({...form,email: e.target.value})}/></div>
          <div className="field"><label>Crie uma senha:</label><input type="password" placeholder="Crie uma senha..." value={form.senha} onChange={(e) =>setForm({...form,senha: e.target.value})}/> </div>
          <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="Confirme a senha..." value={form.confirmarSenha} onChange={(e) =>setForm({...form,confirmarSenha: e.target.value})}/></div>
        </div>
        <div style={{ padding:'10px 24px 28px' }}>
          {
  erro && (
    <div
      style={{
        background:'#ffe5e5',
        color:'#d00000',
        padding:'12px',
        borderRadius:12,
        fontSize:13,
        fontWeight:700,
        marginBottom:16,
        border:'1px solid #ffb3b3',
        textAlign:'center'
      }}
    >
      ⚠️ {erro}
    </div>
  )
}
          <button onClick={handleCadastro}>Criar Conta</button>
          <div className="footer-link mt-12">Já tem conta? <span className="link" onClick={() => navigate('login')}>Fazer login</span></div>
        </div>
      </div>

      {/* DESKTOP — full width */}
      <div className="cadr-desktop" style={{ width:'100vw', minHeight:'100vh', display:'none' }}>
        {/* LEFT */}
        <div style={{
          flex:'0 0 48%', minHeight:'100vh',
          background:'linear-gradient(145deg, #061527 0%, #0e2d52 40%, #1557a6 75%, #38a7fb 100%)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'60px 64px', position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize:'32px 32px' }}></div>
          <div style={{ position:'absolute', top:'10%', right:'15%', width:200, height:200, borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%', background:'rgba(72,195,120,.2)', animation:'blob 8s ease-in-out infinite', filter:'blur(2px)' }}></div>
          <div style={{ position:'absolute', bottom:'15%', left:'10%', width:180, height:180, borderRadius:'40% 60% 70% 30%/40% 50% 60% 50%', background:'rgba(253,190,45,.12)', animation:'blob 10s ease-in-out infinite reverse', filter:'blur(2px)' }}></div>

          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <img src={logoIconeBranco} alt="Autim" style={{ width:400, height:400, objectFit:'contain', display:'block', margin:'0 auto 20px', animation:'float3 4s ease-in-out infinite', filter:'drop-shadow(0 10px 20px rgba(0,0,0,.25))' }} />
            <div style={{ width:60, height:4, borderRadius:99, background:'linear-gradient(90deg,var(--green),var(--blue))', margin:'0 auto 20px' }}></div>
            <p style={{ marginLeft: 40, fontSize:17, fontWeight:600, color:'rgba(255,255,255,.78)', lineHeight:1.75, maxWidth:320, marginBottom:44 }}>
              Crie sua conta e comece a conectar sua família com a escola do seu filho.
            </p>

            {/* Step tracker */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <div className="step-circle" style={{ background:'var(--green)', color:'#fff' }}>✓</div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:.5 }}>Início</div>
              </div>
              <div className="step-connector" style={{ background:'rgba(255,255,255,.3)', margin:'0 8px 20px' }}></div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <div className="step-circle" style={{ background:'var(--white)', color:'var(--blue)', boxShadow:'0 0 0 4px rgba(56,167,251,.3)' }}>2</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:.5 }}>Cadastro</div>
              </div>
              <div className="step-connector" style={{ background:'rgba(255,255,255,.3)', margin:'0 8px 20px' }}></div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <div className="step-circle" style={{ background:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.5)' }}>3</div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:.5 }}>Pronto</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex:'0 0 52%', minHeight:'100vh', background:'#f6faff', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 64px', overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:500 }}>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--blue)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Passo 2 de 3</div>
              <h1 style={{ fontSize:32, fontWeight:900, color:'var(--dark)', letterSpacing:-1, marginBottom:6 }}>Criar conta — Responsável</h1>
              <p style={{ fontSize:14, color:'#888', fontWeight:600 }}>Preencha os dados abaixo para criar sua conta</p>
            </div>

            <div style={{ background:'var(--white)', borderRadius:28, padding:36, boxShadow:'0 8px 40px rgba(0,0,0,.09)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:18, padding:'16px 20px', background:'#f0f7ff', borderRadius:18, border:'1.5px dashed var(--blue)', marginBottom:24, cursor:'pointer' }}>
                <div className="avatar-circle" style={{ width:68, height:68, fontSize:28, flexShrink:0, margin:0 }}>📷</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Foto de perfil do aluno</div>
                  <div style={{ fontSize:12, color:'#aaa', fontWeight:600, marginTop:3 }}>Clique para enviar uma foto (opcional)</div>
                </div>
              </div>
<div
  style={{
    display:'flex',
    background:'#edf2f7',
    borderRadius:16,
    padding:4,
    marginBottom:24
  }}
>
  <button
    onClick={() => setTipoCadastro('responsavel')}
    style={{
      flex:1,
      padding:'14px',
      border:'none',
      borderRadius:12,
      fontWeight:800,
      cursor:'pointer',
      background:
        tipoCadastro === 'responsavel'
          ? 'white'
          : 'transparent'
    }}
  >
    👤 Responsável
  </button>

</div>
              <div className="grid-2">

  {
    tipoCadastro === 'responsavel'
    ? (
      <>
        <div className="field">
          <label>Nome do aluno:</label>
          <input
            type="text"
            placeholder="Digite o nome do aluno..."
            value={form.nomeAluno}
            onChange={(e) =>
              setForm({
                ...form,
                nomeAluno: e.target.value
              })
            }
          />
        </div>

        <div className="field">
          <label>Nome do responsável:</label>
          <input
            type="text"
            placeholder="Digite o nome do responsável..."
            value={form.nomeResponsavel}
            onChange={(e) =>
              setForm({
                ...form,
                nomeResponsavel: e.target.value
              })
            }
          />
        </div>
      </>
    )
    : (
      <>
      </>
    )
  }

  <div className="field">
    <label>Telefone:</label>
    <input
      type="tel"
      placeholder="(00) 00000-0000"
      value={form.telefone}
      onChange={(e) =>
        setForm({
          ...form,
          telefone: e.target.value
        })
      }
    />
  </div>

  <div className="field">
    <label>E-mail:</label>
    <input
      type="email"
      placeholder="Digite o e-mail..."
      value={form.email}
      onChange={(e) =>
        setForm({
          ...form,
          email: e.target.value
        })
      }
    />
  </div>

  <div className="field">
    <label>Crie uma senha:</label>
    <input
      type="password"
      placeholder="Crie uma senha..."
      value={form.senha}
      onChange={(e) =>
        setForm({
          ...form,
          senha: e.target.value
        })
      }
    />
<div
  style={{
    background:'#f4f7fb',
    borderRadius:12,
    padding:'12px',
    marginTop:10,
    fontSize:12,
    fontWeight:700,
    display:'flex',
    flexDirection:'column',
    gap:6
  }}
>
  <div style={{ color: regrasSenha.tamanho ? 'green' : '#999' }}>
    {regrasSenha.tamanho ? '✅' : '❌'} Mínimo de 8 caracteres
  </div>

  <div style={{ color: regrasSenha.maiuscula ? 'green' : '#999' }}>
    {regrasSenha.maiuscula ? '✅' : '❌'} Uma letra maiúscula
  </div>

  <div style={{ color: regrasSenha.minuscula ? 'green' : '#999' }}>
    {regrasSenha.minuscula ? '✅' : '❌'} Uma letra minúscula
  </div>

  <div style={{ color: regrasSenha.numero ? 'green' : '#999' }}>
    {regrasSenha.numero ? '✅' : '❌'} Um número
  </div>

  <div style={{ color: regrasSenha.especial ? 'green' : '#999' }}>
    {regrasSenha.especial ? '✅' : '❌'} Um caractere especial
  </div>

  <div style={{ color: regrasSenha.iguais ? 'green' : '#999' }}>
    {regrasSenha.iguais ? '✅' : '❌'} As senhas coincidem
  </div>
</div>
    
  </div>

  <div className="field">
    <label>Confirme a senha:</label>
    <input
      type="password"
      placeholder="Confirme a senha..."
      value={form.confirmarSenha}
      onChange={(e) =>
        setForm({
          ...form,
          confirmarSenha: e.target.value
        })
      }
    />
  </div>

  <div className="col-span-2">
    {
  erro && (
    <div
      style={{
        background:'#ffe5e5',
        color:'#d00000',
        padding:'12px',
        borderRadius:12,
        fontSize:13,
        fontWeight:700,
        marginBottom:16,
        border:'1px solid #ffb3b3',
        textAlign:'center'
      }}
    >
      ⚠️ {erro}
    </div>
  )
}
                  <button className="btn btn-blue" style={{ fontSize:15, padding:16 }} onClick={handleCadastro}>Criar Conta</button>
                </div>
                <div className="col-span-2">
                  <div className="footer-link">Já tem conta? <span className="link" onClick={() => navigate('login')}>Fazer login</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
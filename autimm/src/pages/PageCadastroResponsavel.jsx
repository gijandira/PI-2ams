import logoIconeBranco from '../assets/logo-icone-branco.png';
import { useState, useEffect } from 'react';

export default function PageCadastroResponsavel({ navigate }) {

  const [tipoCadastro, setTipoCadastro] =
    useState('responsavel');

  const [notificacao, setNotificacao] = useState(null);

  const [form, setForm] = useState({
    nomeAluno: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    if (notificacao) {
      const timer = setTimeout(() => setNotificacao(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notificacao]);

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

    // Validar campos obrigatórios
    const camposVazios = [];
    if (!form.nomeAluno.trim()) camposVazios.push('Nome do aluno');
    if (!form.nomeResponsavel.trim()) camposVazios.push('Nome do responsável');
    if (!form.telefone.trim()) camposVazios.push('Telefone');
    if (!form.email.trim()) camposVazios.push('E-mail');
    if (!form.senha.trim()) camposVazios.push('Senha');
    if (!form.confirmarSenha.trim()) camposVazios.push('Confirmação de senha');

    if (camposVazios.length > 0) {
      setNotificacao({
        tipo: 'erro',
        titulo: 'Campos obrigatórios não preenchidos',
        mensagens: camposVazios.map(campo => `${campo} é obrigatório`)
      });
      return;
    }

    if (!senhaValida) {
      // Construir mensagem detalhada do que falta
      const erros = [];
      
      if (!regrasSenha.tamanho) {
        erros.push(`Faltam ${8 - form.senha.length} caracteres`);
      }
      if (!regrasSenha.maiuscula) {
        erros.push('Falta uma letra maiúscula (A-Z)');
      }
      if (!regrasSenha.minuscula) {
        erros.push('Falta uma letra minúscula (a-z)');
      }
      if (!regrasSenha.numero) {
        erros.push('Falta um número (0-9)');
      }
      if (!regrasSenha.especial) {
        erros.push('Falta um caractere especial (!@#$%...)');
      }
      if (!regrasSenha.iguais && form.confirmarSenha.length > 0) {
        erros.push('As senhas não coincidem');
      }

      setNotificacao({
        tipo: 'erro',
        titulo: 'Sua senha não atende os requisitos',
        mensagens: erros
      });

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

      setNotificacao({
        tipo: 'sucesso',
        titulo: 'Cadastro realizado com sucesso!',
        mensagens: ['Você será redirecionado para o login em breve']
      });

      setTimeout(() => navigate('login'), 2000);

    } else {

      setNotificacao({
        tipo: 'erro',
        titulo: 'Erro ao cadastrar',
        mensagens: [data.erro || 'Ocorreu um erro ao processar seu cadastro']
      });

    }

  } catch (error) {

    console.log(error);

    setNotificacao({
      tipo: 'erro',
      titulo: 'Erro de conexão',
      mensagens: ['Não foi possível conectar ao servidor']
    });

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
        
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-20px); opacity: 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        
        .notificacao-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .notificacao-container.saindo { animation: slideOut 0.3s ease-in; }
        
        .notificacao { border-radius: 20px; padding: 24px 28px; box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15); backdrop-filter: blur(10px); max-width: 90vw; width: 420px; border-left: 6px solid; position: relative; overflow: hidden; }
        
        .notificacao.erro { background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%); border-left-color: #e74c3c; }
        .notificacao.sucesso { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left-color: #48c378; }
        
        .notificacao::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0)); }
        
        @media (max-width: 600px) { .notificacao { width: calc(100vw - 32px); } }
        
        .notificacao-titulo { font-size: 16px; font-weight: 900; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; letter-spacing: 0.3px; }
        .notificacao.erro .notificacao-titulo { color: #c0392b; }
        .notificacao.sucesso .notificacao-titulo { color: #27ae60; }
        
        .notificacao-icon { font-size: 22px; flex-shrink: 0; animation: pulse 2s ease-in-out infinite; }
        
        .notificacao-lista { display: flex; flex-direction: column; gap: 10px; }
        
        .notificacao-item { font-size: 14px; font-weight: 600; display: flex; align-items: flex-start; gap: 10px; line-height: 1.4; }
        .notificacao.erro .notificacao-item { color: #5d4e37; }
        .notificacao.sucesso .notificacao-item { color: #165b33; }
        
        .notificacao-item::before { content: '✓'; font-weight: 900; flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; }
        .notificacao.erro .notificacao-item::before { content: '!'; background: #e74c3c; color: white; font-size: 12px; }
        .notificacao.sucesso .notificacao-item::before { background: #48c378; color: white; font-size: 12px; }
      `}</style>

      {notificacao && (
        <div className="notificacao-container">
          <div className={`notificacao ${notificacao.tipo}`}>
            <div className="notificacao-titulo">
              <span className="notificacao-icon">{notificacao.tipo === 'erro' ? '⚠️' : '🎉'}</span>
              {notificacao.titulo}
            </div>
            <div className="notificacao-lista">
              {notificacao.mensagens.map((msg, idx) => (
                <div key={idx} className="notificacao-item">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          <div className="field">
            <label>Crie uma senha:</label>
            <input type="password" placeholder="Crie uma senha..." value={form.senha} onChange={(e) =>setForm({...form,senha: e.target.value})}/>
          </div>
          <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="Confirme a senha..." value={form.confirmarSenha} onChange={(e) =>setForm({...form,confirmarSenha: e.target.value})}/></div>
        </div>
        <div style={{ padding:'10px 24px 28px' }}>
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
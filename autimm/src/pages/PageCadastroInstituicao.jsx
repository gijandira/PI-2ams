import { useState, useEffect } from 'react';


export default function PageCadastroInstituicao({ navigate }) {

  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [form, setForm] = useState({
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  confirmarsenha: '',
  codigo: ''
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
  form.confirmarsenha.length > 0 &&
  form.senha === form.confirmarsenha
};

  const senhaValida =
    regrasSenha.tamanho &&
    regrasSenha.maiuscula &&
    regrasSenha.minuscula &&
    regrasSenha.numero &&
    regrasSenha.especial &&
    regrasSenha.iguais;

const handleCadastroInstituicao = async () => {
  setLoading(true);

  try {

    // Validar campos obrigatórios
    const camposVazios = [];
    if (!form.nome.trim()) camposVazios.push('Nome da instituição');
    if (!form.telefone.trim()) camposVazios.push('Telefone');
    if (!form.email.trim()) camposVazios.push('E-mail institucional');
    if (!form.senha.trim()) camposVazios.push('Senha');
    if (!form.confirmarsenha.trim()) camposVazios.push('Confirmação de senha');
    if (!form.codigo.trim()) camposVazios.push('Código de acesso');

    if (camposVazios.length > 0) {
      setNotificacao({
        tipo: 'erro',
        titulo: 'Campos obrigatórios não preenchidos',
        mensagens: camposVazios.map(campo => `${campo} é obrigatório`)
      });
      setLoading(false);
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
      if (!regrasSenha.iguais && form.confirmarsenha.length > 0) {
        erros.push('As senhas não coincidem');
      }

      setNotificacao({
        tipo: 'erro',
        titulo: 'Sua senha não atende os requisitos',
        mensagens: erros
      });

      setLoading(false);
      return;

}

    const response = await fetch(
      'http://localhost:3001/auth/cadastro-instituicao',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      }
    );

    const data = await response.json();

    if (response.ok) {

      setNotificacao({
        tipo: 'sucesso',
        titulo: 'Instituição cadastrada com sucesso!',
        mensagens: ['Você será redirecionado para o login em breve']
      });

      setTimeout(() => navigate('login'), 2000);

    } else {

      setNotificacao({
        tipo: 'erro',
        titulo: 'Erro ao cadastrar',
        mensagens: [data.mensagem || 'Ocorreu um erro ao processar seu cadastro']
      });

    }

  } catch (error) {

    console.log(error);

    setNotificacao({
      tipo: 'erro',
      titulo: 'Erro de conexão',
      mensagens: ['Não foi possível conectar ao servidor']
    });

  } finally {

    setLoading(false);

  }

};


  return (
    <>
      <style>{`
        @media (min-width: 768px) { .cadi-mobile { display: none !important; } }
        .cadi-desktop { display: none; }
        @media (min-width: 768px) { .cadi-desktop { display: flex !important; } }
        .cadi-desktop .field input:focus { border-color: var(--green) !important; box-shadow: 0 0 0 3px rgba(72,195,120,.12) !important; }
        .code-input input { letter-spacing: 3px; font-size: 16px; font-weight: 800; text-align: center; border-color: var(--green) !important; background: #edfaf3 !important; }
        
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
          <div className="field"><label>Nome da instituição:</label><input type="text" placeholder="Nome da instituição..." value={form.nome}onChange={(e) =>setForm({...form,nome: e.target.value})}/></div>
          <div className="field"><label>Telefone:</label><input type="tel" placeholder="(00) 00000-0000" value={form.telefone}onChange={(e) =>setForm({...form,telefone: e.target.value})}/></div>
          <div className="field"><label>E-mail institucional:</label><input type="email" placeholder="email@instituicao.com" value={form.email}onChange={(e) =>setForm({...form,email: e.target.value})}/></div>
          <div className="field"><label>Crie uma senha:</label><input type="password" placeholder="Crie uma senha..." value={form.senha}onChange={(e) =>setForm({...form,senha: e.target.value})}/></div>
          <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="Confirme a senha..." value={form.confirmarsenha}onChange={(e) =>setForm({...form,confirmarsenha: e.target.value})}/></div>
          <div className="field code-input"><label>Código de acesso:</label><input type="text" placeholder="Ex: Autim-2024" maxLength={12} value={form.codigo}onChange={(e) =>setForm({...form,codigo: e.target.value})}/></div>
          <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, textAlign:'center', marginTop:-4 }}>🔑 Este código será usado pelos responsáveis para se afiliar à sua instituição</div>
        </div>
        <div style={{ padding:'10px 24px 28px' }}>
          <button onClick={handleCadastroInstituicao}>Cadastrar Instituição</button>
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
            <span style={{ fontSize:80, display:'block', marginBottom:60, animation:'float4 4s ease-in-out infinite', filter:'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}>🏫</span>
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
                <div className="field col-span-2"><label>Nome da instituição:</label><input type="text" placeholder="Nome da instituição..." value={form.nome}onChange={(e) =>setForm({...form,nome: e.target.value})} /></div>
                <div className="field"><label>Telefone:</label><input type="tel" placeholder="(00) 00000-0000" value={form.telefone}onChange={(e) =>setForm({...form,telefone: e.target.value})}/></div>
                <div className="field"><label>E-mail institucional:</label><input type="email" placeholder="email@instituicao.com"value={form.email}onChange={(e) =>setForm({...form,email: e.target.value})} /></div>
                <div className="field"><label>Crie uma senha:</label><input type="password" placeholder="••••••••" value={form.senha}onChange={(e) =>setForm({...form,senha: e.target.value})} /></div>
                <div className="field"><label>Confirme a senha:</label><input type="password" placeholder="••••••••"value={form.confirmarsenha}onChange={(e) =>setForm({...form,confirmarsenha: e.target.value})} /></div>
                <div className="field col-span-2 code-input"><label>Código de acesso:</label><input type="text" placeholder="Ex: Autim-2024" maxLength={12} value={form.codigo}onChange={(e) =>setForm({...form,codigo: e.target.value})}/></div>
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
                  <button className="btn btn-green" style={{ fontSize:15, padding:16 }} onClick={handleCadastroInstituicao}>Cadastrar Instituição</button>
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
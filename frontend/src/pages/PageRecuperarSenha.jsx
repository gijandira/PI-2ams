import { useState, useEffect } from 'react';

export default function PageRecuperarSenha({ navigate }) {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => setMensagem(null), 7000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  const handleEnviar = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setMensagem({ tipo: 'erro', titulo: 'E-mail obrigatório', mensagens: ['Informe seu e-mail para recuperar a senha.'] });
      return;
    }

    if (/\s/.test(trimmedEmail)) {
      setMensagem({ tipo: 'erro', titulo: 'E-mail inválido', mensagens: ['Remova espaços do e-mail antes de continuar.'] });
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch('http://localhost:3001/auth/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: trimmedEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', titulo: 'Solicitação enviada', mensagens: [data.mensagem || 'Verifique seu e-mail para continuar.'] });
        setEmail('');
      } else {
        setMensagem({ tipo: 'erro', titulo: 'Erro', mensagens: [data.erro || 'Não foi possível enviar o e-mail de recuperação.'] });
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      setMensagem({ tipo: 'erro', titulo: 'Erro de conexão', mensagens: ['Não foi possível conectar ao servidor.'] });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <style>{`
        .recuperar-senha-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 28px; background: #f5f8ff; }
        .recuperar-senha-card { width: min(100%, 460px); background: #ffffff; border-radius: 24px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); padding: 32px; }
        .recuperar-senha-card h1 { margin: 0 0 10px; font-size: 28px; color: #102a43; }
        .recuperar-senha-card p { margin: 0 0 24px; color: #52606d; line-height: 1.7; }
        .field { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .field label { color: #334e68; font-weight: 700; }
        .field input { width: 100%; padding: 14px 16px; border: 1px solid #d9e2ec; border-radius: 14px; font-size: 15px; color: #102a43; background: #f8fbff; }
        .field input:focus { outline: none; border-color: #2f6fbf; box-shadow: 0 0 0 4px rgba(56, 167, 251, 0.14); }
        .btn { width: 100%; padding: 14px 16px; border: none; border-radius: 14px; font-size: 15px; font-weight: 700; color: #ffffff; background: #2f6fbf; cursor: pointer; transition: transform 0.12s ease, box-shadow 0.12s ease; }
        .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(47, 111, 191, 0.16); }
        .btn:disabled { opacity: 0.72; cursor: default; transform: none; box-shadow: none; }
        .link-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 14px; color: #52606d; }
        .link-row span { cursor: pointer; color: #2f6fbf; font-weight: 700; }
        .link-row span:hover { text-decoration: underline; }
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
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .notificacao-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      {/* Notificação elegante (centralizada) */}
      {mensagem && (
        <div className={`notificacao-container`}>
          <div className={`notificacao ${mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}>
            <div className="notificacao-titulo">
              <span className="notificacao-icon">{mensagem.tipo === 'erro' ? '⚠️' : '🎉'}</span>
              {mensagem.titulo}
            </div>
            <div className="notificacao-lista">
              {(mensagem.mensagens || []).map((m, i) => (
                <div key={i} className="notificacao-item">{m}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="recuperar-senha-page">
        <div className="recuperar-senha-card">
          <h1>Recuperar senha</h1>
          <p>Digite o e-mail cadastrado para receber uma senha temporária e acessar sua conta.</p>

          {/* notificacao inline removida - usamos toast discreto */}

          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handleEnviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>

          <div className="link-row">
            <span onClick={() => navigate('login')}>Voltar ao login</span>
          </div>
        </div>
      </div>
    </>
  );
}
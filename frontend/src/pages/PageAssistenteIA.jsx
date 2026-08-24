import { useMemo, useRef, useState, useEffect } from 'react';
import logoIcone from '../assets/logo-icone.png';
import {
  IconHome,
  IconChat,
  IconSchool,
  IconCalendar,
  IconPerson,
  IconRobot,
  IconSettings
} from '../components/icons';
import SidebarUser from '../components/SidebarUser';

const API_URL = 'http://localhost:3001';
const SETTINGS_KEY = 'autim.user-settings';

const SUGESTOES = [
  { emoji: '🗺️', texto: 'Me guie pelo site' },
  { emoji: '💬', texto: 'Como usar a Comunicação?' },
  { emoji: '⚙️', texto: 'Como mudar a voz do narrador?' },
  { emoji: '📅', texto: 'Como criar um evento na Agenda?' },
  { emoji: '🧘', texto: 'O que fazer em momento de crise?' },
  { emoji: '⚖️', texto: 'Quais os direitos no TEA?' },
];

function getStoredDarkMode() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed.darkMode;
  } catch (e) {
    return false;
  }
}

function formatarTextoLimpo(texto) {
  if (!texto) return '';
  return texto
    .replace(/^#{1,6}\s*/gm, '') // remove # e ###
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **
    .replace(/\*(.*?)\*/g, '$1') // remove *
    .replace(/[`_~]/g, '') // remove crases
    .replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, '') // remove caracteres asiáticos
    .trim();
}

function getHoraAtual() {
  const agora = new Date();
  return agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PageAssistenteIA({ navigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Olá! Sou o assistente do Autim. Posso ajudar com dicas sobre comunicação, sugestões de atividades para a rotina ou tirar dúvidas sobre o app. 😊',
      time: getHoraAtual()
    },
    {
      id: 2,
      sender: 'assistant',
      text: 'Você pode me perguntar sobre manejo de crises, uso dos cartões PECS, eventos da agenda ou direitos no TEA! 🎓',
      time: getHoraAtual()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(getStoredDarkMode);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Sincroniza a classe do tema no body
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('autim-dark-theme', darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const novoValor = !darkMode;
    setDarkMode(novoValor);
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const settings = raw ? JSON.parse(raw) : {};
      settings.darkMode = novoValor;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('login');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  async function enviarMensagem(texto) {
    const mensagem = texto.trim();
    if (!mensagem || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: mensagem,
      time: getHoraAtual()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await fetch(`${API_URL}/ia/perguntar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.erro || 'Não foi possível obter a resposta.');
      }

      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.resposta || 'Desculpe, não consegui processar agora. Tente novamente! 💙',
        time: getHoraAtual()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      let aviso = `Não foi possível conectar ao assistente no momento.`;
      if (error.message.includes('model') || error.message.includes('404')) {
        aviso += `\n\nCertifique-se de executar no terminal:\nollama run qwen2.5:0.5b`;
      } else {
        aviso += `\n\nErro: ${error.message}`;
      }

      const assistantMessage = {
        id: Date.now() + 2,
        sender: 'assistant',
        text: aviso,
        time: getHoraAtual()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }

  function handleSend() {
    enviarMensagem(input);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  // ─── Componente do Avatar da IA ───
  function AvatarIA({ size = 32 }) {
    return (
      <div
        className="autim-avatar-ia"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          padding: 3
        }}
      >
        <img
          src={logoIcone}
          alt="Autim"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  // ─── Componente do Avatar do Usuário ───
  function AvatarUser({ size = 30 }) {
    return (
      <div
        className="autim-avatar-user"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0
        }}
      >
        👤
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes autim-dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        /* ── MODO CLARO (Default) ── */
        .autim-chat-page {
          background: #f0f5fa;
          color: #2d3748;
        }
        .autim-header-dark {
          background: #181d33;
          color: #ffffff;
        }
        .autim-chat-box {
          background: #f0f5fa;
          border-color: #dce6f2;
        }
        .autim-bubble-ia {
          background: #ffffff;
          color: #2d3748;
          border: 1px solid rgba(225,233,244,0.8);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .autim-bubble-user {
          background: #2b99f5;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(43,153,245,0.25);
        }
        .autim-chip-item {
          background: #ffffff;
          border: 1px solid #e1e9f4;
          color: #3b4859;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .autim-chip-item:hover {
          border-color: #2b99f5;
          color: #126cd6;
          background: #f4f9ff;
        }
        .autim-input-wrap {
          background: #ffffff;
          border: 1.5px solid #dbe5f1;
        }
        .autim-input-wrap input {
          color: #2d3748;
        }
        .autim-input-wrap input::placeholder {
          color: #94a3b8;
        }
        .autim-input-bar-bg {
          background: #f0f5fa;
        }
        .autim-avatar-ia {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1.5px solid #e2eaf4;
        }
        .autim-avatar-user {
          background: linear-gradient(135deg, #e8edf5, #d2dceb);
          color: #5a6b82;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .autim-typing-box {
          background: #ffffff;
          border: 1px solid rgba(225,233,244,0.8);
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }
        .autim-typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8e9bb0;
          display: inline-block;
        }
        .autim-timestamp {
          color: #a4b1c2;
        }
        .autim-theme-toggle {
          background: rgba(255,255,255,0.12);
          border: none;
          color: #ffffff;
          cursor: pointer;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all .2s;
        }
        .autim-theme-toggle:hover {
          background: rgba(255,255,255,0.22);
          transform: scale(1.05);
        }

        /* ── MODO ESCURO (autim-dark-theme) ── */
        body.autim-dark-theme .autim-chat-page {
          background: #0e1117;
          color: #e2e8f0;
        }
        body.autim-dark-theme .autim-header-dark {
          background: #141824;
          border-bottom: 1px solid #1f2638;
        }
        body.autim-dark-theme .autim-chat-box {
          background: #121620;
          border-color: #1f2738;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        body.autim-dark-theme .autim-bubble-ia {
          background: #1a202e;
          color: #e2e8f0;
          border: 1px solid #28334a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }
        body.autim-dark-theme .autim-bubble-user {
          background: #258cf0;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37,140,240,0.3);
        }
        body.autim-dark-theme .autim-chip-item {
          background: #1a202e;
          border-color: #28334a;
          color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        body.autim-dark-theme .autim-chip-item:hover {
          border-color: #38a7fb;
          color: #59baff;
          background: #222b3d;
        }
        body.autim-dark-theme .autim-input-wrap {
          background: #1a202e;
          border-color: #28334a;
        }
        body.autim-dark-theme .autim-input-wrap input {
          color: #f1f5f9;
        }
        body.autim-dark-theme .autim-input-wrap input::placeholder {
          color: #64748b;
        }
        body.autim-dark-theme .autim-input-bar-bg {
          background: #121620;
        }
        body.autim-dark-theme .autim-avatar-ia {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 1.5px solid #28334a;
        }
        body.autim-dark-theme .autim-avatar-user {
          background: #28334a;
          color: #cbd5e1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        body.autim-dark-theme .autim-typing-box {
          background: #1a202e;
          border: 1px solid #28334a;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        body.autim-dark-theme .autim-typing-dot {
          background: #64748b;
        }
        body.autim-dark-theme .autim-timestamp {
          color: #64748b;
        }
        body.autim-dark-theme .desktop-sidebar {
          background: #161a20;
          border-color: #2d343a;
        }
        body.autim-dark-theme .main-content {
          background: #0b0d10 !important;
        }

        .autim-chip-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          user-select: none;
        }
        .autim-chip-item:active {
          transform: scale(0.96);
        }

        .autim-chip-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 6px 16px;
          scrollbar-width: none;
        }
        .autim-chip-scroll::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 1024px) { .ai-mobile { display: none !important; } }
        .ai-desktop { display: none; }
        @media (min-width: 1024px) { .ai-desktop { display: block !important; } }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          VERSÃO MOBILE
      ───────────────────────────────────────────────────────────── */}
      <div
        className="ai-mobile autim-chat-page"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* Top Header Dark Navy */}
        <div
          className="autim-header-dark"
          style={{
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Botão voltar circular */}
            <button
              onClick={() => navigate('home-aluno')}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#ffffff',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1
              }}
            >
              ‹
            </button>

            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', letterSpacing: -0.2 }}>
                Assistente Autim
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#2fd375',
                    display: 'inline-block',
                    boxShadow: '0 0 6px #2fd375'
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2fd375' }}>
                  {isLoading ? 'Digitando resposta...' : 'Online agora'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Botão de alternar tema Escuro/Claro */}
            <button
              className="autim-theme-toggle"
              onClick={toggleDarkMode}
              title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Avatar Header */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
                boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.85)'
              }}
            >
              <img
                src={logoIcone}
                alt="Autim"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Área de Conversa */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    gap: 8
                  }}
                >
                  {!isUser && <AvatarIA size={30} />}

                  <div
                    className={isUser ? 'autim-bubble-user' : 'autim-bubble-ia'}
                    style={{
                      maxWidth: '82%',
                      padding: '14px 16px',
                      borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 6px',
                      fontSize: 14,
                      lineHeight: 1.55,
                      fontWeight: 600,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {formatarTextoLimpo(msg.text)}
                  </div>

                  {isUser && <AvatarUser size={30} />}
                </div>

                {/* Timestamp */}
                {msg.time && (
                  <div
                    className="autim-timestamp"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      marginTop: 4,
                      marginRight: isUser ? 38 : 0,
                      marginLeft: !isUser ? 38 : 0,
                      textAlign: isUser ? 'right' : 'left'
                    }}
                  >
                    {msg.time}
                  </div>
                )}
              </div>
            );
          })}

          {/* Indicador de Digitação */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -4 }}>
              <AvatarIA size={30} />
              <div
                className="autim-typing-box"
                style={{
                  borderRadius: 18,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0s' }} />
                <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0.2s' }} />
                <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0.4s' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Barra de Sugestões Chips Horizontais */}
        <div style={{ paddingBottom: 6 }}>
          <div className="autim-chip-scroll">
            {SUGESTOES.map((sug, i) => (
              <div
                key={i}
                className="autim-chip-item"
                onClick={() => enviarMensagem(sug.texto)}
              >
                <span>{sug.emoji}</span>
                <span>{sug.texto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div
          className="autim-input-bar-bg"
          style={{
            padding: '10px 14px 16px',
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}
        >
          <div
            className="autim-input-wrap"
            style={{
              flex: 1,
              borderRadius: 24,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida ou mensagem..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isLoading || !input.trim() ? '#b8c7d9' : '#2b99f5',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 18,
              boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 12px rgba(43,153,245,0.4)',
              transition: 'all .2s',
              flexShrink: 0
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VERSÃO DESKTOP
      ───────────────────────────────────────────────────────────── */}
      <div className="ai-desktop">
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>

          {[
            { icon: <IconHome />, label: 'Início', active: false, page: 'home-aluno' },
            { icon: <IconChat />, label: 'Comunicação', active: false, page: 'comunicacao' },
            { icon: <IconSchool />, label: 'Lições', active: false, page: null },
            { icon: <IconCalendar />, label: 'Agenda', active: false, page: 'agenda' },
            { icon: <IconRobot />, label: 'Assistente IA', active: true, page: 'ia' }
          ].map((item, i) => (
            <div
              key={i}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => item.page && navigate(item.page)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}

          <div className="sidebar-spacer"></div>

          <div className="sidebar-nav-item" onClick={() => navigate('perfil')} style={{ cursor: 'pointer' }}>
            <IconPerson />
            Perfil
          </div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')} style={{ cursor: 'pointer' }}>
            <IconSettings />
            Configurações
          </div>
          <div className="sidebar-nav-item" onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--red)' }}>
            🚪 Sair
          </div>

          <SidebarUser />
        </nav>

        <div className="main-content" style={{ minHeight: '100vh', padding: 24 }}>
          <div
            className="autim-chat-box"
            style={{
              maxWidth: 880,
              margin: '0 auto',
              height: 'calc(100vh - 48px)',
              borderRadius: 24,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid'
            }}
          >
            {/* Header Dark Navy Desktop */}
            <div
              className="autim-header-dark"
              style={{
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={() => navigate('home-aluno')}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ‹
                </button>

                <div>
                  <div style={{ fontSize: 19, fontWeight: 900 }}>Assistente Autim</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#2fd375',
                        boxShadow: '0 0 8px #2fd375'
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2fd375' }}>
                      {isLoading ? 'Processando resposta...' : 'Online agora'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Botão de alternar tema Escuro/Claro */}
                <button
                  className="autim-theme-toggle"
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {/* Logo badge */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    border: '2px solid rgba(255,255,255,0.85)'
                  }}
                >
                  <img
                    src={logoIcone}
                    alt="Autim"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>

            {/* Chat List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        gap: 12
                      }}
                    >
                      {!isUser && <AvatarIA size={36} />}

                      <div
                        className={isUser ? 'autim-bubble-user' : 'autim-bubble-ia'}
                        style={{
                          maxWidth: '75%',
                          padding: '16px 20px',
                          borderRadius: isUser ? '22px 22px 4px 22px' : '22px 22px 22px 6px',
                          fontSize: 15,
                          lineHeight: 1.6,
                          fontWeight: 600,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {formatarTextoLimpo(msg.text)}
                      </div>

                      {isUser && <AvatarUser size={36} />}
                    </div>

                    {msg.time && (
                      <div
                        className="autim-timestamp"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          marginTop: 4,
                          marginRight: isUser ? 48 : 0,
                          marginLeft: !isUser ? 48 : 0,
                          textAlign: isUser ? 'right' : 'left'
                        }}
                      >
                        {msg.time}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AvatarIA size={36} />
                  <div
                    className="autim-typing-box"
                    style={{
                      borderRadius: 20,
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0s' }} />
                    <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0.2s' }} />
                    <span className="autim-typing-dot" style={{ animation: 'autim-dot-pulse 1.2s infinite 0.4s' }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Chips Desktop */}
            <div style={{ padding: '0 24px 8px' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {SUGESTOES.map((sug, i) => (
                  <div
                    key={i}
                    className="autim-chip-item"
                    onClick={() => enviarMensagem(sug.texto)}
                    style={{ padding: '8px 18px', fontSize: 13 }}
                  >
                    <span>{sug.emoji}</span>
                    <span>{sug.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Bar Desktop */}
            <div
              className="autim-input-bar-bg"
              style={{
                padding: '12px 24px 20px',
                display: 'flex',
                gap: 12,
                alignItems: 'center'
              }}
            >
              <div
                className="autim-input-wrap"
                style={{
                  flex: 1,
                  borderRadius: 28,
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte sobre autismo, rotina ou navegação no AUTIM..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  padding: '12px 24px',
                  borderRadius: 24,
                  background: isLoading || !input.trim() ? '#b8c7d9' : '#2b99f5',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 800,
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 14px rgba(43,153,245,0.35)',
                  transition: 'all .2s'
                }}
              >
                <span>Enviar</span>
                <span>➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

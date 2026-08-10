import { useMemo, useRef, useState } from 'react';

const API_URL = 'http://localhost:3001';

const initialMessages = [
  {
    id: 1,
    sender: 'assistant',
    text: 'Olá! Posso responder dúvidas sobre o AUTIM e sobre como usar a plataforma. Como posso ajudar?'
  }
];

export default function PageAssistenteIA({ navigate }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const statusText = useMemo(() => {
    if (isLoading) return 'Pensando...';
    return 'Online';
  }, [isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  async function handleSend() {
    const mensagem = input.trim();
    if (!mensagem || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: mensagem
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
        text: data.resposta || 'Desculpe, não consegui responder agora.'
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: Date.now() + 2,
        sender: 'assistant',
        text: `Não foi possível conectar com a IA. ${error.message}`
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f3f3',
      color: '#111',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      padding: '24px 16px 80px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 980,
        minHeight: 'calc(100vh - 80px)',
        background: '#ffffff',
        border: '1px solid #d9d9d9',
        boxShadow: '0 18px 50px rgba(0,0,0,0.08)',
        borderRadius: 24,
        overflow: 'hidden'
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid #e6e6e6',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('home-aluno')}
              style={{
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '8px 12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Assistente AUTIM</div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                {statusText}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#111',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLoading ? '#d9d9d9' : '#8ae28f', display: 'inline-block' }}></span>
            IA qwen2.5:0.5b
          </div>
        </header>

        <main style={{ height: 'calc(100vh - 220px)', minHeight: 420, display: 'flex', flexDirection: 'column', background: '#f7f7f7' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 0' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 14
                }}
              >
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '12px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 0 14px' : '14px 14px 14px 0',
                    background: msg.sender === 'user' ? '#111' : '#fff',
                    color: msg.sender === 'user' ? '#fff' : '#111',
                    border: msg.sender === 'assistant' ? '1px solid #d9d9d9' : 'none',
                    lineHeight: 1.55,
                    fontSize: 14,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '14px 14px 14px 0',
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  color: '#222',
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  Digitando...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={{
            borderTop: '1px solid #e6e6e6',
            background: '#fdfdfd',
            padding: '14px 16px 18px'
          }}>
            <div style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              background: '#fff',
              border: '1px solid #d8d8d8',
              borderRadius: 16,
              padding: '8px 10px 8px 14px'
            }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva sua dúvida sobre o site ou autismo..."
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: 15,
                  minHeight: 44,
                  maxHeight: 120,
                  lineHeight: 1.5,
                  background: 'transparent',
                  color: '#111'
                }}
              />

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  border: 'none',
                  background: isLoading || !input.trim() ? '#d9d9d9' : '#111',
                  color: '#fff',
                  padding: '12px 18px',
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  minWidth: 96
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

  import { useState, useEffect } from 'react';
  import logoIcone from '../assets/logo-icone.png';
  import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings, IconRobot } from '../components/icons';
  import SidebarUser from '../components/SidebarUser';
  import { preloadSpeech, speakText } from '../hooks/voiceUtils';

  const CARD_IMAGES = {
    'quero agua': 'agua.png',
    'quero comer': 'comer.png',
    'ir ao banheiro': 'banheiro.png',
    'quero descansar': 'Descansar.png',
    'preciso de ajuda': 'ajuda.png',
    'quero sair': 'sair.png',
    'quero brincar': 'brincando.png',
    'quero silencio': 'silêncio.png',
    'estou com frio': 'frio.png',
    'estou com calor': 'calor.png',
    'nao estou bem': 'nao estou bem.png',
    'preciso de remedio': 'remedio.png',
    feliz: 'feliz.png',
    triste: 'Triste.png',
    bravo: 'Bravo.png',
    assustado: 'Susto.png',
    cansado: 'Cansado.png',
    frustrado: 'Frustrado.png',
    correr: 'correndo.png',
    brincar: 'brincando.png',
    estudar: 'estudando.png',
    musica: 'musica.png',
    comer: 'comida.png',
    banho: 'chuveiro.png',
    escola: 'escolas.png',
    casa: 'casas.png',
    hospital: 'hospital.png',
    mercado: 'mercado.png',
    parque: 'parque.png',
    piscina: 'piscina.png',
    mae: 'mae.png',
    pai: 'pai.png',
    irma: 'irma.png',
    irmao: 'irmao.png',
    professora: 'Professora.png',
    medico: 'medico.png',
    animado: 'Animado.png',
    calmo: 'Calmo.png',
    preocupado: 'Preocupadas.png',
    surpreso: 'Surpresa.png',
    andar: 'andando.png',
    sentar: 'sentado.png',
    parar: 'Parado.png',
    esperar: 'esperando.png',
    clinica: 'clinica.png',
    farmacia: 'farmacia.png',
    biblioteca: 'biblioteca.png',
    vovo: 'vovo.png',
    'vovó': 'vovo1.png',
    'vovô': 'vovo.png',
    amigo: 'amigos.png',
    terapeuta: 'terapeutica.png',
  };

  function getCardImage(label) {
    var normalizedLabel = label.toLowerCase().trim();
    var filename = CARD_IMAGES[normalizedLabel] || CARD_IMAGES[normalizedLabel
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    ];
    return filename ? encodeURI('/fotos/' + filename) : null;
  }

  function ModeSelector({ mode, onChange }) {
    return (
      <div className="com-mode-switch" role="group" aria-label="Modo de comunicação">
        <button
          type="button"
          className={'com-mode-button' + (mode === 'emote' ? ' active' : '')}
          aria-pressed={mode === 'emote'}
          onClick={function () { onChange('emote'); }}
        >
          😀 Emotes
        </button>
        <button
          type="button"
          className={'com-mode-button' + (mode === 'image' ? ' active' : '')}
          aria-pressed={mode === 'image'}
          onClick={function () { onChange('image'); }}
        >
          🖼️ Imagens
        </button>
      </div>
    );
  }

  // Dados de fallback usados caso o backend não esteja disponível
  const CATEGORIES_FALLBACK = [
    { id: 'sentimentos',  nome: '😊 Sentimentos'  },
    { id: 'necessidades', nome: '🍽️ Necessidades' },
    { id: 'acoes',        nome: '🏃 Ações'         },
    { id: 'lugares',      nome: '📍 Lugares'       },
    { id: 'pessoas',      nome: '👨‍👩‍👧 Pessoas'  },
  ];

  const CARDS_FALLBACK = {
  };

  const SETTINGS_KEY = 'autim.user-settings';

  function getSettings() {
    const fallback = {
      narrator: true,
      darkMode: false,
      vibration: true,
      notifications: true,
      speed: 50,
      voice: 'Feminina'
    };

    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return fallback;
      return { ...fallback, ...JSON.parse(raw) };
    } catch {
      return fallback;
    }
  }

  // ─── Card de comunicação com fala via Web Speech API ─────────────────────────
  function ECard({ card, size, mode }) {
    var big = size === 'desktop';
    var [pressed, setPressed]   = useState(false);
    var [falando, setFalando]   = useState(false);
    var image = mode === 'image' ? getCardImage(card.label || '') : null;

    function handleClick() {
      const settings = getSettings();

      if (!settings.narrator) return;

      setFalando(true);
      try {
        speakText(card.label, settings, function() {
          setFalando(false);
        });
      } catch (error) {
        console.warn('Áudio indisponível para o card selecionado.', error);
        setFalando(false);
      }
    }

    return (
      <div
        onPointerEnter={function () {
          try {
            preloadSpeech(card.label, getSettings());
          } catch (error) {
            console.warn('Falha ao preparar a fala do card.', error);
          }
        }}
        onTouchStart={function () {
          try {
            preloadSpeech(card.label, getSettings());
          } catch (error) {
            console.warn('Falha ao preparar a fala do card.', error);
          }
        }}
        onClick={handleClick}
        onMouseDown={function () { setPressed(true); }}
        onMouseUp={function ()   { setPressed(false); }}
        onMouseLeave={function () { setPressed(false); }}
        style={{
          borderRadius: 22,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: image ? 200 : undefined,
          boxSizing: 'border-box',
          padding: big ? '28px 16px 20px' : '18px 10px 14px',
          cursor: 'pointer',
          gap: big ? 14 : 12,
          position: 'relative',
          overflow: 'hidden',
          background: card.bg,
          backgroundImage: image ? 'url("' + image + '")' : undefined,
          backgroundSize: image ? 'cover' : undefined,
          backgroundPosition: image ? 'center' : undefined,
          boxShadow: falando
            ? '0 0 0 4px #fff, 0 0 0 7px ' + card.bg + ', 0 8px 28px ' + card.shadow
            : '0 6px 20px ' + card.shadow,
          transform: pressed ? 'scale(.95)' : falando ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform .15s, box-shadow .2s',
          outline: 'none',
          userSelect: 'none',
        }}
      >
        {/* brilho superior */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(180deg,rgba(255,255,255,.18) 0%,transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* ondas de áudio enquanto fala */}
        {falando && (
          <div style={{
            position: 'absolute', bottom: 6, right: 8,
            display: 'flex', alignItems: 'flex-end', gap: 2,
          }}>
            {[6, 10, 7, 12, 5].map(function (h, i) {
              return (
                <div key={i} style={{
                  width: 3, height: h,
                  background: 'rgba(255,255,255,.8)',
                  borderRadius: 3,
                  animation: 'wave ' + (0.5 + i * 0.1) + 's ease-in-out infinite alternate',
                }} />
              );
            })}
          </div>
        )}

        {/* emoji */}
        {(!image || mode !== 'image') && <div style={{
          width: big ? 90 : 76,
          height: big ? 90 : 76,
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,.15)',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ fontSize: big ? 50 : 42, lineHeight: 1 }}>{card.emoji}</span>
        </div>}

        {/* rótulo */}
        <div style={{
          background: image ? 'rgba(0,0,0,.58)' : falando ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.15)',
          borderRadius: 20,
          padding: '4px 14px',
          position: 'relative',
          zIndex: 1,
          transition: 'background .2s',
          ...(image ? { position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', maxWidth: 'calc(100% - 20px)', whiteSpace: 'nowrap' } : {}),
        }}>
          <span style={{
            fontSize: big ? 13 : 12,
            fontWeight: 900,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            {falando ? '🔊 ' + card.label : card.label}
          </span>
        </div>
      </div>
    );
  }

  // ─── Página principal ─────────────────────────────────────────────────────────
  export default function PageComunicacao({ navigate }) {
    var [activeCat,  setActiveCat]  = useState(null);
    var [categorias, setCategorias] = useState([]);
    var [allCards,   setAllCards]   = useState({});
    var [loading,    setLoading]    = useState(true);
    var [erro,       setErro]       = useState(false);
    var [visualMode, setVisualMode] = useState('emote');

    const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('login');

  };

    // Busca categorias e cards do backend ao montar a página
    useEffect(function () {
      Promise.all([
        fetch('/api/comunicacao/categorias').then(function (r) { return r.json(); }),
        fetch('/api/comunicacao/cards').then(function (r)      { return r.json(); }),
      ])
        .then(function (results) {
          var catData   = results[0];
          var cardsData = results[1];

          if (catData.categorias && cardsData.cards) {
            setCategorias(catData.categorias);
            setAllCards(cardsData.cards);
            setActiveCat(catData.categorias[0]?.slug || null);
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        })
        .catch(function () {
          // Fallback: usa dados estáticos se o backend não responder
          console.warn('Backend não disponível — usando dados estáticos.');
          setCategorias(CATEGORIES_FALLBACK.map(function (c) {
            return { id: c.id, slug: c.id, nome: c.nome, icone: null };
          }));
          setAllCards(CARDS_FALLBACK);
          setActiveCat(CATEGORIES_FALLBACK[0].id);
          setErro(true);
        })
        .finally(function () {
          setLoading(false);
        });
    }, []);

    var cards = activeCat ? (allCards[activeCat] || []) : [];

    // ── Loading ──
    if (loading) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'var(--bg)',
          flexDirection: 'column', gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '4px solid var(--blue)', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ color: '#888', fontWeight: 700 }}>Carregando cards...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    return (
      <>
        <style>{`
          @keyframes wave {
            from { transform: scaleY(0.5); }
            to   { transform: scaleY(1.5); }
          }
          @media (min-width: 1024px) { .com-mobile  { display: none !important; } }
          .com-desktop { display: none; }
          @media (min-width: 1024px) { .com-desktop { display: block !important; } }
          .cat-tabs-scroll { display:flex; gap:8px; overflow-x:auto; }
          .cat-tabs-scroll::-webkit-scrollbar { display:none; }
          .cat-pill { padding:7px 16px; border-radius:20px; background:#fff; border:2px solid #e0e8f0; font-size:12px; font-weight:800; color:#888; white-space:nowrap; cursor:pointer; transition:all .2s; flex-shrink:0; font-family:'Nunito',sans-serif; }
          .cat-pill.active { background:var(--blue); border-color:var(--blue); color:#fff; }
          .cat-pill:hover:not(.active) { border-color:var(--blue); color:var(--blue); }
          .com-mode-switch { display:flex; width:max-content; max-width:100%; padding:4px; gap:4px; border:1px solid #dce5ed; border-radius:12px; background:#fff; }
          .com-mode-button { border:0; border-radius:8px; padding:9px 14px; background:transparent; color:#53616d; font:800 13px 'Nunito',sans-serif; cursor:pointer; transition:background .2s,color .2s; }
          .com-mode-button.active { background:var(--blue); color:#fff; }
          .com-cards-grid      { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
          .com-cards-grid-desk { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        `}</style>

        {/* Aviso de fallback (apenas em desenvolvimento) */}
        {erro && (
          <div style={{
            position: 'fixed', top: 8, right: 8, zIndex: 999,
            background: '#fff3cd', border: '1px solid #ffc107',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 11, color: '#856404', fontWeight: 700,
          }}>
            Backend offline — usando dados locais
          </div>
        )}

        {/* ── MOBILE ── */}
        <div className="com-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>

          <div style={{ background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 12px rgba(0,0,0,.2)', overflow:'hidden' }}>
              <img src={logoIcone} alt="Autim" style={{ width:46, height:46, objectFit:'contain' }} />
            </div>
            <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Comunicação</div>
            {/* botão de logout móvel removido — disponível apenas em Perfil */}
            <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)' }}>Toque em um card para ouvir a palavra</div>
          </div>

          <div className="cat-tabs-scroll" style={{ padding:'14px 16px 0', flexShrink:0 }}>
            {categorias.map(function (c) {
              return (
                <div
                  key={c.slug || c.id}
                  className={'cat-pill' + (activeCat === (c.slug || c.id) ? ' active' : '')}
                  onClick={function () { setActiveCat(c.slug || c.id); }}
                >
                  {c.nome}
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', justifyContent:'center', padding:'12px 16px 0' }}>
            <ModeSelector mode={visualMode} onChange={setVisualMode} />
          </div>

          <div style={{ flex:1, padding:'12px 14px 80px', overflowY:'auto' }}>
            <div className="com-cards-grid">
              {cards.map(function (card, i) { return <ECard key={card.id || i} card={card} size="mobile" mode={visualMode} />; })}
            </div>
          </div>

          <nav className="bottom-nav">
            <div className="nav-item" onClick={function () { navigate('home-aluno'); }}>
              <div className="nav-icon"><IconHome /></div>
              <div className="nav-label">Início</div>
            </div>
            <div className="nav-item active">
              <div className="nav-icon active"><IconChat /></div>
              <div className="nav-label">Comunicar</div>
            </div>
            <div className="nav-item" onClick={function () { navigate('licoes'); }}>
              <div className="nav-icon"><IconSchool /></div>
              <div className="nav-label">Lições</div>
            </div>
            <div className="nav-item" onClick={function () { navigate('agenda'); }}>
              <div className="nav-icon"><IconCalendar /></div>
              <div className="nav-label">Agenda</div>
            </div>
            <div className="nav-item" onClick={function () { navigate('perfil'); }}>
              <div className="nav-icon"><IconPerson /></div>
              <div className="nav-label">Perfil</div>
            </div>
            
          </nav>
        </div>

        {/* ── DESKTOP ── */}
        <div className="com-desktop">
          <nav className="desktop-sidebar">
            <div className="sidebar-logo">
              <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
              <span className="sidebar-logo-name">Autim</span>
            </div>
            {[
              { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'  },
              { icon:<IconChat/>,     label:'Comunicação', active:true,  page:'comunicacao' },
              { icon:<IconSchool/>,   label:'Lições',      active:false, page:'licoes'      },
              { icon:<IconCalendar/>, label:'Agenda',      active:false, page:'agenda'      },
              { icon:<IconRobot/>,    label:'Assistente IA', active:false, page:'ia' },
            ].map(function (item, i) {
              return (
                <div key={i} className={'sidebar-nav-item' + (item.active ? ' active' : '')} onClick={function () { if (item.page) navigate(item.page); }}>
                  {item.icon}{item.label}
                </div>
              );
            })}
            <div className="sidebar-spacer"></div>
            <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
            <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
            <div
    className="sidebar-nav-item"
    onClick={handleLogout}
    style={{
      cursor:'pointer',
      color:'var(--red)'
    }}
  >
    🚪 Sair
  </div>
            <SidebarUser />
          </nav>

          <div className="main-content">
            <div className="page-wrapper">
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>💬 Comunicação</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Clique em um card para ouvir a palavra em voz alta</div>
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
                <ModeSelector mode={visualMode} onChange={setVisualMode} />
              </div>

              <div className="cat-tabs-scroll" style={{ marginBottom:24 }}>
                {categorias.map(function (c) {
                  return (
                    <div
                      key={c.slug || c.id}
                      className={'cat-pill' + (activeCat === (c.slug || c.id) ? ' active' : '')}
                      onClick={function () { setActiveCat(c.slug || c.id); }}
                    >
                      {c.nome}
                    </div>
                  );
                })}
              </div>

              <div className="com-cards-grid-desk">
                {cards.map(function (card, i) { return <ECard key={card.id || i} card={card} size="desktop" mode={visualMode} />; })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

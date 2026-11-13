import { useState, useEffect } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconRobot, IconSettings } from '../components/icons';
import SidebarUser from '../components/SidebarUser';

const CATEGORY_TEMPLATE = [
  {
    id: 'sentimentos', name: 'Sentimentos', icon: '😊', bg: '#fff8e1', accent: '#fdbe2d',
    desc: 'Aprenda a expressar emoções', done: 0, total: 5,
    phases: [
      { emoji:'😄', label:'Fase 1', offset:''        },
      { emoji:'😢', label:'Fase 2', offset:'right'   },
      { emoji:'😠', label:'Fase 3', offset:'left'    },
      { emoji:'😨', label:'Fase 4', offset:''        },
      { emoji:'😴', label:'Fase 5', offset:'right'   },
    ],
  },
  {
    id: 'necessidades', name: 'Necessidades', icon: '🍽️', bg: '#e8f4ff', accent: '#38a7fb',
    desc: 'Comida, água, sono e mais', done: 0, total: 5,
    phases: [],
  },
  {
    id: 'acoes', name: 'Ações', icon: '🔒', bg: '#f0f2f4', accent: '#e0e8f0',
    desc: 'Complete Necessidades para desbloquear', done: 0, total: 5,
    locked: true, phases: [],
  },
];

function createCategories(lessons = [], sections = {}) {
  const necessidadesLiberada = Boolean(sections.necessidadesLiberada);

  return CATEGORY_TEMPLATE.map(template => {
    const category = template.id === 'necessidades'
      ? {
          ...template,
          locked: !necessidadesLiberada,
          desc: necessidadesLiberada
            ? template.desc
            : 'Conclua Sentimentos e solicite a liberação'
        }
      : template;

    if (category.id === 'necessidades' || category.id === 'sentimentos') {
      const categoryLessons = lessons.filter(phase => (
        phase.categoria.toLowerCase() === category.name.toLowerCase()
      ));
      const completed = categoryLessons.filter(phase => phase.concluida).length;
      const nextIndex = categoryLessons.findIndex(phase => !phase.concluida);
      const phases = category.id === 'sentimentos'
        ? category.phases.map((phase, index) => ({
            ...phase,
            ...(categoryLessons.find(lesson => lesson.fase === index + 1) || {})
          }))
        : categoryLessons;

      return {
        ...category,
        done: completed,
        phases: phases.map((phase, index) => ({
          ...phase,
          state: category.locked
            ? 'locked'
            : phase.concluida ? 'done' : index === nextIndex ? 'active' : 'pending'
        }))
      };
    }
    return {
      ...category,
      phases: category.phases.map(phase => ({
        ...phase,
        state: 'pending'
      }))
    };
  });
}

// ── Config geométrica da trilha ──
const NODE = 64;
const RADIUS = NODE / 2;
const OFFSET = 58;     // quanto uma fase "right"/"left" se desloca do centro
const ROW = 88;        // distância vertical entre o centro de duas fases
const TRACK_W = 226;   // largura fixa do trilho (centro + folga dos offsets)
const CENTER_X = TRACK_W / 2;

function offsetX(offset) {
  return offset === 'right' ? OFFSET : offset === 'left' ? -OFFSET : 0;
}

function buildPath(points) {
  if (points.length < 2) return '';
  return points.reduce((d, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + pt.y) / 2;
    // curva em S suave entre um nó e o próximo
    return `${d} C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
  }, '');
}

function PhaseNode({ phase, navigate }) {
  const colors = {
    done:   { bg:'#48c378', border:'#34a363', shadow:'rgba(72,195,120,.5)'   },
    active: { bg:'#38a7fb', border:'#2090e0', shadow:'rgba(56,167,251,.6)'   },
    pending: { bg:'#38a7fb', border:'#2090e0', shadow:'rgba(56,167,251,.35)' },
    locked: { bg:'#e0e8f0', border:'#c8d5e0', shadow:'rgba(0,0,0,.08)'       },
  };
  const c = colors[phase.state];

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      {phase.state === 'active' && (
        <div className="phase-flag" style={{ '--flag-bg': c.bg }}>
          Continuar
          <span className="phase-flag-arrow" style={{ '--flag-bg': c.bg }} />
        </div>
      )}

      <div
        onClick={() => {
          if (phase.state === 'locked') return;
          localStorage.setItem('licaoSelecionada', JSON.stringify({
            label: phase.label,
            emoji: phase.emoji,
            categoria: phase.categoria || 'Sentimentos',
            pergunta: phase.pergunta,
            palavra: phase.palavra,
            opcoes: phase.opcoes,
            atividadeId: phase.id,
            fase: phase.fase
          }));
          navigate('licao-atividade');
        }}
        className={`phase-node ${phase.state === 'locked' ? 'locked' : ''} ${phase.state === 'active' ? 'active' : ''}`}
        style={{
          '--node-bg': c.bg,
          '--node-border': c.border,
          '--node-glow': c.shadow,
        }}
      >
        <span style={{ fontSize:24, lineHeight:1, filter: phase.state === 'locked' ? 'grayscale(1) opacity(.5)' : 'none' }}>{phase.emoji}</span>
        <span style={{ fontSize:10, fontWeight:900, color: phase.state === 'locked' ? '#aaa' : 'rgba(255,255,255,.85)', letterSpacing:.5 }}>{phase.label}</span>
        {phase.state === 'done' && (
          <div style={{ position:'absolute', bottom:-6, right:-6, width:20, height:20, background:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, boxShadow:'0 1px 4px rgba(0,0,0,.15)' }}>✅</div>
        )}
      </div>
    </div>
  );
}

function PhaseTrack({ phases, navigate }) {
  if (!phases.length) return null;

  const points = phases.map((p, i) => ({
    x: CENTER_X + offsetX(p.offset),
    y: RADIUS + i * ROW,
    phase: p,
  }));

  // até onde o trilho já foi percorrido (fases 'done' seguidas, incluindo a 'active' logo em seguida)
  let doneUpTo = -1;
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].state === 'done') doneUpTo = i;
    else if (phases[i].state === 'active') { doneUpTo = i; break; }
    else break;
  }

  const height = RADIUS * 2 + (phases.length - 1) * ROW;
  const fullPath = buildPath(points);
  const donePath = doneUpTo > 0 ? buildPath(points.slice(0, doneUpTo + 1)) : '';

  return (
    <div style={{ position:'relative', width: TRACK_W, height, margin:'0 auto' }}>
      <svg width={TRACK_W} height={height} style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }}>
        <path d={fullPath} fill="none" stroke="#d0dce8" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 13" />
        {donePath && (
          <path d={donePath} fill="none" stroke="#48c378" strokeWidth="5" strokeLinecap="round" />
        )}
      </svg>

      {points.map((pt, i) => (
        <div key={i} style={{ position:'absolute', left: pt.x - RADIUS, top: pt.y - RADIUS }}>
          <PhaseNode phase={pt.phase} navigate={navigate} />
        </div>
      ))}
    </div>
  );
}

export default function PageLicoes({ navigate }) {
  const [expanded, setExpanded] = useState('sentimentos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState(() => createCategories());
  const [alunoId, setAlunoId] = useState(() => localStorage.getItem('alunoId'));
  const [secoes, setSecoes] = useState({
    sentimentosConcluida: false,
    necessidadesLiberada: false,
    solicitacaoNecessidades: null
  });
  const [solicitacaoEmAndamento, setSolicitacaoEmAndamento] = useState(false);
  const [mensagemSolicitacao, setMensagemSolicitacao] = useState('');
  const [secaoReiniciando, setSecaoReiniciando] = useState(null);
  const [mensagemReinicio, setMensagemReinicio] = useState(null);
  const [categoriaConfirmacaoReinicio, setCategoriaConfirmacaoReinicio] = useState(null);
  const [dados, setDados] = useState({
    xp: 0,
    diasOfensiva: 0,
    alunoNome: 'Aluno',
    responsavelNome: 'Responsável'
  });

  const handleLogout = () => {
    ['token', 'usuario', 'userData', 'alunoId', 'dashboardAlunoId'].forEach(key => localStorage.removeItem(key));
    navigate('login');
  };

  useEffect(() => {
    if (!categoriaConfirmacaoReinicio) return undefined;

    const fecharComEscape = event => {
      if (event.key === 'Escape') {
        setCategoriaConfirmacaoReinicio(null);
      }
    };

    window.addEventListener('keydown', fecharComEscape);
    return () => window.removeEventListener('keydown', fecharComEscape);
  }, [categoriaConfirmacaoReinicio]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    const carregarDados = async () => {
      try {
        const perfilResponse = await fetch('http://localhost:3001/auth/perfil-usuario', {
          headers: { Authorization: `Bearer ${token}` }
        });

        let perfilData = null;
        if (perfilResponse.ok) {
          perfilData = await perfilResponse.json();
        }

        const aluno = perfilData?.aluno || {};
        const usuario = perfilData?.usuario || {};
        const alunoId = aluno.ALU_ID || localStorage.getItem('dashboardAlunoId') || localStorage.getItem('alunoId');
        setAlunoId(alunoId ? String(alunoId) : null);
        let dashboardData = null;

        if (alunoId) {
          localStorage.setItem('alunoId', String(alunoId));
          const dashboardResponse = await fetch(`http://localhost:3001/dashboard/aluno?alunoId=${alunoId}&periodo=total`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (dashboardResponse.ok) {
            dashboardData = await dashboardResponse.json();
          }
        }

        let lessons = [];
        if (alunoId) {
          const licoesResponse = await fetch(`http://localhost:3001/dashboard/licoes?alunoId=${alunoId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!licoesResponse.ok) {
            const erro = await licoesResponse.json().catch(() => ({}));
            throw new Error(erro.erro || 'Não foi possível carregar as lições.');
          }
          const licoesData = await licoesResponse.json();
          lessons = licoesData.licoes || [];
          setSecoes(licoesData.secoes || {});
          setCategories(createCategories(lessons, licoesData.secoes || {}));
        }

        const resumo = dashboardData?.resumo || {};

        setDados({
          xp: Number(resumo.xp ?? aluno.ALU_XP_TOTAL ?? 0),
          diasOfensiva: Number(resumo.diasOfensiva ?? aluno.ALU_DIAS_OFENSIVA ?? 0),
          alunoNome: aluno.ALU_NOME || aluno.nome || 'Aluno',
          responsavelNome: usuario.USU_NOME || usuario.nome || 'Responsável'
        });
      } catch (error) {
        console.error('Erro ao carregar dados das lições:', error);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (!alunoId || secoes.solicitacaoNecessidades !== 'pendente') return undefined;

    let cancelado = false;
    let tentativas = 0;
    let timer;
    const verificarLiberacao = async () => {
      if (cancelado || tentativas >= 20) return;
      tentativas += 1;

      try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`http://localhost:3001/dashboard/licoes?alunoId=${alunoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error('Não foi possível verificar a liberação da seção.');
        const dadosLicoes = await resposta.json();
        if (cancelado) return;

        const acesso = dadosLicoes.secoes || {};
        setSecoes(acesso);
        setCategories(createCategories(dadosLicoes.licoes || [], acesso));
        if (acesso.necessidadesLiberada) {
          setExpanded('necessidades');
          setMensagemSolicitacao('Seção Necessidades liberada!');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar liberação da seção:', error);
      }

      if (!cancelado && tentativas < 20) {
        timer = setTimeout(verificarLiberacao, 1500);
      } else if (!cancelado) {
        setMensagemSolicitacao('O pedido continua pendente. Você pode voltar às lições mais tarde.');
      }
    };

    timer = setTimeout(verificarLiberacao, 1000);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [alunoId, secoes.solicitacaoNecessidades]);

  const solicitarLiberacao = async () => {
    const token = localStorage.getItem('token');
    if (!token || !alunoId || solicitacaoEmAndamento) return;

    setSolicitacaoEmAndamento(true);
    setMensagemSolicitacao('');
    try {
      const resposta = await fetch('http://localhost:3001/dashboard/licoes/solicitar-liberacao', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alunoId: Number(alunoId) })
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível solicitar a liberação.');

      if (resultado.liberada) {
        const respostaLicoes = await fetch(`http://localhost:3001/dashboard/licoes?alunoId=${alunoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!respostaLicoes.ok) throw new Error('A seção foi liberada, mas não foi possível atualizar as lições.');
        const dadosLicoes = await respostaLicoes.json();
        const acesso = dadosLicoes.secoes || {};
        setSecoes(acesso);
        setCategories(createCategories(dadosLicoes.licoes || [], acesso));
        setExpanded('necessidades');
        setMensagemSolicitacao('Seção Necessidades liberada!');
      } else {
        setSecoes(anterior => ({ ...anterior, solicitacaoNecessidades: 'pendente' }));
        setMensagemSolicitacao('Solicitação enviada. Aguardando a verificação do sistema...');
      }
    } catch (error) {
      setMensagemSolicitacao(error.message);
    } finally {
      setSolicitacaoEmAndamento(false);
    }
  };

  const reiniciarAtividades = async category => {
    if (!alunoId || secaoReiniciando) return;

    const token = localStorage.getItem('token');
    setSecaoReiniciando(category.id);
    setMensagemReinicio(null);

    try {
      const resposta = await fetch('http://localhost:3001/dashboard/licoes/reiniciar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alunoId: Number(alunoId), categoria: category.id })
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        throw new Error(resultado.erro || 'Não foi possível reiniciar as atividades.');
      }

      try {
        const respostaLicoes = await fetch(`http://localhost:3001/dashboard/licoes?alunoId=${alunoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!respostaLicoes.ok) {
          throw new Error('Não foi possível atualizar o progresso das lições.');
        }
        const dadosLicoes = await respostaLicoes.json();
        const acesso = dadosLicoes.secoes || {};
        setSecoes(acesso);
        setCategories(createCategories(dadosLicoes.licoes || [], acesso));
        setMensagemReinicio({
          categoria: category.id,
          texto: `Atividades de ${category.name} reiniciadas com sucesso.`
        });
      } catch (error) {
        console.error('Erro ao atualizar o progresso após reiniciar a seção:', error);
        setMensagemReinicio({
          categoria: category.id,
          texto: `Atividades de ${category.name} reiniciadas, mas não foi possível atualizar o progresso exibido. Atualize a página.`
        });
      }
    } catch (error) {
      console.error('Erro ao reiniciar atividades:', error);
      setMensagemReinicio({
        categoria: category.id,
        texto: error.message || `Não foi possível reiniciar as atividades de ${category.name}.`
      });
    } finally {
      setSecaoReiniciando(null);
    }
  };

  const renderReiniciarAtividades = category => {
    if (!['sentimentos', 'necessidades'].includes(category.id)) return null;

    const ocupado = secaoReiniciando !== null;
    const desabilitado = Boolean(category.locked || !alunoId || ocupado);

    return (
      <div style={{ marginTop:8, paddingLeft:10 }}>
        <button
          type="button"
          onClick={() => setCategoriaConfirmacaoReinicio(category)}
          disabled={desabilitado}
          style={{
            border:'1px solid #f2b8b5',
            borderRadius:10,
            padding:'8px 11px',
            background:desabilitado ? '#f5f5f5' : '#fff',
            color:desabilitado ? '#aaa' : '#c4453c',
            fontWeight:800,
            cursor:desabilitado ? 'not-allowed' : 'pointer'
          }}
        >
          {secaoReiniciando === category.id ? 'Reiniciando...' : '↻ Reiniciar atividades'}
        </button>
        {mensagemReinicio?.categoria === category.id && (
          <div role="status" style={{ marginTop:6, fontSize:12, color:'#555' }}>
            {mensagemReinicio.texto}
          </div>
        )}
      </div>
    );
  };

  const renderSolicitarLiberacao = category => {
    if (
      category.id !== 'necessidades'
      || !category.locked
      || !secoes.sentimentosConcluida
    ) return null;

    return (
      <div style={{ marginTop:8, paddingLeft:10 }}>
        <button
          type="button"
          onClick={solicitarLiberacao}
          disabled={solicitacaoEmAndamento}
          style={{
            border:0,
            borderRadius:10,
            padding:'9px 12px',
            background:'#38a7fb',
            color:'#fff',
            fontWeight:800,
            cursor:solicitacaoEmAndamento ? 'wait' : 'pointer'
          }}
        >
          {solicitacaoEmAndamento
            ? 'Enviando solicitação...'
            : secoes.solicitacaoNecessidades === 'pendente'
              ? 'Reenviar solicitação de liberação'
              : 'Solicitar liberação da próxima seção'}
        </button>
        {mensagemSolicitacao && (
          <div role="status" style={{ marginTop:6, fontSize:12, color:'#555' }}>
            {mensagemSolicitacao}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .lic-mobile { display: none !important; } }
        .lic-desktop { display: none; }
        @media (min-width: 768px) { .lic-desktop { display: block !important; } }
        .cat-card { background:#fff; border-radius:20px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,.07); cursor:pointer; transition:transform .15s; border-left:5px solid transparent; }
        .cat-card:hover { transform:translateY(-2px); }

        .phase-node {
          width:${NODE}px; height:${NODE}px; border-radius:50%;
          background:var(--node-bg); border:4px solid var(--node-border);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
          box-shadow: 0 3px 8px var(--node-glow), 0 6px 0 var(--node-border);
          cursor:pointer; transition: transform .12s ease, box-shadow .12s ease;
        }
        .phase-node.locked { cursor:not-allowed; }
        .phase-node:not(.locked):hover { transform: translateY(-2px); }
        .phase-node:not(.locked):active { transform: translateY(5px); box-shadow: 0 1px 4px var(--node-glow), 0 1px 0 var(--node-border); }
        .phase-node.active { animation: pulse-glow 2s infinite; }
        .lic-mobile-menu { position:absolute; top:54px; right:12px; z-index:1001; min-width:204px; display:flex; flex-direction:column; gap:4px; padding:8px; background:var(--white); border:1px solid var(--border); border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.18); }
        .lic-mobile-menu button { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; border:0; border-radius:8px; background:transparent; color:var(--dark); font:800 13px 'Nunito',sans-serif; text-align:left; cursor:pointer; }
        .lic-mobile-menu button:hover { background:var(--bg); }
        .lic-mobile-menu svg { width:18px; height:18px; fill:currentColor; }

        .phase-flag {
          position:absolute; top:-34px; left:50%; transform:translateX(-50%);
          background:var(--flag-bg); color:#fff; font-size:11px; font-weight:900;
          padding:5px 10px; border-radius:10px; white-space:nowrap;
          box-shadow:0 3px 8px rgba(0,0,0,.15);
        }
        .phase-flag-arrow {
          position:absolute; bottom:-5px; left:50%; transform:translateX(-50%) rotate(45deg);
          width:9px; height:9px; background:var(--flag-bg);
        }
        .lic-reset-overlay {
          position:fixed; inset:0; z-index:2000; display:flex; align-items:center;
          justify-content:center; padding:20px; background:rgba(20,31,48,.48);
          backdrop-filter:blur(4px); animation:lic-reset-fade-in .18s ease-out;
        }
        .lic-reset-dialog {
          width:min(100%, 440px); box-sizing:border-box; padding:28px;
          border:1px solid rgba(224,232,240,.9); border-radius:24px;
          background:var(--white); box-shadow:0 24px 70px rgba(20,31,48,.24);
          color:var(--dark); text-align:left; animation:lic-reset-rise-in .2s ease-out;
        }
        .lic-reset-icon {
          display:flex; align-items:center; justify-content:center; width:54px; height:54px;
          margin-bottom:18px; border-radius:18px; background:#fff0ee; color:#d94b43;
          font-size:26px; font-weight:900;
        }
        .lic-reset-title { margin:0 0 9px; color:var(--dark); font-size:22px; line-height:1.25; font-weight:900; }
        .lic-reset-description { margin:0; color:var(--text-muted); font-size:14px; line-height:1.65; }
        .lic-reset-note {
          display:flex; align-items:flex-start; gap:9px; margin-top:18px; padding:12px 14px;
          border:1px solid #dcefe4; border-radius:14px; background:#f2fbf5;
          color:#39734e; font-size:13px; line-height:1.5; font-weight:700;
        }
        .lic-reset-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; }
        .lic-reset-actions button {
          min-height:44px; padding:0 17px; border-radius:12px;
          font:800 14px 'Nunito',sans-serif; cursor:pointer; transition:transform .15s, box-shadow .15s;
        }
        .lic-reset-actions button:hover { transform:translateY(-1px); }
        .lic-reset-cancel { border:1px solid var(--border); background:var(--white); color:var(--dark); }
        .lic-reset-confirm {
          border:1px solid #d94b43; background:#d94b43; color:#fff;
          box-shadow:0 4px 10px rgba(217,75,67,.2);
        }
        .lic-reset-confirm:hover { box-shadow:0 6px 16px rgba(217,75,67,.28); }
        @keyframes lic-reset-fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes lic-reset-rise-in { from { opacity:0; transform:translateY(8px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @media (max-width:480px) {
          .lic-reset-dialog { padding:24px 20px; border-radius:20px; }
          .lic-reset-actions { flex-direction:column-reverse; }
          .lic-reset-actions button { width:100%; }
        }
        @media (prefers-reduced-motion:reduce) {
          .lic-reset-overlay, .lic-reset-dialog { animation:none; }
          .lic-reset-actions button { transition:none; }
        }
      `}</style>

      {/* ── MOBILE ── */}
        <div className="lic-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, flexShrink:0, position:'relative', zIndex:2 }}>
          <button
            type="button"
            className="lic-menu-toggle"
            aria-label="Abrir menu de conta"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(open => !open)}
            style={{ position:'absolute', top:10, right:12, width:38, height:38, border:0, borderRadius:10, background:'rgba(255,255,255,.2)', color:'#fff', fontSize:22, cursor:'pointer' }}
          >☰</button>
          {mobileMenuOpen && (
            <div className="lic-mobile-menu" role="menu" aria-label="Menu de conta">
              <button type="button" role="menuitem" onClick={() => { setMobileMenuOpen(false); navigate('ia'); }}><IconRobot />Assistente IA</button>
              <button type="button" role="menuitem" onClick={() => { setMobileMenuOpen(false); navigate('perfil'); }}><IconPerson />Perfil</button>
              <button type="button" role="menuitem" onClick={() => { setMobileMenuOpen(false); navigate('config'); }}><IconSettings />Configurações</button>
              <button type="button" role="menuitem" onClick={handleLogout} style={{ color:'var(--red)' }}>🚪 Sair</button>
            </div>
          )}
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 3px 12px rgba(0,0,0,.2)' }}>
            <img src={logoIcone} alt="Autim" style={{ width:42, height:42, objectFit:'contain' }} />
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Lições</div>
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%' }}>
            <div style={{ background:'rgba(255,255,255,.2)', borderRadius:20, padding:'4px 12px', fontSize:13, fontWeight:800, color:'#fff' }}>🔥 {dados.diasOfensiva} dias</div>
            <div style={{ flex:1, background:'rgba(255,255,255,.25)', borderRadius:99, height:8, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#fdbe2d', borderRadius:99, width: `${Math.min(100, dados.diasOfensiva * 10)}%` }}></div>
            </div>
            <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>⭐ {dados.xp} XP</div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px', display:'flex', flexDirection:'column', gap:20 }}>
          {categories.map(cat => (
            <div key={cat.id}>
              <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'0 4px', marginBottom:8 }}>
                {cat.icon} {cat.name}
              </div>
              <div className="cat-card" style={{ borderLeftColor: cat.accent, opacity: cat.locked ? .6 : 1 }}
                onClick={() => !cat.locked && setExpanded(expanded === cat.id ? null : cat.id)}>
                <div style={{ width:52, height:52, borderRadius:16, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{cat.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:900, color: cat.locked ? '#aaa' : 'var(--dark)' }}>{cat.name}</div>
                  <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{cat.desc}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                    <div style={{ flex:1, height:6, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(cat.done/cat.total)*100}%`, background:cat.accent, borderRadius:99 }}></div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{cat.done}/{cat.total}</div>
                  </div>
                </div>
                <div style={{ fontSize:18, color:'#ccc' }}>{cat.locked ? '🔒' : '›'}</div>
              </div>
              {renderSolicitarLiberacao(cat)}
              {renderReiniciarAtividades(cat)}

              {expanded === cat.id && cat.phases.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <PhaseTrack phases={cat.phases} navigate={navigate} />
                </div>
              )}
            </div>
          ))}
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item active"><div className="nav-icon active"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="lic-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      active:true,  page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      active:false, page:'agenda'      },
            { icon:<IconRobot/>,    label:'Assistente IA', active:false, page:'ia'         },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item" onClick={() => navigate('perfil')}><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
          <div className="sidebar-nav-item" onClick={handleLogout} style={{ color:'var(--red)' }}>🚪 Sair</div>
          <SidebarUser />
        </nav>

        <div className="main-content">
          <div className="page-wrapper">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Lições</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Continue seu progresso</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, background:'#fff', borderRadius:16, padding:'12px 20px', boxShadow:'var(--shadow-card)' }}>
                <span style={{ fontSize:16 }}>🔥 {dados.diasOfensiva} dias</span>
                <div style={{ width:120, height:8, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width: `${Math.min(100, dados.diasOfensiva * 10)}%`, background:'#fdbe2d', borderRadius:99 }}></div>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>⭐ {dados.xp} XP</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              {/* coluna esquerda: categorias */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ fontSize:13, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888' }}>Categorias</div>
                  {categories.map(cat => (
                    <div key={cat.id}>
                      <div className="cat-card" style={{ borderLeftColor: cat.accent, opacity: cat.locked ? .6 : 1, borderRadius:18 }}
                        onClick={() => !cat.locked && setExpanded(cat.id)}>
                        <div style={{ width:52, height:52, borderRadius:16, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{cat.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15, fontWeight:900, color: cat.locked ? '#aaa' : 'var(--dark)' }}>{cat.name}</div>
                          <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{cat.desc}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                            <div style={{ flex:1, height:6, background:'#e0e8f0', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${(cat.done/cat.total)*100}%`, background:cat.accent, borderRadius:99 }}></div>
                            </div>
                            <div style={{ fontSize:11, fontWeight:800, color:'#888' }}>{cat.done}/{cat.total}</div>
                          </div>
                        </div>
                        <div style={{ fontSize:18, color:'#ccc' }}>{cat.locked ? '🔒' : '›'}</div>
                      </div>
                      {renderSolicitarLiberacao(cat)}
                      {renderReiniciarAtividades(cat)}
                    </div>
                ))}
              </div>

              {/* coluna direita: trilha de fases */}
              <div style={{ background:'#fff', borderRadius:24, padding:24, boxShadow:'var(--shadow-card)' }}>
                <div style={{ fontSize:13, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', marginBottom:20 }}>
                  {categories.find(c => c.id === expanded)?.icon} {categories.find(c => c.id === expanded)?.name} — Fases
                </div>
                {(categories.find(c => c.id === expanded)?.phases || []).length > 0 ? (
                  <PhaseTrack phases={categories.find(c => c.id === expanded)?.phases || []} navigate={navigate} />
                ) : (
                  <div style={{ textAlign:'center', color:'#aaa', fontSize:14, fontWeight:600, paddingTop:40 }}>Selecione uma categoria para ver as fases</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {categoriaConfirmacaoReinicio && (
        <div
          className="lic-reset-overlay"
          onClick={() => setCategoriaConfirmacaoReinicio(null)}
        >
          <section
            className="lic-reset-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="lic-reset-title"
            aria-describedby="lic-reset-description lic-reset-note"
            onClick={event => event.stopPropagation()}
          >
            <div className="lic-reset-icon" aria-hidden="true">↻</div>
            <h2 className="lic-reset-title" id="lic-reset-title">
              Recomeçar {categoriaConfirmacaoReinicio.name}?
            </h2>
            <p className="lic-reset-description" id="lic-reset-description">
              O progresso e o histórico das atividades desta seção serão apagados.
            </p>
            <div className="lic-reset-note" id="lic-reset-note">
              <span aria-hidden="true">✓</span>
              <span>Seu XP e seus dias de ofensiva continuam iguais.</span>
            </div>
            <div className="lic-reset-actions">
              <button
                type="button"
                className="lic-reset-cancel"
                autoFocus
                onClick={() => setCategoriaConfirmacaoReinicio(null)}
              >
                Manter meu progresso
              </button>
              <button
                type="button"
                className="lic-reset-confirm"
                onClick={() => {
                  const category = categoriaConfirmacaoReinicio;
                  setCategoriaConfirmacaoReinicio(null);
                  void reiniciarAtividades(category);
                }}
              >
                Sim, reiniciar
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
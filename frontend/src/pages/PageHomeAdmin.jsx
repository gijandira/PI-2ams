import { useState, useEffect, useCallback } from 'react';
import logoIcone from '../assets/logo-icone.png';

export default function PageHomeAdmin({ navigate }) {
  const [abaAtiva, setAbaAtiva] = useState('instituicoes');
  const [instituicoes, setInstituicoes] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [instFiltroId, setInstFiltroId] = useState('');
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState(null);

  const [modalInst, setModalInst] = useState(null);
  const [modalAluno, setModalAluno] = useState(null);

  const token = localStorage.getItem('token');

  const carregarDados = useCallback(async () => {
    const res = await fetch('http://localhost:3001/admin/dados', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao carregar dados.');
    return data;
  }, [token]);

  const atualizarDados = useCallback(async () => {
    try {
      const data = await carregarDados();
      setInstituicoes(data.instituicoes || []);
      setAlunos(data.alunos || []);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message || 'Erro de conexão com o servidor.' });
    }
  }, [carregarDados]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!token || user.cargo !== 'adm_master') {
      navigate('login');
      return;
    }

    let active = true;
    carregarDados().then(data => {
      if (!active) return;
      setInstituicoes(data.instituicoes || []);
      setAlunos(data.alunos || []);
    }).catch(error => {
      if (active) {
        setMensagem({ tipo: 'erro', texto: error.message || 'Erro de conexão com o servidor.' });
      }
    });

    return () => {
      active = false;
    };
  }, [carregarDados, navigate, token]);

  const handleStatusInst = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/instituicoes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem({ tipo: 'sucesso', texto: data.mensagem });
        atualizarDados();
      }
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao alterar status.' });
    }
  };

  const salvarInstituicao = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(modalInst.id);
    const url = isEdit
      ? `http://localhost:3001/admin/instituicoes/${modalInst.id}`
      : 'http://localhost:3001/admin/instituicoes';

    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(modalInst)
    });
    const data = await res.json();
    if (res.ok) {
      setMensagem({ tipo: 'sucesso', texto: data.mensagem });
      setModalInst(null);
      atualizarDados();
    } else {
      setMensagem({ tipo: 'erro', texto: data.erro || 'Erro ao salvar instituição.' });
    }
  };

  const excluirInstituicao = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir a instituição "${nome}"?`)) return;
    const res = await fetch(`http://localhost:3001/admin/instituicoes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMensagem({ tipo: 'sucesso', texto: 'Instituição excluída!' });
      atualizarDados();
    }
  };

  const salvarAluno = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(modalAluno.id);
    const url = isEdit
      ? `http://localhost:3001/admin/alunos/${modalAluno.id}`
      : 'http://localhost:3001/admin/alunos';

    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(modalAluno)
    });
    const data = await res.json();
    if (res.ok) {
      setMensagem({ tipo: 'sucesso', texto: data.mensagem });
      setModalAluno(null);
      atualizarDados();
    } else {
      setMensagem({ tipo: 'erro', texto: data.erro || 'Erro ao salvar aluno.' });
    }
  };

  const excluirAluno = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`)) return;
    const res = await fetch(`http://localhost:3001/admin/alunos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMensagem({ tipo: 'sucesso', texto: 'Aluno excluído!' });
      atualizarDados();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('login');
  };

  const pendentes = instituicoes.filter(i => i.status === 'pendente');
  const alunosFiltrados = alunos.filter(a => {
    const instId = a.insIdAfiliacao || a.insIdDireto;
    const matchInst = instFiltroId ? String(instId) === String(instFiltroId) : true;
    const matchBusca = (a.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
                       (a.responsavelNome || '').toLowerCase().includes(busca.toLowerCase());
    return matchInst && matchBusca;
  });

  return (
    <div className="adm-wrapper">
      <style>{`
        .adm-wrapper {
          width: 100vw;
          min-height: 100vh;
          background: #f0f5fa;
          padding: 28px 40px;
          box-sizing: border-box;
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1e293b;
          text-align: left;
        }
        .adm-container {
          max-width: 1320px;
          margin: 0 auto;
        }
        .adm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 18px 28px;
          border-radius: 22px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
          margin-bottom: 24px;
        }
        .adm-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .adm-brand img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        .adm-brand h1 {
          margin: 0;
          font-size: 21px;
          font-weight: 900;
          color: #0f172a;
        }
        .adm-brand span {
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
        }
        .adm-btn {
          border: none;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          font-weight: 800;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .adm-btn:hover {
          transform: translateY(-1px);
          filter: brightness(0.96);
        }
        .adm-btn-logout {
          background: #fee2e2;
          color: #dc2626 !important;
          padding: 10px 22px;
          font-size: 13px;
        }
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 26px;
        }
        @media (max-width: 900px) {
          .adm-stats-grid { grid-template-columns: 1fr; }
          .adm-wrapper { padding: 16px; }
        }
        .adm-stat-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 24px rgba(15, 23, 42, 0.04);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 2px solid transparent;
        }
        .adm-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }
        .adm-stat-card.active-amber { border-color: #f59e0b; }
        .adm-stat-card.active-blue { border-color: #38a7fb; }
        .adm-stat-card.active-green { border-color: #48c378; }
        .adm-stat-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .adm-stat-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #64748b;
          text-transform: uppercase;
        }
        .adm-stat-value {
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
        }
        .adm-stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }
        .adm-tabs {
          display: inline-flex;
          background: #e2e8f0;
          padding: 6px;
          border-radius: 16px;
          gap: 6px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .adm-tab {
          border: none;
          background: transparent;
          color: #475569 !important;
          padding: 11px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .adm-tab.active {
          background: #ffffff;
          color: #0284c7 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .adm-panel {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
        }
        .adm-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .adm-panel-title {
          margin: 0;
          font-size: 19px;
          font-weight: 900;
          color: #0f172a;
        }
        .adm-btn-primary {
          background: linear-gradient(135deg, #48c378 0%, #2eae60 100%);
          color: #ffffff !important;
          padding: 11px 22px;
          font-size: 14px;
          box-shadow: 0 4px 14px rgba(72, 195, 120, 0.35);
        }
        .adm-table-wrap {
          width: 100%;
          overflow-x: auto;
        }
        .adm-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .adm-table th {
          padding: 14px 16px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          text-align: left;
        }
        .adm-table th.col-actions,
        .adm-table td.col-actions {
          text-align: right;
        }
        .adm-table td {
          padding: 16px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          text-align: left;
        }
        .adm-table tbody tr:hover {
          background: #f8fafc;
        }
        .adm-code-badge {
          background: #1e293b;
          color: #f8fafc;
          padding: 5px 11px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .adm-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        .adm-actions-group {
          display: inline-flex;
          gap: 8px;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
        }
        .adm-btn-view {
          background: #e0f2fe;
          color: #0369a1 !important;
          padding: 8px 14px;
          font-size: 12px;
        }
        .adm-btn-edit {
          background: #f1f5f9;
          color: #334155 !important;
          border: 1px solid #cbd5e1;
          padding: 8px 14px;
          font-size: 12px;
        }
        .adm-btn-delete {
          background: #fee2e2;
          color: #b91c1c !important;
          padding: 8px 14px;
          font-size: 12px;
        }
        .adm-btn-approve {
          background: #dcfce7;
          color: #15803d !important;
          padding: 8px 14px;
          font-size: 12px;
        }
        .adm-filter-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .adm-input, .adm-select {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          outline: none;
        }
        .adm-input:focus, .adm-select:focus {
          border-color: #38a7fb;
          box-shadow: 0 0 0 3px rgba(56, 167, 251, 0.15);
        }
        .adm-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .adm-modal {
          background: #ffffff;
          padding: 28px;
          border-radius: 24px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .adm-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .adm-field label {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
        }
      `}</style>

      <div className="adm-container">
        {/* HEADER */}
        <div className="adm-header">
          <div className="adm-brand">
            <img src={logoIcone} alt="Autim" />
            <div>
              <h1>Painel Administrador Master</h1>
              <span>Gestão de Instituições, Aprovações e Alunos</span>
            </div>
          </div>
          <button className="adm-btn adm-btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>

        {/* ALERTA */}
        {mensagem && (
          <div style={{
            padding: '14px 20px',
            borderRadius: 14,
            marginBottom: 20,
            fontWeight: 800,
            background: mensagem.tipo === 'erro' ? '#fee2e2' : '#dcfce7',
            color: mensagem.tipo === 'erro' ? '#b91c1c' : '#166534',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{mensagem.texto}</span>
            <span style={{ cursor: 'pointer', fontSize: 16 }} onClick={() => setMensagem(null)}>✕</span>
          </div>
        )}

        {/* CARDS DE RESUMO */}
        <div className="adm-stats-grid">
          <div
            onClick={() => setAbaAtiva('pendentes')}
            className={`adm-stat-card ${abaAtiva === 'pendentes' ? 'active-amber' : ''}`}
          >
            <div className="adm-stat-info">
              <span className="adm-stat-label">Pedidos Pendentes</span>
              <span className="adm-stat-value" style={{ color: '#d97706' }}>{pendentes.length}</span>
            </div>
            <div className="adm-stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
          </div>

          <div
            onClick={() => setAbaAtiva('instituicoes')}
            className={`adm-stat-card ${abaAtiva === 'instituicoes' ? 'active-blue' : ''}`}
          >
            <div className="adm-stat-info">
              <span className="adm-stat-label">Total de Instituições</span>
              <span className="adm-stat-value" style={{ color: '#0284c7' }}>{instituicoes.length}</span>
            </div>
            <div className="adm-stat-icon" style={{ background: '#e0f2fe' }}>🏫</div>
          </div>

          <div
            onClick={() => { setInstFiltroId(''); setAbaAtiva('alunos'); }}
            className={`adm-stat-card ${abaAtiva === 'alunos' ? 'active-green' : ''}`}
          >
            <div className="adm-stat-info">
              <span className="adm-stat-label">Total de Alunos</span>
              <span className="adm-stat-value" style={{ color: '#16a34a' }}>{alunos.length}</span>
            </div>
            <div className="adm-stat-icon" style={{ background: '#dcfce7' }}>👦</div>
          </div>
        </div>

        {/* BARRA DE ABAS */}
        <div className="adm-tabs">
          <button
            className={`adm-tab ${abaAtiva === 'instituicoes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('instituicoes')}
          >
            🏫 Instituições ({instituicoes.length})
          </button>
          <button
            className={`adm-tab ${abaAtiva === 'pendentes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('pendentes')}
          >
            ⏳ Aprovações Pendentes ({pendentes.length})
          </button>
          <button
            className={`adm-tab ${abaAtiva === 'alunos' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('alunos')}
          >
            👦 Alunos & Responsáveis ({alunos.length})
          </button>
        </div>

        {/* ABA 1: APROVAÇÕES PENDENTES */}
        {abaAtiva === 'pendentes' && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h3 className="adm-panel-title">Solicitações de Novas Instituições</h3>
            </div>
            {pendentes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b', fontWeight: 700 }}>
                🎉 Nenhuma solicitação de instituição pendente no momento.
              </div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Nome da Instituição</th>
                      <th>E-mail</th>
                      <th>Telefone</th>
                      <th>Código</th>
                      <th className="col-actions">Decisão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendentes.map(inst => (
                      <tr key={inst.id}>
                        <td style={{ fontWeight: 800, color: '#0f172a' }}>{inst.nome}</td>
                        <td>{inst.email}</td>
                        <td>{inst.telefone || '—'}</td>
                        <td><span className="adm-code-badge">{inst.codAcesso}</span></td>
                        <td className="col-actions">
                          <div className="adm-actions-group">
                            <button className="adm-btn adm-btn-approve" onClick={() => handleStatusInst(inst.id, 'aprovado')}>
                              ✓ Aceitar Pedido
                            </button>
                            <button className="adm-btn adm-btn-delete" onClick={() => handleStatusInst(inst.id, 'recusado')}>
                              ✕ Recusar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: INSTITUIÇÕES CADASTRADAS */}
        {abaAtiva === 'instituicoes' && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h3 className="adm-panel-title">Instituições Cadastradas</h3>
              <button
                className="adm-btn adm-btn-primary"
                onClick={() => setModalInst({ nome: '', email: '', telefone: '', codAcesso: '', senha: '', status: 'aprovado' })}
              >
                + Nova Instituição
              </button>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Instituição</th>
                    <th>E-mail</th>
                    <th>Código</th>
                    <th>Status</th>
                    <th className="col-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {instituicoes.map(inst => (
                    <tr key={inst.id}>
                      <td style={{ fontWeight: 700, color: '#64748b' }}>#{inst.id}</td>
                      <td style={{ fontWeight: 800, color: '#0f172a' }}>{inst.nome}</td>
                      <td>{inst.email}</td>
                      <td><span className="adm-code-badge">{inst.codAcesso}</span></td>
                      <td>
                        <span
                          className="adm-status-badge"
                          style={{
                            background: inst.status === 'aprovado' ? '#dcfce7' : inst.status === 'pendente' ? '#fef3c7' : '#fee2e2',
                            color: inst.status === 'aprovado' ? '#166534' : inst.status === 'pendente' ? '#b45309' : '#991b1b'
                          }}
                        >
                          {(inst.status || 'aprovado').toUpperCase()}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="adm-actions-group">
                          <button
                            className="adm-btn adm-btn-view"
                            onClick={() => { setInstFiltroId(inst.id); setAbaAtiva('alunos'); }}
                          >
                            👦 Ver Alunos
                          </button>
                          {inst.status !== 'aprovado' && (
                            <button
                              className="adm-btn adm-btn-approve"
                              onClick={() => handleStatusInst(inst.id, 'aprovado')}
                            >
                              ✓ Aprovar
                            </button>
                          )}
                          <button
                            className="adm-btn adm-btn-edit"
                            onClick={() => setModalInst({ ...inst, novaSenha: '' })}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="adm-btn adm-btn-delete"
                            onClick={() => excluirInstituicao(inst.id, inst.nome)}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: ALUNOS E RESPONSÁVEIS */}
        {abaAtiva === 'alunos' && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h3 className="adm-panel-title">Alunos e Responsáveis</h3>
              <div className="adm-filter-bar">
                <select
                  className="adm-select"
                  value={instFiltroId}
                  onChange={e => setInstFiltroId(e.target.value)}
                >
                  <option value="">Todas as Instituições</option>
                  {instituicoes.map(i => (
                    <option key={i.id} value={i.id}>{i.nome}</option>
                  ))}
                </select>
                <input
                  className="adm-input"
                  type="text"
                  placeholder="Buscar aluno ou responsável..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
                <button
                  className="adm-btn adm-btn-primary"
                  onClick={() => setModalAluno({
                    nomeAluno: '',
                    diagnostico: '',
                    xpTotal: 0,
                    nomeResponsavel: '',
                    emailResponsavel: '',
                    telefoneResponsavel: '',
                    senhaResponsavel: '',
                    instituicaoId: instFiltroId || ''
                  })}
                >
                  + Novo Aluno
                </button>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Aluno</th>
                    <th>Diagnóstico</th>
                    <th>XP</th>
                    <th>Responsável (E-mail)</th>
                    <th>Instituição Vinculada</th>
                    <th className="col-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.map(al => (
                    <tr key={al.id}>
                      <td style={{ fontWeight: 700, color: '#64748b' }}>#{al.id}</td>
                      <td style={{ fontWeight: 800, color: '#0f172a' }}>{al.nome}</td>
                      <td>{al.diagnostico || '—'}</td>
                      <td style={{ fontWeight: 800, color: '#0284c7' }}>{al.xpTotal} XP</td>
                      <td>
                        {al.responsavelNome ? (
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{al.responsavelNome}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{al.responsavelEmail}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Sem responsável</span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          background: al.instituicaoNome ? '#e0f2fe' : '#f1f5f9',
                          color: al.instituicaoNome ? '#0369a1' : '#64748b',
                          padding: '5px 12px',
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 800
                        }}>
                          {al.instituicaoNome || 'Não vinculado'}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="adm-actions-group">
                          <button
                            className="adm-btn adm-btn-edit"
                            onClick={() => setModalAluno({
                              id: al.id,
                              nomeAluno: al.nome,
                              diagnostico: al.diagnostico || '',
                              xpTotal: al.xpTotal || 0,
                              responsavelId: al.responsavelId,
                              nomeResponsavel: al.responsavelNome || '',
                              emailResponsavel: al.responsavelEmail || '',
                              telefoneResponsavel: al.responsavelTelefone || '',
                              instituicaoId: al.insIdAfiliacao || al.insIdDireto || ''
                            })}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="adm-btn adm-btn-delete"
                            onClick={() => excluirAluno(al.id, al.nome)}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CRIAR/EDITAR INSTITUIÇÃO */}
      {modalInst && (
        <div className="adm-modal-backdrop">
          <form onSubmit={salvarInstituicao} className="adm-modal">
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#0f172a' }}>
              {modalInst.id ? '✏️ Editar Instituição' : '🏫 Nova Instituição'}
            </h3>
            <div className="adm-field">
              <label>Nome da Instituição:</label>
              <input className="adm-input" required value={modalInst.nome} onChange={e => setModalInst({ ...modalInst, nome: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>E-mail:</label>
              <input className="adm-input" type="email" required value={modalInst.email} onChange={e => setModalInst({ ...modalInst, email: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Telefone:</label>
              <input className="adm-input" value={modalInst.telefone} onChange={e => setModalInst({ ...modalInst, telefone: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Código de Acesso:</label>
              <input className="adm-input" required value={modalInst.codAcesso} onChange={e => setModalInst({ ...modalInst, codAcesso: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Status:</label>
              <select className="adm-select" value={modalInst.status} onChange={e => setModalInst({ ...modalInst, status: e.target.value })}>
                <option value="aprovado">Aprovado</option>
                <option value="pendente">Pendente</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>
            {!modalInst.id ? (
              <div className="adm-field">
                <label>Senha:</label>
                <input className="adm-input" type="password" required value={modalInst.senha} onChange={e => setModalInst({ ...modalInst, senha: e.target.value })} />
              </div>
            ) : (
              <div className="adm-field">
                <label>Nova Senha (deixe em branco para manter):</label>
                <input className="adm-input" type="password" value={modalInst.novaSenha || ''} onChange={e => setModalInst({ ...modalInst, novaSenha: e.target.value })} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn adm-btn-edit" style={{ padding: '10px 20px' }} onClick={() => setModalInst(null)}>
                Cancelar
              </button>
              <button type="submit" className="adm-btn adm-btn-primary" style={{ padding: '10px 24px' }}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CRIAR/EDITAR ALUNO */}
      {modalAluno && (
        <div className="adm-modal-backdrop">
          <form onSubmit={salvarAluno} className="adm-modal">
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#0f172a' }}>
              {modalAluno.id ? '✏️ Editar Aluno e Vínculos' : '👦 Novo Aluno'}
            </h3>
            <div className="adm-field">
              <label>Nome do Aluno:</label>
              <input className="adm-input" required value={modalAluno.nomeAluno} onChange={e => setModalAluno({ ...modalAluno, nomeAluno: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Diagnóstico:</label>
              <input className="adm-input" value={modalAluno.diagnostico} onChange={e => setModalAluno({ ...modalAluno, diagnostico: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>XP Total:</label>
              <input className="adm-input" type="number" value={modalAluno.xpTotal} onChange={e => setModalAluno({ ...modalAluno, xpTotal: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Instituição Vinculada:</label>
              <select className="adm-select" value={modalAluno.instituicaoId} onChange={e => setModalAluno({ ...modalAluno, instituicaoId: e.target.value })}>
                <option value="">Sem instituição</option>
                {instituicoes.map(i => (
                  <option key={i.id} value={i.id}>{i.nome}</option>
                ))}
              </select>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', width: '100%', margin: '4px 0' }} />
            <div className="adm-field">
              <label>Nome do Responsável:</label>
              <input className="adm-input" value={modalAluno.nomeResponsavel} onChange={e => setModalAluno({ ...modalAluno, nomeResponsavel: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>E-mail do Responsável:</label>
              <input className="adm-input" type="email" value={modalAluno.emailResponsavel} onChange={e => setModalAluno({ ...modalAluno, emailResponsavel: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Telefone do Responsável:</label>
              <input className="adm-input" value={modalAluno.telefoneResponsavel} onChange={e => setModalAluno({ ...modalAluno, telefoneResponsavel: e.target.value })} />
            </div>
            {!modalAluno.id && (
              <div className="adm-field">
                <label>Senha do Responsável:</label>
                <input className="adm-input" type="password" minLength={8} title="Use 8 ou mais caracteres, com maiúscula, minúscula, número e símbolo." placeholder="Defina uma senha forte" autoComplete="new-password" value={modalAluno.senhaResponsavel} onChange={e => setModalAluno({ ...modalAluno, senhaResponsavel: e.target.value })} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn adm-btn-edit" style={{ padding: '10px 20px' }} onClick={() => setModalAluno(null)}>
                Cancelar
              </button>
              <button type="submit" className="adm-btn adm-btn-primary" style={{ padding: '10px 24px' }}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
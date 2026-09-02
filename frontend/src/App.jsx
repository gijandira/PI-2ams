import { useState } from 'react';
import GlobalStyle from './styles/GlobalStyle';
import PageIndex from './pages/PageIndex';
import PageLogin from './pages/PageLogin';
import PageCadastroResponsavel from './pages/PageCadastroResponsavel';
import PageCadastroInstituicao from './pages/PageCadastroInstituicao';
import PageHomeAluno from './pages/PageHomeAluno';
import PageHomeInstituicao from './pages/PageHomeInstituicao';
import PageComunicacao from './pages/PageComunicacao';
import PageAgenda from './pages/PageAgenda';
import PagePerfil from './pages/PagePerfil';
import PageConfig from './pages/PageConfig';
import PageEditarPerfil from './pages/PageEditarPerfil';
import PageAfiliacao from './pages/PageAfiliacao';
import PageDashboardAluno from './pages/PageDashboardAluno';
import PageSolicitacoesInst from './pages/PageSolicitacoesInst';
import PagePerfilInst from './pages/PagePerfilInst';
import PageConfigInst from './pages/PageConfigInst';
import PageLicoes from './pages/PageLicoes';
import PageLicaoAtividade from './pages/PageLicaoAtividade';
import PageLicaoFeedback from './pages/PageLicaoFeedback';

export default function App() {
  const [page, setPage] = useState('index');
  const navigate = (p) => setPage(p);

  return (
    <>
      <GlobalStyle />
      <div className="accent-bar"></div>
      {page === 'index'                && <PageIndex                navigate={navigate} />}
      {page === 'login'                && <PageLogin                navigate={navigate} />}
      {page === 'cadastro-responsavel' && <PageCadastroResponsavel  navigate={navigate} />}
      {page === 'cadastro-instituicao' && <PageCadastroInstituicao  navigate={navigate} />}
      {page === 'home-aluno'           && <PageHomeAluno            navigate={navigate} />}
      {page === 'home-instituicao'     && <PageHomeInstituicao      navigate={navigate} />}
      {page === 'comunicacao'          && <PageComunicacao          navigate={navigate} />}
      {page === 'agenda'               && <PageAgenda               navigate={navigate} />}
      {page === 'perfil'               && <PagePerfil               navigate={navigate} />}
      {page === 'config'               && <PageConfig               navigate={navigate} />}
      {page === 'editar-perfil'        && <PageEditarPerfil         navigate={navigate} />}
      {page === 'afiliacao'            && <PageAfiliacao            navigate={navigate} />}
      {page === 'dashboard-aluno'      && <PageDashboardAluno       navigate={navigate} />}
      {page === 'solicitacoes-inst'    && <PageSolicitacoesInst     navigate={navigate} />}
      {page === 'perfil-inst'          && <PagePerfilInst           navigate={navigate} />}
      {page === 'config-inst'          && <PageConfigInst           navigate={navigate} />}
      {page === 'licoes'               && <PageLicoes               navigate={navigate} />}
      {page === 'licao-atividade'      && <PageLicaoAtividade       navigate={navigate} />}
      {page === 'licao-feedback'       && <PageLicaoFeedback        navigate={navigate} />}
    </>
  );
}

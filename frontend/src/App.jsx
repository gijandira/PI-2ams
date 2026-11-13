import { useEffect, useState } from 'react';
import logoIcone from './assets/logo-icone.png';
import GlobalStyle from './styles/GlobalStyle';
import PageIndex from './pages/PageIndex';
import PageLogin from './pages/PageLogin';
import PageCadastroResponsavel from './pages/PageCadastroResponsavel';
import PageCadastroInstituicao from './pages/PageCadastroInstituicao';
import PageCadastroEscolha from './pages/PageCadastroEscolha';
import PageHomeAluno from './pages/PageHomeAluno';
import PageHomeInstituicao from './pages/PageHomeInstituicao';
import PageComunicacao from './pages/PageComunicacao';
import PageAgenda from './pages/PageAgenda';
import PageRecuperarSenha from './pages/PageRecuperarSenha';
import PageResetarSenha from './pages/PageResetarSenha';
import PagePerfil from './pages/PagePerfil';
import PageEditarPerfil from './pages/PageEditarPerfil';
import PageConfig from './pages/PageConfig';
import PageAssistenteIA from './pages/PageAssistenteIA';
import PageProgressoAluno from './pages/PageProgressoAluno';
import PageProgressoInst from './pages/PageProgressoInst';
import PageAfiliacao from './pages/PageAfiliacao';
import PageSolicitacoesInst from './pages/PageSolicitacoesInst';
import PagePerfilInst from './pages/PagePerfilInst';
import PageConfigInst from './pages/PageConfigInst';
import PageLicoes from './pages/PageLicoes';
import PageLicaoAtividade from './pages/PageLicaoAtividade';
import PageLicaoFeedback from './pages/PageLicaoFeedback';

const ROUTE_PATHS = {
  index: '/',
  login: '/login',
  'login-instituicao': '/login-instituicao',
  'recuperar-senha': '/recuperar-senha',
  'resetar-senha': '/resetar-senha',
  'cadastro-escolha': '/cadastro-escolha',
  'cadastro-responsavel': '/cadastro-responsavel',
  'cadastro-instituicao': '/cadastro-instituicao',
  'home-aluno': '/home-aluno',
  'home-instituicao': '/home-instituicao',
  comunicacao: '/comunicacao',
  agenda: '/agenda',
  perfil: '/perfil',
  'editar-perfil': '/editar-perfil',
  config: '/config',
  ia: '/ia',
  afiliacao: '/afiliacao',
  'solicitacoes-inst': '/solicitacoes-inst',
  'perfil-inst': '/perfil-inst',
  'config-inst': '/config-inst',
  'progresso-aluno': '/progresso-aluno',
  'progresso-inst': '/progresso-inst',
  licoes: '/licoes',
  'licao-atividade': '/licao-atividade',
  'licao-feedback': '/licao-feedback',
};

const PAGE_BY_PATH = Object.fromEntries(
  Object.entries(ROUTE_PATHS).map(([page, path]) => [path, page])
);

function normalizePage(value) {
  if (!value) return 'index';
  if (value.startsWith('/')) {
    return PAGE_BY_PATH[value] || 'index';
  }
  return value;
}

function getInitialPage() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset_token')) return 'resetar-senha';
    const pathname = window.location.pathname || '/';
    return normalizePage(pathname === '/' ? '/' : pathname);
  } catch {
    return 'index';
  }
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      setPage(getInitialPage());
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = function (nextPage) {
    const targetPage = normalizePage(nextPage);
    if (targetPage === page) return;

    setLoading(true);
    const nextPath = ROUTE_PATHS[targetPage] || '/';

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', nextPath);
    }

    window.setTimeout(() => {
      setPage(targetPage);
      setLoading(false);
    }, 400);
  };

  return (
    <>
      <GlobalStyle />
      <div className="accent-bar"></div>

      {loading && (
        <div className="autim-loading-layer">
          <div className="autim-loading-card">
            <div className="autim-loading-orb">
              <img src={logoIcone} alt="Autim" className="autim-loading-logo" />
            </div>
            <div className="autim-loading-title">Carregando...</div>
            <div className="autim-loading-bar"><span></span></div>
          </div>
        </div>
      )}

      {page === 'index'                && <PageIndex                navigate={navigate} />}
      {page === 'login'                && <PageLogin                navigate={navigate} />}
      {page === 'login-instituicao'    && <PageLogin                navigate={navigate} initialTab="instituicao" />}
      {page === 'recuperar-senha'      && <PageRecuperarSenha       navigate={navigate} />}
      {page === 'resetar-senha'        && <PageResetarSenha         navigate={navigate} />}
      {page === 'cadastro-escolha'     && <PageCadastroEscolha      navigate={navigate} />}
      {page === 'cadastro-responsavel' && <PageCadastroResponsavel  navigate={navigate} />}
      {page === 'cadastro-instituicao' && <PageCadastroInstituicao  navigate={navigate} />}
      {page === 'home-aluno'           && <PageHomeAluno            navigate={navigate} />}
      {page === 'home-instituicao'     && <PageHomeInstituicao      navigate={navigate} />}
      {page === 'comunicacao'          && <PageComunicacao          navigate={navigate} />}
      {page === 'agenda'               && <PageAgenda               navigate={navigate} />}
      {page === 'perfil'               && <PagePerfil               navigate={navigate} />}
      {page === 'editar-perfil'        && <PageEditarPerfil         navigate={navigate} />}
      {page === 'config'               && <PageConfig               navigate={navigate} />}
      {page === 'ia'                   && <PageAssistenteIA         navigate={navigate} />}
      {page === 'afiliacao'            && <PageAfiliacao            navigate={navigate} />}
      {page === 'solicitacoes-inst'    && <PageSolicitacoesInst     navigate={navigate} />}
      {page === 'perfil-inst'          && <PagePerfilInst           navigate={navigate} />}
      {page === 'config-inst'          && <PageConfigInst           navigate={navigate} />}
      {page === 'progresso-aluno'      && <PageProgressoAluno       navigate={navigate} />}
      {page === 'progresso-inst'       && <PageProgressoInst        navigate={navigate} />}
      {page === 'licoes'               && <PageLicoes               navigate={navigate} />}
      {page === 'licao-atividade'      && <PageLicaoAtividade       navigate={navigate} />}
      {page === 'licao-feedback'       && <PageLicaoFeedback        navigate={navigate} />}
    </>
  );
}
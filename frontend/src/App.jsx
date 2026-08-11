import { useState } from 'react';
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
// 1. IMPORTAÇÕES ADICIONADAS:
import PagePerfil from './pages/PagePerfil';
import PageEditarPerfil from './pages/PageEditarPerfil';
import PageConfig from './pages/PageConfig';
import PageAssistenteIA from './pages/PageAssistenteIA';

export default function App() {
  var [page, setPage] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('reset_token') ? 'resetar-senha' : 'index';
    } catch (e) {
      return 'perfil';
    }
  });

  const [loading, setLoading] = useState(false);

  var navigate = function(p) {
    if (p === page) return;
    setLoading(true);

    window.setTimeout(() => {
      setPage(p);
      setLoading(false);
    }, 500);
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
    </>
  );
}
import { useState } from 'react';
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

export default function App() {
  var [page, setPage] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('reset_token') ? 'resetar-senha' : 'index';
    } catch (e) {
      return 'index';
    }
  });
  var navigate = function(p) { setPage(p); };

  return (
    <>
      <GlobalStyle />
      <div className="accent-bar"></div>
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
    </>
  );
}

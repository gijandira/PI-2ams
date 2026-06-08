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

export default function App() {
  var [page, setPage] = useState('index');
  var navigate = function(p) { setPage(p); };

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
    </>
  );
}

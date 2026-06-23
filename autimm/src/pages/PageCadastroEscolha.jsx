import logoIcone from '../assets/logo-icone.png';

export default function PageCadastroEscolha({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 520, background: 'var(--white)', borderRadius: 28, boxShadow: '0 18px 60px rgba(0,0,0,.08)', overflow: 'hidden' }}>
        <div style={{ padding: '36px 32px', textAlign: 'center' }}>
          <img src={logoIcone} alt="Autim" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 18 }} />
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--dark)', marginBottom: 10 }}>Criar conta</div>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, margin: '0 auto 28px', maxWidth: 360 }}>Escolha seu perfil para continuar com o cadastro do responsável ou da instituição.</p>
          <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
            <button className="btn btn-blue" style={{ padding: '16px 18px', fontSize: 16 }} onClick={() => navigate('cadastro-responsavel')}>Responsável</button>
            <button className="btn btn-outline-blue" style={{ padding: '16px 18px', fontSize: 16 }} onClick={() => navigate('cadastro-instituicao')}>Instituição</button>
          </div>
          <div style={{ fontSize: 13, color: '#888' }}>Já tem conta? <span className="link" onClick={() => navigate('login')} style={{ fontWeight: 800 }}>Faça login</span></div>
        </div>
      </div>
    </div>
  );
}

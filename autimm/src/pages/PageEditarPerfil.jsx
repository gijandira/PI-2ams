import { useState, useEffect } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';
import SidebarUser from '../components/SidebarUser';

export default function PageEditarPerfil({ navigate }) {
  const [form, setForm] = useState({
    nomeAluno: '',
    dataNascimento: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    fotoUrl: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const userName = form.nomeResponsavel || 'Responsável';
  const userAvatar = userName ? userName.trim().charAt(0).toUpperCase() : 'R';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('index');
      return;
    }

    fetch('http://localhost:3001/auth/perfil-usuario', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar perfil');
        return res.json();
      })
      .then(data => {
        const usuario = data.usuario || {};
        const aluno = data.aluno || {};

        setForm({
          nomeAluno: aluno.ALU_NOME || aluno.nome || '',
          dataNascimento: aluno.ALU_DTNASC || aluno.dataNascimento || '',
          nomeResponsavel: usuario.USU_NOME || usuario.nome || '',
          telefone: usuario.USU_TELEFONE || usuario.telefone || '',
          email: usuario.USU_EMAIL || usuario.email || '',
          fotoUrl: aluno.ALU_URLAVATAR || ''
        });
      })
      .catch(error => {
        console.error('Erro ao carregar perfil:', error);
        setStatusMessage('Não foi possível carregar os dados do perfil.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (field) => (event) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview('');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setStatusMessage(null);
    setIsSaving(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('index');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nomeAluno', form.nomeAluno);
      formData.append('dataNascimento', form.dataNascimento);
      formData.append('nomeResponsavel', form.nomeResponsavel);
      formData.append('telefone', form.telefone);
      if (photoFile) {
        formData.append('fotoAluno', photoFile);
      }

      const response = await fetch('http://localhost:3001/auth/perfil-usuario', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Não foi possível salvar alterações.');
      }

      setStatusMessage('Alterações salvas com sucesso.');
      navigate('perfil');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setStatusMessage(error.message || 'Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const innerContent = (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* avatar */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'4px 0 8px' }}>
        <div style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg,#e8f4ff,#c8e8ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, position:'relative', cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,.12)', overflow:'hidden' }}>
          {photoPreview ? (
            <img src={photoPreview} alt="Foto do perfil" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          ) : form.fotoUrl ? (
            <img src={`http://localhost:3001${form.fotoUrl}`} alt="Foto do perfil" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          ) : (
            userAvatar
          )}
          <div style={{ position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, border:'2px solid #fff' }}>📷</div>
        </div>
        <label style={{ fontSize:12, fontWeight:700, color:'var(--blue)', cursor:'pointer' }}>
          Alterar foto
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display:'none' }}
          />
        </label>
      </div>

      {/* dados do aluno */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'2px 0' }}>📋 Dados do aluno</div>
      <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 3px 12px rgba(0,0,0,.07)', display:'flex', flexDirection:'column', gap:14 }}>
        <div className="field">
          <label>Nome do aluno:</label>
          <input type="text" value={form.nomeAluno} onChange={handleChange('nomeAluno')} />
        </div>
        <div className="field">
          <label>Data de nascimento:</label>
          <input type="date" value={form.dataNascimento || ''} onChange={handleChange('dataNascimento')} />
        </div>
      </div>

      {/* dados do responsável */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'2px 0' }}>👤 Dados do responsável</div>
      <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 3px 12px rgba(0,0,0,.07)', display:'flex', flexDirection:'column', gap:14 }}>
        <div className="field">
          <label>Nome do responsável:</label>
          <input type="text" value={form.nomeResponsavel} onChange={handleChange('nomeResponsavel')} />
        </div>
        <div className="field">
          <label>Telefone:</label>
          <input type="tel" value={form.telefone} onChange={handleChange('telefone')} />
        </div>
        <div className="field">
          <label>E-mail:</label>
          <input type="email" value={form.email} disabled style={{ background:'#f0f4f8', color:'#aaa', cursor:'not-allowed', borderColor:'#e8eef5' }} />
          <div style={{ fontSize:11, color:'#aaa', fontWeight:600 }}>🔒 O e-mail não pode ser alterado</div>
        </div>
      </div>

      {/* segurança */}
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', color:'#888', padding:'2px 0' }}>🔐 Segurança</div>
      <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', boxShadow:'0 3px 12px rgba(0,0,0,.07)', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>Alterar senha</div>
          <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>Última alteração há 30 dias</div>
        </div>
        <div style={{ fontSize:22, color:'#ccc' }}>›</div>
      </div>

    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .ep-mobile { display: none !important; } }
        .ep-desktop { display: none; }
        @media (min-width: 768px) { .ep-desktop { display: block !important; } }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="ep-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--blue)', padding:'4px 20px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={() => navigate('perfil')} style={{ background:'rgba(255,255,255,.2)', border:'none', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>‹</button>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Editar Perfil</div>
          <button onClick={handleSave} disabled={isSaving || loading} style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.5)', borderRadius:20, padding:'6px 14px', fontFamily:'Nunito,sans-serif', fontSize:12, fontWeight:800, color:'#fff', cursor:'pointer', whiteSpace:'nowrap' }}>{isSaving ? 'Salvando...' : 'Salvar'}</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 12px' }}>
          {loading ? <div style={{ color:'#fff', textAlign:'center', padding:24 }}>Carregando dados...</div> : innerContent}
        </div>

        <div style={{ padding:'8px 20px 28px', flexShrink:0 }}>
          {statusMessage && <div style={{ marginBottom:10, color:'#fff', textAlign:'center' }}>{statusMessage}</div>}
          <button onClick={handleSave} disabled={isSaving || loading} className="btn btn-blue">{isSaving ? 'Salvando...' : 'Salvar Alterações'}</button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="ep-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      active:false, page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      active:false, page:'agenda'      },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item active"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
          <SidebarUser />
        </nav>

        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:600 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <button onClick={() => navigate('perfil')} style={{ width:40, height:40, borderRadius:'50%', background:'#fff', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-card)', flexShrink:0 }}>‹</button>
                <div>
                  <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Editar Perfil</div>
                  <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Atualize suas informações</div>
                </div>
              </div>
              <button onClick={handleSave} disabled={isSaving || loading} className="btn btn-blue" style={{ width:'auto', padding:'12px 28px', fontSize:14 }}>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</button>
            </div>
            {loading ? <div style={{ color:'var(--dark)', textAlign:'center', padding:24 }}>Carregando dados...</div> : innerContent}
          </div>
        </div>
      </div>
    </>
  );
}
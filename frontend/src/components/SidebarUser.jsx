import { useState, useEffect } from 'react';

export default function SidebarUser() {
  const [alunoName, setAlunoName] = useState('Aluno');
  const [responsavelName, setResponsavelName] = useState('Responsável');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/auth/perfil-usuario', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const usuario = data.usuario || {};
        const aluno = data.aluno || {};
        setAlunoName(aluno.ALU_NOME || aluno.nome || 'Aluno');
        setResponsavelName(usuario.USU_NOME || usuario.nome || 'Responsável');
        setAvatarUrl(aluno.ALU_URLAVATAR || null);
      })
      .catch(() => {});
  }, []);

  const avatarImage = avatarUrl ? `http://localhost:3001${avatarUrl}` : null;
  const initial = alunoName ? alunoName.trim().charAt(0).toUpperCase() : 'A';

  return (
    <div className="sidebar-user">
      <div className="sidebar-avatar" style={{ overflow: 'hidden' }}>
        {avatarImage ? (
          <img src={avatarImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          initial
        )}
      </div>
      <div>
        <div className="sidebar-user-name">{alunoName}</div>
        <div className="sidebar-user-role">Responsável: {responsavelName}</div>
      </div>
    </div>
  );
}

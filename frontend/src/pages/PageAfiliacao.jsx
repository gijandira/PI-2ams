import { useState } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';

export default function PageAfiliacao({ navigate }) {
  const [code, setCode] = useState('');
  const [linked, setLinked] = useState(true); // mostra instituição já vinculada

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .af-mobile { display: none !important; } }
        .af-desktop { display: none; }
        @media (min-width: 768px) { .af-desktop { display: block !important; } }
        .code-input-af { flex:1; padding:14px 16px; border:2px solid #e0e8f0; border-radius:14px; font-family:'Nunito',sans-serif; font-size:16px; font-weight:800; letter-spacing:3px; text-align:center; outline:none; background:#f8fafd; text-transform:uppercase; transition:border-color .2s; }
        .code-input-af:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(72,195,120,.12); }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="af-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>
        <div style={{ background:'var(--green)', padding:'4px 20px 22px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={() => navigate('perfil')} style={{ background:'rgba(255,255,255,.2)', border:'none', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff', flex:1, textAlign:'center' }}>Afiliação</div>
          <div style={{ width:36 }}></div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 88px', display:'flex', flexDirection:'column', gap:16 }}>
          {/* ilustração */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ fontSize:64 }}>🏫</div>
            <div style={{ fontSize:17, fontWeight:900, color:'var(--dark)', textAlign:'center' }}>Conecte-se à sua instituição</div>
            <div style={{ fontSize:13, color:'#888', fontWeight:600, textAlign:'center', lineHeight:1.5 }}>Insira o código fornecido pela escola, clínica ou terapeuta para vinculá-los ao perfil do aluno.</div>
          </div>

          {/* vinculada */}
          {linked && (
            <div style={{ background:'#fff', borderRadius:20, padding:16, boxShadow:'0 4px 14px rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:14, border:'2px solid var(--green)' }}>
              <div style={{ width:52, height:52, borderRadius:16, background:'#edfaf3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>🏥</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:900, color:'var(--dark)' }}>Instituto Inclusão</div>
                <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>Vinculado desde Jan/2024</div>
                <span style={{ display:'inline-block', background:'#edfaf3', color:'var(--green)', fontSize:11, fontWeight:900, borderRadius:10, padding:'2px 10px', marginTop:4 }}>✅ Ativo</span>
              </div>
              <button onClick={() => setLinked(false)} style={{ fontSize:12, color:'var(--red)', fontWeight:800, background:'none', border:'none', cursor:'pointer' }}>Desvincular</button>
            </div>
          )}

          {/* campo de código */}
          <div style={{ background:'#fff', borderRadius:20, padding:20, boxShadow:'0 4px 14px rgba(0,0,0,.08)', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#555' }}>Adicionar nova instituição:</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="code-input-af" type="text" placeholder="CÓDIGO" maxLength={12} value={code} onChange={e => setCode(e.target.value.toUpperCase())} />
              <button style={{ padding:'14px 20px', background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(72,195,120,.4)', whiteSpace:'nowrap' }}>Conectar</button>
            </div>
          </div>

          {/* info */}
          <div style={{ background:'#e8f4ff', borderRadius:16, padding:'14px 16px', display:'flex', gap:10 }}>
            <div style={{ fontSize:20, flexShrink:0 }}>ℹ️</div>
            <div style={{ fontSize:12, color:'#1a5e8a', fontWeight:700, lineHeight:1.5 }}>Ao se afiliar, os profissionais da instituição poderão acompanhar o progresso do aluno e enviar atividades personalizadas.</div>
          </div>
        </div>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item" onClick={() => navigate('agenda')}><div className="nav-icon"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item" onClick={() => navigate('perfil')}><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="af-desktop">
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      page:'home-aluno'  },
            { icon:<IconChat/>,     label:'Comunicação', page:'comunicacao' },
            { icon:<IconSchool/>,   label:'Lições',      page:null          },
            { icon:<IconCalendar/>, label:'Agenda',      page:'agenda'      },
          ].map((item,i) => (
            <div key={i} className="sidebar-nav-item" onClick={() => item.page && navigate(item.page)}>{item.icon}{item.label}</div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item active"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item" onClick={() => navigate('config')}><IconSettings />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">J</div>
            <div><div className="sidebar-user-name">João Pedro</div><div className="sidebar-user-role">Responsável</div></div>
          </div>
        </nav>
        <div className="main-content">
          <div className="page-wrapper" style={{ maxWidth:640 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button onClick={() => navigate('perfil')} style={{ width:40, height:40, borderRadius:'50%', background:'#fff', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-card)' }}>‹</button>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Afiliação</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Vincule o aluno a uma instituição</div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fff', borderRadius:24, padding:32, boxShadow:'var(--shadow-card)', display:'flex', flexDirection:'column', alignItems:'center', gap:12, textAlign:'center' }}>
                <div style={{ fontSize:64 }}>🏫</div>
                <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>Conecte-se à sua instituição</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, lineHeight:1.6, maxWidth:420 }}>Insira o código fornecido pela escola, clínica ou terapeuta para vinculá-los ao perfil do aluno.</div>
              </div>

              {linked && (
                <div style={{ background:'#fff', borderRadius:20, padding:20, boxShadow:'var(--shadow-card)', display:'flex', alignItems:'center', gap:16, border:'2px solid var(--green)' }}>
                  <div style={{ width:60, height:60, borderRadius:18, background:'#edfaf3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>🏥</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:900, color:'var(--dark)' }}>Instituto Inclusão</div>
                    <div style={{ fontSize:13, color:'#888', fontWeight:600, marginTop:3 }}>Vinculado desde Jan/2024</div>
                    <span style={{ display:'inline-block', background:'#edfaf3', color:'var(--green)', fontSize:12, fontWeight:900, borderRadius:10, padding:'3px 12px', marginTop:6 }}>✅ Ativo</span>
                  </div>
                  <button onClick={() => setLinked(false)} style={{ fontSize:13, color:'var(--red)', fontWeight:800, background:'none', border:'2px solid var(--red)', borderRadius:12, padding:'8px 16px', cursor:'pointer' }}>Desvincular</button>
                </div>
              )}

              <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'var(--shadow-card)', display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#555' }}>Adicionar nova instituição:</div>
                <div style={{ display:'flex', gap:10 }}>
                  <input className="code-input-af" type="text" placeholder="CÓDIGO DA INSTITUIÇÃO" maxLength={12} value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ flex:1 }} />
                  <button style={{ padding:'14px 24px', background:'var(--green)', color:'#fff', border:'none', borderRadius:14, fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(72,195,120,.4)', whiteSpace:'nowrap' }}>Conectar</button>
                </div>
              </div>

              <div style={{ background:'#e8f4ff', borderRadius:16, padding:'16px 20px', display:'flex', gap:12 }}>
                <div style={{ fontSize:22 }}>ℹ️</div>
                <div style={{ fontSize:13, color:'#1a5e8a', fontWeight:700, lineHeight:1.6 }}>Ao se afiliar, os profissionais da instituição poderão acompanhar o progresso do aluno e enviar atividades personalizadas.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
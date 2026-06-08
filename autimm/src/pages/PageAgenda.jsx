import { useState, useEffect } from 'react';
import logoIcone from '../assets/logo-icone.png';
import { IconHome, IconChat, IconSchool, IconCalendar, IconPerson, IconSettings } from '../components/icons';

// Função para gerar dias da semana (segunda a domingo)
function generateWeekDays(weekOffset = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda...
  
  // Calcular a segunda-feira da semana (0 = segunda, 6 = domingo)
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(diff);
  
  // Adicionar offset de semanas
  startOfWeek.setDate(startOfWeek.getDate() + (weekOffset * 7));
  
  const days = [];
  const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    
    days.push({
      name: dayNames[i],
      num: date.getDate(),
      month: monthNames[date.getMonth()],
      hasEvent: false,
      dayIndex: i,
      fullDate: date
    });
  }
  
  return days;
}

const ALL_EVENTS = [];
  // Array vazio - todos os eventos virão do banco de dados

function EventCard({ ev, onClick }) {
  return (
    <div style={{
      background:'#fff', borderRadius:18, padding:'14px 16px',
      display:'flex', alignItems:'center', gap:14,
      boxShadow:'0 3px 12px rgba(0,0,0,.07)', cursor:'pointer',
      borderLeft:`5px solid ${ev.accent}`,
      transition:'transform .15s',
    }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
      onMouseLeave={e => e.currentTarget.style.transform='none'}
    >
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', fontSize:12, fontWeight:900, color:'#888', flexShrink:0, width:42 }}>
        <span style={{ fontSize:16, fontWeight:900, color:'var(--dark)' }}>{ev.hour}</span>
        <span>:{ev.min}</span>
      </div>
      <div style={{ width:42, height:42, borderRadius:14, background:ev.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{ev.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--dark)' }}>{ev.title}</div>
        <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:2 }}>{ev.sub}</div>
        <span style={{ fontSize:10, fontWeight:800, borderRadius:8, padding:'2px 8px', marginTop:4, display:'inline-block', background:ev.tagBg, color:ev.tagColor }}>{ev.tag}</span>
      </div>
    </div>
  );
}

function EventModal({ event, onClose }) {
  if (!event) return null;
  
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex',
      alignItems:'flex-end', zIndex:1000
    }}>
      <div style={{
        background:'#fff', width:'100%', borderRadius:'24px 24px 0 0',
        padding:'28px 24px', maxHeight:'80vh', overflowY:'auto'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:24 }}>
          <div>
            <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>{event.title}</div>
            <div style={{ fontSize:12, color:'#888', fontWeight:600, marginTop:4 }}>Detalhes do evento</div>
          </div>
          <button onClick={onClose} style={{
            width:40, height:40, borderRadius:'50%', background:'#f0f0f0',
            border:'none', cursor:'pointer', fontSize:20, display:'flex',
            alignItems:'center', justifyContent:'center'
          }}>✕</button>
        </div>
        
        <div style={{ background:'var(--bg)', borderRadius:16, padding:20, marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
            <div style={{ width:60, height:60, borderRadius:16, background:event.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>{event.icon}</div>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'var(--dark)' }}>{event.hour}:{event.min}</div>
              <span style={{ fontSize:12, fontWeight:800, borderRadius:8, padding:'4px 12px', display:'inline-block', background:event.tagBg, color:event.tagColor, marginTop:8 }}>{event.tag}</span>
            </div>
          </div>
          
          <div style={{ borderTop:'1px solid #e0e0e0', paddingTop:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase', marginBottom:6 }}>Local</div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--dark)' }}>{event.sub}</div>
          </div>
        </div>
        
        <button onClick={onClose} style={{
          width:'100%', padding:16, background:'var(--blue)', color:'#fff',
          border:'none', borderRadius:14, fontSize:15, fontWeight:800,
          cursor:'pointer'
        }}>Fechar</button>
      </div>
    </div>
  );
}

function NewEventModal({ onClose, onSaveEvent, alunoId }) {
  const [form, setForm] = useState({ 
    titulo:'', 
    descricao:'', 
    dataInicio:'', 
    horaInicio:'', 
    dataFim:'', 
    horaFim:'',
    etiqueta:'licao' 
  });
  const [loading, setLoading] = useState(false);

  const tagColors = {
    licao: { bg:'#edfaf3', color:'#48c378', icon:'🎓' },
    terapia: { bg:'#e8f4ff', color:'#38a7fb', icon:'🏥' },
    saude: { bg:'#fff8e1', color:'#e0a000', icon:'💊' },
    esporte: { bg:'#f5eeec', color:'#a1887f', icon:'🏃' },
    lazer: { bg:'#fff0f7', color:'#e9589a', icon:'🎨' }
  };
  
  const currentTag = tagColors[form.etiqueta];

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.dataInicio || !form.horaInicio || !form.dataFim || !form.horaFim) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!alunoId) {
      alert('Erro: ID do aluno não encontrado. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      const dataInicioDateTime = `${form.dataInicio} ${form.horaInicio}`;
      const dataFimDateTime = `${form.dataFim} ${form.horaFim}`;

      const response = await fetch('http://localhost:3001/evento/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alunoId: alunoId,
          titulo: form.titulo,
          descricao: form.descricao,
          dataInicio: dataInicioDateTime,
          dataFim: dataFimDateTime,
          etiqueta: form.etiqueta
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar evento');
      }

      const data = await response.json();
      
      // Callback para atualizar a lista
      onSaveEvent({
        EVE_ID: data.eventoId,
        EVE_TITULO: form.titulo,
        EVE_DESCRICAO: form.descricao,
        EVE_DT_INICIO: dataInicioDateTime,
        EVE_DT_FIM: dataFimDateTime,
        EVE_ETIQUETA: form.etiqueta
      });

      onClose();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar evento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.6)', display:'flex',
      alignItems:'flex-end', zIndex:1000, backdropFilter:'blur(4px)'
    }}>
      <div style={{
        background:'#fff', width:'100%', borderRadius:'28px 28px 0 0',
        padding:0, maxHeight:'85vh', overflowY:'auto',
        boxShadow:'0 -8px 40px rgba(0,0,0,.15)'
      }}>
        {/* Header com Gradiente */}
        <div style={{
          background:'linear-gradient(135deg, #38a7fb 0%, #48c378 50%, #fdbe2d 100%)',
          padding:'20px 20px 14px',
          borderRadius:'28px 28px 0 0',
          position:'relative',
          overflow:'hidden'
        }}>
          <div style={{
            position:'absolute', top:0, right:0, width:'120px', height:'120px',
            background:'rgba(255,255,255,.1)', borderRadius:'50%', transform:'translate(40%, -40%)'
          }}></div>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'start',
            position:'relative', zIndex:2
          }}>
            <div>
              <div style={{ fontSize:24, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
                📅 Novo Evento
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.85)', fontWeight:600, marginTop:4 }}>
                Crie um novo compromisso
              </div>
            </div>
            <button onClick={onClose} style={{
              width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.25)',
              border:'none', cursor:'pointer', fontSize:18, display:'flex',
              alignItems:'center', justifyContent:'center', color:'#fff',
              transition:'all .2s', backdropFilter:'blur(10px)'
            }} onMouseEnter={e => e.target.style.background='rgba(255,255,255,.35)'}
               onMouseLeave={e => e.target.style.background='rgba(255,255,255,.25)'}>
              ✕
            </button>
          </div>
        </div>
        
        <div style={{ padding:'16px 18px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Título */}
            <div>
              <label style={{ fontSize:12, fontWeight:900, color:'var(--dark)', textTransform:'uppercase', letterSpacing:0.5, display:'flex', alignItems:'center', gap:5 }}>
                📝 Título <span style={{ color:'#e94542' }}>*</span>
              </label>
              <input type="text" placeholder="Ex: Consulta médica" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} style={{
                width:'100%', padding:'11px 14px', borderRadius:'12px', border:'2px solid #e0e8f0', 
                marginTop:6, fontSize:13, fontFamily:'Nunito', boxSizing:'border-box',
                background:'#f8fafd', transition:'all .2s', color:'var(--dark)',
                outline:'none'
              }} onFocus={e => e.target.style.borderColor='#38a7fb'} 
                 onBlur={e => e.target.style.borderColor='#e0e8f0'} />
            </div>
            
            {/* Descrição */}
            <div>
              <label style={{ fontSize:12, fontWeight:900, color:'var(--dark)', textTransform:'uppercase', letterSpacing:0.5, display:'flex', alignItems:'center', gap:5 }}>
                ✍️ Descrição
              </label>
              <textarea placeholder="Ex: Consulta com o Dr. Carlos na sala 3" value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} style={{
                width:'100%', padding:'11px 14px', borderRadius:'12px', border:'2px solid #e0e8f0',
                marginTop:6, fontSize:13, fontFamily:'Nunito', minHeight:70, resize:'none', boxSizing:'border-box',
                background:'#f8fafd', transition:'all .2s', color:'var(--dark)', outline:'none'
              }} onFocus={e => e.target.style.borderColor='#48c378'}
                 onBlur={e => e.target.style.borderColor='#e0e8f0'} />
            </div>

            {/* Etiqueta */}
            <div>
              <label style={{ fontSize:12, fontWeight:900, color:'var(--dark)', textTransform:'uppercase', letterSpacing:0.5, display:'flex', alignItems:'center', gap:5 }}>
                🏷️ Tipo <span style={{ color:'#e94542' }}>*</span>
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(75px, 1fr))', gap:8, marginTop:8 }}>
                {Object.entries(tagColors).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setForm({...form, etiqueta: key})}
                    style={{
                      padding:'10px 8px', borderRadius:'12px', border:'2px solid',
                      borderColor: form.etiqueta === key ? val.color : '#e0e8f0',
                      background: form.etiqueta === key ? val.bg : '#fff',
                      cursor:'pointer', fontSize:10, fontWeight:800, fontFamily:'Nunito',
                      color: val.color, textTransform:'uppercase', letterSpacing:0.4,
                      transition:'all .2s', display:'flex', flexDirection:'column', alignItems:'center', gap:4
                    }}
                  >
                    <span style={{ fontSize:18 }}>{val.icon}</span>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Data e Hora Início */}
            <div>
              <label style={{ fontSize:12, fontWeight:900, color:'var(--dark)', textTransform:'uppercase', letterSpacing:0.5, display:'flex', alignItems:'center', gap:5 }}>
                ⏰ Início <span style={{ color:'#e94542' }}>*</span>
              </label>
              <div style={{ display:'flex', gap:10, marginTop:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:'#888', fontWeight:700, marginBottom:3 }}>Data</div>
                  <input type="date" value={form.dataInicio} onChange={(e) => setForm({...form, dataInicio: e.target.value})} style={{
                    width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #e0e8f0',
                    fontSize:12, fontFamily:'Nunito', boxSizing:'border-box', background:'#f8fafd',
                    transition:'all .2s', color:'var(--dark)', outline:'none'
                  }} onFocus={e => e.target.style.borderColor='#38a7fb'}
                     onBlur={e => e.target.style.borderColor='#e0e8f0'} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:'#888', fontWeight:700, marginBottom:3 }}>Hora</div>
                  <input type="time" value={form.horaInicio} onChange={(e) => setForm({...form, horaInicio: e.target.value})} style={{
                    width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #e0e8f0',
                    fontSize:12, fontFamily:'Nunito', boxSizing:'border-box', background:'#f8fafd',
                    transition:'all .2s', color:'var(--dark)', outline:'none'
                  }} onFocus={e => e.target.style.borderColor='#38a7fb'}
                     onBlur={e => e.target.style.borderColor='#e0e8f0'} />
                </div>
              </div>
            </div>

            {/* Data e Hora Fim */}
            <div>
              <label style={{ fontSize:12, fontWeight:900, color:'var(--dark)', textTransform:'uppercase', letterSpacing:0.5, display:'flex', alignItems:'center', gap:5 }}>
                🏁 Fim <span style={{ color:'#e94542' }}>*</span>
              </label>
              <div style={{ display:'flex', gap:10, marginTop:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:'#888', fontWeight:700, marginBottom:3 }}>Data</div>
                  <input type="date" value={form.dataFim} onChange={(e) => setForm({...form, dataFim: e.target.value})} style={{
                    width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #e0e8f0',
                    fontSize:12, fontFamily:'Nunito', boxSizing:'border-box', background:'#f8fafd',
                    transition:'all .2s', color:'var(--dark)', outline:'none'
                  }} onFocus={e => e.target.style.borderColor='#48c378'}
                     onBlur={e => e.target.style.borderColor='#e0e8f0'} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:'#888', fontWeight:700, marginBottom:3 }}>Hora</div>
                  <input type="time" value={form.horaFim} onChange={(e) => setForm({...form, horaFim: e.target.value})} style={{
                    width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #e0e8f0',
                    fontSize:12, fontFamily:'Nunito', boxSizing:'border-box', background:'#f8fafd',
                    transition:'all .2s', color:'var(--dark)', outline:'none'
                  }} onFocus={e => e.target.style.borderColor='#48c378'}
                     onBlur={e => e.target.style.borderColor='#e0e8f0'} />
                </div>
              </div>
            </div>

            {/* Preview da Etiqueta */}
            {form.titulo && (
              <div style={{
                background: currentTag.bg, borderRadius:'12px', padding:'12px',
                marginTop:4, display:'flex', alignItems:'center', gap:10,
                border:`2px solid ${currentTag.color}20`
              }}>
                <span style={{ fontSize:22 }}>{currentTag.icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:900, color: currentTag.color }}>
                    {form.titulo}
                  </div>
                  <div style={{ fontSize:10, color:'#888', fontWeight:700, marginTop:1 }}>
                    {form.dataInicio ? new Date(form.dataInicio).toLocaleDateString('pt-BR') : 'Data não definida'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão Salvar */}
          <button onClick={handleSave} disabled={loading} style={{
            width:'100%', padding:14, background:'linear-gradient(135deg, #38a7fb 0%, #48c378 100%)',
            color:'#fff', border:'none', borderRadius:'14px', fontSize:13, fontWeight:900,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop:16, letterSpacing:0.8, textTransform:'uppercase',
            boxShadow:'0 8px 24px rgba(56,167,251,.35)', transition:'all .2s', opacity: loading ? 0.7 : 1,
            display:'flex', alignItems:'center', justifyContent:'center', gap:6
          }} onMouseEnter={e => {
            if (!loading) {
              e.target.style.transform='translateY(-2px)';
              e.target.style.boxShadow='0 12px 32px rgba(56,167,251,.45)';
            }
          }} onMouseLeave={e => {
            if (!loading) {
              e.target.style.transform='translateY(0)';
              e.target.style.boxShadow='0 8px 24px rgba(56,167,251,.35)';
            }
          }}>
            {loading ? '⏳ Salvando...' : '✓ Salvar Evento'}
          </button>

          <div style={{ height:12 }}></div>
        </div>
      </div>
    </div>
  );
}

export default function PageAgenda({ navigate }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const DAYS = generateWeekDays(weekOffset);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [userClicked, setUserClicked] = useState(false);
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [alunoId, setAlunoId] = useState(null);

  // Carregar eventos e dados do usuário
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const aluId = localStorage.getItem('alunoId');
    
    if (userData.nome) {
      setUserName(userData.nome);
    }
    if (aluId) {
      setAlunoId(parseInt(aluId));
      carregarEventos(aluId);
    } else {
      setLoading(false);
    }
  }, []);

  const carregarEventos = async (alunoId) => {
    try {
      const response = await fetch(`http://localhost:3001/evento/listar?alunoId=${alunoId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Converte eventos do banco para o formato visual
        const eventosFormatados = data.eventos.map(ev => {
          const dataInicio = new Date(ev.EVE_DT_INICIO);
          const dayIndex = dataInicio.getDay() === 0 ? 6 : dataInicio.getDay() - 1;
          const hour = String(dataInicio.getHours()).padStart(2, '0');
          const min = String(dataInicio.getMinutes()).padStart(2, '0');

          const tagColors = {
            licao: { bg:'#edfaf3', color:'#48c378', icon:'🎓' },
            terapia: { bg:'#e8f4ff', color:'#38a7fb', icon:'🏥' },
            saude: { bg:'#fff8e1', color:'#e0a000', icon:'💊' },
            esporte: { bg:'#f5eeec', color:'#a1887f', icon:'🏃' },
            lazer: { bg:'#fff0f7', color:'#e9589a', icon:'🎨' }
          };
          
          const tag = tagColors[ev.EVE_ETIQUETA] || tagColors.licao;

          return {
            EVE_ID: ev.EVE_ID,
            dayIndex,
            hour,
            min,
            icon: tag.icon,
            iconBg: tag.bg,
            title: ev.EVE_TITULO,
            sub: ev.EVE_DESCRICAO || '(sem descrição)',
            tag: ev.EVE_ETIQUETA.charAt(0).toUpperCase() + ev.EVE_ETIQUETA.slice(1),
            tagBg: tag.bg,
            tagColor: tag.color,
            accent: tag.color
          };
        });
        
        setDatabaseEvents(eventosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const allEvents = [...ALL_EVENTS, ...databaseEvents];

  // Lógica de filtragem de eventos
  let eventsToday, eventsTomorrow, dayName, dayDate, dayMonth, tomorrowName, tomorrowDate, tomorrowMonth, showTomorrow;

  if (!userClicked) {
    // Modo padrão (primeira vez): segunda + terça
    eventsToday = allEvents.filter(ev => ev.dayIndex === 0).sort((a, b) => {
      const timeA = parseInt(a.hour) * 60 + parseInt(a.min);
      const timeB = parseInt(b.hour) * 60 + parseInt(b.min);
      return timeA - timeB;
    });
    eventsTomorrow = allEvents.filter(ev => ev.dayIndex === 1).sort((a, b) => {
      const timeA = parseInt(a.hour) * 60 + parseInt(a.min);
      const timeB = parseInt(b.hour) * 60 + parseInt(b.min);
      return timeA - timeB;
    });
    dayName = DAYS[0].name;
    dayDate = DAYS[0].num;
    dayMonth = DAYS[0].month.toUpperCase();
    tomorrowName = DAYS[1].name;
    tomorrowDate = DAYS[1].num;
    tomorrowMonth = DAYS[1].month.toUpperCase();
    showTomorrow = true;
  } else {
    // Modo customizado: só o dia clicado
    eventsToday = allEvents.filter(ev => ev.dayIndex === activeDay).sort((a, b) => {
      const timeA = parseInt(a.hour) * 60 + parseInt(a.min);
      const timeB = parseInt(b.hour) * 60 + parseInt(b.min);
      return timeA - timeB;
    });
    eventsTomorrow = [];
    dayName = DAYS[activeDay].name;
    dayDate = DAYS[activeDay].num;
    dayMonth = DAYS[activeDay].month.toUpperCase();
    tomorrowName = '';
    tomorrowDate = '';
    tomorrowMonth = '';
    showTomorrow = false;
  }

  const handleDayClick = (dayIndex) => {
    setActiveDay(dayIndex);
    setUserClicked(true);
  }

  const handleNewEvent = (eventData) => {
    // Recarrega os eventos do banco de dados
    if (alunoId) {
      carregarEventos(alunoId);
    }
    // Navega automaticamente para o dia do novo evento
    const dataInicio = new Date(eventData.EVE_DT_INICIO);
    const dayIndex = dataInicio.getDay() === 0 ? 6 : dataInicio.getDay() - 1;
    setActiveDay(dayIndex);
    setUserClicked(true);
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .ag-mobile { display: none !important; } }
        .ag-desktop { display: none; }
        @media (min-width: 768px) { .ag-desktop { display: block !important; } }

        .day-pill { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 12px; border-radius:16px; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .day-pill.active { background:#fff; }
        .day-name-txt { font-size:10px; font-weight:800; color:rgba(255,255,255,.7); text-transform:uppercase; letter-spacing:.5px; }
        .day-pill.active .day-name-txt { color:var(--blue); }
        .day-num-txt { font-size:18px; font-weight:900; color:#fff; }
        .day-pill.active .day-num-txt { color:var(--dark); }
        .day-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.4); }
        .day-pill.has-event .day-dot { background:var(--yellow); }

        .day-pill-desk { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 16px; border-radius:16px; cursor:pointer; transition:all .2s; flex-shrink:0; border:2px solid transparent; }
        .day-pill-desk.active { background:var(--blue); }
        .day-pill-desk:not(.active):hover { border-color:var(--border); background:#f8fafd; }
        .day-name-desk { font-size:11px; font-weight:800; color:#aaa; text-transform:uppercase; }
        .day-pill-desk.active .day-name-desk { color:rgba(255,255,255,.8); }
        .day-num-desk { font-size:20px; font-weight:900; color:var(--dark); }
        .day-pill-desk.active .day-num-desk { color:#fff; }
        .day-dot-desk { width:6px; height:6px; border-radius:50%; background:transparent; }
        .day-pill-desk.has-event .day-dot-desk { background:var(--yellow); }
        .day-pill-desk.active.has-event .day-dot-desk { background:rgba(255,255,255,.8); }

        .date-label { font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#888; padding:0 4px; }
        .fab-btn { position:fixed; bottom:88px; right:20px; width:52px; height:52px; border-radius:50%; background:var(--blue); border:none; display:flex; align-items:center; justify-content:center; font-size:26px; cursor:pointer; box-shadow:0 6px 20px rgba(56,167,251,.5); transition:transform .15s; z-index:5; color:#fff; line-height:1; }
        .fab-btn:hover { transform:scale(1.08); }
        .fab-btn-desk { display:flex; align-items:center; gap:8px; padding:12px 20px; background:var(--blue); border:none; border-radius:14px; color:#fff; font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 4px 14px rgba(56,167,251,.4); transition:transform .15s,box-shadow .15s; }
        .fab-btn-desk:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(56,167,251,.5); }
      `}</style>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showNewEvent && <NewEventModal onClose={() => setShowNewEvent(false)} onSaveEvent={handleNewEvent} alunoId={alunoId} />}

      {/* ── MOBILE ── */}
      <div className="ag-mobile" style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:60 }}>

        {/* header azul com mini calendário */}
        <div style={{ marginTop:-55, background:'var(--blue)', padding:'6px 20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 3px 12px rgba(0,0,0,.2)' }}>
            <img src={logoIcone} alt="Autim" style={{ width:42, height:42, objectFit:'contain' }} />
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff' }}>Agenda</div>
          {/* controles de semana */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:12, paddingTop:8 }}>
            <button 
              onClick={() => setWeekOffset(weekOffset - 1)}
              style={{
                width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.25)', border:'none',
                cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s', color:'#fff', fontWeight:900, backdropFilter:'blur(10px)'
              }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,.35)'}
              onMouseLeave={e => e.target.style.background='rgba(255,255,255,.25)'}
            >‹</button>
            
            <button 
              onClick={() => setWeekOffset(0)}
              style={{
                padding:'6px 12px', borderRadius:'8px', border:'none',
                cursor:'pointer', fontSize:12, fontWeight:700, backdropFilter:'blur(10px)',
                background: weekOffset === 0 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.15)', 
                color: '#fff',
                transition:'all .2s'
              }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,.35)'}
              onMouseLeave={e => e.target.style.background = weekOffset === 0 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.15)'}
            >Hoje</button>
            
            <button 
              onClick={() => setWeekOffset(weekOffset + 1)}
              style={{
                width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.25)', border:'none',
                cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s', color:'#fff', fontWeight:900, backdropFilter:'blur(10px)'
              }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,.35)'}
              onMouseLeave={e => e.target.style.background='rgba(255,255,255,.25)'}
            >›</button>
          </div>
          {/* mini cal */}
          <div style={{ display:'flex', gap:6, overflowX:'auto', width:'100%', justifyContent:'center' }}>
            {DAYS.map((d, i) => (
              <div key={i} className={`day-pill ${i===activeDay && userClicked?'active':''} ${d.hasEvent?'has-event':''}`} onClick={() => handleDayClick(i)}>
                <div className="day-name-txt">{d.name}</div>
                <div className="day-num-txt">{d.num}</div>
                <div className="day-dot"></div>
              </div>
            ))}
          </div>
        </div>

        {/* events list */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 88px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* DIA SELECIONADO */}
          <div>
            <div className="date-label" style={{ marginBottom:10 }}>{dayName.toUpperCase()} — {dayDate} DE {dayMonth}</div>
            {eventsToday.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {eventsToday.map((ev,i) => <EventCard key={i} ev={ev} onClick={() => setSelectedEvent(ev)} />)}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'16px', color:'#999', fontSize:12, fontWeight:600 }}>
                Nenhum evento para este dia
              </div>
            )}
          </div>

          {/* PRÓXIMO DIA */}
          {showTomorrow && (
            <div>
              <div className="date-label" style={{ marginBottom:10 }}>{tomorrowName.toUpperCase()} — {tomorrowDate} DE {tomorrowMonth}</div>
              {eventsTomorrow.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {eventsTomorrow.map((ev,i) => <EventCard key={i} ev={ev} onClick={() => setSelectedEvent(ev)} />)}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'16px', color:'#999', fontSize:12, fontWeight:600 }}>
                  Nenhum evento para este dia
                </div>
              )}
            </div>
          )}
        </div>

        <button className="fab-btn" onClick={() => setShowNewEvent(true)}>＋</button>

        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => navigate('home-aluno')}><div className="nav-icon"><IconHome /></div><div className="nav-label">Início</div></div>
          <div className="nav-item" onClick={() => navigate('comunicacao')}><div className="nav-icon"><IconChat /></div><div className="nav-label">Comunicar</div></div>
          <div className="nav-item"><div className="nav-icon"><IconSchool /></div><div className="nav-label">Lições</div></div>
          <div className="nav-item active"><div className="nav-icon active"><IconCalendar /></div><div className="nav-label">Agenda</div></div>
          <div className="nav-item"><div className="nav-icon"><IconPerson /></div><div className="nav-label">Perfil</div></div>
        </nav>
      </div>

      {/* ── DESKTOP ── */}
      <div className="ag-desktop" style={{ display:'none' }}>
        <nav className="desktop-sidebar">
          <div className="sidebar-logo">
            <img src={logoIcone} alt="Autim" style={{ width:28, height:28, objectFit:'contain' }} />
            <span className="sidebar-logo-name">Autim</span>
          </div>
          {[
            { icon:<IconHome/>,     label:'Início',      active:false, page:'home-aluno'   },
            { icon:<IconChat/>,     label:'Comunicação', active:false, page:'comunicacao'  },
            { icon:<IconSchool/>,   label:'Lições',      active:false, page:null           },
            { icon:<IconCalendar/>, label:'Agenda',      active:true,  page:'agenda'       },
          ].map((item,i) => (
            <div key={i} className={`sidebar-nav-item ${item.active?'active':''}`} onClick={() => item.page && navigate(item.page)}>
              {item.icon}{item.label}
            </div>
          ))}
          <div className="sidebar-spacer"></div>
          <div className="sidebar-nav-item"><IconPerson />Perfil</div>
          <div className="sidebar-nav-item"><IconSettings />Configurações</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div><div className="sidebar-user-name">{userName}</div><div className="sidebar-user-role">Responsável</div></div>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-wrapper">

            {/* top row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:28, fontWeight:900, color:'var(--dark)' }}>Agenda</div>
                <div style={{ fontSize:14, color:'#888', fontWeight:600, marginTop:4 }}>Acompanhe compromissos e atividades</div>
              </div>
              <button className="fab-btn-desk" onClick={() => setShowNewEvent(true)}>＋ Novo evento</button>
            </div>

            {/* week strip */}
            <div style={{ background:'#fff', borderRadius:20, padding:'20px 24px', boxShadow:'var(--shadow-card)', marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:1 }}>
                  {DAYS[0].num} — {DAYS[6].num} de {DAYS[6].month}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button 
                    onClick={() => setWeekOffset(weekOffset - 1)}
                    style={{
                      width:32, height:32, borderRadius:'50%', background:'#f0f0f0', border:'none',
                      cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .2s', color:'#666', fontWeight:900
                    }}
                    onMouseEnter={e => { e.target.style.background='#e0e0e0'; e.target.style.transform='scale(1.1)'; }}
                    onMouseLeave={e => { e.target.style.background='#f0f0f0'; e.target.style.transform='none'; }}
                  >‹</button>
                  
                  <button 
                    onClick={() => setWeekOffset(0)}
                    style={{
                      padding:'6px 12px', borderRadius:'8px', border:'none',
                      cursor:'pointer', fontSize:12, fontWeight:700,
                      background: weekOffset === 0 ? '#38a7fb' : '#f0f0f0', 
                      color: weekOffset === 0 ? '#fff' : '#666',
                      transition:'all .2s'
                    }}
                    onMouseEnter={e => { if(weekOffset !== 0) e.target.style.background='#e0e0e0'; }}
                    onMouseLeave={e => { if(weekOffset !== 0) e.target.style.background='#f0f0f0'; }}
                  >Hoje</button>
                  
                  <button 
                    onClick={() => setWeekOffset(weekOffset + 1)}
                    style={{
                      width:32, height:32, borderRadius:'50%', background:'#f0f0f0', border:'none',
                      cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .2s', color:'#666', fontWeight:900
                    }}
                    onMouseEnter={e => { e.target.style.background='#e0e0e0'; e.target.style.transform='scale(1.1)'; }}
                    onMouseLeave={e => { e.target.style.background='#f0f0f0'; e.target.style.transform='none'; }}
                  >›</button>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
                {DAYS.map((d, i) => (
                  <div key={i} className={`day-pill-desk ${i===activeDay && userClicked?'active':''} ${d.hasEvent?'has-event':''}`} onClick={() => handleDayClick(i)}>
                    <div className="day-name-desk">{d.name}</div>
                    <div className="day-num-desk">{d.num}</div>
                    <div className="day-dot-desk"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* events list */}
            <div>
              {/* DIA SELECIONADO */}
              <div style={{ marginBottom: showTomorrow ? 32 : 0 }}>
                <div className="date-label" style={{ marginBottom:12 }}>{dayName.toUpperCase()} — {dayDate} DE {dayMonth}</div>
                {eventsToday.length > 0 ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {eventsToday.map((ev,i) => <EventCard key={i} ev={ev} onClick={() => setSelectedEvent(ev)} />)}
                  </div>
                ) : (
                  <div style={{ textAlign:'center', padding:'32px 16px', color:'#999', fontSize:14, fontWeight:600 }}>
                    Nenhum evento para este dia
                  </div>
                )}
              </div>

              {/* PRÓXIMO DIA */}
              {showTomorrow && (
                <div>
                  <div className="date-label" style={{ marginBottom:12 }}>{tomorrowName.toUpperCase()} — {tomorrowDate} DE {tomorrowMonth}</div>
                  {eventsTomorrow.length > 0 ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {eventsTomorrow.map((ev,i) => <EventCard key={i} ev={ev} onClick={() => setSelectedEvent(ev)} />)}
                    </div>
                  ) : (
                    <div style={{ textAlign:'center', padding:'32px 16px', color:'#999', fontSize:14, fontWeight:600 }}>
                      Nenhum evento para este dia
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

## 1. Visão Geral e Stack Tecnológica

- **Frontend:** JavaScript/JSX com React 19 e Vite, organizado como SPA com navegação controlada em `App.jsx`.
- **Backend principal:** JavaScript (CommonJS) com Node.js e Express 5, expondo rotas REST.
- **Banco de dados:** MySQL, compartilhado pelos módulos de negócio. Acesso via `mysql2/promise` e pool de conexões; **não há ORM**: os controllers executam SQL diretamente.
- **Bibliotecas e integrações:** `jsonwebtoken` e `bcryptjs` para autenticação/senhas; `multer` para uploads locais; `nodemailer` para e-mail; cliente Ollama para IA local; `node-cron` para agendamentos; chamadas HTTP à ElevenLabs para síntese de voz.
- **Legado:** há endpoints PHP com `mysqli` em paralelo ao backend Node. O frontend React observado consome principalmente o Node.

## 2. Mapeamento de Domínios e Módulos

- `frontend/src/pages/`: telas de autenticação/cadastro, perfil e configurações, painel e progresso, comunicação por cartões, lições, agenda, afiliação institucional e assistente IA.
- `backend/node/routes/` e `controllers/`: módulos de autenticação e perfis; comunicação e mídia; agenda/eventos; IA; afiliação entre responsáveis, alunos e instituições; dashboard, sessões de atividade e progresso.
- `backend/node/services/`: integração com Ollama, envio de e-mails e agendamento de notificações de eventos.
- `backend/node/config/`: pool MySQL e configuração de upload. Arquivos são gravados em `backend/node/uploads` e servidos pelo Express.
- `database/autim.sql`: schema relacional com usuários, alunos, instituições, afiliações, categorias/subcategorias, mídia, atividades/sessões, agenda, rotinas e relatórios.
- `backend/routes/` e `backend/config/`: endpoints/configuração PHP legados, incluindo operações antigas de autenticação e mensagens.

## 3. Pontos de Acoplamento Crítico

- Os controllers usam diretamente o mesmo pool e schema MySQL, sem camada de repositórios ou contratos de persistência. Consultas cruzam domínios, por exemplo aluno/usuário/afiliação/sessões em relatórios, dashboards e autorização.
- `authcontroller` reúne cadastro, login, perfis de responsáveis, alunos e instituições. `afiliacaocontroller` também concentra vínculos e relatórios institucionais; `dashboardcontroller` valida vínculos e altera dados de progresso e XP.
- A interface chama endpoints Node com URLs `http://localhost:3001` espalhadas pelas páginas; há também uso do proxy Vite para comunicação. Isso vincula a interface ao endereço e aos contratos atuais da API.
- A API PHP paralela usa `mysqli` e apresenta divergência de schema em código legado (por exemplo, o login consulta `users`, enquanto o schema atual declara `usuario`), aumentando o risco de manutenção e confusão sobre a fonte ativa.
- O controller de eventos invoca diretamente o agendador em memória; envio de e-mail é feito pelo serviço associado, no mesmo processo da API.

## 4. Gargalos e Escalabilidade

- Perguntas à IA aguardam a resposta do Ollama dentro da requisição HTTP, sem streaming; síntese de voz também aguarda a ElevenLabs, pode repetir a chamada e carrega o áudio integralmente em memória.
- Controllers executam consultas sequenciais e agregações relacionais para dashboards e relatórios. Não há dependência ou camada de cache identificável nos manifests.
- `node-cron` mantém jobs dinâmicos apenas na memória do processo. Reinícios perdem agendamentos; múltiplas instâncias podem duplicar ou divergir jobs. Não há fila persistente identificável nos manifests.
- Uploads são armazenados no disco local do backend, sem armazenamento compartilhado configurado, o que dificulta escalar horizontalmente sem volume compartilhado ou migração para object storage.

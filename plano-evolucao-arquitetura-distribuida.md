## 1. Decomposição em Microsserviços / Domínios

Adote o padrão *Strangler*: mantenha a API atual como fachada e extraia capacidades por domínio, preservando as rotas existentes enquanto o frontend migra gradualmente.

1. **IA e voz:** primeiro candidato. O Ollama e a ElevenLabs já são integrações isoláveis e hoje bloqueiam requisições. Extraia API de submissão e workers de IA/voz; mantenha catálogo de cartões e categorias no domínio de conteúdo até haver necessidade de separá-lo.
2. **Agenda e notificações:** extraia eventos e lembretes juntos. O serviço de agenda é dono dos eventos e publica mudanças; workers enviam e-mail e tratam lembretes.
3. **Conteúdo e aprendizagem:** separe catálogo de categorias, mídia e atividades do registro de sessões, progresso e XP. Comece pela propriedade das tabelas e contratos; dashboards podem continuar agregando dados temporariamente.
4. **Alunos, instituições e afiliação:** agrupe alunos/instituições e vínculos num domínio de gestão, evitando que dashboard e autenticação alterem diretamente essas tabelas.
5. **Identidade/autenticação por último:** é uma dependência transversal e hoje mistura cadastro, perfil e emissão de tokens. Primeiro padronize identidade JWT e valide autorização via claims/contratos; depois extraia cadastro e perfil sem mudar o consumidor de uma vez.

Não crie um serviço para cada controller. Extraia um domínio quando tiver dados que possa possuir, contrato estável, necessidade operacional clara e implantação independente. Mantenha módulos internos bem delimitados antes de separar processos.

## 2. Desacoplamento do Banco de Dados

- **Mapeie propriedade antes de mover dados.** Exemplos iniciais: agenda → `evento_agenda`; gestão → `aluno`, `instituicao`, `aluno_usuario`, `solicitacao_afiliacao`; aprendizagem → `atividade`, `categoria`, `subcategoria`, `sessao_atividade`; identidade → `usuario`. Confirme tabelas de configuração, mídia e relatórios conforme o uso real.
- **Crie fronteiras no monólito:** mova SQL de controllers para módulos de persistência por domínio, com operações explícitas e testes. Não é obrigatório adotar ORM; `mysql2` com repositórios SQL bem delimitados é suficiente. Se escolher ORM/query builder, introduza por serviço, não como migração global.
- **Migre de forma incremental:** primeiro restrinja usuários e permissões MySQL para que cada módulo acesse apenas suas tabelas. Em seguida mova as tabelas de um domínio para um schema/database próprio, inicialmente no mesmo servidor MySQL para reduzir custo operacional. Só depois avalie instâncias separadas.
- **Elimine joins entre proprietários:** substitua-os por APIs do domínio dono ou por projeções locais alimentadas por eventos. Para dashboards, use um serviço de consulta/read model que consome eventos; evite conceder acesso SQL cruzado como solução permanente.
- **Evite transações distribuídas:** use eventos e padrão *outbox* para publicar mudanças junto com o commit local. Para fluxos que atravessam domínios, como aceitar afiliação, modele uma saga com passos idempotentes e compensação. Não tente manter atomicidade entre bancos via transação global.
- Mantenha a API atual como adaptador durante a transição e migre consumidores endpoint a endpoint; não duplique escrita sem regra clara de reconciliação.

## 3. Mensageria e Processos Assíncronos

- **Começo de menor atrito:** BullMQ com Redis gerenciado, por já ser uma aplicação Node. Configure persistência/alta disponibilidade do Redis conforme criticidade. Prefira RabbitMQ se houver consumidores em várias linguagens, necessidade de roteamento complexo ou broker independente do ecossistema Redis.
- **Agenda:** ao criar, alterar ou cancelar evento, grave no banco do domínio e publique evento via outbox (`evento.criado`, `evento.alterado`, `evento.cancelado`). Um worker agenda ou cancela job persistente de lembrete; outro envia o e-mail. Não mantenha cron dinâmico em memória dentro das instâncias HTTP.
- **IA e ElevenLabs:** a API valida e registra solicitação, enfileira trabalho e responde `202 Accepted` com `jobId`. A interface consulta estado ou recebe atualização por SSE; workers separados executam Ollama e síntese de voz com limites de concorrência, timeout e controle de recursos. Para a UX de resposta imediata, mantenha endpoint síncrono como fallback temporário durante a migração.
- Configure tentativas com *backoff*, idempotência, timeout, fila de falhas (DLQ), métricas e possibilidade de reprocessar. Não faça retry indefinido de erros permanentes. E-mail, transcrição/voz e notificações devem ser operações idempotentes para evitar duplicidade.
- Comece com uma fila e tipos de job separados; introduza tópicos/brokers adicionais apenas se isolamento de carga ou propriedade dos serviços exigir.

## 4. Armazenamento de Arquivos e Estado

- Mova fotos e demais uploads de `backend/node/uploads` para object storage S3-compatível (por exemplo, S3 ou MinIO). Grave no banco apenas chave, tipo, tamanho e metadados; use URL pré-assinada para upload/download privado ou CDN para conteúdo público. Migre arquivos existentes preservando as chaves e valide cada objeto antes de trocar as URLs.
- Enquanto o storage não é migrado, use volume persistente compartilhado e paths absolutos; disco efêmero local não é compatível com múltiplas instâncias.
- Retire agendamentos do estado do processo usando jobs persistentes na fila. O restante da API pode ser horizontalizado sem sessão sticky enquanto autenticação continuar baseada em JWT e não depender de estado de sessão local.
- Se futuramente houver sessões revogáveis, rate limits ou cache compartilhado, use Redis com TTL e política explícita de invalidação. Não trate cache como fonte de verdade.
- **Ordem prática:** delimite módulos e contratos; introduza fila/workers para IA, voz e notificações; migre uploads para object storage; restrinja acessos ao MySQL e extraia agenda; depois migre gestão, aprendizagem e identidade, um domínio por vez.

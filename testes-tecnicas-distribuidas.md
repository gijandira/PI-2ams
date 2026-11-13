# Testes de técnicas de sistemas distribuídos no AUTIM

## É possível testar isso em um monólito?

Sim. Um monólito ainda enfrenta falhas típicas de sistemas distribuídos quando
depende de MySQL, Ollama, serviços de e-mail ou outras APIs: uma dependência pode
ficar indisponível, uma chamada pode ser repetida e o processo pode cair entre
duas operações. É possível testar os padrões de resiliência antes de separar a
aplicação em serviços.

Os exemplos em `backend/node/distributed-lab/patterns.js` são implementações
didáticas executadas pelos testes, não foram conectadas aos controllers,
agendador, banco ou integrações atuais. Não alteram a execução normal do AUTIM.
Rode-os a partir de `backend`:

```sh
npm test
```

O conjunto utiliza apenas o test runner e as asserções nativas do Node.js; não
precisa de MySQL, Redis, Ollama, e-mail ou instalação de dependências adicionais.

### O que cada teste unitário verifica

No arquivo `backend/node/tests/distributed-patterns.test.js`:

| Cenário | Verificação |
| --- | --- |
| Retry recuperável | Repete uma operação que falha duas vezes, aplica esperas de 10 ms e 20 ms e retorna o sucesso da terceira tentativa. |
| Erro permanente | Não repete uma operação quando `shouldRetry` classifica o erro como permanente. |
| Idempotência concorrente | Duas chamadas simultâneas e um replay com a mesma chave produzem apenas um efeito. |
| Retry após falha | Remove o resultado falho da chave para permitir que a chamada seguinte tente novamente. |
| Circuit breaker | Conta falhas, abre o circuito, bloqueia uma chamada, faz probe após o prazo e fecha quando a dependência responde. |
| Outbox com falha de publicação | Não marca como enviada uma mensagem quando o broker simulado falha. |
| Outbox com falha de confirmação | Demonstra que pode haver reenvio após publicação bem-sucedida e falha ao marcar a mensagem como enviada. |

Os testes injetam espera e relógio falsos onde necessário para não depender de
tempo real. Os comentários no arquivo explicam os dublês e os efeitos simulados.

## Integração com XAMPP e Ollama locais

Para testar os serviços locais reais, inicie o MySQL no XAMPP e a Ollama com o
modelo `qwen2.5:0.5b` instalado. Configure a conexão do backend em
`backend/.env` (baseando-se em `.env.example`) e execute, a partir de `backend`:

```sh
npm run test:integration
```

Essa suíte é intencionalmente separada de `npm test`: ela precisa dos serviços
ativos e pode demorar enquanto o modelo responde. O teste de banco só executa
consultas de leitura (`SELECT`) e verifica conexão e tabelas do AUTIM; exige que
`DB_HOST` aponte para a máquina local. O teste de IA consulta os modelos
instalados e envia uma pergunta fixa e não sensível ao serviço de IA usado pelo
backend. Nenhum dos dois testes cria ou altera registros.

## Testes de lacunas conhecidas

Há também três testes de diagnóstico intencionalmente separados da suíte padrão.
Execute-os com:

```sh
npm run test:gaps
```

No arquivo `backend/node/tests/distributed-gaps.test.js`, os dublês substituem
temporariamente o pool MySQL, o serviço de e-mail, o agendador cron e, no terceiro
caso, as dependências do controller. O `require.cache` é restaurado no fim de
cada cenário; assim, não há conexão com o banco real, alteração de registros nem
envio de e-mail. Os comentários `GAP` apontam o comportamento esperado e a
limitação atual que faz a asserção falhar.

Eles devem falhar até que as lacunas correspondentes sejam implementadas:

1. **Recuperação após reinício:** a inicialização do agendador deve carregar
   lembretes pendentes persistidos. Hoje os jobs ficam somente em memória.
2. **Coordenação entre instâncias:** duas instâncias não devem agendar
   simultaneamente o mesmo lembrete. Hoje cada processo mantém seu próprio mapa
   de jobs.
3. **Falha do agendamento visível à API:** se o evento for salvo, mas o
   agendamento falhar, a resposta deve informar que a notificação não foi
   agendada. Hoje o controller não aguarda nem verifica o resultado e informa
   sucesso com a notificação agendada.

Esses testes usam dublês de banco/agendador e não enviam e-mail nem modificam
dados reais. A falha é esperada e intencional; por isso não integra `npm test`,
que continua sendo a suíte verde dos padrões implementados no laboratório.

Os comandos de teste têm propósitos distintos:

| Comando | Resultado esperado | Dependências |
| --- | --- | --- |
| `npm test` | Todos os testes locais de padrões passam. | Node.js; sem serviços externos. |
| `npm run test:gaps` | Os três testes de lacunas falham até as funcionalidades serem implementadas. | Node.js; dependências substituídas por dublês. |
| `npm run test:integration` | Verifica MySQL e Ollama locais ativos e configurados. | XAMPP/MySQL, Ollama e modelo `qwen2.5:0.5b`. |

## Técnicas cobertas

### 1. Retry com backoff exponencial

`retryWithBackoff` repete uma operação um número limitado de vezes e aumenta o
intervalo entre tentativas (por exemplo, 10 ms, 20 ms, 40 ms). A função
`shouldRetry` separa falhas temporárias de falhas permanentes. Isso é útil para
chamadas de rede transitórias, mas retries devem ter limite, timeout e
classificação de erros para não sobrecarregar uma dependência nem repetir
operações não idempotentes.

Os testes verificam a sequência de espera e que uma falha permanente não é
repetida. O relógio não espera de verdade: a função `wait` é substituída por um
coletor para tornar o teste determinístico.

### 2. Idempotência

`createIdempotentExecutor` associa uma chave de idempotência ao resultado de uma
operação. Chamadas simultâneas com a mesma chave compartilham a execução, e um
replay bem-sucedido retorna o resultado anterior sem repetir o efeito.

O teste usa um efeito em memória para contar execuções e também verifica que uma
tentativa que falhou pode ser refeita. No exemplo, o mapa existe apenas no
processo atual: não protege contra reinício ou duas instâncias. Em produção,
armazene a chave e o resultado/estado em banco compartilhado, com restrição única
e política de expiração apropriada. Para uma chamada de IA ou criação de evento,
a chave precisa representar a mesma requisição lógica, não apenas o usuário.

### 3. Circuit breaker

`CircuitBreaker` tem três estados:

- `CLOSED`: chamadas seguem para a dependência e falhas consecutivas são contadas.
- `OPEN`: chamadas são recusadas durante o intervalo de recuperação.
- `HALF_OPEN`: após o intervalo, uma chamada-probe testa a dependência; sucesso
  fecha o circuito e falha volta a abri-lo.

O teste injeta um relógio controlável, comprova o bloqueio antes do prazo e o
fechamento após uma chamada bem-sucedida. O circuito deste exemplo é local ao
processo; instâncias independentes não compartilham estado. Ele protege recursos
locais, mas não representa por si só uma estratégia global de failover.

### 4. Outbox e entrega pelo menos uma vez

`dispatchOutboxBatch` busca mensagens pendentes, publica cada uma e só depois
marca a mensagem como enviada. O primeiro teste verifica que uma falha do broker
não confirma a mensagem, deixando-a disponível para retry.

O segundo teste cobre a janela em que o broker aceitou a mensagem, mas a
atualização da outbox falhou. O próximo ciclo publicará novamente. Esse é o
comportamento esperado de entrega *at-least-once*: consumidores devem ser
idempotentes e deduplicar usando o identificador da mensagem.

Para usar o padrão real, a escrita de negócio e a inclusão da linha na outbox
devem acontecer na mesma transação MySQL. Um processo separado pode publicar
linhas pendentes e marcar entregas. Os exemplos atuais simulam apenas o relay;
não criam tabelas nem acessam o banco.

## O que os testes demonstram — e o que não demonstram

Os testes validam a lógica local dos padrões e cenários de falha determinísticos.
Não medem disponibilidade real, concorrência entre processos, durabilidade,
particionamento de rede, latência, escala horizontal ou comportamento real do
MySQL/broker. Para isso, uma etapa posterior deve usar banco/broker de teste e
testes de integração ou de caos, sem misturar dados de produção.

Uma evolução natural para o AUTIM seria aplicar outbox e idempotência ao fluxo de
eventos/notificações e usar fila persistente para IA ou e-mail. Isso exige
definir esquema, worker, política de retry/DLQ, observabilidade e operação do
broker; os testes deste laboratório não afirmam que essas capacidades já existem
na aplicação.

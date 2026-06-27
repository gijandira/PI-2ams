<div align="center">
  <img src="https://raw.githubusercontent.com/gijandira/PI-2ams/refs/heads/main/autimm/src/assets/logo-icone.png" alt="Autim Logo" width="160"/>

  # 🧩 Autim | Inclusão Inteligente

  > Plataforma de comunicação assistiva para pessoas com TEA não verbais, utilizando IA para adaptação personalizada.

  ![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge)
  ![Curso](https://img.shields.io/badge/2º%20ADS-AMS-blue?style=for-the-badge)
  ![FATEC](https://img.shields.io/badge/FATEC-Taubaté-red?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

  <sub>🚀 Projeto Integrador | 2º ADS-AMS — FATEC Taubaté</sub><br>
  <sub>Foco: Inclusão, acessibilidade e tecnologia adaptativa</sub>
</div>

---

## 📋 Índice

- [Missão do Produto](#-missão-do-produto)
- [Problema](#-problema)
- [Solução](#-descrição-da-solução)
- [Funcionalidades](#️-funcionalidades)
- [Arquitetura](#️-arquitetura)
- [Tecnologias](#-tecnologias-utilizadas)
- [Como Executar](#️-como-executar)
- [Segurança](#-segurança)
- [Sprints](#-planejamento-de-entregas)
- [Diferenciais](#-diferenciais)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Equipe](#-equipe)

---

## 🤩 Missão do Produto

Prover voz, autonomia e inclusão para pessoas autistas não verbais por meio de uma arquitetura tecnológica adaptativa. Nossa missão é romper barreiras comunicativas e pedagógicas, transformando a interação humana através de uma interface intuitiva que respeita a neurodiversidade e elimina a sobrecarga sensorial.

---

## ❗ Problema

Pessoas autistas não verbais enfrentam dificuldades na comunicação e no aprendizado, muitas vezes dependendo de ferramentas pouco adaptativas e interfaces sobrecarregadas.

---

## 💡 Descrição da Solução

O **Autim** é um ecossistema multimodal que integra:

- Comunicação assistiva e aprendizado personalizado
- Atividades adaptativas com base em IA
- Monitoramento automático e ajuste ao nível das atividades conforme o progresso do usuário
- Conexão entre aluno, responsáveis e profissionais

---

## 🛠️ Funcionalidades

| # | Funcionalidade | Descrição |
|---|---|---|
| 🗣️ | Comunicação por símbolos | Pictogramas com reprodução de áudio |
| 🤖 | IA Adaptativa | Adaptação automática de atividades com Inteligência Artificial |
| 📊 | Dashboard | Acompanhamento de progresso em tempo real |
| 👤 | Sistema de Perfis | Admin, Profissional e Aluno |
| 🖼️ | Biblioteca de Mídias | Conteúdo personalizado por perfil |

---

## 🏗️ Arquitetura

<div align="center">

| Camada | Tecnologia |
|---|---|
| Frontend | React |
| Backend | Java |
| Banco de Dados | MySQL |
| Comunicação | API REST |

</div>

📄 **Diagramas do sistema:** [DiagramasAUTIM.pdf](https://github.com/user-attachments/files/27103746/DiagramasAUTIMM.pdf)

---

## 🚀 Tecnologias Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/REST%20API-005571?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
</div>

---

## ▶️ Como Executar

**Pré-requisitos:** Node.js, Java JDK e MySQL instalados.

```bash
# Clone o repositório
git clone https://github.com/gijandira/PI-2ams.git

# Entre na pasta
cd autim

# Instale as dependências do frontend
npm install

# Rode o frontend
npm start
```

> Para instruções detalhadas de backend e configuração do banco de dados, consulte o arquivo [`Funcionar o projeto.txt`](autim/) dentro da pasta `autim/`.

---

## 🔒 Segurança

O sistema segue os princípios da **LGPD**, garantindo:

- Criptografia de dados sensíveis
- Controle de acesso por perfil de usuário
- Proteção das informações dos usuários

---

## 📅 Planejamento de Entregas

| Sprint | Descrição | Período | Status |
|---|---|---|---|
| 🔖 Sprint 1 | Estrutura Base e Identidade Visual | 24/03/2026 – 24/04/2026 | ✅ Concluída |
| 🔖 Sprint 2 | Gerenciamento de Acessos e Perfis | 01/05/2026 – 31/05/2026 | ✅ Concluída |
| 🔖 Sprint 3 | Novas Interfaces e Infraestrutura | 01/06/2026 – 30/06/2026 | 🔄 Em andamento |
| 🔖 Sprint 4 | Integrações | A definir | ⏳ Aguardando |
| 🔖 Sprint 5 | Finalização | A definir | ⏳ Aguardando |

---

## 🌟 Diferenciais

- Interface pensada para **evitar sobrecarga sensorial**
- Uso de **IA** para personalização real do aprendizado
- Foco em **inclusão e neurodiversidade**
- Conexão direta entre aluno, responsáveis e profissionais de saúde

---

## 📁 Estrutura do Repositório

```
PI-2ams/
│
├── autim/                    # Código principal do sistema
│   ├── BD/                   # Scripts e modelos do banco de dados
│   ├── backend/              # Lógica de servidor
│   ├── public/               # Arquivos públicos estáticos
│   ├── src/                  # Código-fonte principal
│   │   └── assets/           # Imagens e recursos estáticos
│   │       └── logo-icone.png
│   ├── INSTRUCOES.txt        # Como executar o projeto
│   └── ...
│
├── backend/                  # Configurações do backend
│   ├── config/               # Configurações da aplicação
│   ├── routes/               # Rotas da API
│   └── .env.example          # Exemplo de variáveis de ambiente
│
├── utilitarios-backend/      # Utilitários de suporte ao backend
│   └── response.php
│
└── README.md
```

---

## 👥 Equipe

### 🎯 Gestão

| Nome | Função | GitHub | LinkedIn |
|---|---|---|---|
| Giovanna Yasmin | Product Owner | — | — |
| Giovana Levindo | Scrum Master | — | — |

### 💻 Frontend

| Nome | Função | GitHub | LinkedIn |
|---|---|---|---|
| Iran Freitas ⭐ | Dev Frontend / Porta-voz | — | — |
| Flávio Augusto | Dev Frontend | — | — |
| Rodrigo Cunha | Dev Frontend | — | — |

### ⚙️ Backend

| Nome | Função | GitHub | LinkedIn |
|---|---|---|---|
| Lucas Lica ⭐ | Dev Backend / Porta-voz | — | — |
| Vitor Gouvea | Dev Backend | — | — |
| Vinicius Gouvea | Dev Backend | — | — |
| João Vitor da Mota | Dev Backend | — | — |
| Daniel Moreira | Dev Backend | — | — |
| Gustavo Duran | Dev Backend | — | — |

### 🏗️ Infraestrutura

| Nome | Função | GitHub | LinkedIn |
|---|---|---|---|
| Giovana Jandira ⭐ | Infraestrutura / Porta-voz | — | — |
| Felipe Caitano | Infraestrutura | — | — |
| Glenda Lopes | Infraestrutura | — | — |
| João Vitor Alvarenga | Infraestrutura | — | — |
| Alex Sander | Infraestrutura | — | — |

> ⭐ Porta-voz do time

---

<div align="center">
  <sub><i>"A tecnologia move o mundo, mas a empatia move a inclusão."</i></sub>
  <br><br>
  <b>FATEC Taubaté — 2026 | 2º ADS-AMS</b>
</div>

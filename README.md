# 🧩 Autim — Plataforma de Comunicação Assistiva com IA

<p align="center">
  <img src="docs/banner.png" alt="Autim Banner" width="800"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Curso-ADS-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Como Executar](#-como-executar)
- [Sprints](#-sprints)
- [Backlog do Produto](#-backlog-do-produto)
- [Equipe](#-equipe)

---

## 💡 Sobre o Projeto

O **Autim** é uma plataforma de comunicação assistiva voltada para pessoas com **Transtorno do Espectro Autista (TEA) não verbal**. Utilizando **Inteligência Artificial**, a plataforma se adapta de forma personalizada ao perfil de cada usuário, facilitando a comunicação e promovendo maior autonomia e inclusão.

> 📌 **Status do projeto:** 🟡 Em desenvolvimento

---

## 🛠 Tecnologias

As seguintes tecnologias foram utilizadas no desenvolvimento do projeto:

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/REST%20API-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="REST API"/>
</p>

| Camada | Tecnologia |
|---|---|
| Frontend | React |
| Backend | Java |
| Banco de Dados | MySQL |
| Comunicação | API REST |

---

## 📁 Estrutura do Repositório

```
PI-2ams/
│
├── autim/                  # Código principal do sistema
│   ├── BD/                 # Scripts e modelos do banco de dados
│   ├── backend/            # Lógica de servidor
│   ├── public/             # Arquivos públicos estáticos
│   └── src/                # Código-fonte principal
│
├── backend/                # Configurações do backend
│   ├── config/             # Configurações da aplicação
│   ├── routes/             # Rotas da API
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   └── .gitignore
│
├── utilitarios-backend/    # Utilitários de suporte ao backend
│   └── response.php
│
├── docs/                   # Documentação, diagramas e imagens
│
└── README.md
```

---

## ⚙️ Como Executar

> Siga as instruções detalhadas no arquivo [`autim/INSTRUCOES.txt`](autim/) para configurar e executar o projeto localmente.

**Requisitos básicos:**
- Node.js instalado (para o frontend React)
- Java JDK instalado (para o backend)
- MySQL configurado e rodando

**Passo a passo resumido:**
1. Clone o repositório:
   ```bash
   git clone https://github.com/gijandira/PI-2ams.git
   ```
2. Configure as variáveis de ambiente copiando o `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Siga as instruções do arquivo `INSTRUCOES.txt` para subir o banco e os serviços.

---

## 📅 Sprints

| Sprint | Descrição | Período | Status |
|---|---|---|---|
| 🔖 Sprint 1 | Estrutura Base e Identidade Visual | 24/03/2026 – 24/04/2026 | ✅ Concluída |
| 🔖 Sprint 2 | Gerenciamento de Acessos e Perfis | 01/05/2026 – 31/05/2026 | ✅ Concluída |
| 🔖 Sprint 3 | Novas Interfaces e Infraestrutura | 01/06/2026 – 30/06/2026 | 🔄 Em andamento |
| 🔖 Sprint 4 | Integrações | A definir | ⏳ Aguardando |
| 🔖 Sprint 5 | Finalização | A definir | ⏳ Aguardando |

---

## 📌 Backlog do Produto

### Requisitos Funcionais

| ID | Descrição |
|---|---|
| RF-01 | O sistema deve permitir cadastro e login de usuários (responsáveis e terapeutas) |
| RF-02 | O sistema deve oferecer comunicação por símbolos visuais (pictogramas) |
| RF-03 | A IA deve adaptar os painéis de comunicação conforme o perfil do usuário |
| RF-04 | O sistema deve permitir o gerenciamento de perfis de usuários com TEA |
| RF-05 | O sistema deve disponibilizar painéis de controle para responsáveis e terapeutas |
| RF-06 | O sistema deve integrar as diferentes funcionalidades em uma plataforma unificada |

### Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| RNF-01 | Interface acessível e intuitiva, adequada ao público-alvo |
| RNF-02 | Sistema responsivo (web e mobile) |
| RNF-03 | Autenticação segura com controle de acesso por perfil |
| RNF-04 | Tempo de resposta adequado para uso em tempo real |
| RNF-05 | Documentação técnica e manual do usuário disponíveis |

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

<p align="center">
  Desenvolvido com 💙 pela turma 2AMS — Análise e Desenvolvimento de Sistemas
</p>

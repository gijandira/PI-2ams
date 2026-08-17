# 🧩 Autim | Inclusão Inteligente

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="Imagens/logo-preta.png">
  <source media="(prefers-color-scheme: light)" srcset="Imagens/logo-branca.png">
  <img alt="Logo Autim" src="Imagens/logo-branca.png">
</picture>

> Plataforma de comunicação assistiva para pessoas com TEA não verbais, utilizando IA para adaptação personalizada.

🚀 **Projeto Integrador** | 2º ADS-AMS - FATEC TAUBATÉ
<br>
Foco: Inclusão, acessibilidade e tecnologia adaptativa

## 🤩 Missão do Produto

* Prover voz, autonomia e inclusão para pessoas autistas não verbais por meio de uma arquitetura tecnológica adaptativa. Nossa missão é romper barreiras comunicativas e pedagógicas, transformando a interação humana através de uma interface intuitiva que respeita a neurodiversidade e elimina a sobrecarga sensorial.

## ❗ Problema

Pessoas autistas não verbais enfrentam dificuldades na comunicação e no aprendizado, muitas vezes dependendo de ferramentas pouco adaptativas e interfaces sobrecarregadas.

## Descrição da Solução

* O Autim é um ecossistema multimodal que integra:
- Comunicação assistiva e aprendizado personalizado.
- Atividades adaptativas com base em IA
- Monitoramento automático ao nível das atividades conforme o progresso do usuário.
- Conexão entre alunos, responsáveis e profissionais

---

### 🛠️ Engenharia e Escopo

> **Funcionalidades**

- 🗣️ Comunicação por símbolos com reprodução de áudio
- 🤖 Bot que auxiliará no uso da plataforma e a como lidar com o Autista
- 📊 Dashboard de acompanhamento de progresso
- 👤 Sistema de perfis (Admin, Profissional, Aluno)
- 🖼️ Biblioteca de mídias personalizadas

## 🏗️ Arquitetura do Sistema

| Camada | Tecnologias / Ferramentas / Pacotes |
| :--- | :--- |
| **Frontend (Web & Desktop)** | React.js, Electron, Vite, HTML5, CSS3, JavaScript |
| **Mobile** | React Native |
| **Backend (Node.js)** | Node.js, Express.js, PHP, `path`, `fs` |
| **Banco de Dados** | MySQL (driver `mysql2`) |
| **Autenticação & Segurança** | JSON Web Tokens (JWT), Bcrypt.js, CORS, Dotenv, Certificado SSL (HTTPS) |
| **Comunicação / Protocolo** | API REST (HTTPS / JSON) |
| **Infraestrutura & Web Server** | NGINX (Reverse Proxy / SSL), VPS Hostgator (Produção), XAMPP (Dev Local) |
| **Design & UI/UX** | Figma, Adobe Photoshop, Canva |
| **Ferramentas de Desenvolvimento** | Visual Studio Code, Git, GitHub |

---

*Diagramas Autim*
[DiagramasAUTIMM.pdf](https://github.com/user-attachments/files/27103746/DiagramasAUTIMM.pdf)

> **▶️ Como executar**

**Pré-requisitos:** Node.js e MySQL instalados.

```bash
# Clone o repositório
git clone https://github.com/gijandira/PI-2ams

# Entre na pasta
cd autim

# Instale dependências (frontend)
npm install

# Rode o projeto
npm start
```

Para instruções detalhadas de backend e configuração do banco de dados, consulte o arquivo [Funcionar o projeto.txt](autimm/Funcionar%20o%20projeto.txt) dentro da pasta `autimm/`.

> **🔒 Segurança**

O sistema segue princípios da LGPD, garantindo:
- Criptografia de dados sensíveis
- Controle de acesso por perfil
- Proteção de informações dos usuários

## 🚀 Tecnologias Utilizadas

### 💻 Frontend & Mobile

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### ⚙️ Backend & Banco de Dados

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### 🌐 Servidor & Infraestrutura

![NGINX](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![HostGator](https://img.shields.io/badge/HostGator_VPS-F15A24?style=for-the-badge&logo=hostgator&logoColor=white)
![XAMPP](https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white)

### 🛠️ Ferramentas & Design

![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Photoshop](https://img.shields.io/badge/Adobe_Photoshop-31A8FF?style=for-the-badge&logo=adobe-photoshop&logoColor=white)
![Canva](https://img.shields.io/badge/Canva-00C4CC?style=for-the-badge&logo=canva&logoColor=white)

## 📅 Planejamento de Entregas

| Sprint | Descrição | Período | Status |
|--------|-----------|---------|--------|
| Sprint 1 | Base do sistema | 24/03/2026 – 24/04/2026 | ✅ Concluída |
| Sprint 2 | Testes e Validação | 01/05/2026 – 31/05/2026 | ✅ Concluída |
| Sprint 3 | Correções e Apresentação | 01/06/2026 – 30/06/2026 | 🔄 Em andamento |
| Sprint 4 | Integrações | — | ⏳ Pendente |
| Sprint 5 | Finalização | — | ⏳ Pendente |

## 📁 Estrutura do Repositório

PI-2ams/
├── autim/ # Código principal do sistema
├── backend/ # Configurações do backend
├── utilitários de backend/ # Utilitários de suporte ao backend
├── front-end/ # Código do frontend
├── banco de dados/ # Documentação do banco de dados
├── documentos/ # Documentações do projeto
├── Imagens/ # Imagens utilizadas no README
├── CHANGELOG.md # Histórico de alterações por Sprint
├── LICENÇA.txt # Licença de uso do projeto
├── arquivo package-lock.json # Dependências do projeto
├── package.json # Configurações do projeto
└── README.md # Documentação principal

## 👥 Equipe

### 🎯 Gestão

| Nome | Função | GitHub | LinkedIn |
| :--- | :--- | :---: | :---: |
| Giovanna Yasmin | Product Owner | — | — |
| Giovana Levindo | Scrum Master | — | — |

### 🖥️ Frontend

| Nome | Função | GitHub | LinkedIn |
| :--- | :--- | :---: | :---: |
| Iran Freitas ⭐ | Dev Frontend / Porta-voz | — | — |
| Flávio Augusto | Dev Frontend | — | — |
| Rodrigo Cunha | Dev Frontend | — | — |

### ⚙️ Backend

| Nome | Função | GitHub | LinkedIn |
| :--- | :--- | :---: | :---: |
| Lucas Lica ⭐ | Dev Backend / Porta-voz | — | — |
| Vitor Gouvea | Dev Backend | — | — |
| Vinicius Gouvea | Dev Backend | — | — |
| João Vitor da Mota | Dev Backend | — | — |
| Daniel Moreira | Dev Backend | — | — |
| Gustavo Duran | Dev Backend | — | — |

### 🏗️ Infraestrutura

| Nome | Função | GitHub | LinkedIn |
| :--- | :--- | :---: | :---: |
| Giovana Jandira ⭐ | Infraestrutura / Porta-voz | — | — |
| Felipe Caitano | Infraestrutura | — | — |
| Glenda Lopes | Infraestrutura | — | — |
| João Vitor Alvarenga | Infraestrutura | — | — |
| Alex Sander | Infraestrutura | — | — |

> ⭐ Porta-voz do time

> *"A empatia é ver com os olhos do outro, ouvir com os ouvidos do outro e sentir com o coração do outro."*
> — Alfred Adler

**FATEC TAUBATÉ - 2026 | 2° ADS/AMS**

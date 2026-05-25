-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 22/05/2026 às 15:47
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `autim`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `ALU_NOME` varchar(100) NOT NULL,
  `ALU_DTNASC` date DEFAULT NULL,
  `ALU_DIAGNOSTICO` varchar(100) DEFAULT NULL,
  `ALU_XP_TOTAL` int(11) NOT NULL DEFAULT 0,
  `ALU_DIAS_OFENSIVA` int(11) NOT NULL DEFAULT 0,
  `ALU_ULTIMO_ACESSO` datetime DEFAULT NULL,
  `ALU_URLAVATAR` varchar(500) DEFAULT NULL,
  `ALU_DTCAD` datetime NOT NULL DEFAULT current_timestamp(),
  `ALU_DTALT` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `USU_ID` int(11) DEFAULT NULL,
  `INS_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `aluno`
--

INSERT INTO `aluno` (`ALU_ID`, `ALU_NOME`, `ALU_DTNASC`, `ALU_DIAGNOSTICO`, `ALU_XP_TOTAL`, `ALU_DIAS_OFENSIVA`, `ALU_ULTIMO_ACESSO`, `ALU_URLAVATAR`, `ALU_DTCAD`, `ALU_DTALT`, `USU_ID`, `INS_ID`) VALUES
(1, 'Daniel', NULL, NULL, 0, 0, NULL, NULL, '2026-05-20 09:36:50', '2026-05-20 09:36:50', 3, NULL),
(2, 'Daniel', NULL, NULL, 0, 0, NULL, NULL, '2026-05-20 09:45:13', '2026-05-20 09:45:13', 4, NULL),
(3, 'Daniel', NULL, NULL, 0, 0, NULL, NULL, '2026-05-22 08:28:43', '2026-05-22 08:28:43', NULL, NULL),
(4, 'Lucas', NULL, NULL, 0, 0, NULL, NULL, '2026-05-22 08:55:27', '2026-05-22 08:55:27', NULL, NULL),
(5, 'a', NULL, NULL, 0, 0, NULL, NULL, '2026-05-22 09:03:41', '2026-05-22 09:03:41', NULL, NULL),
(6, 'b', NULL, NULL, 0, 0, NULL, NULL, '2026-05-22 09:55:09', '2026-05-22 09:55:09', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno_auxiliar`
--

CREATE TABLE `aluno_auxiliar` (
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `ALAU_DTATRIBUIDO` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno_usuario`
--

CREATE TABLE `aluno_usuario` (
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `ALUS_DTVINCULO` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `aluno_usuario`
--

INSERT INTO `aluno_usuario` (`ALU_ID`, `USU_ID`, `ALUS_DTVINCULO`) VALUES
(3, 5, '2026-05-22 08:28:43'),
(4, 6, '2026-05-22 08:55:27'),
(5, 7, '2026-05-22 09:03:41');

-- --------------------------------------------------------

--
-- Estrutura para tabela `atividade`
--

CREATE TABLE `atividade` (
  `ATI_ID` int(10) UNSIGNED NOT NULL,
  `ATI_TITULO` varchar(200) NOT NULL,
  `ATI_DESCRICAO` text DEFAULT NULL,
  `ATI_TIPO` enum('associacao','multipla_escolha','repeticao') NOT NULL,
  `SUB_ID` int(10) UNSIGNED NOT NULL,
  `ATI_DIFICULDADE` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `ATI_MINPONTOS` decimal(5,2) NOT NULL DEFAULT 70.00,
  `ATI_IDIMAGEM` int(10) UNSIGNED DEFAULT NULL,
  `ATI_IDAUDIO` int(10) UNSIGNED DEFAULT NULL,
  `ATI_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `CAT_ID` int(10) UNSIGNED NOT NULL,
  `CAT_NOME` varchar(100) NOT NULL,
  `CAT_ICONE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `configuracao_app`
--

CREATE TABLE `configuracao_app` (
  `CON_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `CON_MODO_ESCURO` tinyint(1) NOT NULL DEFAULT 0,
  `CON_NOTIFICACOES` tinyint(1) NOT NULL DEFAULT 1,
  `CON_VELOCIDADE_VOZ` decimal(3,2) NOT NULL DEFAULT 1.00,
  `CON_ALERTAS_INAT` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento_agenda`
--

CREATE TABLE `evento_agenda` (
  `EVE_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `EVE_TITULO` varchar(150) NOT NULL,
  `EVE_DESCRICAO` text DEFAULT NULL,
  `EVE_ETIQUETA` enum('lazer','esporte','saude','licao') NOT NULL DEFAULT 'licao',
  `EVE_DT_INICIO` datetime NOT NULL,
  `EVE_DT_FIM` datetime NOT NULL,
  `EVE_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `frase`
--

CREATE TABLE `frase` (
  `FRA_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `FRA_TITULO` varchar(200) DEFAULT NULL,
  `FRA_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `instituicao`
--

CREATE TABLE `instituicao` (
  `INS_ID` int(10) UNSIGNED NOT NULL,
  `INS_NOME` varchar(150) NOT NULL,
  `INS_TELEFONE` varchar(20) NOT NULL,
  `INS_EMAIL` varchar(100) NOT NULL,
  `INS_SENHA` varchar(255) NOT NULL,
  `INS_COD_ACESSO` varchar(50) NOT NULL,
  `INS_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `item_rotina`
--

CREATE TABLE `item_rotina` (
  `ITE_ID` int(10) UNSIGNED NOT NULL,
  `ROT_ID` int(10) UNSIGNED NOT NULL,
  `ATI_ID` int(10) UNSIGNED NOT NULL,
  `ITE_HORARIOPROGRAMADO` time DEFAULT NULL,
  `ITE_POSICAO` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `midia`
--

CREATE TABLE `midia` (
  `MID_ID` int(10) UNSIGNED NOT NULL,
  `MID_TIPO` enum('imagem','audio') NOT NULL,
  `MID_URL` varchar(500) NOT NULL,
  `MID_ROTULO` varchar(150) DEFAULT NULL,
  `MID_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `perfil`
--

CREATE TABLE `perfil` (
  `PER_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `PER_NIVEL` enum('iniciante','intermediario','avancado') NOT NULL DEFAULT 'iniciante',
  `PER_DIFICULDADE` text DEFAULT NULL,
  `PER_PREFERENCIA` text DEFAULT NULL,
  `PER_DTALT` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `perfil`
--

INSERT INTO `perfil` (`PER_ID`, `ALU_ID`, `PER_NIVEL`, `PER_DIFICULDADE`, `PER_PREFERENCIA`, `PER_DTALT`) VALUES
(1, 3, 'iniciante', NULL, NULL, '2026-05-22 08:28:43'),
(2, 4, 'iniciante', NULL, NULL, '2026-05-22 08:55:27'),
(3, 5, 'iniciante', NULL, NULL, '2026-05-22 09:03:41'),
(4, 6, 'iniciante', NULL, NULL, '2026-05-22 09:55:09');

-- --------------------------------------------------------

--
-- Estrutura para tabela `relatorio`
--

CREATE TABLE `relatorio` (
  `REL_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `REL_INICIO` date NOT NULL,
  `REL_FIM` date NOT NULL,
  `REL_TOTALSESSAO` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `REL_MEDIA` decimal(5,2) DEFAULT NULL,
  `REL_OBSERVACAO` text DEFAULT NULL,
  `REL_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `rotina`
--

CREATE TABLE `rotina` (
  `ROT_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `ROT_TITULO` varchar(200) NOT NULL,
  `ROT_DATA` date DEFAULT NULL,
  `ROT_DTCAD` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessao_atividade`
--

CREATE TABLE `sessao_atividade` (
  `SES_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `ATI_ID` int(10) UNSIGNED NOT NULL,
  `USU_ID` int(10) UNSIGNED DEFAULT NULL,
  `SES_ACERTOS` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `SES_TOTALPERGUNTAS` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `SES_FEEDBACK_RESPONSAVEL` enum('sim','quase','parcialmente','nao') DEFAULT NULL,
  `SES_PONTOS` decimal(5,2) NOT NULL DEFAULT 0.00,
  `SES_DTINICIO` datetime NOT NULL,
  `SES_DTTERMINO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `simbolo_frase`
--

CREATE TABLE `simbolo_frase` (
  `SIM_ID` int(10) UNSIGNED NOT NULL,
  `FRA_ID` int(10) UNSIGNED NOT NULL,
  `MID_ID` int(10) UNSIGNED NOT NULL,
  `SIM_POSICAO` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `solicitacao_afiliacao`
--

CREATE TABLE `solicitacao_afiliacao` (
  `SOL_ID` int(10) UNSIGNED NOT NULL,
  `ALU_ID` int(10) UNSIGNED NOT NULL,
  `INS_ID` int(10) UNSIGNED NOT NULL,
  `SOL_STATUS` enum('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
  `SOL_DT_SOLICITACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `SOL_DT_RESPOSTA` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `subcategoria`
--

CREATE TABLE `subcategoria` (
  `SUB_ID` int(10) UNSIGNED NOT NULL,
  `CAT_ID` int(10) UNSIGNED NOT NULL,
  `SUB_NOME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `USU_ID` int(10) UNSIGNED NOT NULL,
  `USU_NOME` varchar(100) NOT NULL,
  `USU_EMAIL` varchar(150) NOT NULL,
  `USU_TELEFONE` varchar(20) DEFAULT NULL,
  `USU_SENHA` varchar(255) NOT NULL,
  `USU_CARGO` enum('responsavel','auxiliar') NOT NULL,
  `USU_DTCAD` datetime NOT NULL DEFAULT current_timestamp(),
  `USU_DTALT` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`USU_ID`, `USU_NOME`, `USU_EMAIL`, `USU_TELEFONE`, `USU_SENHA`, `USU_CARGO`, `USU_DTCAD`, `USU_DTALT`) VALUES
(1, '', '', '', '$2b$10$F4fkdkR6sO.1EDMuwgXzQux4p3pe9butwHajhPqQPG4C.9TYueSuG', 'responsavel', '2026-05-20 09:25:39', '2026-05-20 09:25:39'),
(5, 'Vitor', 'daniel@gmail.com', '12 988774547', '$2b$10$5ys/KH6MIBv/hbEaZC/FBeMmYS/UewCUa6J5VvU.r1ZSotuGCfYZO', 'responsavel', '2026-05-22 08:28:43', '2026-05-22 08:28:43'),
(6, 'João', 'lucas@gmail.com', '12 996637203', '$2b$10$TCGPtWYVpzTat39D/.S18O1r627SqyuD8EArLZfJrsyGt2Wv37lSO', 'responsavel', '2026-05-22 08:55:27', '2026-05-22 08:55:27'),
(7, 'b', 'a@gmail.com', '1', '$2b$10$TOvx63mwxWR4DAzwYB6iA.DFRUDwrjn5lCAw8o8WmNkpMUVSIc3VG', 'responsavel', '2026-05-22 09:03:41', '2026-05-22 09:03:41');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`ALU_ID`);

--
-- Índices de tabela `aluno_auxiliar`
--
ALTER TABLE `aluno_auxiliar`
  ADD PRIMARY KEY (`ALU_ID`,`USU_ID`),
  ADD KEY `idx_ALUNO_AUXILIAR_USU` (`USU_ID`);

--
-- Índices de tabela `aluno_usuario`
--
ALTER TABLE `aluno_usuario`
  ADD PRIMARY KEY (`ALU_ID`,`USU_ID`),
  ADD KEY `idx_ALUNO_USUARIO_USU` (`USU_ID`);

--
-- Índices de tabela `atividade`
--
ALTER TABLE `atividade`
  ADD PRIMARY KEY (`ATI_ID`),
  ADD KEY `fk_ati_imagem` (`ATI_IDIMAGEM`),
  ADD KEY `fk_ati_audio` (`ATI_IDAUDIO`),
  ADD KEY `idx_atividade_sub` (`SUB_ID`);

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`CAT_ID`);

--
-- Índices de tabela `configuracao_app`
--
ALTER TABLE `configuracao_app`
  ADD PRIMARY KEY (`CON_ID`),
  ADD KEY `fk_con_USUARIO` (`USU_ID`);

--
-- Índices de tabela `evento_agenda`
--
ALTER TABLE `evento_agenda`
  ADD PRIMARY KEY (`EVE_ID`),
  ADD KEY `idx_evento_agenda_aluno` (`ALU_ID`),
  ADD KEY `idx_evento_agenda_datas` (`EVE_DT_INICIO`,`EVE_DT_FIM`);

--
-- Índices de tabela `frase`
--
ALTER TABLE `frase`
  ADD PRIMARY KEY (`FRA_ID`),
  ADD KEY `fk_fra_USUARIO` (`USU_ID`),
  ADD KEY `idx_FRASE_ALU` (`ALU_ID`);

--
-- Índices de tabela `instituicao`
--
ALTER TABLE `instituicao`
  ADD PRIMARY KEY (`INS_ID`),
  ADD UNIQUE KEY `INS_EMAIL` (`INS_EMAIL`),
  ADD UNIQUE KEY `INS_COD_ACESSO` (`INS_COD_ACESSO`);

--
-- Índices de tabela `item_rotina`
--
ALTER TABLE `item_rotina`
  ADD PRIMARY KEY (`ITE_ID`),
  ADD KEY `fk_ite_ATIVIDADE` (`ATI_ID`),
  ADD KEY `idx_ITEM_ROTINA_ROT` (`ROT_ID`);

--
-- Índices de tabela `midia`
--
ALTER TABLE `midia`
  ADD PRIMARY KEY (`MID_ID`);

--
-- Índices de tabela `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`PER_ID`),
  ADD UNIQUE KEY `uq_PERFIL_ALU` (`ALU_ID`),
  ADD KEY `idx_PERFIL_ALU` (`ALU_ID`);

--
-- Índices de tabela `relatorio`
--
ALTER TABLE `relatorio`
  ADD PRIMARY KEY (`REL_ID`),
  ADD KEY `fk_rel_USUARIO` (`USU_ID`),
  ADD KEY `idx_RELATORIO_ALU` (`ALU_ID`),
  ADD KEY `idx_RELATORIO_PERIODO` (`REL_INICIO`,`REL_FIM`);

--
-- Índices de tabela `rotina`
--
ALTER TABLE `rotina`
  ADD PRIMARY KEY (`ROT_ID`),
  ADD KEY `fk_rot_USUARIO` (`USU_ID`),
  ADD KEY `idx_ROTINA_ALU` (`ALU_ID`);

--
-- Índices de tabela `sessao_atividade`
--
ALTER TABLE `sessao_atividade`
  ADD PRIMARY KEY (`SES_ID`),
  ADD KEY `fk_ses_USUARIO` (`USU_ID`),
  ADD KEY `idx_SESSAO_ATIVIDADE_ALU` (`ALU_ID`),
  ADD KEY `idx_SESSAO_ATIVIDADE_ATI` (`ATI_ID`),
  ADD KEY `idx_SESSAO_ATIVIDADE_INI` (`SES_DTINICIO`);

--
-- Índices de tabela `simbolo_frase`
--
ALTER TABLE `simbolo_frase`
  ADD PRIMARY KEY (`SIM_ID`),
  ADD KEY `fk_sim_MIDIA` (`MID_ID`),
  ADD KEY `idx_SIMBOLO_FRASE_FRA` (`FRA_ID`);

--
-- Índices de tabela `solicitacao_afiliacao`
--
ALTER TABLE `solicitacao_afiliacao`
  ADD PRIMARY KEY (`SOL_ID`),
  ADD KEY `idx_solicitacao_aluno` (`ALU_ID`),
  ADD KEY `idx_solicitacao_inst` (`INS_ID`);

--
-- Índices de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`SUB_ID`),
  ADD KEY `idx_subcategoria_cat` (`CAT_ID`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`USU_ID`),
  ADD UNIQUE KEY `uq_USUARIO_email` (`USU_EMAIL`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `ALU_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `atividade`
--
ALTER TABLE `atividade`
  MODIFY `ATI_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `CAT_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `configuracao_app`
--
ALTER TABLE `configuracao_app`
  MODIFY `CON_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `evento_agenda`
--
ALTER TABLE `evento_agenda`
  MODIFY `EVE_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `frase`
--
ALTER TABLE `frase`
  MODIFY `FRA_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `instituicao`
--
ALTER TABLE `instituicao`
  MODIFY `INS_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `item_rotina`
--
ALTER TABLE `item_rotina`
  MODIFY `ITE_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `midia`
--
ALTER TABLE `midia`
  MODIFY `MID_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `perfil`
--
ALTER TABLE `perfil`
  MODIFY `PER_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `relatorio`
--
ALTER TABLE `relatorio`
  MODIFY `REL_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `rotina`
--
ALTER TABLE `rotina`
  MODIFY `ROT_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sessao_atividade`
--
ALTER TABLE `sessao_atividade`
  MODIFY `SES_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `simbolo_frase`
--
ALTER TABLE `simbolo_frase`
  MODIFY `SIM_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `solicitacao_afiliacao`
--
ALTER TABLE `solicitacao_afiliacao`
  MODIFY `SOL_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `SUB_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `USU_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aluno_auxiliar`
--
ALTER TABLE `aluno_auxiliar`
  ADD CONSTRAINT `fk_alau_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alau_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `aluno_usuario`
--
ALTER TABLE `aluno_usuario`
  ADD CONSTRAINT `fk_alus_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alus_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `atividade`
--
ALTER TABLE `atividade`
  ADD CONSTRAINT `fk_ati_SUBCATEGORIA` FOREIGN KEY (`SUB_ID`) REFERENCES `subcategoria` (`SUB_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ati_audio` FOREIGN KEY (`ATI_IDAUDIO`) REFERENCES `midia` (`MID_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ati_imagem` FOREIGN KEY (`ATI_IDIMAGEM`) REFERENCES `midia` (`MID_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `configuracao_app`
--
ALTER TABLE `configuracao_app`
  ADD CONSTRAINT `fk_con_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `evento_agenda`
--
ALTER TABLE `evento_agenda`
  ADD CONSTRAINT `fk_eve_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `frase`
--
ALTER TABLE `frase`
  ADD CONSTRAINT `fk_fra_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fra_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `item_rotina`
--
ALTER TABLE `item_rotina`
  ADD CONSTRAINT `fk_ite_ATIVIDADE` FOREIGN KEY (`ATI_ID`) REFERENCES `atividade` (`ATI_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ite_ROTINA` FOREIGN KEY (`ROT_ID`) REFERENCES `rotina` (`ROT_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `perfil`
--
ALTER TABLE `perfil`
  ADD CONSTRAINT `fk_per_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `relatorio`
--
ALTER TABLE `relatorio`
  ADD CONSTRAINT `fk_rel_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rel_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `rotina`
--
ALTER TABLE `rotina`
  ADD CONSTRAINT `fk_rot_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rot_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `sessao_atividade`
--
ALTER TABLE `sessao_atividade`
  ADD CONSTRAINT `fk_ses_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ses_ATIVIDADE` FOREIGN KEY (`ATI_ID`) REFERENCES `atividade` (`ATI_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ses_USUARIO` FOREIGN KEY (`USU_ID`) REFERENCES `usuario` (`USU_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `simbolo_frase`
--
ALTER TABLE `simbolo_frase`
  ADD CONSTRAINT `fk_sim_FRASE` FOREIGN KEY (`FRA_ID`) REFERENCES `frase` (`FRA_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sim_MIDIA` FOREIGN KEY (`MID_ID`) REFERENCES `midia` (`MID_ID`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `solicitacao_afiliacao`
--
ALTER TABLE `solicitacao_afiliacao`
  ADD CONSTRAINT `fk_sol_ALUNO` FOREIGN KEY (`ALU_ID`) REFERENCES `aluno` (`ALU_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sol_INSTITUICAO` FOREIGN KEY (`INS_ID`) REFERENCES `instituicao` (`INS_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `fk_sub_CATEGORIA` FOREIGN KEY (`CAT_ID`) REFERENCES `categoria` (`CAT_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

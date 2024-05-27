-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/05/2024 às 18:55
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `appexpedicao`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `auditoria`
--

CREATE TABLE `auditoria` (
  `placa` varchar(50) NOT NULL,
  `tu` varchar(50) NOT NULL,
  `uc` varchar(50) NOT NULL,
  `posicao` varchar(50) NOT NULL,
  `loja` varchar(50) NOT NULL,
  `tipologia_quantidade` varchar(250) NOT NULL,
  `user` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `auditoria`
--

INSERT INTO `auditoria` (`placa`, `tu`, `uc`, `posicao`, `loja`, `tipologia_quantidade`, `user`) VALUES
('CAY2505', '6400246082', '1000035179198', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035179217', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035179254', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035230704', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000034010528', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035028926', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035230567', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035230847', '9020-J080', 'LJ0001', '57890-', '51053528'),
('CAY2505', '6400246082', '1000035263029', '9020-J080', 'LJ0001', '21312412', '51053528');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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
-- Estrutura para tabela `desatribuicao`
--

CREATE TABLE `desatribuicao` (
  `tu` varchar(250) NOT NULL,
  `uc` varchar(250) NOT NULL,
  `tratativa` varchar(250) NOT NULL,
  `posicao_pallet` varchar(50) NOT NULL,
  `tratado` varchar(20) DEFAULT NULL,
  `user` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `desatribuicao`
--

INSERT INTO `desatribuicao` (`tu`, `uc`, `tratativa`, `posicao_pallet`, `tratado`, `user`) VALUES
('6400246082', '1000035179254', '2141241', '42141', 'Não', '51053528'),
('6400246082', '1000035179254', '2141241', '42141', 'Não', '51053528'),
('6400246082', '1000035230567', 'pallet desatribuido', '9020-J080	', 'Sim', '51053528');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

<?php
session_start();

// Conecta ao banco de dados
$conexao = new mysqli("localhost", "id22229242_root", "Banana151218@", "id22229242_appexpedicao");

// Verifica se a conexão foi bem sucedida
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Recupera os dados enviados via POST
$login = $_POST["login"];
$senha = $_POST["senha"];

// Consulta SQL para buscar o usuário
$sql = "SELECT *  FROM login WHERE user = '$login' AND password = '$senha'";
$resultado = $conexao->query($sql);

// Verifica se o usuário foi encontrado
if ($resultado->num_rows > 0) {
    // Usuário autenticado, armazena o login na variável de sessão
    $_SESSION["login"] = $login;

    // Redireciona para a página de sucesso
    header("Location: inserir_dados.php");
} else {
    // Usuário não encontrado, redireciona para acesso negado
    header("Location: acesso_negado.php");
}

// Fecha a conexão com o banco de dados
$conexao->close();

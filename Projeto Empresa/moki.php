<?php

session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION["login"])) {
    // Redireciona para a página de login
    header("Location: login.php");
    exit; // Certifica-se de que o script não continua a ser executado após o redirecionamento
}

?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <title>Moki Expedição</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <?php
    echo '<link rel="stylesheet" href="desatribuicao.css">';
    ?>

</head>

<body>

    <header class="main-menu">
        <nav class="option-menu">
            <div class="hamburger" onclick="toggleMenu()">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <div class="menu">
                <img class="dhl" src="./image/DHL_Logo.svg.png" style="width:180px; background:none;">
                <a href="http://localhost/Projeto%20Empresa/inserir_dados.php">Área Assistente</a>
                <a href="http://localhost/Projeto%20Empresa/recuperar_dados.php">Consultar Auditoria</a>
                <a href="http://localhost/Projeto%20Empresa/processar_dados.php">Auditar Carga</a>
                <a href="http://localhost/Projeto%20Empresa/moki.php">Moki</a>
                <a href="http://localhost/Projeto%20Empresa/desatribuicao.php">Desatribuição</a>
                <a href="http://localhost/Projeto%20Empresa/visualizar_desatribuidas.php">Ucs Desatribuidas</a>
                <a class="login-a" href="http://localhost/Projeto%20Empresa/login.php" style="margin-left:30vh;"><img class="loginimg" src="./image/login.png">Login</a>
            </div>
        </nav>
    </header>
    <!-- Botão que o usuário pode clicar para carregar o site -->
    <button class="moki-button" onclick="carregarSite()" style="margin-top: 10vh; padding:10px 10px;
    border:none; border-bottom:2px solid black; margin-left:30px; width:40%;">Carregar Site</button>

    <!-- O iframe onde o site será carregado -->

    <iframe id="siteFrame" width="100%" height="500" frameborder="0"></iframe>



</body>

<script>
    //Menu hamburguer
    function toggleMenu() {
        var menu = document.querySelector('.menu');
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
    }
</script>
<script>
    function carregarSite() {
        // URL do site que você deseja carregar
        var url = "https://www.site.moki.com.br/";

        // Obtém o elemento iframe
        var iframe = document.getElementById("siteFrame");

        // Define o atributo src do iframe para a URL desejada
        iframe.src = url;
    }
</script>

</html>
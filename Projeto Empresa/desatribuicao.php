<?php

session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION["login"])) {
    // Redireciona para a página de login
    header("Location: login.php");
    exit; // Certifica-se de que o script não continua a ser executado após o redirecionamento
}


// Verifica se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica se todos os campos necessários foram preenchidos
    if (isset($_POST['tu']) && isset($_POST['uc']) && isset($_POST['tratativa']) && isset($_POST['posicao'])) {
        // Estabelece a conexão com o banco de dados
        $host = "localhost";
        $username = "id22229242_root";
        $password = "Banana151218@";
        $dbname = "id22229242_appexpedicao";

        $conn = new mysqli($host, $username, $password, $dbname);

        // Verifica a conexão
        if ($conn->connect_error) {
            die("Erro de conexão: " . $conn->connect_error);
        }

        // Processa os dados do formulário
        $tu = $_POST['tu'];
        $uc = $_POST['uc'];
        $tratativa = $_POST['tratativa'];
        $posicao = $_POST['posicao'];

        // Prepara e executa a consulta SQL para inserir os dados na tabela
        $sql = "INSERT INTO desatribuicao (tu, uc, tratativa, posicao_pallet) VALUES ('$tu', '$uc', '$tratativa', '$posicao')";

        if ($conn->query($sql) === TRUE) {
            echo "Dados inseridos com sucesso!";
        } else {
            echo "Erro ao inserir dados: " . $conn->error;
        }

        $conn->close();
    } else {
        echo "Todos os campos são obrigatórios!";
    }
}

?>



<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desatribuição</title>
    <?php
    echo '<link rel="stylesheet" href="desatribuicao.css">'
    ?>
    <style>
        .login-a {
            margin-left: 150px;
        }
    </style>

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
                <a class="login-a" href="http://localhost/Projeto%20Empresa/visualizar_desatribuidas.php"> <img class="loginimg" src="./image/login.png">Login</a>
            </div>
        </nav>
    </header>

    <form action="" method="POST">
        <h1>INFORME A DESATRIBUIÇÃO E A TRATATIVA</h1>

        <label for="tu"><strong>NÚMERO DA TU:</strong></label>
        <br>
        <input type="text" id="tu" name="tu">


        <div id="ucOptions">
            <label for="uc"><strong>UCS NESTA TU:</strong></label>
            <br>
            <select id="uc" name="uc"></select>
        </div>

        <div>
            <label for="trativa" id="tratativa"><strong>TRATATIVA:</strong></label>
            <br>
            <input type="text" id="tratativa" name="tratativa">
        </div>

        <div>
            <label for="posicao" id="posicao"><strong>POSIÇÃO DO PALLET:</strong></label>
            <br>
            <input type="text" id="posicao" name="posicao">
        </div>

        <div>
            <button class="btn-form" type="submit">Enviar</button>
        </div>

    </form>

    <script>
        //Menu hamburguer
        function toggleMenu() {
            var menu = document.querySelector('.menu');
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        }
        // Função para carregar as opções de UC
        function carregarUCs() {
            var tu = document.getElementById('tu').value; // Obtém o valor de TU
            var selectUC = document.getElementById('uc'); // Obtém o elemento select

            // Limpa as opções atuais
            selectUC.innerHTML = '';

            // Faz uma requisição AJAX para obter as opções de UC
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var options = xhr.responseText; // Opções de UC retornadas pela consulta PHP
                        selectUC.innerHTML = options; // Adiciona as opções ao elemento select
                    } else {
                        selectUC.innerHTML = "<option value=''>Erro ao carregar UCs</option>"; // Exibe uma mensagem de erro em caso de falha
                    }
                }
            };
            xhr.open('GET', 'consulta.php?tu=' + tu, true);
            xhr.send();
        }

        // Chama a função carregarUCs quando o valor de TU for alterado
        document.getElementById('tu').addEventListener('change', carregarUCs);

        // Carrega as UCs na página inicialmente (se TU já estiver definido)
        carregarUCs();

        // Adiciona um event listener para capturar o valor selecionado de UC quando o formulário é submetido
        document.querySelector('form').addEventListener('submit', function(event) {
            var selectUC = document.getElementById('uc'); // Obtém o elemento select
            var selectedUCValue = selectUC.options[selectUC.selectedIndex].value; // Captura o valor selecionado de UC
            document.getElementById('uc_hidden').value = selectedUCValue; // Define o valor do campo hidden para enviar ao PHP
        });
    </script>

</body>

</html>
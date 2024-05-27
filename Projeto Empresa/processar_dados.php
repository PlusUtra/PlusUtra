<?php

session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION["login"])) {
    // Redireciona para a página de login
    header("Location: login.php");
    exit; // Certifica-se de que o script não continua a ser executado após o redirecionamento
}

// Conectar ao banco de dados
$host = "localhost";
$username = "id22229242_root";
$password = "Banana151218@";
$dbname = "id22229242_appexpedicao";

$conexao = new mysqli($host, $usuario, $senha, $banco_de_dados);

// Verificar se a conexão foi estabelecida com sucesso
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $placa = isset($_POST['placa']) ? $_POST['placa'] : '';
    $tu = isset($_POST['tu']) ? $_POST['tu'] : '';
    $uc = isset($_POST['uc']) ? $_POST['uc'] : '';
    $posicao = isset($_POST['posicao']) ? $_POST['posicao'] : '';
    $loja = isset($_POST['loja']) ? $_POST['loja'] : '';
    $tipologia_quantidade = isset($_POST['tipologia_quantidade']) ? $_POST['tipologia_quantidade'] : '';
    $usuario_logado = $_SESSION["login"];

    if (!empty($placa) && !empty($tu) && !empty($uc) && !empty($posicao) && !empty($loja)) {
        $ucs = explode("\n", $uc);
        $ucs = array_map('trim', $ucs);
        $ucs = array_filter($ucs);

        $conexao->begin_transaction();

        try {
            foreach ($ucs as $uc) {
                $sql = "INSERT INTO auditoria (placa, tu, uc, posicao, loja, tipologia_quantidade, user) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $conexao->prepare($sql);

                if ($stmt) {
                    $stmt->bind_param("sssssss", $placa, $tu, $uc, $posicao, $loja, $tipologia_quantidade, $usuario_logado);
                    if (!$stmt->execute()) {
                        throw new Exception("Erro ao inserir dados: " . $stmt->error);
                    }
                    $stmt->close();
                } else {
                    throw new Exception("Erro ao preparar a consulta: " . $conexao->error);
                }
            }
            $conexao->commit();
            echo "Dados inseridos com sucesso!";
        } catch (Exception $e) {
            $conexao->rollback();
            echo $e->getMessage();
        }
    }

    $conexao->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auditar Carga</title>
    <?php
    echo '<link rel="stylesheet" href="./inserir.css">';
    echo '<link rel="stylesheet" href="./auditoria.css">';
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
                <a class="login-a" href="http://localhost/Projeto%20Empresa/login.php"> <img class="loginimg" src="./image/login.png">Login</a>
            </div>
        </nav>
    </header>
    <div class="container">
        <h1>Auditoria de carga</h1>
        <form id="auditoriaForm" action="processar_dados.php" method="post">
            <div class="form-group">
                <label for="placa">Placa:</label>
                <input type="text" id="placa" name="placa" style="background-color: <?php echo $cor_desejada; ?>" readonly>
            </div>
            <div class="form-group">
                <label for="tu">TU:</label>
                <input type="text" id="tu" name="tu">
            </div>
            <div class="form-group">
                <label for="uc">UC:</label>
                <textarea id="uc" name="uc" style="width: 98%; height:5vh; border-radius:4px; resize: none;"></textarea>
            </div>
            <div class="form-group">
                <label for="posicao">Posição:</label>
                <input type="text" id="posicao" name="posicao" readonly>
            </div>
            <div class="form-group">
                <label for="loja">Loja:</label>
                <input type="text" id="loja" name="loja" readonly>
            </div>
            <div class="form-group">
                <label for="tipologia_quantidade">Quantidade de pallets e tipologia:</label>
                <input type="text" id="tipologia_quantidade" name="tipologia_quantidade" placeholder="Informe quantidade de palletes + tipologia">
            </div>

            <div class="form-group">
                <input type="submit" value="Enviar">
            </div>
        </form>
        <div id="resultado"></div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("tu").addEventListener("change", function() {
                var tu = this.value;
                var ucs = document.getElementById("uc").value.split("\n").map(line => line.trim()).filter(line => line).join(",");

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "buscar_dados.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var response = JSON.parse(xhr.responseText);
                        if (!response.error) {
                            document.getElementById("placa").value = response.placa;
                            document.getElementById("posicao").value = response.posicao;
                            document.getElementById("loja").value = response.loja;
                            document.getElementById("placa").setAttribute("readonly", true);
                            document.getElementById("posicao").setAttribute("readonly", true);
                            document.getElementById("loja").setAttribute("readonly", true);
                        } else {
                            alert(response.error);
                        }
                    }
                };
                xhr.send("tu=" + encodeURIComponent(tu));
            });

            document.getElementById("uc").addEventListener("input", function() {
                var tu = document.getElementById("tu").value;
                var ucs = this.value.split("\n").map(line => line.trim()).filter(line => line).join(",");

                var xhr_litigio = new XMLHttpRequest();
                xhr_litigio.open("POST", "verificar_dados.php", true);
                xhr_litigio.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr_litigio.onreadystatechange = function() {
                    if (xhr_litigio.readyState == 4 && xhr_litigio.status == 200) {
                        var response_litigio = JSON.parse(xhr_litigio.responseText);
                        if (!response_litigio.litigio) {
                            document.getElementById("resultado").innerHTML = '<p style="color: green;">Dados válidos!</p>';
                            // Habilitar o botão de envio
                            document.querySelector('input[type="submit"]').removeAttribute('disabled');
                        } else {
                            var ucsInexistentes = response_litigio.ucs_inexistentes.join(", ");
                            document.getElementById("resultado").innerHTML = '<p style="color: red;">Litígio identificado: A combinação TU-UC não é válida para os seguintes UCs: ' + ucsInexistentes + '.</p>';
                            // Desativar o botão de envio
                            document.querySelector('input[type="submit"]').setAttribute('disabled', 'disabled');
                        }
                    }
                };
                xhr_litigio.send("tu=" + encodeURIComponent(tu) + "&uc=" + encodeURIComponent(ucs));
            });
        });
    </script>
    <script>
        function toggleMenu() {
            var menu = document.querySelector('.menu');
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        }
    </script>
</body>

</html>
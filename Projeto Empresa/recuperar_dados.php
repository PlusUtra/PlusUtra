<?php

session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION["login"])) {
    // Redireciona para a página de login
    header("Location: login.php");
    exit; // Certifica-se de que o script não continua a ser executado após o redirecionamento
}


echo '<header class="main-menu">';
echo '    <nav class="option-menu">';
echo '        <div class="hamburger" onclick="toggleMenu()">';
echo '            <div class="bar"></div>';
echo '            <div class="bar"></div>';
echo '            <div class="bar"></div>';
echo '        </div>';
echo '        <div class="menu">';
echo '            <img class="dhl" src="./image/DHL_Logo.svg.png" style="width:180px; background:none;">';
echo '            <a href="http://localhost/Projeto%20Empresa/inserir_dados.php">Área Assistente</a>';
echo '            <a href="http://localhost/Projeto%20Empresa/recuperar_dados.php">Consultar Auditoria</a>';
echo '            <a href="http://localhost/Projeto%20Empresa/processar_dados.php">Auditar Carga</a>';
echo '            <a href="http://localhost/Projeto%20Empresa/moki.php">Moki</a>';
echo '            <a href="http://localhost/Projeto%20Empresa/desatribuicao.php">Desatribuição</a>';
echo '            <a href="http://localhost/Projeto%20Empresa/visualizar_desatribuidas.php">Ucs Desatribuidas</a>';
echo '            <a class="login-a" href="http://localhost/Projeto%20Empresa/login.php"> <img class="loginimg" src="./image/login.png" style="margin-left:40vh;">Login</a> ';
echo '        </div>';
echo '    </nav>';
echo '</header>';


echo '<h1>Consultar Auditoria</h1>';

// Conecta ao banco de dados
$conexao = new mysqli("localhost", "id22229242_root", "Banana151218@", "id22229242_appexpedicao");

// Verifica se a conexão foi bem sucedida
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Consulta SQL para buscar os dados da tabela "lojas"
$sql_lojas = "SELECT * FROM lojas";

// Executa a consulta
$resultado_lojas = $conexao->query($sql_lojas);

// Verifica se a consulta foi bem sucedida
if ($resultado_lojas) {
    // Array associativo para armazenar os nomes das lojas usando o ID como chave
    $nome_loja = array();

    // Itera sobre os resultados da tabela "lojas" e armazena os nomes das lojas
    while ($row_lojas = $resultado_lojas->fetch_assoc()) {
        $nome_loja[$row_lojas['id']] = $row_lojas['loja'];
    }
} else {
    echo "Erro na consulta SQL para lojas: " . $conexao->error;
}

// Consulta SQL para buscar todos os dados da tabela "app9020" e os nomes das lojas
$sql = "SELECT app9020.tu, app9020.uc, app9020.onda, app9020.posicao, app9020.loja AS nome_loja, app9020.placa, app9020.situacao, app9020.flag, app9020.user
        FROM app9020 
        JOIN lojas ON app9020.loja = lojas.id";


$resultado = $conexao->query($sql);

// Verifica se a consulta foi bem sucedida
if ($resultado) {
    echo "<table>";
    echo "<thead>";
    echo "<tr>";
    echo "<th>TU</th>";
    echo "<th>UC</th>";
    echo "<th>ONDA</th>";
    echo "<th>POSIÇÃO</th>";
    echo "<th>LOJA</th>";
    echo "<th>PLACA</th>";
    echo "<th>STATUS</th>";
    echo "<th>FLAG</th>";
    echo "<th>LDAP</th>";
    echo "</tr>";
    echo "</thead>";
    echo "<tbody>";


    // Itera sobre os resultados e os adiciona à tabela
    while ($row = $resultado->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['tu'] . "</td>";
        echo "<td>" . $row['uc'] . "</td>";
        echo "<td>" . $row['onda'] . "</td>";
        echo "<td>" . $row['posicao'] . "</td>";

        // Verifica se o nome da loja está definido no array $nome_loja
        $nome_loja_print = isset($nome_loja[$row['nome_loja']]) ? $nome_loja[$row['nome_loja']] : 'Loja não encontrada';
        echo "<td>" . $nome_loja_print . "</td>";

        echo "<td>" . $row['placa'] . "</td>";

        // Define a cor com base na situação
        $cor = ($row['situacao'] === 'Ag Auditoria') ? '#f7331e' : (($row['situacao'] === 'Auditado') ? '#17911d' : '');
        echo "<td style='background: $cor; color: white; '><strong>" . $row['situacao'] . "</strong></td>";

        // Adiciona uma caixa de seleção para editar a FLAG
        echo "<td>"; {
            // Se existir na tabela de auditoria, exibe a caixa de seleção
            echo "<select style='padding: 10px;' onchange='updateFlag(\"{$row['uc']}\", this.value)'>";
            echo "<option value=''>Selecione...</option>";
            echo "<option value='XD' " . (($row['flag'] === 'XD') ? 'selected' : '') . ">XD</option>";
            echo "<option value='STD' " . (($row['flag'] === 'STD') ? 'selected' : '') . ">STD</option>";
            echo "</select>";
        }

        echo "</td>";

        echo "<td>" . $row['user'] . "</td>";

        echo "</tr>";

        // Verifica se existe uma entrada na tabela "auditoria" para esta UC
        $uc = $row['uc'];
        $sql_auditoria = "SELECT * FROM auditoria WHERE uc = '$uc'";
        $resultado_auditoria = $conexao->query($sql_auditoria);

        if ($resultado_auditoria && $resultado_auditoria->num_rows > 0) {
            // Atualiza a situação para "Auditado" se houver uma entrada na tabela "auditoria"
            $sql_update_situacao = "UPDATE app9020 SET situacao = 'Auditado' WHERE uc = '$uc'";
            $conexao->query($sql_update_situacao);
            $row_auditoria = $resultado_auditoria->fetch_assoc();
            $user_auditoria = $row_auditoria['user'];
            // Atualiza o usuário na tabela "app9020"
            $sql_update_user = "UPDATE app9020 SET user = '$user_auditoria' WHERE uc = '$uc'";
            $conexao->query($sql_update_user);
        } else {
            // Se não houver entrada na tabela "auditoria", atualiza a situação para "Ag Auditoria"
            $sql_update_situacao = "UPDATE app9020 SET situacao = 'Ag Auditoria' WHERE uc = '$uc'";
            $conexao->query($sql_update_situacao);
        }
    }


    echo "</tbody>";
    echo "</table>";
} else {
    echo "Erro na consulta SQL: " . $conexao->error;
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <?php
    echo '<link rel="stylesheet" href="./recuperar.css">';
    ?>

    <?php
    // Verifica se a solicitação é do tipo POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Verifica se as variáveis foram recebidas
        if (isset($_POST["uc"]) && isset($_POST["flag"])) {
            // Conecta ao banco de dados
            $conexao = new mysqli("localhost", "root", "", "appexpedicao");

            // Verifica se a conexão foi bem sucedida
            if ($conexao->connect_error) {
                die("Erro de conexão: " . $conexao->connect_error);
            }

            // Recupera os dados enviados via POST
            $uc = $_POST["uc"];
            $flag = $_POST["flag"];

            // Recupera o usuário da sessão
            $user = $_SESSION["login"];

            // Atualiza a FLAG e o usuário no banco de dados
            $sql = "UPDATE app9020 SET flag = '{$flag}', user = '{$user}' WHERE uc = '{$uc}'";

            if ($conexao->query($sql) === TRUE) {
                echo "Flag e usuário atualizados com sucesso!";
            } else {
                echo "Erro ao atualizar a flag e o usuário: " . $conexao->error;
            }

            // Fecha a conexão com o banco de dados
            $conexao->close();
        } else {
            echo "Parâmetros ausentes na solicitação.";
        }
    } else {
        echo "Online !";
    }
    ?>

    <title>Consultar PEC</title>
</head>

<body>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!--Menu Hamburguer-->
    <script>
        function toggleMenu() {
            var menu = document.querySelector('.menu');
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        }
    </script>

    <script>
        function updateFlag(uc, flag) {
            // Envia uma solicitação AJAX para atualizar a coluna "FLAG" no banco de dados
            $.ajax({
                url: 'atualizar_flag.php',
                method: 'POST',
                data: {
                    uc: uc,
                    flag: flag
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    </script>



</body>

</html>
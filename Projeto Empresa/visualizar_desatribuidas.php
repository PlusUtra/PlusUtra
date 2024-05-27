<?php
session_start(); // Iniciar a sessão

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

// Atualiza o tratado na tabela desatribuicao
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["uc"]) && isset($_POST["tratado"])) {
    $uc = $conn->real_escape_string($_POST["uc"]);
    $tratado = $conn->real_escape_string($_POST["tratado"]);
    $user = isset($_SESSION["login"]) ? $_SESSION["login"] : 'anonimo'; // Assumindo que o usuário está armazenado na sessão

    $sql_update = "UPDATE desatribuicao SET tratado = '$tratado', user = '$user' WHERE uc = '$uc'";

    if ($conn->query($sql_update) === TRUE) {
        echo "Registro atualizado com sucesso!";
    } else {
        echo "Erro ao atualizar o registro: " . $conn->error;
    }

    $conn->close();
    exit;
}

// Consulta SQL para buscar todos os dados da tabela "desatribuicao"
$sql = "SELECT * FROM desatribuicao";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dados de Desatribuição</title>
    <link rel="stylesheet" href="desatribuicao.css">
</head>

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
            <a class="login-a" href="http://localhost/Projeto%20Empresa/visualizar_desatribuidas.php" style="margin-left:40vh;"> <img class="loginimg" src="./image/login.png">Login</a>
        </div>
    </nav>
</header>

<body>
    <h1>Dados de Desatribuição</h1>

    <table>
        <thead>
            <tr>
                <th>TU</th>
                <th>UC</th>
                <th>TRATIVA</th>
                <th>POSIÇÃO DO PALLET</th>
                <th>TRATADO ?</th>
                <th>LDAP</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row['tu'] . "</td>";
                    echo "<td>" . $row['uc'] . "</td>";
                    echo "<td>" . $row['tratativa'] . "</td>";
                    echo "<td>" . $row['posicao_pallet'] . "</td>";
                    echo "<td>";
                    echo "<select style='padding: 10px; width:10vh;' onchange='updateTratado(\"{$row['uc']}\", this.value)'>";
                    echo "<option value='' selected disabled>Selecionar</option>";
                    echo "<option value='Sim' " . (($row['tratado'] === 'Sim') ? 'selected' : '') . ">Sim</option>";
                    echo "<option value='Não' " . (($row['tratado'] === 'Não') ? 'selected' : '') . ">Não</option>";
                    echo "</select>";
                    echo "</td>";
                    echo "<td>" . $row['user'] . "</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='6'>Nenhum registro encontrado</td></tr>";
            }
            ?>
        </tbody>
    </table>

    <script>
        //Menu hamburguer
        function toggleMenu() {
            var menu = document.querySelector('.menu');
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        }

        // Função para atualizar o tratado na tabela desatribuicao
        function updateTratado(uc, tratado) {
            // Envia uma solicitação AJAX para atualizar o tratado na tabela desatribuicao
            var formData = new FormData();
            formData.append('uc', uc);
            formData.append('tratado', tratado);

            fetch('visualizar_desatribuidas.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('Erro:', error));
        }
    </script>

</body>

</html>

<?php
// Fecha a conexão com o banco de dados
$conn->close();
?>
<?php
session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION["login"])) {
    // Redireciona para a página de login
    header("Location: login.php");
    exit; // Certifica-se de que o script não continua a ser executado após o redirecionamento
}

// Verifica se a requisição é do tipo POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica se os dados foram enviados
    if (!isset($_POST["texto"])) {
        echo json_encode(["status" => "error", "message" => "Nenhum dado enviado."]);
        exit();
    }

    // Recebe os dados enviados pelo JavaScript
    $dados = $_POST["texto"];

    // Conecta ao banco de dados
    $conexao = new mysqli("localhost", "id22229242_root", "Banana151218@", "id22229242_appexpedicao");

    // Verifica se a conexão foi bem sucedida
    if ($conexao->connect_error) {
        echo json_encode(["status" => "error", "message" => "Erro de conexão: " . $conexao->connect_error]);
        exit();
    }

    // Prepara a query para inserção
    $sql_inserir = "INSERT INTO app9020 (placa, onda, uc, tipologia, peso, posicao, fifo, loja, chave, tu, situacao, flag, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_inserir = $conexao->prepare($sql_inserir);

    // Verifica se a preparação da consulta foi bem sucedida
    if (!$stmt_inserir) {
        echo json_encode(["status" => "error", "message" => "Erro na preparação da consulta: " . $conexao->error]);
        exit();
    }

    $dadosInseridos = [];

    // Recebe os dados individuais
    $parsedData = explode("\n", $dados);
    foreach ($parsedData as $row) {
        $rowData = explode("\t", $row);

        // Atribuir valores às variáveis para a inserção
        list($placa, $onda, $uc, $tipologia, $peso, $posicao, $fifo, $loja, $chave, $tu, $situacao, $flag, $user) = $rowData;

        // Define a situação como "Ag Auditoria" por padrão
        $situacao = "Ag Auditoria";

        // Verifica se STATUS e FLAG estão vazios e atribui NULL se for o caso
        $flag = empty($flag) ? null : $flag;

        // Executar a inserção
        $stmt_inserir->bind_param("sssssssssssss", $placa, $onda, $uc, $tipologia, $peso, $posicao, $fifo, $loja, $chave, $tu, $situacao, $flag, $user);
        $stmt_inserir->execute();
        if ($stmt_inserir->affected_rows > 0) {
            $dadosInseridos[] = $row;
        } else {
            // Se a inserção falhar, adicionamos uma mensagem de erro à resposta JSON
            echo json_encode(["status" => "error", "message" => "Erro ao inserir dados: " . $stmt_inserir->error]);
            exit();
        }
    }

    // Fecha a declaração preparada e a conexão com o banco de dados
    $stmt_inserir->close();
    $conexao->close();

    // Retorna a resposta
    echo json_encode([
        "status" => "success",
        "message" => "Dados processados.",
        "dadosInseridos" => $dadosInseridos
    ]);
    exit(); // Certifica-se de que nada mais é enviado depois da resposta JSON
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="inserir.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>Área do assistente</title>
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

    <h1>INSERÇÃO DE PEC</h1>
    <textarea id="itemInput" placeholder="Insira os dados"></textarea>
    <button onclick="addData()">Adicionar Dados</button>
    <div id="responseMessage"></div>
    <table id="itemTable">
        <thead>
            <tr id="tableHeaders">
                <th>PLACA</th>
                <th>ONDA</th>
                <th>UC</th>
                <th>TIPOLOGIA</th>
                <th>PESO</th>
                <th>POSIÇÃO</th>
                <th>FIFO</th>
                <th>LOJA</th>
                <th>CHAVE</th>
                <th>TU</th>
                <th>STATUS</th>
                <th>FLAG</th>
            </tr>
        </thead>
        <tbody id="itemTableBody"></tbody>
    </table>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script>
        //Menu hamburguer
        function toggleMenu() {
            var menu = document.querySelector('.menu');
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        }

        function addData() {
            var itemInput = document.getElementById("itemInput").value;

            $.ajax({
                url: 'inserir_dados.php',
                method: 'POST',
                data: {
                    texto: itemInput
                },
                success: function(response) {
                    var responseData = JSON.parse(response);
                    if (responseData.status === "success") {
                        var message = "Dados inseridos com sucesso!\n";
                        if (responseData.dadosInseridos.length > 0) {
                            message += "Os seguintes dados foram inseridos:\n" + responseData.dadosInseridos.join("\n");
                            // Chama a função para atualizar a tabela com os novos dados
                            updateTable(responseData.dadosInseridos);
                        }
                        document.getElementById("responseMessage").innerHTML = message;
                    } else {
                        document.getElementById("responseMessage").innerHTML = responseData.message;
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        // Função para atualizar a tabela HTML com os dados inseridos
        function updateTable(dados) {
            var tableBody = document.getElementById("itemTableBody");
            dados.forEach(function(dado) {
                var rowData = dado.split("\t");
                var row = document.createElement("tr");
                rowData.forEach(function(cellData) {
                    var cell = document.createElement("td");
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        }
    </script>

</body>

</html>
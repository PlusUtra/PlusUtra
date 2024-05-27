<?php
// Verifica se a solicitação é do tipo POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica se as variáveis foram recebidas
    if (isset($_POST["uc"]) && isset($_POST["flag"])) {
        // Conecta ao banco de dados
        $conexao = new mysqli("localhost", "id22229242_root", "Banana151218@", "id22229242_appexpedicao");
        // Verifica se a conexão foi bem sucedida
        if ($conexao->connect_error) {
            die("Erro de conexão: " . $conexao->connect_error);
        }

        // Recupera os dados enviados via POST
        $uc = $_POST["uc"];
        $flag = $_POST["flag"];

        // Atualiza a FLAG no banco de dados
        $sql = "UPDATE app9020 SET flag = '{$flag}' WHERE uc = '{$uc}'";

        if ($conexao->query($sql) === TRUE) {
            echo "Flag atualizada com sucesso!";
        } else {
            echo "Erro ao atualizar a flag: " . $conexao->error;
        }

        // Fecha a conexão com o banco de dados
        $conexao->close();
    } else {
        echo "Parâmetros ausentes na solicitação.";
    }
}

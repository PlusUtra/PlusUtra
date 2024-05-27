<?php
$host = "localhost";
$username = "id22229242_root";
$password = "Banana151218@";
$dbname = "id22229242_appexpedicao";

$conexao = new mysqli($host, $usuario, $senha, $banco_de_dados);

if ($conexao->connect_error) {
    die(json_encode(["error" => "Erro de conexão: " . $conexao->connect_error]));
}

$tu = isset($_POST['tu']) ? $_POST['tu'] : '';

$response = ["error" => ""];

if (!empty($tu)) {
    $sql = "SELECT placa, posicao, loja FROM app9020 WHERE tu = ?";
    $stmt = $conexao->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $tu);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $response["placa"] = $row["placa"];
            $response["posicao"] = $row["posicao"];
            $response["loja"] = $row["loja"];
        } else {
            $response["error"] = "TU não encontrado.";
        }

        $stmt->close();
    } else {
        $response["error"] = "Erro ao preparar a consulta: " . $conexao->error;
    }
}

echo json_encode($response);
$conexao->close();

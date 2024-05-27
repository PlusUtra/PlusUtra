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
$ucs = isset($_POST['uc']) ? explode(",", $_POST['uc']) : [];

$response = [
    "litigio" => false,
    "error" => "",
    "ucs_inexistentes" => []
];

if (!empty($tu) && !empty($ucs)) {
    $sql = "SELECT uc FROM app9020 WHERE tu = ?";
    $stmt = $conexao->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $tu);
        $stmt->execute();
        $result = $stmt->get_result();

        $uc_encontrados = [];
        while ($row = $result->fetch_assoc()) {
            $uc_encontrados[] = $row['uc'];
        }

        foreach ($ucs as $uc) {
            if (!in_array($uc, $uc_encontrados)) {
                $response["litigio"] = true;
                $response["ucs_inexistentes"][] = $uc;
            }
        }

        $stmt->close();
    } else {
        $response["error"] = "Erro ao preparar a consulta: " . $conexao->error;
    }
}

echo json_encode($response);
$conexao->close();

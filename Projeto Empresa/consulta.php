<?php
// Conectar ao banco de dados
$host = 'localhost';
$usuario = 'root';
$senha = '';
$banco_de_dados = 'appexpedicao';

$conexao = new mysqli($host, $usuario, $senha, $banco_de_dados);

// Verificar se a conexão foi estabelecida com sucesso
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Verificar se o campo TU foi enviado
if (isset($_GET['tu'])) {
    $tu = $_GET['tu'];

    // Consultar todas as linhas da coluna UC que contêm o valor de TU fornecido
    $sql = "SELECT UC FROM app9020 WHERE TU = '$tu'";
    $result = $conexao->query($sql);

    if ($result->num_rows > 0) {
        // Iniciar a tag select
        $options = "";

        // Adicionar as options
        while ($row = $result->fetch_assoc()) {
            $options .= "<option value='" . $row['UC'] . "'>" . $row['UC'] . "</option>";
        }

        // Imprimir as options na posição desejada
        echo $options;
    } else {
        echo "<option value=''>Nenhuma UC encontrada</option>";
    }
}

$conexao->close();
?>

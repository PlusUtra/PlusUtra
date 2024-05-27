<!DOCTYPE html>
<html lang="pt-br">

<head>
    <title>Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="./login.css">
</head>

<body>
    <div class="login-container">
        <?php
        session_start();
        if (isset($_SESSION['login'])) {
            echo '<p>Bem-vindo, ' . $_SESSION['login'] . '</p>';
            echo '<form action="logout.php" method="post">';
            echo '<input type="submit" name="logout" value="Finalizar sessão">';
            echo '</form>';
        } else {
            echo '<img src="./image/DHL_Logo.svg.png" alt="Logo">';
            echo '<form class="processar-login" action="processar_login.php" method="post">';
            echo '<input type="text" name="login" placeholder="Login" required autocomplete="off"><br>';
            echo '<input type="password" name="senha" placeholder="Senha" required autocomplete="off"><br>';
            echo '<input type="submit" value="Entrar">';
            echo '</form>';
        }
        ?>

    </div>
</body>

</html>
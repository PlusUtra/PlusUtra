<?php
session_start();

// Destruir todas as variáveis de sessão.
$_SESSION = array();

// Se a sessão estava sendo utilizada, é boa prática removê-la.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destrua a sessão.
session_destroy();

// Redirecionar de volta para a página de login.
header("Location: login.php");
exit;
?>

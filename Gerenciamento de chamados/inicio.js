function redirectToPage(pageName) {
    // Construa o nome do arquivo com base no nome da página
    var pageUrl = pageName + ".html";

    // Redireciona para a página correspondente
    window.location.href = pageUrl;
}

// Função para verificar se o usuário está logado
function checkLogin() {
    // Verifique se o e-mail está salvo no localStorage
    var email = localStorage.getItem('email');
    
    if (!email) {
        // Se não houver e-mail no localStorage, redirecione para a página de login
        window.location.href = "login.html";
    }
}

// Chame essa função no início de suas páginas onde a validação de login é necessária
checkLogin();


// Função para deslogar o usuário
document.querySelector(".deslogar button").addEventListener("click", function() {
    // Limpa as informações do usuário armazenadas no sessionStorage ou localStorage
    sessionStorage.clear();  // Limpa a sessão
    localStorage.clear();    // Caso queira limpar também o localStorage
    
    // Redireciona para a página de login
    window.location.href = "login.html";
});


// Recupera o nome do usuário logado do sessionStorage
var loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    // Exibe o nome do usuário na tela
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";

    // Verifica se o usuário é "ADMIN"
    if (loggedInUser === "ADMIN") {
        // Se o usuário for "ADMIN", esconde todos os cards, exceto o "Base CD" (card 3) e "Gerenciamento de Chamados" (card 7)
        document.getElementById("card2").style.display = "none"; // Solicitar Senha LDAP
        document.getElementById("card4").style.display = "none"; // Status do Chamado
        document.getElementById("card5").style.display = "none"; // Ldap/Senha
        document.getElementById("card6").style.display = "none"; // Alteração de missão
    } else {
        // Se o usuário não for "ADMIN", esconde os cards de "Base CD" (card 3) e "Gerenciamento de Chamados" (card 7)
        document.getElementById("card3").style.display = "none"; // Base CD
        document.getElementById("card7").style.display = "none"; // Gerenciamento de Chamados
    }

} else {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "login.html";
}



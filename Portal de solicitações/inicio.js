import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbiG8N7mdznEZxpE9p0zlWasNT6bGDB3E",
    authDomain: "oms-a-c9762.firebaseapp.com",
    databaseURL: "https://oms-a-c9762-default-rtdb.firebaseio.com",
    projectId: "oms-a-c9762",
    storageBucket: "oms-a-c9762.firebasestorage.app",
    messagingSenderId: "571808116138",
    appId: "1:571808116138:web:3064f5406322204299cfd3",
    measurementId: "G-Q98PRFJMYN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Função para redirecionamento dos cards
function redirectToPage(pageName) {
    window.location.href = pageName + ".html";  // Redireciona para a página
}

// Evento de clique no botão de login
document.addEventListener("DOMContentLoaded", function () {
    // Listener para o botão de deslogar
    document.querySelector(".deslogando").addEventListener("click", function() {
        sessionStorage.clear();  // Limpa a sessão
        window.location.href = "index.html.html";  // Redireciona para a página de login
    });

    // Verificar se o usuário está logado
    verifyLoggedInUser();
    checkLogin();
});

// Função para verificar se o usuário está logado
function checkLogin() {
    var loggedInUser = sessionStorage.getItem('loggedInUser');  // Verifica se o nome do usuário está no sessionStorage
    
    if (!loggedInUser) {
        window.location.href = "index.html";  // Redireciona para a página de login
    }
}

// Função para verificar o usuário logado e ajustar o conteúdo da página
function verifyLoggedInUser() {
    var loggedInUser = sessionStorage.getItem("loggedInUser");  // Recupera o nome do usuário logado do sessionStorage
    
    if (loggedInUser) {
        document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";
        
        // Condicional para exibir ou esconder os cards dependendo do tipo de usuário
        if (loggedInUser === "ADMIN") {
            // Se for "ADMIN", esconde alguns cards
            document.getElementById("card2").style.display = "none"; // Solicitar Senha LDAP
            document.getElementById("card4").style.display = "none"; // Status do Chamado
            document.getElementById("card5").style.display = "none"; // Ldap/Senha
            document.getElementById("card6").style.display = "none"; // Alteração de missão
        } else {
            // Se não for "ADMIN", esconde outros cards
            document.getElementById("card3").style.display = "none"; // Base CD
            document.getElementById("card7").style.display = "none"; // Gerenciamento de Chamados
        }
    } else {
        window.location.href = "index.html.html";  // Redireciona para a página de login
    }
}

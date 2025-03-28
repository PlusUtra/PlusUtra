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

document.getElementById("verifyButton").addEventListener("click", function() {
    var enteredLdap = document.getElementById("verificationCodeEmail").value;  // Renomeado para LDAP
    var enteredCode = document.getElementById("verificationCode").value;
    var errorMessage = document.getElementById("error-message");

    // Validar se os campos de LDAP e código estão preenchidos
    if (!enteredLdap || !enteredCode) {
        errorMessage.textContent = "Por favor, preencha ambos os campos.";
        errorMessage.style.display = "block";
        return;
    }

    // Verificar o usuário no Firebase
    checkUserInFirebase(enteredLdap, enteredCode);
});

// Função para verificar se o usuário está no Firebase
function checkUserInFirebase(enteredLdap, enteredCode) {
    const db = getDatabase();  // Obtém o banco de dados do Firebase
    const userRef = ref(db, 'Login');  // Refere-se à tabela/coleção de usuários no Firebase
    const ldapQuery = query(userRef, orderByChild('ldap'), equalTo(enteredLdap));  // Alterado para verificar LDAP diretamente

    get(ldapQuery).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const storedLdap = userData.ldap;  // Obtendo o código LDAP do usuário
                const storedPassword = userData.Senha;  // Obtendo a senha armazenada

                // Verificar se o LDAP e a senha são válidos
                if (storedLdap === enteredLdap && storedPassword === enteredCode) {
                    // Se LDAP e senha forem válidos, mostra uma mensagem de sucesso
                    alert("Usuário autenticado: " + userData.nome);  // Exibe o nome do usuário

                    // Armazena o nome do usuário no sessionStorage e na variável
                    sessionStorage.setItem("loggedInUser", userData.nome);
                    var loggedInUser = userData.nome;  // Variável que armazena o nome do usuário logado

                    // Para garantir que o nome do usuário pode ser acessado em outros locais do sistema
                    console.log("Nome do usuário logado: " + loggedInUser);  // Exibe o nome do usuário no console (para depuração)

                    // Redireciona para a página principal após 2 segundos
                    setTimeout(function() {
                        window.location.href = "inicio.html";  // Redireciona para a página principal
                    }, 2000);  // 2000 ms = 2 segundos

                } else {
                    alert("Código LDAP ou senha inválidos.");  // Exibe uma mensagem de erro se a senha ou LDAP estiverem incorretos
                }
            });
        } else {
            alert("LDAP não encontrado.");  // Exibe uma mensagem se o LDAP não for encontrado no banco de dados
        }
    }).catch((error) => {
        console.error("Erro ao consultar o banco de dados", error);  // Exibe erro no console se algo falhar na consulta
        alert("Houve um erro ao tentar verificar o LDAP. Tente novamente.");
    });
}

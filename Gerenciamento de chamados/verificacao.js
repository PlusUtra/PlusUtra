import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";


// Lista de usuários válidos (com o código LDAP e nome)
const validUsers = {
    
    "123456": "DIEPPE LUIGI",
    "51050244": "ADMIN"
};

// Função para verificar o código LDAP
document.getElementById("verifyButton").addEventListener("click", function() {
    var enteredCode = document.getElementById("verificationCode").value;
    var errorMessage = document.getElementById("error-message");

    // Verifica se o código de verificação está na lista de usuários válidos
    if (validUsers[enteredCode]) {
        // Código válido, exibe o nome do usuário para confirmação
        alert("Código válido! Bem-vindo, " + validUsers[enteredCode] + "!");

        // Armazena o nome do usuário no sessionStorage
        sessionStorage.setItem("loggedInUser", validUsers[enteredCode]);

        // Redireciona para a página principal após 2 segundos
        setTimeout(function() {
            window.location.href = "inicio.html";  // Redireciona para a página principal
        }, 2000);  // 2000 ms = 2 segundos

    } else {
        // Código inválido
        errorMessage.textContent = "Código inválido ou não autorizado.";
        errorMessage.style.display = "block";
    }
});

// Função para verificar se o código LDAP existe no Firebase
function checkUserInFirebase(email) {
    const db = getDatabase();  // Obtém o banco de dados do Firebase
    const userRef = ref(db, 'Gestoes');  // Refere-se à tabela/coleção de usuários no Firebase
    const emailQuery = query(userRef, orderByChild('email'), equalTo(email));

    get(emailQuery).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const ldap = userData.ldap;  // Obtendo o código LDAP do usuário

                // Verificar se o LDAP do usuário está na lista de códigos válidos
                if (validUsers[ldap]) {
                    alert("Usuário encontrado: " + validUsers[ldap]);
                    // Caso queira fazer algum redirecionamento ou ação adicional
                } else {
                    alert("Código LDAP inválido.");
                }
            });
        } else {
            alert("E-mail não encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao consultar o banco de dados", error);
    });
}

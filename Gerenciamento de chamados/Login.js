import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, equalTo, update } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("logar").addEventListener("click", function() {
    var email = document.getElementById("name").value;
    var errorMessage = document.getElementById("error-message");

    console.log("E-mail informado:", email); // Log do e-mail informado pelo usuário

    // Garantir que o e-mail não seja vazio ou inválido
    if (!email || !validateEmail(email)) {
        showErrorMessage("Por favor, insira um e-mail válido.");
        return;
    }

    const userRef = ref(db, 'Gestoes'); // Certifique-se de que a variável db está correta
    const emailQuery = query(userRef, orderByChild('email'), equalTo(email));

    get(emailQuery).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("E-mail encontrado no Firebase");

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                console.log("Dados do usuário:", userData); // Log dos dados do usuário
                
                var validationCode = Math.floor(100000 + Math.random() * 900000); 
                var expirationTime = Date.now() + 2 * 60 * 1000;

                update(ref(db, 'Gestoes/' + childSnapshot.key + '/validationCode'), {
                    code: validationCode,
                    expiresAt: expirationTime
                }).then(() => {
                    console.log("Código de validação atualizado com sucesso.");
                    sendEmail(email, validationCode);

                    localStorage.setItem('validationCodeExpiresAt', expirationTime);
                    localStorage.setItem('email', email);
                    window.location.href = "verificacao.html";  // Redireciona apenas após sucesso
                }).catch((error) => {
                    console.error("Erro ao atualizar o código de validação:", error);
                    showErrorMessage("Erro ao processar a solicitação. Tente novamente.");
                });
            });
        } else {
            console.log("E-mail não encontrado no Firebase");
            showErrorMessage("E-mail não encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao consultar o banco de dados", error);
        showErrorMessage("Erro ao consultar o banco de dados. Tente novamente mais tarde.");
    });
});

// Função para validar o formato do e-mail
function validateEmail(email) {
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Função para enviar o e-mail com o código
function sendEmail(email, validationCode) {
    // Configuração do serviço de e-mail
    const serviceID = "default_service";  // Substitua pelo seu service ID do EmailJS
    const templateID = "template_8o9ymee";  // Substitua pelo seu template ID do EmailJS
    const userID = "6DMTvx8AVYQvJMev";  // Substitua pela sua Public Key (userID) do EmailJS

    const templateParams = {
        to_email: email,
        validation_code: validationCode
    };

    // Enviar o e-mail
    emailjs.send(serviceID, templateID, templateParams, userID)
        .then(function(response) {
            console.log("E-mail enviado com sucesso", response);
        }, function(error) {
            console.log("Erro ao enviar e-mail", error);
            showErrorMessage("Erro ao enviar o e-mail. Tente novamente.");
        });
}

// Função para mostrar a mensagem de erro
function showErrorMessage(message) {
    var errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(function() {
        errorMessage.style.display = "none";
    }, 4000);
}

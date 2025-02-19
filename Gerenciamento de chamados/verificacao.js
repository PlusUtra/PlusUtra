import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";


// Lista de usuários válidos (com o código LDAP e nome)
const validUsers = {
    "51066709": "ADRIANA CIPOLLA GEREVINI MARTINS",
    "51038694": "AILTON DOS SANTOS SILVA",
    "51039494": "ALAN DA SILVA ALVES",
    "51031834": "ALESSANDRO FUMANI DE LIMA",
    "9827261": "ALEX DE LUCCA FIGLIOLINO",
    "51038307": "ALEX PEREIRA DE OLIVEIRA",
    "51032200": "ALEXANDRE COSME MANOEL",
    "51057102": "BRUNO CARVALHO DE OLIVEIRA",
    "51037854": "BRUNO RODRIGUES COIMBRA",
    "51055819": "BRUNO SILVA FARIAS",
    "9815198": "CAROLINE ALVES FREIRE",
    "51050579": "CLAUDIO OLIVEIRA DA SILVA",
    "51037433": "CLETON PINTO DE MACEDO",
    "51066553": "DANIEL FERREIRA MARQUES",
    "51067141": "DEBORA MARIA CAJUEIRO DIAS",
    "51050218": "DOUGLAS DOS SANTOS MAGALHAES",
    "51055764": "EDUARDA SA VIEIRA SANTOS",
    "51065275": "EDUARDO PEREIRA DOS SANTOS",
    "51045523": "EDVALDO LUIZ CORREIA NETO",
    "51049460": "EMERSON CERQUEIRA DO CANTO",
    "51050730": "ESTENIO DE PAULA ANDRADE DE LIMA",
    "51065590": "EVELYN LIMA DE ALENCAR",
    "51023292": "FERNANDO HENRIQUE DA SILVA",
    "51055392": "FERNANDO RODRIGUES DOS SANTOS",
    "9803245": "GILSON FELIPE DA SILVA BARBOSA",
    "9817065": "GREICY KELLY DE SOUZA ZANATA PINHEIRO",
    "guidelim": "GUILHERME LUIS DE LIMA",
    "51054039": "HENRIQUE CURCINO RIBEIRO",
    "51037596": "HUGO LEONARDO DOS SANTOS",
    "51055763": "IGOR GOMES DA MATA",
    "51050927": "JAIME DIAS GOMES DA SILVA",
    "51049163": "JAIME SOARES DA SILVA",
    "51049539": "JEFFERSON CRUZ DEL GELMO",
    "51060899": "JEISA FERREIRA DE FARIAS",
    "51061784": "JOSE KELVIN NUNES GOMES",
    "51055835": "JUAN FERREIRA BATISTA",
    "51065595": "JUNIO BILL DA SILVA",
    "9889492": "KAROLINE ARIELEN FERREIRA DOS SANTOS",
    "51049164": "LAISE NEVES DE PAULA",
    "51058093": "LEANDRO BEZERRA DE VASCONCELOS",
    "51029001": "LEONARDO CATANDUBA DA SILVA SANTOS",
    "9819091": "LEONARDO GONCALVES",
    "51064903": "LUANA CARDOSO DO NASCIMENTO",
    "51055398": "LUCAS FERNANDO MAGALHAES",
    "51050822": "LUCAS HENRY LOPES",
    "51050849": "LUCI MARIA DA SILVA",
    "51064420": "LUIZ GUILHERME PASCHOAL",
    "51059070": "LUZIANNE BATISTA DE SOUTO",
    "51064222": "MADSON FELIPE LEITE DE LIRA",
    "51049454": "MARCELA MORAES DE OLIVEIRA",
    "51000181": "MARCOS ANTONIO DE LIMA",
    "51061548": "MARQUITSON JOSE VALE",
    "51050505": "MATEUS HENRIQUE DE ABREU ROCCO",
    "51067143": "MATHEUS HONORIO DE LIMA",
    "51060902": "MAYARA MACHADO SANTANA",
    "51067133": "MICAEL DAIAMA DE SOUZA",
    "51067134": "MILSON SILVA DE JESUS",
    "51058725": "MURILO AUGUSTO MENEZES DOS SANTOS",
    "9808391": "ODIRLEI UMBELINO PEREIRA",
    "51038105": "PATRICIA RODRIGUES BATISTA DA SILVA",
    "51049840": "PAULO HENRIQUE ORDONIO DA SILVA",
    "51059355": "PEDRO EDUARDO MEDEIROS DO CARMO",
    "51061507": "PEDRO HENRIQUE ELOI CARDOSO SANTOS",
    "1500587": "PIERRE APARECIDO DE CAMARGO",
    "51058540": "RAFAEL CATIOLLO",
    "51061177": "RAPHAEL GUIMARAES FARRAO",
    "51051103": "RENATO LIMA GALENI",
    "51050573": "ROSANGELA DE JESUS MATOS",
    "51055395": "ROSIMEIRE MAYRA SOLLNER",
    "51062841": "SANDRA APARECIDA ALVES PEREIRA CRISPIM",
    "51049168": "SHIRLEI SATURNINO DOS SANTOS",
    "51050731": "TAMIRES DA SILVA ANDRE",
    "51066414": "THIAGO SOUZA FERNANDES DA SILVA",
    "51042233": "URIEL PRACHEDES TRINDADE DE JESUS",
    "51050078": "VINICIUS ANTUNES DE BRITO",
    "51060436": "VINICIUS AUGUSTO DA SILVA FERREIRA",
    "51055912": "VINICIUS ENRIQUE RIBEIRO SANTOS",
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
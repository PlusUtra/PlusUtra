 // Importando as funções do Firebase
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
 import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
 
const firebaseConfig = {
    apiKey: "-",
    authDomain: "-",
    databaseURL: "-",
    projectId: "-",
    storageBucket: "-",
    messagingSenderId: "-",
    appId: "-",
    measurementId: "-"
};


 // Inicializa o Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);

 // Função para recuperar dados do Firebase e preencher a tabela
 async function fetchData() {
     const tableBody = document.getElementById("tabela-body");
     const dbRef = ref(db, "users"); // Referência ao nó 'users' no Firebase

     try {
         // Recupera os dados do Firebase
         const snapshot = await get(dbRef);
         
         if (snapshot.exists()) {
             // Preenche a tabela com os dados
             snapshot.forEach((childSnapshot) => {
                 const userData = childSnapshot.val();
                 
                 // Cria uma nova linha da tabela para cada usuário
                 const row = document.createElement("tr");
                 row.innerHTML = `
                     <td>${userData.nome}</td>
                     <td>${userData.cargo}</td>
                     <td>${userData.gestor}</td>
                     <td>${userData.ldap}</td>
                 `;
                 tableBody.appendChild(row);
             });
         } else {
             console.log("Nenhum dado encontrado.");
         }
     } catch (error) {
         console.error("Erro ao recuperar dados do Firebase: ", error);
     }
 }

 // Chama a função para preencher a tabela quando a página for carregada
 fetchData();

 
        // Captura o elemento de busca e a tabela
        document.getElementById("search").addEventListener("input", function() {
            let searchValue = this.value.toLowerCase().trim(); // Obtém o valor da pesquisa
            let table = document.getElementById("tabela"); // Captura a tabela
            let rows = table.getElementsByTagName("tr"); // Obtém todas as linhas da tabela (exceto o cabeçalho)
            
            // Itera sobre as linhas da tabela (começando de 1 para pular o cabeçalho)
            for (let i = 1; i < rows.length; i++) {
                let cells = rows[i].getElementsByTagName("td"); // Obtém todas as células da linha
                
                // Se o nome na primeira coluna corresponder ao valor de busca
                let nameCellValue = cells[0].textContent.toLowerCase().trim();
                
                // Verifica se o nome da linha corresponde ao valor de pesquisa
                if (nameCellValue.indexOf(searchValue) !== -1) {
                    rows[i].style.display = ""; // Exibe a linha
                } else {
                    rows[i].style.display = "none"; // Oculta a linha
                }
            }
        });

        // Recupera o nome do usuário logado do sessionStorage
var loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    // Exibe o nome do usuário na tela, por exemplo:
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";
} else {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "index.html";
}

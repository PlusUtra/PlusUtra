// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQgBecZxzPAAAgEu3fDRGCbdClrP-0HKo",
    authDomain: "portal-troca-turno.firebaseapp.com",
    databaseURL: "https://portal-troca-turno-default-rtdb.firebaseio.com",
    projectId: "portal-troca-turno",
    storageBucket: "portal-troca-turno.firebasestorage.app",
    messagingSenderId: "608578837996",
    appId: "1:608578837996:web:6efae1d9d945c88b5b74c9",
    measurementId: "G-6K18TSHYJ7"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variável global para armazenar todos os comentários carregados
let allComments = [];

// Função para carregar os comentários do Firebase
function loadFeed() {
    const feedContainer = document.getElementById("feed");
    const comentariosRef = ref(db, "Comentários");

    onValue(comentariosRef, (snapshot) => {
        feedContainer.innerHTML = ""; // Limpa o feed antes de atualizar

        if (snapshot.exists()) {
            allComments = Object.values(snapshot.val()).reverse(); // Salva todos os comentários

            // Exibir todos os comentários no início
            displayFeed(allComments);
        } else {
            feedContainer.innerHTML = "<p>Nenhuma publicação encontrada.</p>";
        }
    });
}

// Função para exibir os comentários na tela
function displayFeed(comments) {
    const feedContainer = document.getElementById("feed");
    feedContainer.innerHTML = ""; // Limpa o feed antes de atualizar

    if (comments.length === 0) {
        feedContainer.innerHTML = "<p>Nenhuma publicação encontrada.</p>";
        return;
    }

    comments.forEach(comentario => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Substituir quebras de linha (\n) por <br> para exibição correta
        const observacoesFormatadas = comentario.observacoes.replace(/\n/g, "<br>");

        postDiv.innerHTML = `
            <strong>${comentario.nome} - ${comentario.area} </strong>
            <p>📅 ${comentario.data}</p>
            <p>🕒 Turno: ${comentario.turno}</p>
            <p>🔄 Troca com: ${comentario.trocaTurno}</p>
            <p>📝 ${observacoesFormatadas}</p>
        `;
        feedContainer.appendChild(postDiv);
    });
}

// Função para filtrar os comentários por área
window.filterFeed = function(area) {
    if (area === "Todos") {
        displayFeed(allComments); // Mostrar todos os comentários
    } else {
        const filteredComments = allComments.filter(comentario => comentario.area === area);
        displayFeed(filteredComments);
    }
};

// Função para filtrar os comentários por data
window.filterByDate = function() {
    const selectedDate = document.getElementById("filter-date").value; // Data selecionada no input

    if (!selectedDate) {
        alert("Por favor, selecione uma data!");
        return;
    }

    // Ajustar formato da data para garantir compatibilidade
    const filteredComments = allComments.filter(comentario => {
        const commentDate = comentario.data.split(" ")[0]; // Remove horas, caso existam
        return commentDate === selectedDate;
    });

    displayFeed(filteredComments);
};

// Adicionando um botão para resetar filtros e voltar ao feed completo
window.resetFilters = function() {
    document.getElementById("filter-date").value = ""; // Limpa a data selecionada
    displayFeed(allComments); // Volta a exibir todos os comentários
};

// Carregar feed ao abrir a página
loadFeed();

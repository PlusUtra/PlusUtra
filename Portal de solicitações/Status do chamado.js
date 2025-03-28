import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para consultar chamados vinculados ao nome do gestor
function consultarChamadosPorGestor(gestor) {
    // Consultando dados da "Solicitacoes"
    const dbRefSolicitacoes = ref(db, 'Solicitacoes');
    const qSolicitacoes = query(dbRefSolicitacoes, orderByChild('gestor'), equalTo(gestor));

    // Consultando dados da "Alteracao"
    const dbRefAlteracao = ref(db, 'Alteracao');
    const qAlteracao = query(dbRefAlteracao, orderByChild('gestor_dhl'), equalTo(gestor));

// Recuperando os dados
Promise.all([ 
    get(qSolicitacoes),
    get(qAlteracao)
]).then(([snapshotSolicitacoes, snapshotAlteracao]) => {
    const chamadosDiv = document.getElementById('resultados');
    chamadosDiv.innerHTML = '';  // Limpa os resultados anteriores

    let foundResults = false;  // Para verificar se encontrou dados
    // Exibe os chamados vinculados ao gestor de "Solicitacoes"
    if (snapshotSolicitacoes.exists()) {
        const dadosSolicitacoes = snapshotSolicitacoes.val();
        const chamadosSolicitacoes = Object.values(dadosSolicitacoes);

        chamadosSolicitacoes.forEach(chamado => {
            // Garantir que o status não seja undefined e, se for, atribuir "Aguardando retorno"
            let status = chamado.status || "Aguardando retorno";
        
            const chamadoDiv = document.createElement('div');
            chamadoDiv.classList.add('chamado');
            chamadoDiv.innerHTML = `
                <div class="card">
                    <p><strong>Tipo:</strong> Solicitação LDAP e SENHA </p>
                    <p><strong>Nome do Colaborador:</strong> ${chamado.nome}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Data da Solicitação:</strong> ${chamado.dataSolicitacao}</p>
                </div>
            `;
            chamadosDiv.appendChild(chamadoDiv);
            foundResults = true;
        });
    }


        // Exibe os chamados vinculados ao gestor de "Alteracao"
        if (snapshotAlteracao.exists()) {
            const dadosAlteracao = snapshotAlteracao.val();
            const chamadosAlteracao = Object.values(dadosAlteracao);

            chamadosAlteracao.forEach(chamado => {

            // Garantir que o status não seja undefined e, se for, atribuir "Aguardando retorno"
            let comentario = chamado.comentario || "Aguardando retorno";  // Garantir que o comentário seja atribuído corretamente


                const chamadoDiv = document.createElement('div');
                chamadoDiv.classList.add('chamado');
                chamadoDiv.innerHTML = `
                    <div class="card">
                        <p><strong>Tipo:</strong> Alteração</p>
                        <p><strong>Nome do Colaborador:</strong> ${chamado.nome}</p>
                        <p><strong>Data da Alteração:</strong> ${chamado.data}</p>
                        <p><strong>Comentário do ADMIN:</strong> ${comentario}</p>
                    </div>
                `;
                chamadosDiv.appendChild(chamadoDiv);
                foundResults = true;
            });
        }

        // Caso não haja dados encontrados
        if (!foundResults) {
            chamadosDiv.innerHTML = '<p>Nenhum chamado encontrado para este gestor.</p>';
        }

    }).catch((error) => {
        console.error("Erro ao consultar chamados:", error);
    });
}

// Recupera o nome do usuário logado do sessionStorage
var loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    // Exibe o nome do usuário na tela, por exemplo:
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";

    // Realiza a consulta automaticamente com o nome do usuário logado
    consultarChamadosPorGestor(loggedInUser);
} else {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "index.html";
}

// Script para alternar a visibilidade do menu hambúrguer
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

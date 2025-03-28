import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get, set } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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

// Recuperar o nome do usuário logado do sessionStorage
const loggedInUser = sessionStorage.getItem("loggedInUser");

if (loggedInUser) {
    // Fixar o nome do usuário logado na lista de gestores e desabilitar o select
    const gestorSelect = document.getElementById('gestor-name');

    // Adicionando o nome do usuário logado como a única opção
    const option = document.createElement('option');
    option.value = loggedInUser;
    option.textContent = loggedInUser;
    gestorSelect.appendChild(option);

    // Desabilitar o select para impedir outra seleção
    gestorSelect.disabled = true;

    // Exibir uma mensagem de boas-vindas
    document.getElementById('welcomeMessage').textContent = `Bem-vindo, ${loggedInUser}!`;

} else {
    alert("Você não está logado. Redirecionando para a página de login.");
    window.location.href = "index.html";
}

// Função para buscar gestores e popular a lista de opções
function carregarGestores() {
    const dbRef = ref(db, 'users');
    get(dbRef).then((snapshot) => {
        const gestorSelect = document.getElementById('gestor-name');
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const gestores = new Set();  // Para garantir gestores únicos
            for (let key in dados) {
                const gestor = dados[key].gestor;
                gestores.add(gestor);
            }

            gestores.forEach(gestor => {
                const option = document.createElement('option');
                option.value = gestor;
                option.textContent = gestor;
                gestorSelect.appendChild(option);
            });
        } else {
            alert('Nenhum gestor encontrado.');
        }
    }).catch((error) => {
        console.error("Erro ao carregar gestores:", error);
    });
}

// Função para buscar usuários relacionados ao gestor
function buscarUsuariosPorGestor(gestor) {
    const dbRef = ref(db, 'users');
    const q = query(dbRef, orderByChild('gestor'), equalTo(gestor));

    get(q).then((snapshot) => {
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = '';  // Limpa os resultados anteriores

        if (snapshot.exists()) {
            const dados = snapshot.val();
            const usuarios = Object.values(dados);

            // Exibe os resultados dentro de "balões"
            usuarios.forEach(usuario => {
                const usuarioDiv = document.createElement('div');
                usuarioDiv.classList.add('usuario');
                usuarioDiv.innerHTML = `
                    <div class="card">
                        <p><strong>Nome:</strong> ${usuario.nome}</p>
                        <p><strong>Cargo:</strong> ${usuario.cargo}</p>
                        <p><strong>Ldap:</strong> ${usuario.ldap}</p>
                        <button class="botao-chamado" data-nome="${usuario.nome}" data-gestor="${gestor}">Abrir Chamado</button>
                    </div>
                `;
                resultadosDiv.appendChild(usuarioDiv);

                // Adicionando o evento de clique no botão "Abrir Chamado"
                const botaoChamado = usuarioDiv.querySelector('.botao-chamado');
                botaoChamado.addEventListener('click', function() {
                    const nomeUsuario = botaoChamado.getAttribute('data-nome');
                    const gestorUsuario = botaoChamado.getAttribute('data-gestor');
                    exibirModal(nomeUsuario, gestorUsuario);  // Exibe o modal com os dados do usuário
                });
            });
        } else {
            resultadosDiv.innerHTML = '<p>Nenhum usuário encontrado para este gestor.</p>';
        }
    }).catch((error) => {
        console.error("Erro ao buscar dados:", error);
    });
}

// Evento de clique no botão de busca
document.getElementById('search-button').addEventListener('click', () => {
    const gestorName = document.getElementById('gestor-name').value.trim();
    if (gestorName) {
        buscarUsuariosPorGestor(gestorName);
    } else {
        alert('Por favor, selecione o nome do gestor para buscar.');
    }
});

// Função para exibir o modal
function exibirModal(nome, gestor) {
    const modal = document.getElementById('modal');
    const usuarioNomeModal = document.getElementById('usuario-nome');
    const confirmarChamado = document.getElementById('confirmar-chamado');

    // Configurar o nome do usuário no modal
    usuarioNomeModal.textContent = nome;
    
    // Exibir o modal
    modal.style.display = "block";
    
    // Fechar o modal ao clicar no "x"
    document.getElementById('close-modal').onclick = function() {
        modal.style.display = "none";
    };
    
    // Fechar o modal ao clicar em "Cancelar"
    document.getElementById('cancelar-chamado').onclick = function() {
        modal.style.display = "none";
    };

    // Confirmar e registrar a solicitação no banco de dados
    confirmarChamado.onclick = function() {
        // Função para formatar a data no formato dd/mm/aaaa hh:mm:ss
        function formatarData() {
            const data = new Date();
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então somamos 1
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');

            return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
        }

        const solicitacaoData = {
            nome: nome,
            gestor: gestor,
            status: 'Pendente',  // Status inicial
            dataSolicitacao: formatarData(),  // Usando a função para formatar a data
        };

        // Enviar para o Firebase
        const solicitacaoRef = ref(db, 'Solicitacoes/' + nome + '_' + Date.now());  // Chave única para a solicitação
        set(solicitacaoRef, solicitacaoData)
            .then(() => {
                alert("Solicitação registrada com sucesso!");
                modal.style.display = "none"; // Fechar o modal após confirmação
            })
            .catch((error) => {
                console.error("Erro ao registrar solicitação: ", error);
                alert("Erro ao registrar solicitação.");
            });
    };
}
// Script para alternar a visibilidade do menu hambúrguer
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');  // Alterna a visibilidade do menu
    menuToggle.classList.toggle('active');  // Alterna o ícone do hambúrguer
});

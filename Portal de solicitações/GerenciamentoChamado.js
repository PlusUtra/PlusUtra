// Importação dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, get, set, push, remove } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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


// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const resultadosDiv = document.getElementById('resultados');
resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

let snapshotSolicitacoes = null;
let snapshotAlteracao = null;

// Recupera o nomeBusca do usuário logado do sessionStorage
const loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";
} else {
    window.location.href = "index.html"; // Redireciona para o login se não houver um usuário logado
}

// Função para exibir resultados no front-end
function exibirResultados(snapshot, source) {
    let foundResults = false;
    let sourceText = source === "Alteracao" ? "Alterar Missão" : "LDAP / SENHA";

    console.log('Buscando dados no source:', source);

    // Cria um título para separar as seções de resultados
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    sectionDiv.innerHTML = `<h2>${source === "Alteracao" ? "Alterações" : "Solicitações"}</h2>`;

    // Se o snapshot existe (ou seja, dados encontrados no banco)
    if (snapshot.exists()) {
        const dados = snapshot.val();
        
        // Itera pelas chaves e valores dos dados
        Object.entries(dados).forEach(([key, item]) => {
            // Exibe apenas chamados com status "pendente"
            if (item.status !== "Finalizado") { // Só exibe chamados não finalizados

                const chamadoDiv = document.createElement('div');
                chamadoDiv.classList.add('chamado');

                chamadoDiv.innerHTML = `
                    <p><strong>Fonte:</strong> ${sourceText}</p>
                    <p><strong>Nome:</strong> ${item.nome || item.nomeBusca}</p>
                    <p><strong>Status:</strong> ${item.status}</p>
                    <p><strong>Data da Solicitação:</strong> ${item.dataSolicitacao || item.data}</p>
                    <p><strong>Nome Gestor:</strong> ${item.gestor || item.gestor_dhl}</p>
                    <textarea id="comentario-${key}" placeholder="Digite um comentário">${item.comentario || ''}</textarea>
                    <button class="finalizar-chamado" data-source="${source}" data-nome="${item.nome || item.nomeBusca}" data-key="${key}">Finalizar Chamado</button>
                `;

                sectionDiv.appendChild(chamadoDiv);
                foundResults = true;

                // Adiciona o evento para o botão "Finalizar Chamado"
                const finalizarBtn = chamadoDiv.querySelector('.finalizar-chamado');
                finalizarBtn.addEventListener('click', () => {
                    const comentario = document.getElementById(`comentario-${key}`).value; // Obtém o comentário
                    if (comentario.trim()) {
                        // Atualiza o status para "finalizado" e salva o comentário
                        const dbRef = ref(db, `${source}/${key}`);
                        set(dbRef, {
                            ...item,            // Mantém os dados do item
                            status: 'Finalizado', // Altera o status para finalizado
                            comentario: comentario,  // Adiciona o comentário no banco de dados
                        }).then(() => {
                            console.log(`Chamado ${key} finalizado e comentário adicionado`);

                            // Atualiza a interface sem recarregar a página
                            chamadoDiv.querySelector('.finalizar-chamado').style.display = 'none'; // Esconde o botão
                            chamadoDiv.querySelector('textarea').value = comentario; // Exibe o comentário na interface
                        }).catch((error) => {
                            console.error("Erro ao finalizar chamado e adicionar comentário:", error);
                        });
                    }
                });
            }
        });
    }

    if (!foundResults) {
        sectionDiv.innerHTML += `<p>Nenhum chamado pendente encontrado em ${source}.</p>`;
    }

    // Adiciona a seção no container de resultados
    resultadosDiv.appendChild(sectionDiv);
}



// Função para buscar dados por nome nas fontes (Solicitacoes e Alteracao)
function buscarDados() {
    if (loggedInUser === 'ADMIN') {
        const dbRefSolicitacoes = ref(db, 'Solicitacoes');
        const dbRefAlteracoes = ref(db, 'Alteracao');

        document.getElementById('loading-spinner').style.display = 'block';

        // Buscar dados de 'Solicitacoes' por nome
        get(dbRefSolicitacoes).then((snapshot) => {
            snapshotSolicitacoes = snapshot;
            exibirResultados(snapshot, 'Solicitacoes');
        }).catch((error) => {
            console.error("Erro ao buscar dados de Solicitações:", error);
        });

        // Buscar dados de 'Alteracao' por nome
        get(dbRefAlteracoes).then((snapshot) => {
            snapshotAlteracao = snapshot;
            exibirResultados(snapshot, 'Alteracao');
        }).catch((error) => {
            console.error("Erro ao buscar dados de Alterações:", error);
        }).finally(() => {
            // Esconde o carregamento após o carregamento dos dados
            document.getElementById('loading-spinner').style.display = 'none';
        });
    } else {
        resultadosDiv.innerHTML = '<p>Acesso restrito. Você não tem permissão para visualizar esses dados.</p>';
    }
}

// Chama a função de buscar dados
buscarDados();

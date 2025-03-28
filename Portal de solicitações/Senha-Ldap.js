import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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


// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para converter a data para o formato que o JavaScript entende
function converterParaDataValida(dataStr) {
    // A data recebida do Firebase está no formato dd/mm/yyyy hh:mm:ss
    const partes = dataStr.split(" ");
    const [dia, mes, ano] = partes[0].split("/");  // Separando dd/mm/yyyy
    const [hora, minuto, segundo] = partes[1].split(":");  // Separando hora:minuto:segundo

    // Convertendo para o formato ISO (yyyy-mm-ddThh:mm:ss)
    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;

    return new Date(dataFormatada); // Retorna um objeto Date válido
}

// Função para consultar chamados vinculados ao nome do gestor
function consultarChamadosPorGestor(gestor, dataFiltro) {
    const dbRef = ref(db, 'Solicitacoes');
    const q = query(dbRef, orderByChild('gestor'), equalTo(gestor));

    get(q).then((snapshot) => {
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = '';  // Limpa os resultados anteriores
    
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const chamados = Object.values(dados);
    
            // Filtra os chamados pela data
            const chamadosFiltrados = chamados.filter(chamado => {
                const dataChamado = converterParaDataValida(chamado.dataSolicitacao);
                
                // Verifica se a data é válida
                if (isNaN(dataChamado)) {
                    console.error("Data inválida:", chamado.dataSolicitacao);
                    return false; // Ignora este chamado se a data for inválida
                }
                
                // Se dataFiltro estiver disponível, compara a data
                return dataFiltro ? dataChamado.toISOString().split('T')[0] === dataFiltro : true;
            });
    
            // Exibe os chamados
            chamadosFiltrados.forEach(chamado => {
                let status = chamado.status || "Aguardando retorno";
                let comentario = chamado.comentario || "Aguardando retorno";
                let nome = chamado.nome || "Nome não informado";
                let dataSolicitacao = converterParaDataValida(chamado.dataSolicitacao);

                // Verificação adicional de data válida
                if (isNaN(dataSolicitacao)) {
                    console.error("Data inválida:", chamado.dataSolicitacao);
                    return; // Pula este chamado se a data for inválida
                }

                const dataFormatada = `${dataSolicitacao.getDate().toString().padStart(2, '0')}/${(dataSolicitacao.getMonth() + 1).toString().padStart(2, '0')}/${dataSolicitacao.getFullYear()}`;
            
                const chamadoDiv = document.createElement('div');
                chamadoDiv.classList.add('chamado');
                chamadoDiv.style.marginBottom = '5px';
                chamadoDiv.innerHTML = `
                    <p><strong>Nome do Colaborador:</strong> ${nome}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Data da Solicitação:</strong> ${dataFormatada}</p>
                    <p><strong>Comentário:</strong> ${comentario}</p>
                `;
                resultadosDiv.appendChild(chamadoDiv);
            });
        } else {
            resultadosDiv.innerHTML = '<p>Nenhum chamado encontrado para este gestor.</p>';
        }
    }).catch((error) => {
        console.error("Erro ao consultar chamados:", error);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>Erro ao carregar os chamados: ${error.message}</p>`;
    });
}

// Função para consultar alterações vinculadas ao nome do gestor
function consultarAlteracoesPorGestor(gestor, dataFiltro) {
    const dbRef = ref(db, 'Alteracao');
    const q = query(dbRef, orderByChild('gestor_dhl'), equalTo(gestor));

    get(q).then((snapshot) => {
        const resultadosDiv = document.getElementById('resultados');
        
        // Limpa os resultados anteriores
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const alteracoes = Object.values(dados);
    
            // Filtra as alterações pela data
            const alteracoesFiltradas = alteracoes.filter(alteracao => {
                const dataAlteracao = converterParaDataValida(alteracao.data);
                
                // Verifica se a data é válida
                if (isNaN(dataAlteracao)) {
                    console.error("Data inválida:", alteracao.data);
                    return false;
                }
                
                // Se dataFiltro estiver disponível, compara a data
                return dataFiltro ? dataAlteracao.toISOString().split('T')[0] === dataFiltro : true;
            });
    
            // Exibe as alterações
            alteracoesFiltradas.forEach(alteracao => {
                let descricao = alteracao.requerimento || "Descrição não fornecida";
                let status = alteracao.status || "Aguardando retorno";
                let nome = alteracao.nome || "Nome não informado";
                let dataAlteracao = converterParaDataValida(alteracao.data);

                // Verificação adicional de data válida
                if (isNaN(dataAlteracao)) {
                    console.error("Data inválida:", alteracao.data);
                    return;
                }

                const dataFormatada = `${dataAlteracao.getDate().toString().padStart(2, '0')}/${(dataAlteracao.getMonth() + 1).toString().padStart(2, '0')}/${dataAlteracao.getFullYear()}`;
            
                const alteracaoDiv = document.createElement('div');
                alteracaoDiv.classList.add('alteracao');
                alteracaoDiv.style.marginBottom = '5px';
                alteracaoDiv.innerHTML = `
                    <p><strong>Nome do Colaborador:</strong> ${nome}</p>
                    <p><strong>Data da Alteração:</strong> ${dataFormatada}</p>
                    <p><strong>Área:</strong> ${alteracao.area || "Não informada"}</p>
                    <p><strong>Requerimento:</strong> ${descricao}</p>
                    <p><strong>Status:</strong> ${status}</p>
                `;
                resultadosDiv.appendChild(alteracaoDiv);
            });
        } else {
            resultadosDiv.innerHTML = '<p>Nenhuma alteração encontrada para este gestor.</p>';
        }
    }).catch((error) => {
        console.error("Erro ao consultar alterações:", error);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>Erro ao carregar as alterações: ${error.message}</p>`;
    });
}

// Recupera o nome do usuário logado do sessionStorage
var loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    // Exibe o nome do usuário na tela, por exemplo:
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";
    // Preenche o campo de nome do gestor com o nome do usuário logado
    document.getElementById("gestor-name").value = loggedInUser;
} else {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "index.html.html";
}

// Evento de clique no botão de busca
document.getElementById('search-date-button').addEventListener('click', () => {
    const gestorName = document.getElementById('gestor-name').value.trim(); // Nome do gestor
    const dataFiltro = document.getElementById('date-filter').value; // Data selecionada

    if (gestorName) {
        consultarChamadosPorGestor(gestorName, dataFiltro); // Passa o nome do gestor e a data para a consulta de chamados
        consultarAlteracoesPorGestor(gestorName, dataFiltro); // Passa o nome do gestor e a data para a consulta de alterações
    } else {
        alert('Por favor, insira o nome do gestor para buscar.');
    }
});

// Função de alternância do menu hambúrguer
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

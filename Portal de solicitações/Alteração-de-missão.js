import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

// Configuração do Firebase
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

// Recuperar o nome do usuário logado do sessionStorage
const loggedInUser = sessionStorage.getItem("loggedInUser");

if (loggedInUser) {
    // Preenche o campo "Gestor DHL" com o nome do usuário logado
    document.getElementById("gestor_dhl").value = loggedInUser;

    // Exibe a mensagem de boas-vindas com o nome do usuário logado
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";

    // Buscar colaboradores associados ao gestor
    carregarColaboradores(loggedInUser);
} else {
    alert("Você não está logado. Redirecionando para a página de login.");
    window.location.href = "index.html";
}

// Função para carregar colaboradores associados ao gestor
function carregarColaboradores(gestor) {
    const dbRef = ref(db, 'users');
    const q = query(dbRef, orderByChild('gestor'), equalTo(gestor));

    get(q).then((snapshot) => {
        const colaboradoresSelect = document.getElementById('nome');
        if (snapshot.exists()) {
            const dados = snapshot.val();
            colaboradoresSelect.innerHTML = '<option value="" selected disabled>Selecione um colaborador</option>'; // Limpa as opções anteriores

            Object.values(dados).forEach(colaborador => {
                const option = document.createElement('option');
                option.value = colaborador.nome;
                option.textContent = colaborador.nome;
                colaboradoresSelect.appendChild(option);
            });
        } else {
            colaboradoresSelect.innerHTML = '<option value="" disabled>Não há colaboradores para este gestor.</option>';
        }
    }).catch((error) => {
        console.error("Erro ao carregar colaboradores:", error);
    });
}

// Adicionar evento para preencher os dados do colaborador selecionado
document.getElementById('nome').addEventListener('change', function() {
    const nomeColaborador = this.value;
    if (nomeColaborador) {
        preencherDadosColaborador(nomeColaborador);
    }
});

// Função para preencher dados do colaborador ao ser selecionado
function preencherDadosColaborador(nome) {
    const dbRef = ref(db, 'users');
    const q = query(dbRef, orderByChild('nome'), equalTo(nome));

    get(q).then((snapshot) => {
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const colaborador = Object.values(dados)[0]; // Como 'nome' é único, pegar o primeiro resultado

            // Preencher os campos do colaborador
            document.getElementById("cargo").value = colaborador.cargo;
            document.getElementById("area").value = colaborador.area;
            document.getElementById("turno").innerHTML = `<option value="${colaborador.turno}" selected>${colaborador.turno}</option>`;
            document.getElementById("ldap").value = colaborador.ldap;
        }
    }).catch((error) => {
        console.error("Erro ao preencher dados do colaborador:", error);
    });
}

// Função para formatar a data no formato dd/mm/aaaa hh:mm:ss
function formatarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');  // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0');  // Mes começa em 0
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

// Adicionar evento de envio do formulário
document.getElementById('alteracao-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    const nome = document.getElementById('nome').value;
    const cargo = document.getElementById('cargo').value;
    const area = document.getElementById('area').value;
    const turno = document.getElementById('turno').value;
    const gestorDhl = document.getElementById('gestor_dhl').value;
    const ldap = document.getElementById('ldap').value;
    const requerimento = document.getElementById('requerimento').value;
    let codChamado = document.getElementById('cod_chamado').value;

    // Se o campo "cod_chamado" estiver vazio, define um valor padrão
    if (!codChamado) {
        codChamado = '0000'; // Valor padrão
    }

    // Verifique se todos os campos obrigatórios estão preenchidos (exceto cod_chamado)
    if (!nome || !cargo || !area || !turno || !gestorDhl || !ldap || !requerimento) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Criando um objeto com os dados para enviar para o Firebase
    const novaAlteracao = {
        nome: nome,
        cargo: cargo,
        area: area,
        turno: turno,
        gestor_dhl: gestorDhl,
        ldap: ldap,
        requerimento: requerimento,
        status: "Pendente",
        cod_chamado: codChamado, // Envia o valor (pode ser "0000" ou o valor preenchido)
        data: formatarData() // Agora usamos a função para formatar a data no formato desejado
    };

    // Enviar dados para o Firebase na referência "Alteracao"
    const dbRef = ref(db, 'Alteracao');
    push(dbRef, novaAlteracao)
        .then(() => {
            alert('Solicitação enviada com sucesso!');
            document.getElementById('alteracao-form').reset(); // Limpa o formulário
        })
        .catch((error) => {
            console.error('Erro ao enviar solicitação:', error);
            alert('Erro ao enviar solicitação. Tente novamente.');
        });
});

// Script para alternar a visibilidade do menu hambúrguer
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

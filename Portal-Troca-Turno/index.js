// Importando as funções necessárias do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, get, push, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";


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

// Função para preencher os campos ao carregar a página
window.onload = function() {
    // Carregar a data atual
    var dataCarimbo = document.getElementById('data-carimbo');
    var dataAtual = new Date();
    var dia = String(dataAtual.getDate()).padStart(2, '0');
    var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    var ano = dataAtual.getFullYear();
    var horas = String(dataAtual.getHours()).padStart(2, '0');
    var minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    var segundos = String(dataAtual.getSeconds()).padStart(2, '0');
    
    var dataHoraAtual = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    dataCarimbo.value = dataHoraAtual;

    // Carregar os dados do Firebase
    loadCoordenadoresData();
};

// Função para carregar dados dos coordenadores do Firebase
function loadCoordenadoresData() {
    const coordenadoresRef = ref(db, 'Coordenadores');
    get(coordenadoresRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const coordenadores = snapshot.val();
                populateSelectFields(coordenadores);
            } else {
                console.log("Nenhum dado encontrado");
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar dados do Firebase:", error);
        });
}

// Função para preencher os campos Nome, Área e Turno
function populateSelectFields(coordenadores) {
    const nomeSelect = document.getElementById('nome');
    const areaSelect = document.getElementById('area');
    const turnoSelect = document.getElementById('turno');
    const trocaturno = document.getElementById('troca-turno');

    // Limpar campos antes de preencher
    nomeSelect.innerHTML = '';
    areaSelect.innerHTML = '';
    turnoSelect.innerHTML = '';

    let areas = new Set();
    let turnos = new Set();

    // Adicionar as opções de área e turno
    Object.values(coordenadores).forEach(coordenador => {
        areas.add(coordenador.area); // Adiciona a área à lista
        turnos.add(coordenador.turno); // Adiciona o turno à lista
    });

    // Adiciona a opção "Selecione uma opção" no início da lista de Áreas
    const optionDefaultArea = document.createElement('option');
    optionDefaultArea.value = "";
    optionDefaultArea.textContent = "Selecione uma área";
    areaSelect.appendChild(optionDefaultArea);

    // Preencher as opções de "Área" com os dados do Firebase
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });

    // Adicionar a opção "Selecione um turno" no início da lista de Turnos
    const optionDefaultTurno = document.createElement('option');
    optionDefaultTurno.value = "";
    optionDefaultTurno.textContent = "Selecione um turno";
    turnoSelect.appendChild(optionDefaultTurno);

    // Preencher as opções de "Turno"
    turnos.forEach(turno => {
        const option = document.createElement('option');
        option.value = turno;
        option.textContent = turno;
        turnoSelect.appendChild(option);
    });

    // Habilitar ou desabilitar campos Nome e Turno dependendo da seleção de Área
    areaSelect.addEventListener('change', function() {
        const selectedArea = areaSelect.value;

        nomeSelect.innerHTML = ''; // Limpa o campo "Nome"
        turnoSelect.innerHTML = ''; // Limpa o campo "Turno"
        turnoSelect.disabled = !selectedArea; // Desabilita o Turno se não houver Área selecionada
        nomeSelect.disabled = !selectedArea; // Desabilita o Nome se não houver Área selecionada

        // Preencher as opções de "Nome" e "Turno" quando a área for selecionada
        if (selectedArea) {
            // Adicionar nomes filtrados pela área selecionada
            Object.values(coordenadores).forEach(coordenador => {
                if (coordenador.area === selectedArea) {
                    const option = document.createElement('option');
                    option.value = coordenador.nome;
                    option.textContent = coordenador.nome;
                    nomeSelect.appendChild(option);
                    
                    // Preencher o campo Turno com o turno da área selecionada
                    const turnoOption = document.createElement('option');
                    turnoOption.value = coordenador.turno;
                    turnoOption.textContent = coordenador.turno;
                    if (!Array.from(turnoSelect.options).some(opt => opt.value === coordenador.turno)) {
                        turnoSelect.appendChild(turnoOption);
                    }

                    // Preencher o campo de Troca de Turno com o nome do coordenador
                    const trocaOption = document.createElement('option');
                    trocaOption.value = coordenador.nome;
                    trocaOption.textContent = coordenador.nome;
                    trocaturno.appendChild(trocaOption);
                }
            });
        } else {
            nomeSelect.innerHTML = '<option value="">Selecione uma área primeiro</option>';
            turnoSelect.innerHTML = '<option value="">Selecione um turno</option>';
        }
    });

    // Preencher o "Nome" com base na primeira área carregada
    areaSelect.dispatchEvent(new Event('change'));
}


// Capturar o evento de envio do formulário
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Capturar a data e hora exata no momento do envio
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
    const dataCarimbo = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

    // Capturar os valores dos outros campos do formulário
    const area = document.getElementById('area').value;
    const nome = document.getElementById('nome').value;
    const turno = document.getElementById('turno').value;
    const trocaTurno = document.getElementById('troca-turno').value;
    const observacoes = document.getElementById('observacoes').value.trim(); // Remove espaços extras

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!area || !nome || !turno || !trocaTurno || !observacoes) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Criar um objeto com os dados do formulário
    const dadosComentario = {
        data: dataCarimbo, // A data é gerada no momento do envio
        area: area,
        nome: nome,
        turno: turno,
        trocaTurno: trocaTurno,
        observacoes: observacoes
    };

    // Referência para a coleção "Comentários"
    const comentariosRef = ref(db, "Comentários");

    // Adicionar os dados ao Firebase (gera um ID único para cada entrada)
    push(comentariosRef, dadosComentario)
        .then(() => {
            alert("Dados enviados com sucesso!");
            document.querySelector("form").reset(); // Limpa o formulário após o envio
        })
        .catch(error => {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao enviar os dados.");
        });
});


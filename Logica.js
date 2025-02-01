// Configuração do Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCNvIMFeW4tdoTdSYyd1zBY1bu2Wl-MmQc",
    authDomain: "app9020exp.firebaseapp.com",
    databaseURL: "https://app9020exp-default-rtdb.firebaseio.com",
    projectId: "app9020exp",
    storageBucket: "app9020exp.appspot.com",
    messagingSenderId: "710551952894",
    appId: "1:710551952894:web:69f08d59a296bd098bf4af",
    measurementId: "G-JX2SK3BXRK"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referências do Firebase
var gravarPec = firebase.database().ref("gravarPec");
var auditarPec = firebase.database().ref("auditarPec");
var userRef = firebase.database().ref("UsuarioPec");
var lojasPec = firebase.database().ref('LojasPec');


// Atualiza a data e hora automaticamente
function updateDateTimeInput() {
    const inputDatetimeLocal = document.getElementById('datetime-local');
    const now = new Date();
    const formattedDateTime = formatDateTimeForInput(now);
    inputDatetimeLocal.value = formattedDateTime;
}


// Função para formatar a data e hora no formato desejado
function formatDateTimeForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Atualiza o valor do input a cada 1 segundo
setInterval(updateDateTimeInput, 1000);


// Atualiza a data e hora automaticamente
function updateDateTimeInputfive() {
    const inputDatetimeLocal = document.getElementById('datetime-local-five');
    const now = new Date();
    const formattedDateTime = formatDateTimeForInput(now);
    inputDatetimeLocal.value = formattedDateTime;
}


// Função para formatar a data e hora no formato desejado
function formatDateTimeForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Atualiza o valor do input a cada 1 segundo
setInterval(updateDateTimeInputfive, 1000);


function criarTabela() {
    const inputData = document.getElementById('inputData').value.trim();
    const linhas = inputData.split('\n');
    let tabela = `
                <table>
                    <thead>
                        <tr>
                            <th>PLACA CARRETA</th><th>Onda</th><th>UC</th><th>Tipologia</th><th>Peso</th>
                            <th>Posição</th><th>Fifo</th><th>Loja</th><th>CHAVE DE VERIFICAÇÃO</th>
                            <th>TU</th><th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    linhas.forEach(linha => {
        // Divide a linha em palavras
        const colunas = linha.split(/\s+/);

        // Encontra a palavra 'Onda' e o número subsequente
        const ondaIndex = colunas.indexOf('Onda');
        if (ondaIndex !== -1 && colunas.length > ondaIndex + 2) {
            // 'Onda 1' como um único campo
            const onda = colunas.slice(ondaIndex, ondaIndex + 2).join(' ');
            // O valor restante após 'Onda 1'
            const resto = colunas.slice(ondaIndex + 2);

            // Adiciona linha à tabela
            tabela += `
                        <tr>
                            <td>${colunas[0] || ''}</td>
                            <td>${onda || ''}</td>
                            <td>${resto[0] || ''}</td>
                            <td>${resto[1] || ''}</td>
                            <td>${resto[2] || ''}</td>
                            <td>${resto[3] || ''}</td>
                            <td>${resto[4] || ''}</td>
                            <td>${resto[5] || ''}</td>
                            <td>${resto[6] || ''}</td>
                            <td>${resto[7] || ''}</td>
                            <td>${resto[8] || 'Ag auditoria'}</td>
                        </tr>
                    `;

            // Salva os dados no Firebase com a formatação correta
            savePac(
                colunas[0] || '', // Placa Carreta
                onda || '', // Onda (incluindo a palavra 'Onda' e o número subsequente)
                resto[0] || '', // UC
                resto[1] || '', // Tipologia
                resto[2] || '', // Peso
                resto[3] || '', // Posição
                resto[4] || '', // Fifo
                resto[5] || '', // Loja
                resto[6] || '', // Chave
                resto[7] || '', // TU
                resto[8] || 'Ag auditoria' // Status
            );
        }
    });

    tabela += '</tbody></table>';
    document.getElementById('tabela-pec').innerHTML = tabela;

    // Adiciona o evento de clique à tabela
    document.querySelectorAll('#tabela-pec table tbody tr').forEach(row => {
        row.addEventListener('click', function () {
            const cells = this.getElementsByTagName('td');
            document.querySelector('input[placeholder="Posição"]').value = cells[3].innerText;
            document.querySelector('input[placeholder="Placa"]').value = cells[1].innerText;
            document.querySelector('input[placeholder="Loja"]').value = cells[7].innerText;
        });
    });
}

// Atualiza a função salvarAuditarPec para salvar múltiplos registros
function salvarAuditarPec() {
    const form = document.querySelector('.form-auditar');
    const data = form.querySelector('input[type="datetime-local"]').value.trim();
    const ucs = form.querySelector('textarea').value.trim().split('\n').filter(linha => linha);
    const doca = form.querySelector('input[placeholder="Posição"]').value.trim();
    const tu = form.querySelector('input[placeholder="INFORME A TU"]').value.trim();
    const nome = form.querySelector('input[placeholder="Nome"]').value.trim();
    const placa = form.querySelector('input[placeholder="Placa"]').value.trim();
    const loja = form.querySelector('input[placeholder="Loja"]').value.trim();

    if (!data) return console.error("Data inválida");

    const formattedDate = new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    Promise.all(ucs.map(uc => auditarPec.push().set({ data: formattedDate, ucs: uc, doca, tu, nome, placa, loja, status: "Auditado" })))
        .then(() => {
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.textContent = "Auditoria enviada";
            setTimeout(() => {
                mensagemSucesso.style.display = "none";
                form.reset();
                document.querySelector('.form-auditar input[type="datetime-local"]').value = new Date().toISOString().slice(0, 16);
                mostrarSecao('section-three');
            }, 3000);
        })
        .catch(console.error);
}

function savePac(placa, onda, uc, tipologia, peso, posicao, fifo, loja, chave, tu, status) {
    // Monta o objeto com os dados a serem salvos
    let data = {
        placa: placa,
        onda: onda,
        uc: uc,
        tipologia: tipologia,
        peso: peso,
        posicao: posicao,
        fifo: fifo,
        loja: loja,
        chave: chave,
        tu: tu,
        status: status
    };

    // Verifica se já existe uma entrada com os mesmos dados
    gravarPec.orderByChild('chave').equalTo(chave).once('value', snapshot => {
        if (snapshot.exists()) {
            console.log(`Dados para chave ${chave} já existem no banco de dados.`);
            // Aqui você pode exibir uma mensagem ou tomar outra ação, se necessário
        } else {
            // Se não existir, realiza o salvamento
            gravarPec.push().set(data)
                .then(() => {
                    console.log(`Dados para chave ${chave} gravados no Firebase!`);
                })
                .catch(error => {
                    console.error(`Erro ao gravar dados para chave ${chave}:`, error);
                });
        }
    }).catch(error => {
        console.error("Erro ao verificar dados:", error);
    });
}


// Mostra e oculta seções
function mostrarSecao(id) {
    document.querySelectorAll('section').forEach(secao => {
        secao.classList.toggle('hidden', secao.id !== id);
    });
}

function carregarDadosConferencia() {
    const tabela = document.getElementById('tbody-conferencia');
    gravarPec.on('value', snapshot => {
        tabela.innerHTML = ''; // Limpa o conteúdo atual da tabela antes de carregar novos dados
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const status = data.status || 'Ag auditoria';
            const row = tabela.insertRow();

            // Buscar a Loja correspondente no banco de dados LojasPec
            const lojaId = data.loja; // Assume que loja é um identificador (ID)
            const lojasPecRef = firebase.database().ref('LojasPec').orderByChild('ID').equalTo(lojaId);

            lojasPecRef.once('value', lojasPecSnapshot => {
                if (lojasPecSnapshot.exists()) {
                    lojasPecSnapshot.forEach(lojaSnapshot => {
                        const lojaData = lojaSnapshot.val();
                        const lojaEncontrada = lojaData.Loja || ''; // Obtém o valor da coluna Loja do LojasPec

                        // Substituir o valor de loja na linha de dados
                        data.loja = lojaEncontrada;

                        // Inserir os campos na tabela
                        ['placa', 'onda', 'uc', 'tipologia', 'peso', 'posicao', 'fifo', 'loja', 'chave', 'tu'].forEach(field => {
                            const cell = row.insertCell();
                            cell.textContent = data[field] || '';
                        });

                        // Inserir célula de status com estilo condicional
                        const statusCell = row.insertCell();
                        const statusText = document.createElement('span');
                        statusText.textContent = status;
                        statusText.style.cssText = `
                                    background-color: ${status === 'Ag auditoria' ? 'red' : 'green'};
                                    color: white;
                                    padding: 3px;
                                    border-radius: 4px;
                                    font-size: 15px;
                                    width: 100%;
                                    text-align: center;
                                `;
                        statusCell.appendChild(statusText);
                    });
                } else {
                    console.error(`Loja ${lojaId} não encontrada no banco de dados LojasPec`);
                    // Inserir os campos na tabela sem substituir loja
                    ['placa', 'onda', 'uc', 'tipologia', 'peso', 'posicao', 'fifo', 'loja', 'chave', 'tu'].forEach(field => {
                        const cell = row.insertCell();
                        cell.textContent = data[field] || '';
                    });

                    // Inserir célula de status com estilo condicional
                    const statusCell = row.insertCell();
                    const statusText = document.createElement('span');
                    statusText.textContent = status;
                    statusText.style.cssText = `
                                background-color: red; /* definir uma cor padrão para quando não há loja encontrada */
                                color: white;
                                padding: 2px;
                                border-radius: 4px;
                                font-size: 15px;
                                width: 100%;
                            `;
                    statusCell.appendChild(statusText);
                }
            });
        });
    });
}


function carregarDadosAuditoria() {
    const tabela = document.getElementById('tbody-auditoria');
    auditarPec.on('value', snapshot => {
        tabela.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const dataFormatada = formatDateTime(new Date(data.data).getTime());
            const row = tabela.insertRow();
            ['data', 'ucs', 'loja', 'tu', 'doca', 'placa'].forEach(field => {
                row.insertCell().textContent = data[field] || '';
            });
            const statusCell = row.insertCell();
            const statusText = document.createElement('span');
            statusText.textContent = data.status || 'Auditado';
            statusText.style.cssText = `
                background-color: ${statusText.textContent === 'Ag auditoria' ? 'red' : 'green'};
                color: white;
                padding: 2px;
                border-radius: 5px;
                font-size: 19px;
            `;
            statusCell.appendChild(statusText);
        });
    });
}


function atualizarStatusConferencia() {
    const tabelaConferencia = document.getElementById('tbody-conferencia');
    const tabelaAuditoria = document.getElementById('tbody-auditoria');

    // Cria um mapa de placas e UCs da seção 3
    const auditoriaMap = new Map();
    tabelaAuditoria.querySelectorAll('tr').forEach(row => {
        const placa = row.cells[5].textContent.trim(); // A placa do veículo está na coluna 6
        const uc = row.cells[1].textContent.trim();    // A UC está na coluna 2
        auditoriaMap.set(`${placa}|${uc}`, true); // Usa a combinação de placa e UC como chave
    });

    // Atualiza a seção 2 com base na verificação com o mapa de auditoria
    tabelaConferencia.querySelectorAll('tr').forEach(row => {
        const placa = row.cells[0].textContent.trim(); // A placa do veículo está na coluna 1
        const uc = row.cells[2].textContent.trim();    // A UC está na coluna 3
        const concatenacao = `${placa}|${uc}`;
        const statusCell = row.cells[10];
        const statusText = statusCell.querySelector('span');

        if (auditoriaMap.has(concatenacao)) {
            // Atualiza o status para 'Auditado' se houver correspondência
            statusText.textContent = 'Auditado';
            statusText.style.backgroundColor = 'green';
        } else {
            // Mantém o status como 'Ag auditoria' se não houver correspondência
            statusText.textContent = 'Ag auditoria';
            statusText.style.backgroundColor = 'red';
        }
    });
}
function iniciarAtualizacao() {
    carregarDadosConferencia();
    carregarDadosAuditoria();
    setInterval(() => {
        atualizarStatusConferencia();
    }, 1000); // Atualiza a cada 1 segundo
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}


// Inicia o processo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', iniciarAtualizacao);



function verificarEExcluirDuplicatasAuditoria(ucs) {
    // Itera sobre as UCs fornecidas para verificar duplicatas
    ucs.forEach(uc => {
        auditarPec.orderByChild('ucs').equalTo(uc).once('value', snapshot => {
            if (snapshot.exists()) {
                // Se encontrar duplicatas, remove os registros com a mesma UC
                snapshot.forEach(childSnapshot => {
                    const registro = childSnapshot.val();
                    const key = childSnapshot.key;
                    console.log(`Duplicata encontrada para UC: ${uc}. Removendo registro com chave: ${key}`);
                    auditarPec.child(key).remove()
                        .then(() => {
                            console.log(`Registro duplicado com UC ${uc} removido com sucesso.`);
                        })
                        .catch(error => {
                            console.error(`Erro ao remover registro duplicado com UC ${uc}:`, error);
                        });
                });
            }
        }).catch(error => {
            console.error("Erro ao verificar duplicatas:", error);
        });
    });
}

function salvarAuditarPec() {
    // Mostrar o modal de carregamento
    mostrarModalCarregamento();

    const form = document.querySelector('.form-auditar');
    const data = form.querySelector('input[type="datetime-local"]').value.trim();
    const ucs = form.querySelector('textarea').value.trim().split('\n').filter(linha => linha);
    const doca = form.querySelector('input[placeholder="Posição"]').value.trim();
    const tu = form.querySelector('input[placeholder="INFORME A TU"]').value.trim();
    const nome = form.querySelector('input[placeholder="Nome"]').value.trim();
    const placa = form.querySelector('input[placeholder="Placa"]').value.trim();
    const loja = form.querySelector('input[placeholder="Loja"]').value.trim();

    if (!data) return console.error("Data inválida");

    // Formata a data
    const formattedDate = new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // Verificar duplicatas no banco de dados antes de salvar
    verificarEExcluirDuplicatasAuditoria(ucs);

    // Aguarda a verificação de duplicatas e, em seguida, salva os novos dados
    Promise.all(ucs.map(uc => auditarPec.push().set({ data: formattedDate, ucs: uc, doca, tu, nome, placa, loja })))
        .then(() => {
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.textContent = "Auditoria enviada";
            setTimeout(() => {
                mensagemSucesso.style.display = "none";
                form.reset();
                document.querySelector('.form-auditar input[type="datetime-local"]').value = new Date().toISOString().slice(0, 16);
                mostrarSecao('section-three');
                // Ocultar o modal de carregamento
                ocultarModalCarregamento();
            }, 3000);
        })
        .catch(console.error);
}

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona um evento para o campo TU
    document.getElementById('input-tu').addEventListener('blur', buscarDadosPorTU);
});




function buscarDadosPorTU() {
    const tu = document.getElementById('input-tu').value.trim();

    if (tu) {
        // Acessa o Firebase para buscar os dados com base na TU na tabela 'gravarPec'
        gravarPec.orderByChild('tu').equalTo(tu).once('value', snapshot => {
            if (snapshot.exists()) {
                const dados = snapshot.val();
                // Pega a primeira chave dos dados retornados
                const primeiraChave = Object.keys(dados)[0];
                const dadosTu = dados[primeiraChave];

                // Atualiza os campos da seção 4
                document.querySelector('input[placeholder="Posição"]').value = dadosTu.posicao || '';
                document.querySelector('input[placeholder="Placa"]').value = dadosTu.placa || '';

                // Obter o valor da coluna loja
                const lojaId = dadosTu.loja;

                if (lojaId) {
                    // Acessa o Firebase para buscar o nome da loja com base no ID
                    lojasPec.orderByChild('ID').equalTo(lojaId).once('value', lojaSnapshot => {
                        if (lojaSnapshot.exists()) {
                            const lojaDados = lojaSnapshot.val();
                            // Pega o primeiro item retornado
                            const primeiraLojaChave = Object.keys(lojaDados)[0];
                            const dadosLoja = lojaDados[primeiraLojaChave];
                            // Preenche o campo input-loja com o valor da coluna Loja
                            document.querySelector('input[placeholder="Loja"]').value = dadosLoja.Loja || '';
                        } else {
                            // Se não encontrar o ID na tabela LojasPec, preenche com "Loja não encontrada"
                            document.querySelector('input[placeholder="Loja"]').value = 'Loja não encontrada';
                            console.log("ID de loja não encontrado no banco de dados LojasPec.");
                        }
                    }).catch(error => {
                        console.error("Erro ao buscar dados da loja:", error);
                    });
                } else {
                    // Se não houver ID de loja, preenche com "Loja não encontrada"
                    document.querySelector('input[placeholder="Loja"]').value = 'Loja não encontrada';
                }
            } else {
                // Limpa os campos se não houver dados encontrados
                document.querySelector('input[placeholder="Posição"]').value = 'Posição não encontrada';
                document.querySelector('input[placeholder="Placa"]').value = 'Placa não encontrada';
                document.querySelector('input[placeholder="Loja"]').value = 'Loja não encontrada';
                console.log("Nenhum dado encontrado para a TU informada.");
            }
        }).catch(error => {
            console.error("Erro ao buscar dados:", error);
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Recupera o nome do usuário logado armazenado em sessionStorage
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    // Verifica se o usuário está logado
    if (loggedInUser) {
        // Preenche o campo input dentro do form
        const inputNomeForm = document.getElementById('input-nome');
        if (inputNomeForm) {
            inputNomeForm.value = loggedInUser;
        }

        // Preenche o campo input dentro do div
        const inputNomeDiv = document.getElementById('input-nome-div');
        if (inputNomeDiv) {
            inputNomeDiv.value = loggedInUser;
        }
    } else {
        // Se o usuário não estive  r logado, redireciona para a página de login
        window.location.href = 'login.html';
    }
});

// Variável para armazenar o temporizador
let clickTimer;

// Função para iniciar o temporizador após um clique
function startClickTimer() {
    // Limpa o temporizador anterior, se existir
    clearTimeout(clickTimer);

    // Inicia um novo temporizador de 2 minutos (120000 milissegundos)
    clickTimer = setTimeout(function () {
        // Encerra o login e redireciona para Login.html
        encerrarLogin();
    }, 600000); // 10 minutos em milissegundos
}

// Função para encerrar o login e redirecionar para Login.html
function encerrarLogin() {
    // Limpa os dados de login no sessionStorage ou localStorage
    sessionStorage.clear(); // Limpa os dados do sessionStorage
    localStorage.clear(); // Limpa os dados do localStorage

    // Redireciona para a página de login
    window.location.href = 'Login.html';
}

// Event listener para cliques na página index
document.addEventListener('click', function () {
    // Reinicia o temporizador ao detectar um clique
    startClickTimer();
});

// Inicia o temporizador quando a página é carregada inicialmente
startClickTimer();


// Event listener para o link "Deslogar-se"
document.getElementById('logout-link').addEventListener('click', function (event) {
    event.preventDefault(); // Previne o comportamento padrão do link

    // Executa a função para encerrar o login imediatamente
    encerrarLogin();
});


function DadosPorTU() {
    const tu = document.getElementById('input-tu').value.trim();

    if (tu) {
        // Limpa a contagem inicial
        document.getElementById('resultado-auditado').textContent = '0/0';

        // Variáveis para contar UCs em gravarPec e auditarPec
        let ucsGravarPec = 0;
        let ucsAuditarPec = 0;

        // Busca os dados na tabela gravarPec com o TU inserido
        gravarPec.orderByChild('tu').equalTo(tu).once('value', gravarSnapshot => {
            if (gravarSnapshot.exists()) {
                gravarSnapshot.forEach(childSnapshot => {
                    // Incrementa a contagem de UCs em gravarPec
                    ucsGravarPec++;
                });
            }

            // Atualiza o texto da UCs em gravarPec
            const resultText1 = `${ucsGravarPec}/`;

            // Busca os dados na tabela auditarPec com o TU inserido
            auditarPec.orderByChild('tu').equalTo(tu).once('value', auditarSnapshot => {
                if (auditarSnapshot.exists()) {
                    auditarSnapshot.forEach(childSnapshot => {
                        // Incrementa a contagem de UCs em auditarPec
                        ucsAuditarPec++;
                    });
                }

                // Atualiza o texto da UCs em auditarPec
                const resultText2 = `${ucsAuditarPec}`;

                // Atualiza o texto completo exibido
                const resultadoElemento = document.getElementById('resultado-auditado');
                resultadoElemento.textContent = resultText1 + resultText2;

                // Define a cor do texto com base na comparação entre ucsGravarPec e ucsAuditarPec
                if (ucsGravarPec === ucsAuditarPec) {
                    resultadoElemento.style.color = 'green';
                } else {
                    resultadoElemento.style.color = 'red';
                }
            }).catch(auditarError => {
                console.error("Erro ao buscar dados na tabela auditarPec:", auditarError);
            });

        }).catch(gravarError => {
            console.error("Erro ao buscar dados na tabela gravarPec:", gravarError);
        });
    }
}

// Função para habilitar ou desabilitar o botão com base na visibilidade da mensagem de erro
function atualizarBotao() {
    const mensagemError = document.getElementById('mensagem-error');
    const botaoAuditar = document.querySelector('.button-auditoria');

    if (mensagemError.style.display === 'none') {
        botaoAuditar.disabled = false;  // Habilita o botão
    } else {
        botaoAuditar.disabled = true;   // Desabilita o botão
    }
}

// Função de validação das UCs que já existe
function validarUcs() {
    const inputUcs = document.getElementById('input-uc').value.trim();

    // Verifica se o campo está vazio
    if (inputUcs === '') {
        document.getElementById('mensagem-error').style.display = 'none';
        atualizarBotao(); // Atualiza o estado do botão
        return;
    }

    // Dividir o inputUcs por quebras de linha para obter uma lista de UCs
    const ucsArray = inputUcs.split('\n').map(uc => uc.trim()).filter(uc => uc !== '');

    // Se não houver UCs válidas, retorna
    if (ucsArray.length === 0) {
        document.getElementById('mensagem-error').style.display = 'none';
        atualizarBotao(); // Atualiza o estado do botão
        return;
    }

    // Referência para o banco de dados Firebase
    const database = firebase.database();
    const gravarPecRef = database.ref("gravarPec");

    // Array para armazenar resultados de cada UC
    const resultados = [];

    // Verificar cada UC no banco de dados
    ucsArray.forEach(inputUc => {
        gravarPecRef.orderByChild('uc').equalTo(inputUc).once('value', (snapshot) => {
            if (snapshot.exists()) {
                // UC encontrada no banco de dados
                resultados.push({ uc: inputUc, encontrada: true });
            } else {
                // UC não encontrada no banco de dados
                resultados.push({ uc: inputUc, encontrada: false });
            }

            // Verificar se todas as UCs foram verificadas
            if (resultados.length === ucsArray.length) {
                // Verifica se há alguma UC não encontrada
                const ucsNaoEncontradas = resultados.filter(resultado => !resultado.encontrada).map(resultado => resultado.uc);
                if (ucsNaoEncontradas.length > 0) {
                    // Algumas UCs não foram encontradas
                    document.getElementById('mensagem-error').textContent = `Litígio: As seguintes UCs não foram encontradas no banco de dados: ${ucsNaoEncontradas.join(', ')}`;
                    document.getElementById('mensagem-error').style.color = 'red';
                    document.getElementById('mensagem-error').style.display = 'block';
                } else {
                    // Todas as UCs foram encontradas
                    document.getElementById('mensagem-error').style.display = 'none';
                    DadosPorTU(); // Chamada para verificar dados por TU após confirmar UCS
                }

                atualizarBotao(); // Atualiza o estado do botão após a verificação
            }
        }).catch((error) => {
            console.error('Erro ao verificar UC:', error);
            document.getElementById('mensagem-error').textContent = 'Erro ao verificar UC. Por favor, tente novamente mais tarde.';
            document.getElementById('mensagem-error').style.color = 'red';
            document.getElementById('mensagem-error').style.display = 'block';
            atualizarBotao(); // Atualiza o estado do botão em caso de erro
        });
    });
}

// Chama a função de validação quando o conteúdo do campo muda (opcional)
document.getElementById('input-uc').addEventListener('input', validarUcs);

// Inicializa o estado do botão ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarBotao);



function DadosPorTU() {
    const tu = document.getElementById('input-tu').value.trim();

    if (tu) {
        // Limpa a contagem inicial
        document.getElementById('resultado-auditado').textContent = '0/0';

        // Variáveis para contar UCs em gravarPec e auditarPec
        let ucsGravarPec = 0;
        let ucsAuditarPec = 0;

        // Busca os dados na tabela gravarPec
        gravarPec.orderByChild('tu').equalTo(tu).once('value', gravarSnapshot => {
            if (gravarSnapshot.exists()) {
                gravarSnapshot.forEach(childSnapshot => {
                    const data = childSnapshot.val();

                    // Incrementa a contagem de UCs em gravarPec
                    ucsGravarPec++;
                });
            }

            // Atualiza o texto da UCs em gravarPec
            const resultText1 = `${ucsGravarPec}/`;

            // Busca os dados na tabela auditarPec
            auditarPec.orderByChild('tu').equalTo(tu).once('value', auditarSnapshot => {
                if (auditarSnapshot.exists()) {
                    auditarSnapshot.forEach(childSnapshot => {
                        const data = childSnapshot.val();

                        // Incrementa a contagem de UCs em auditarPec
                        ucsAuditarPec++;
                    });
                }

                // Atualiza o texto da UCs em auditarPec
                const resultText2 = `${ucsAuditarPec}`;

                // Atualiza o texto completo exibido
                const resultadoElemento = document.getElementById('resultado-auditado');
                resultadoElemento.textContent = resultText1 + resultText2;

                // Define a cor do texto com base na comparação entre ucsGravarPec e ucsAuditarPec
                if (ucsGravarPec === ucsAuditarPec) {
                    resultadoElemento.style.color = 'green';
                } else {
                    resultadoElemento.style.color = 'red';
                }
            }).catch(auditarError => {
                console.error("Erro ao buscar dados na tabela auditarPec:", auditarError);
            });

        }).catch(gravarError => {
            console.error("Erro ao buscar dados na tabela gravarPec:", gravarError);
        });
    }
}

// Atualiza a data e hora automaticamente
function updateDateTimeInputfive() {
    const inputDatetimeLocal = document.getElementById('datetime-local-five');
    const now = new Date();
    const formattedDateTime = formatDateTimeForInput(now);
    inputDatetimeLocal.value = formattedDateTime;
}



// Referência ao Realtime Database
const database = firebase.database()

function DesatribuicaoPec() {
    // Obtém o valor do usuário logado
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    // Obtém os valores dos inputs
    const tuValue = document.getElementById('input-tu-five').value.trim();
    const ucValue = document.getElementById('input-uc-five').value.trim();
    const dataValue = document.getElementById('datetime-local-five').value.trim();

    // Verifica se todos os campos estão preenchidos
    if (tuValue && ucValue && dataValue) {
        // Divide o valor de UC em linhas
        const ucs = ucValue.split('\n').filter(linha => linha.trim() !== '');

        // Verifica se há UCS para salvar
        if (ucs.length > 0) {
            // Processa cada UC individualmente
            const promises = ucs.map(uc => {
                // Cria uma nova referência em 'desatribuicao'
                const newDesatribuicaoRef = database.ref('desatribuicao').push();
                return newDesatribuicaoRef.set({
                    TU: tuValue,
                    UC: uc.trim(),  // Remove espaços extras
                    DIA: dataValue,
                    NOME: loggedInUser  // Adiciona o nome do usuário
                });
            });

            // Aguarda todas as promessas de gravação serem concluídas
            Promise.all(promises)
                .then(() => {
                    // Exibe uma mensagem de sucesso
                    const mensagemSucesso = document.getElementById('mensagem-sucesso');
                    mensagemSucesso.textContent = alert('Dados salvos com sucesso');
                    mensagemSucesso.style.display = 'block';

                    // Opcionalmente, você pode esconder a mensagem após alguns segundos
                    setTimeout(() => {
                        mensagemSucesso.style.display = 'none';
                    }, 3000);
                })
                .catch((error) => {
                    // Exibe uma mensagem de erro
                    const mensagemErro = document.getElementById('mensagem-error-five');
                    mensagemErro.textContent = alert('Erro ao salvar os dados.');
                    mensagemErro.style.display = 'block';

                    // Loga o erro no console
                    console.error('Erro ao salvar os dados:', error);
                });
        } else {
            const mensagemError = document.getElementById('mensagem-error-five');
            mensagemError.textContent = 'O campo UC está vazio.';
            mensagemError.style.display = 'block';
        }
    } else {
        // Exibe uma mensagem de erro se algum campo estiver vazio
        const mensagemError = document.getElementById('mensagem-error-five');
        mensagemError.textContent = 'Todos os campos devem ser preenchidos.';
        mensagemError.style.display = 'block';
    }
}



// Função para formatar a data para exibição (opcional)
function formatarData(data) {
    const date = new Date(data);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Função para carregar os dados do Firebase e preencher a tabela
function carregarDadosDesatribuicao() {
    const tabelaCorpo = document.querySelector('#tbody-desatribuicao');  // Atualizado para usar o ID correto

    // Limpa o corpo da tabela antes de adicionar novos dados
    tabelaCorpo.innerHTML = '';

    // Referência ao banco de dados
    const ref = database.ref('desatribuicao');

    // Obtém os dados do Firebase em tempo real
    ref.on('value', snapshot => {
        const dados = snapshot.val();

        tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de atualizar com os dados mais recentes

        if (dados) {
            // Itera sobre cada item e adiciona uma linha à tabela
            Object.keys(dados).forEach(key => {
                const item = dados[key];

                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
            <td>${formatarData(item.DIA)}</td>
            <td>${item.TU || ''}</td>
            <td>${item.UC || ''}</td>
            <td>${item.NOME || ''}</td>
          `;

                tabelaCorpo.appendChild(novaLinha);
            });
        } else {
            // Se não houver dados, exibe uma linha informativa
            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = '<td colspan="3">Nenhum dado encontrado</td>';
            tabelaCorpo.appendChild(novaLinha);
        }
    }, error => {
        console.error('Erro ao carregar dados:', error);
    });
}


// Inicializa o processo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Seção para exibir os dados (garante que a tabela esteja visível ao carregar os dados)
    carregarDadosDesatribuicao();
});

// Referências para os bancos de dados
const gravarPecRef = firebase.database().ref("gravarPec");
const auditarPecRef = firebase.database().ref("auditarPec");
const desatribuicaoRef = firebase.database().ref("desatribuicao");

// Função para comparar e deletar dados
async function compararEDeletarDados() {
    try {
        // Obter todos os dados do banco de dados "gravarPec"
        const gravarPecSnapshot = await gravarPecRef.once('value');
        const gravarPecData = gravarPecSnapshot.val();

        // Obter todos os dados do banco de dados "auditarPec"
        const auditarPecSnapshot = await auditarPecRef.once('value');
        const auditarPecData = auditarPecSnapshot.val();

        // Obter todos os dados do banco de dados "desatribuicao"
        const desatribuicaoSnapshot = await desatribuicaoRef.once('value');
        const desatribuicaoData = desatribuicaoSnapshot.val();

        if (!desatribuicaoData) {
            console.log("Nenhum dado encontrado em desatribuicao.");
            return;
        }

        // Transformar os dados em arrays de objetos
        const gravarPecArray = Object.entries(gravarPecData || {}); // [ [id, {uc, tu}], ... ]
        const auditarPecArray = Object.entries(auditarPecData || {}); // [ [id, {uc, tu}], ... ]

        // Transformar desatribuicaoData em array se não for
        const desatribuicaoArray = Array.isArray(desatribuicaoData) ? desatribuicaoData : Object.values(desatribuicaoData);

        // Criar um Set a partir dos dados de desatribuicao para rápida busca
        const desatribuicaoSet = new Set(desatribuicaoArray.map(item => `${item.UC}:${item.TU}`)); // Set com chave "UC:T`U"

        // Função para deletar item se presente
        async function deletarItem(ref, id) {
            try {
                console.log(`Tentando deletar ${ref.key} com ID ${id}`);
                await ref.child(id).remove();
                console.log(`Deletado ${ref.key} com ID ${id}`);
            } catch (error) {
                console.error(`Erro ao deletar ${ref.key} com ID ${id}: `, error);
            }
        }

        // Verificar e deletar itens em "gravarPec"
        for (const [id, gravarPecItem] of gravarPecArray) {
            const key = `${gravarPecItem.uc}:${gravarPecItem.tu}`;
            if (desatribuicaoSet.has(key)) {
                console.log(`Encontrado e deletado em gravarPec UC: ${gravarPecItem.uc}, TU: ${gravarPecItem.tu}`);
                await deletarItem(gravarPecRef, id);
            }
        }

        // Verificar e deletar itens em "auditarPec"
        for (const [id, auditarPecItem] of auditarPecArray) {
            const key = `${auditarPecItem.ucs}:${auditarPecItem.tu}`;
            if (desatribuicaoSet.has(key)) {
                console.log(`Encontrado e deletado em auditarPec UC: ${auditarPecItem.ucs}, TU: ${auditarPecItem.tu}`);
                await deletarItem(auditarPecRef, id);
            }
        }

    } catch (error) {
        console.error("Erro ao buscar, comparar ou deletar dados: ", error);
    }
}

// Chama a função para comparar e deletar dados
compararEDeletarDados();


// Função para remover entradas duplicadas
async function removerDuplicatas() {
    try {
        // Obter todos os dados do banco de dados "desatribuicao"
        const desatribuicaoSnapshot = await desatribuicaoRef.once('value');
        const desatribuicaoData = desatribuicaoSnapshot.val();

        if (!desatribuicaoData) {
            console.log("Nenhum dado encontrado em desatribuicao.");
            return;
        }

        // Transformar os dados em um array de objetos
        const desatribuicaoArray = Array.isArray(desatribuicaoData) ? desatribuicaoData : Object.entries(desatribuicaoData).map(([id, item]) => ({ id, ...item }));

        // Criar um Map para identificar duplicatas
        const seen = new Map();
        const toDelete = [];

        // Identificar duplicatas
        desatribuicaoArray.forEach(item => {
            const key = `${item.TU}:${item.UC}`;
            if (seen.has(key)) {
                // Se a chave já foi vista, marcar para exclusão
                toDelete.push(item.id);
            } else {
                // Caso contrário, adicionar a chave ao Map
                seen.set(key, item.id);
            }
        });

        // Excluir entradas duplicadas
        for (const id of toDelete) {
            if (id) { // Verificar se ID é válido
                console.log(`Deletando entrada com ID ${id}`);
                await desatribuicaoRef.child(id).remove();
            } else {
                console.error(`ID inválido para exclusão: ${id}`);
            }
        }

        console.log("Duplicatas removidas com sucesso.");
    } catch (error) {
        console.error("Erro ao buscar e remover duplicatas: ", error);
    }
}

// Chama a função para remover duplicatas
removerDuplicatas();



let debounceTimeout;

async function validarTuEuc() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        try {
            const tu = document.getElementById('input-tu').value.trim();
            const uc = document.getElementById('input-uc').value.trim().split('\n').filter(linha => linha);

            // Referência ao botão "Auditar PEC"
            const botaoAuditar = document.querySelector('#section-for .button-auditoria');

            if (!tu || !uc.length) {
                document.getElementById('mensagem-error').innerText = 'Por favor, informe TU e UC.';
                document.getElementById('mensagem-error').style.display = 'block';
                botaoAuditar.style.display = 'none'; // Ocultar o botão
                return;
            }

            // Buscar todas as entradas com a TU fornecida
            const snapshot = await gravarPec.orderByChild('tu').equalTo(tu).once('value');
            const dados = snapshot.val();

            if (dados) {
                const todasUcs = Object.values(dados).flatMap(item => item.uc);

                // Verificar se há UC fornecida que não está presente nas UC encontradas
                const ucsNaoEncontradas = uc.filter(entradaUc => !todasUcs.includes(entradaUc));

                if (ucsNaoEncontradas.length > 0) {
                    document.getElementById('mensagem-error').innerText = `A TU informada não tem relação com a UC informada: ${ucsNaoEncontradas.join(', ')}`;
                    document.getElementById('mensagem-error').style.display = 'block';
                    botaoAuditar.style.display = 'none'; // Ocultar o botão
                } else {
                    document.getElementById('mensagem-error').style.display = 'none';
                    botaoAuditar.style.display = 'block'; // Mostrar o botão
                }
            } else {
                document.getElementById('mensagem-error').innerText = 'TU não encontrado em banco de dados.';
                document.getElementById('mensagem-error').style.display = 'block';
                botaoAuditar.style.display = 'none'; // Ocultar o botão
            }

        } catch (error) {
            document.getElementById('mensagem-error').innerText = 'Erro ao validar TU e UC: ' + error.message;
            document.getElementById('mensagem-error').style.display = 'block';
            botaoAuditar.style.display = 'none'; // Ocultar o botão
        }
    }, 300); // Tempo de debounce em milissegundos
}

// Adicionar ouvintes de eventos para os campos de entrada
document.getElementById('input-tu').addEventListener('input', validarTuEuc);
document.getElementById('input-uc').addEventListener('input', validarTuEuc);




// Função para mostrar o modal de carregamento
function mostrarModalCarregamento() {
    document.getElementById('modal-carregamento').style.display = 'flex';
}

// Função para ocultar o modal de carregamento
function ocultarModalCarregamento() {
    document.getElementById('modal-carregamento').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // Referência ao campo de filtro e ao tbody da tabela
    const filtroTU = document.getElementById('filtro-tu');
    const tbodyConferencia = document.getElementById('tbody-conferencia');

    // Função para aplicar o filtro
    function aplicarFiltro() {
        const filtroValor = filtroTU.value.toLowerCase(); // Obtém o valor do filtro em minúsculas

        // Itera sobre todas as linhas da tabela
        const linhas = tbodyConferencia.getElementsByTagName('tr');
        for (const linha of linhas) {
            const colunaTU = linha.getElementsByTagName('td')[9]; // TU está na 10ª coluna (índice 9)
            if (colunaTU) {
                const tuTexto = colunaTU.textContent.toLowerCase(); // Obtém o texto do TU em minúsculas
                // Verifica se o TU contém o valor do filtro
                if (tuTexto.includes(filtroValor)) {
                    linha.style.display = ''; // Mostra a linha
                } else {
                    linha.style.display = 'none'; // Oculta a linha
                }
            }
        }
    }

    // Adiciona o evento de input ao campo de filtro
    filtroTU.addEventListener('input', aplicarFiltro);
    }   
);

function updateFields() {
    const loggedInUser = sessionStorage.getItem('loggedInUser'); // Obtém o usuário logado

    // Verifica se o usuário está logado
    if (loggedInUser) {
        // Preenche o campo input dentro do form
        const inputNomeForm = document.getElementById('input-nome');
        if (inputNomeForm) {
            if (!inputNomeForm.value) {
                inputNomeForm.value = loggedInUser;
            }
        }

        // Preenche o campo input dentro do div
        const inputNomeDiv = document.getElementById('input-nome-div');
        if (inputNomeDiv) {
            if (!inputNomeDiv.value) {
                inputNomeDiv.value = loggedInUser;
            }
        }
    } else {
        // Se o usuário não estiver logado, redireciona para a página de login
        window.location.href = 'login.html';
    }
}

// Executa updateFields a cada 1000 milissegundos (1 segundo)
setInterval(updateFields, 857);

// Função fictícia para obter o usuário logado
// Substitua isso pela sua lógica de autenticação
function getLoggedInUser() {
    // Lógica para obter o usuário logado, por exemplo, do armazenamento local ou sessão
    // Retorne o nome do usuário ou null se não estiver logado
    return localStorage.getItem('loggedInUser'); // Exemplo usando localStorage
}

// Executa a função a cada 1000 milissegundos (1 segundo)
setInterval(updateFields, 1000);

// Chama a função imediatamente para garantir que os campos estejam atualizados ao carregar a página
updateFields();

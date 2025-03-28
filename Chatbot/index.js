// Função para exibir todas as perguntas de uma vez dentro de um único balão
function showQuestions() {
    const chatBox = document.getElementById("chat-box");

    // Lista de perguntas
    const questions = [
        "1 - Se precisasse acessar o ETQ agora, saberia como fazer",
        "2 - Você conhece a finalidade do ETQ dentro da empresa",
        "3 - Você sabe seu usuário e senha do ETQ",
        "4 - Caso esqueça sua senha do ETQ saberia como recuperá-la",
        "5 - Com que frequência você utiliza o ETQ",
        "6 - Você sabe onde encontrar suporte para problemas no ETQ",
        "7 - Você sente necessidade de um treinamento sobre o ETQ",
        "8 - Quais treinamentos você gostaria de receber",
        "9 - Você consegue navegar facilmente pelo ETQ",
        "Parabéns, você agora é um especialista em Qualidade"
    ];

    // Juntando todas as perguntas em uma única string, separadas por quebra de linha
    const questionList = questions.map(question => `<br><p>${question}</p>`).join("<br>");

    // Exibe as perguntas dentro de um único balão
    addMessage("Selecione sua dúvida abaixo.<br>" + questionList, 'bot');
}

// Função para adicionar a mensagem ao chat
function addMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = message;  // Usamos innerHTML para permitir links clicáveis
    chatBox.appendChild(messageDiv);
}

// Função para lidar com a resposta do usuário
function sendMessage() {
    const userInput = document.getElementById("user-input").value;

    if (userInput) {
        // Adiciona a mensagem do usuário ao chat
        addMessage("Você digitou: " + userInput, 'user');

        // Verifica se a entrada é um número válido e dentro do intervalo de perguntas
        const questionIndex = parseInt(userInput, 10) - 1; // Subtrai 1 para ajustar ao índice do array

        if (questionIndex >= 0 && questionIndex < 9) {
            showVideo(questionIndex); // Exibe o vídeo correspondente
        } else {
            addMessage("Por favor, digite um número válido entre 1 e 9.", 'bot');
        }

        // Limpa o campo de entrada
        document.getElementById("user-input").value = '';
    }
}

// Função para exibir os vídeos
function showVideo(questionIndex) {
    const chatBox = document.getElementById("chat-box");

    // Links para os vídeos (ajuste conforme os links reais)
    const videoLinks = [
        "/Qualidade/VID-20250325-WA0008.mp4",  // Link para a primeira pergunta
        "/Qualidade/VID-20250325-WA0009.mp4", // Link para a segunda pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a terceira pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a quarta pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a quinta pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a sexta pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a sétima pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4", // Link para a oitava pergunta
        "/Qualidade/WhatsApp Video 2025-03-24 at 13.49.48.mp4",  // Link para a nona pergunta
    ];

    const videoUrl = videoLinks[questionIndex];

    // Exibe o vídeo
    const videoTag = document.createElement("video");
    videoTag.setAttribute("controls", "true");
    videoTag.setAttribute("width", "100%");  // Ajusta a largura do vídeo para 100% do container
    videoTag.innerHTML = `<source src="${videoUrl}" type="video/mp4">`; // Define o caminho para o vídeo
    chatBox.appendChild(videoTag);

    // Exibe novamente as perguntas após o vídeo
    setTimeout(() => {
        showQuestions();
    }, 2000);  // Espera 2 segundos para exibir as perguntas novamente
}

// Função para iniciar a conversa e exibir as perguntas
function startChat() {
    const firstMessage = "Olá, sou o assistente virtual da qualidade e irei lhe auxiliar hoje.";
    addMessage(firstMessage, 'bot');  // Exibe a primeira mensagem do bot

    // Depois de 2 segundos, o bot envia as perguntas
    setTimeout(() => {
        showQuestions();  // Exibe todas as perguntas dentro de um único balão
    }, 2000);
}

// Inicia a conversa assim que a página é carregada
window.onload = startChat;

let currentPage = 1;
const resultsPerPage = 10;
let chatHistory = [];

function clearChatHistory() {
    chatHistory = [];
    displayChatResponse();
}

async function performSearch(page = 1) {
    currentPage = page;
    const query = document.getElementById('searchQuery').value;
    const start = (page - 1) * resultsPerPage + 1;

    const bodyContent = JSON.stringify({ query, start });

    const response = await fetch('https://52urwwn2ba.execute-api.us-east-2.amazonaws.com/dev1/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: bodyContent })
    });

    const resultText = await response.json();
    const results = JSON.parse(resultText.body);

    displayResults(results);
    displayPagination(results.queries.request[0].totalResults);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (results.items && Array.isArray(results.items)) {
        results.items.forEach(item => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-item';
            resultElement.innerHTML = `
                <div>
                    <div class="title"><a href="${item.link}" target="_blank">${item.title}</a></div>
                    <div class="snippet">${item.snippet}</div>
                </div>
                <div class="button-container">
                    <button onclick="fetchAndProcessText('${item.link}', '${document.getElementById('searchQuery').value}')">
                        <img src="button-icon.svg" alt="Button">
                    </button>
                </div>
            `;
            resultsDiv.appendChild(resultElement);
        });
    } else {
        console.error('Results.items is missing or not an array:', results);
    }

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.id = 'pagination';
    resultsDiv.appendChild(paginationDiv);
}

function displayPagination(totalResults) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => performSearch(currentPage - 1);
        paginationDiv.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => performSearch(currentPage + 1);
        paginationDiv.appendChild(nextButton);
    }
}

async function fetchAndProcessText(url, query) {
    clearChatHistory();
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loader';
    chatMessages.appendChild(loadingIndicator);

    const bodyContent = {
        query: query,
        url: url
    };

    const wrappedBodyContent = {
        body: JSON.stringify(bodyContent)
    };

    console.log('Request body:', wrappedBodyContent);

    try {
        const response = await fetch('https://iiyzih11c2.execute-api.us-east-2.amazonaws.com/dev2/dev2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrappedBodyContent)
        });

        if (!response.ok) {
            if (response.status === 504) {
                console.error('Gateway Timeout error:', response.statusText);
                chatMessages.removeChild(loadingIndicator);
                displayChatResponse('Sorry, the site could not be read');
            } else {
                console.error('Error fetching and processing text:', response.statusText);
                chatMessages.removeChild(loadingIndicator);
                displayChatResponse('Error fetching and processing text: ' + response.statusText);
            }
            return;
        }

        const resultText = await response.json();
        console.log('Response:', resultText);

        if (resultText.body) {
            try {
                const resultBody = JSON.parse(resultText.body);
                const answer = resultBody ? resultBody.answer : 'Сайт не удалось прочитать';

                chatMessages.removeChild(loadingIndicator);
                await displayTextWordByWord(answer);
            } catch (error) {
                console.error('Error parsing result body:', error);
                chatMessages.removeChild(loadingIndicator);
                displayChatResponse('Ошибка при обработке ответа');
            }
        } else {
            console.error('Received empty or invalid text for display');
            chatMessages.removeChild(loadingIndicator);
            displayChatResponse('Received empty or invalid text for display');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        chatMessages.removeChild(loadingIndicator);
        displayChatResponse('Fetch error: ' + error.message);
    }
}

async function displayTextWordByWord(text) {
    if (!text) {
        console.error('Received empty or invalid text for display');
        return;
    }

    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    
    // Replace new lines with <br> tags for proper formatting
    const formattedText = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    
    messageElement.innerHTML = `Disc: ${formattedText}`;
    chatMessages.appendChild(messageElement);

    chatHistory.push(`AI: ${text}`);
}


async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message !== '') {
        chatHistory.push(`You: ${message}`);
        displayChatResponse();
        userInput.value = '';

        const chatMessages = document.getElementById('chatMessages');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loader';
        chatMessages.appendChild(loadingIndicator);

        const bodyContent = {
            query: message,
            chatHistory: chatHistory
        };

        const response = await fetch('https://lmf302snxg.execute-api.us-east-2.amazonaws.com/dev3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: JSON.stringify(bodyContent) })
        });

        chatMessages.removeChild(loadingIndicator);

        if (!response.ok) {
            const error = await response.text();
            console.error('Error from API Gateway:', error);
            displayChatResponse('Error from API Gateway: ' + error);
            return;
        }

        const resultText = await response.json();
        console.log('Result text:', resultText);
        const parsedBody = JSON.parse(resultText.body);
        console.log('Parsed body:', parsedBody);
        const answer = parsedBody.answer;

        console.log('Response from API Gateway:', answer);
        await displayTextWordByWord(answer);
    }
}

function displayChatResponse(text = null) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    if (text) {
        chatHistory.push(`AI: ${text}`);
    }

    chatHistory.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
        chatMessages.appendChild(messageElement);
    });
}

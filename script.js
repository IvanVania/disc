let currentPage = 1;
const resultsPerPage = 10;
let chatHistory = [];

function clearChatHistory() {
    chatHistory = [];
    displayChatResponse();
}

async function performSearch(page = 1) {
    currentPage = page;
    const query = document.getElementById('searchQuery').value; //  
    const start = (page - 1) * resultsPerPage + 1; //  

    //  
    const bodyContent = JSON.stringify({ query, start });

    // 
    const response = await fetch('https://52urwwn2ba.execute-api.us-east-2.amazonaws.com/dev1/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: bodyContent }) //  
    });

    const resultText = await response.json();
    const results = JSON.parse(resultText.body);

    displayResults(results); // 
    displayPagination(results.queries.request[0].totalResults); //  
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    //  
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
                    <button onclick="fetchAndProcessText('${item.link}', '${item.title}')">
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
    clearChatHistory(); // 
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loader';
    chatMessages.appendChild(loadingIndicator);

    const bodyContent = {
        query: query,
        url: url
    };

    const response = await fetch('https://iiyzih11c2.execute-api.us-east-2.amazonaws.com/dev2/dev2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(bodyContent) })
    });

    const resultText = await response.json();
    const answer = JSON.parse(resultText.body).answer;

    chatMessages.removeChild(loadingIndicator);

    await displayTextWordByWord(answer);
}

async function displayTextWordByWord(text) {
    if (!text) {
        console.error('Received empty or invalid text for display');
        return;
    }

    const words = text.split(' ');
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = 'Disc: '; //  
    chatMessages.appendChild(messageElement);

    for (let word of words) {
        if (word.includes('\n\n')) {
            word = word.replace(/\n\n/g, '<br><br>');
        } else if (word.includes('\n')) {
            word = word.replace(/\n/g, '<br>');
        }
        messageElement.innerHTML += word + ' '; //  
        await new Promise(resolve => setTimeout(resolve, 200)); //  
    }

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
            body: JSON.stringify({ body: JSON.stringify(bodyContent) }) //  
        });

        chatMessages.removeChild(loadingIndicator);

        if (!response.ok) {
            const error = await response.text();
            console.error('Error from API Gateway:', error);
            return;
        }

        const resultText = await response.json();
        console.log('Result text:', resultText); //  
        const parsedBody = JSON.parse(resultText.body);
        console.log('Parsed body:', parsedBody); //  
        const answer = parsedBody.answer;

        console.log('Response from API Gateway:', answer);
        await displayTextWordByWord(answer);
    }
}


function displayChatResponse() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    chatHistory.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        chatMessages.appendChild(messageElement);
    });
}




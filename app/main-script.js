window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    const payload = { 
        code: authorizationCode || null
    };

    const headers = {
        'Content-Type': 'application/json'
    };
    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    fetch('https://t6ve4y65bj.execute-api.us-east-2.amazonaws.com/default/FetchDataUserLambda', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            if (data.error === 'Authentication failed') {
                window.location.href = '/login.html';
            }
        } else {
            if (data.accessToken) {
                localStorage.setItem('jwtToken', data.accessToken);
            }

            // Обновление изображения профиля
            document.getElementById('profile-pic').src = data.user.profilePicture;

            // Обновление количества кредитов
            document.getElementById('credits').textContent = `Credits: ${data.user.credits || 0}`;

            // Обновление списка книг
            const chatList = document.getElementById('chat-list');
            chatList.innerHTML = '';

            Object.entries(data.user.books).forEach(([bookTitle, bookId]) => {
                const listItem = document.createElement('li');
                listItem.textContent = bookTitle.slice(0, -5); /*.    */
                listItem.setAttribute('data-id', bookId);
                listItem.onclick = () => createBookWindow(bookId, bookTitle);
                chatList.appendChild(listItem);
            });
        }
    })
    .catch(error => {
        console.error('Error executing request:', error);
    });
};


function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login.html';
}

function createNewBookWindow() {
    if (activeIntervalId) {
        clearInterval(activeIntervalId);
        activeIntervalId = null;
    }

    const bookContent = document.getElementById('book-content');
    bookContent.innerHTML = `
        <h2>New book</h2>
        <div id="book-messages" class="book-content">Enter a description to create a book plan</div>
        <div class="chat-input-container">
            <textarea id="book-input" class="chat-input" placeholder="Enter a description of the book..."></textarea>
            <select id="word-number-select" class="word-number-select">
                <option value="10000">10 000 words</option>
                <option value="20000">20 000 words</option>
                <option value="30000">30 000 words</option>
                <option value="40000">40 000 words</option>
                <option value="50000">50 000 words</option>
                <option value="60000">60 000 words</option>
                <option value="70000">70 000 words</option>
                <option value="80000">80 000 words</option>
                <option value="90000">90 000 words</option>
                <option value="100000">100 000 words</option>
                <option value="110000">110 000 words</option>
                <option value="120000">120 000 words</option>
                <option value="130000">130 000 words</option>
                <option value="140000">140 000 words</option>
                <option value="150000">150 000 words</option>
                <option value="160000">160 000 words</option>
                <option value="170000">170 000 words</option>
                <option value="180000">180 000 words</option>
                <option value="190000">190 000 words</option>
                <option value="200000">200 000 words</option>
            </select>
            <button class="chat-send-btn" onclick="sendCreateBookPlan()">Create a plan</button>
        </div>
    `;
}


function sendCreateBookPlan() {
    const input = document.getElementById('book-input');
    const wordNumberSelect = document.getElementById('word-number-select');
    const message = input.value;
    const wordNumber = wordNumberSelect.value;

    if (!message) return;

    const payload = {
        RequestText: message,
        WordNumber: parseInt(wordNumber)
    };

    console.log('Data sent:', payload);

    const messagesContainer = document.getElementById('book-messages');
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    messagesContainer.innerHTML = '';  // Очищаем контейнер перед добавлением спиннера
    messagesContainer.appendChild(spinner);

    input.value = '';

    fetch('https://8cs5141png.execute-api.us-east-2.amazonaws.com/default/CreateBookPlan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Убираем спиннер, как только данные загрузились
        messagesContainer.innerHTML = '';
        if (data.plan) {
            addNewBookToListAndOpen(data.bookTitle || 'New book', data.bookId);
        } else {
            messagesContainer.innerHTML = `<div>Error: ${data.error || 'Unexpected response from the server'}</div>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messagesContainer.innerHTML = `<div>Error: Failed to get book plan</div>`;
    });
}



function sendRegenerateBookPlan() {
    const input = document.getElementById('book-input');
    const message = input.value;
    const bookId = document.getElementById('book-content').getAttribute('data-book-id');

    const payload = {
        oldText: document.getElementById('book-messages').textContent,
        additionalHints: message,
        bookId: bookId
    };

    console.log('Data sent:', payload);

    const messagesContainer = document.getElementById('book-messages');
    messagesContainer.innerHTML = '<div class="loading-spinner"></div>';
    input.value = '';

    fetch('https://3mualszt9f.execute-api.us-east-2.amazonaws.com/default/RegeneratePlanBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.regeneratedPlan) {
            messagesContainer.innerHTML = `<div>New book plan:<br>${data.regeneratedPlan}</div>`;
        } else {
            messagesContainer.innerHTML = `<div>Error: ${data.error || 'Unexpected response from the server'}</div>`;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        messagesContainer.innerHTML = `<div>Error: Failed to regenerate book plan</div>`;
    });
}


let activeIntervalId = null;
let activeBookId = null;

function createBookWindow(bookId, bookTitle) {
    if (activeIntervalId) {
        clearInterval(activeIntervalId);
        activeIntervalId = null;
    }

    fetchBookData(bookId)
        .then(bookData => {
            console.log('Received data from the book:', bookData); // Вывод объекта bookData в консоль

            const bookContent = document.getElementById('book-content');
            bookContent.setAttribute('data-book-id', bookId);

            // Пример обработки текста перед вставкой в HTML
            let formattedText = bookData.plan.replace(/\n/g, '<br>'); // Преобразование новых строк в <br>
//-----Playg
            bookContent.innerHTML = `
                <h2>${bookTitle.slice(0, -5)}</h2>
                <div id="book-messages" class="book-content">${formattedText || 'Contents of the book...'}</div>
                ${renderBookStateUI(bookData.state, bookId)}
            `;

            const chatList = document.getElementById('chat-list');
            const allItems = chatList.querySelectorAll('li');
            allItems.forEach(item => item.classList.remove('active'));

            const currentChat = chatList.querySelector(`li[data-id="${bookId}"]`);
            if (currentChat) {
                currentChat.classList.add('active');
            }

            activeBookId = bookId;

            console.log('ЗАПУСК ЦЫКЛА');
                    console.log('Статус книги:', bookData.state); // Логируем значение state
        console.log('Тип данных статуса:', typeof bookData.state);

            // Проверка состояния книги перед запуском проверки прогресса
            if (bookData.state == 'START') {//??????
                console.log('1-ЗАПУСК ЦЫКЛА');
                startProgressCheck(bookId);
                console.log('2-ЗАПУСК ЦЫКЛА');
            } else {
                console.log('Книга уже завершена или не начала генерацию, проверка прогресса не требуется.');
            }
        });
}




function startProgressCheck(bookId) {
    console.log(`Запуск проверки прогресса для книги с ID: ${bookId}`);
    activeIntervalId = setInterval(() => {
        console.log(`Проверка активной книги: activeBookId=${activeBookId}, bookId=${bookId}`);
        
        if (activeBookId !== bookId) {
            console.log('Книга изменилась, очищаем интервал');
            clearInterval(activeIntervalId);
            return;
        }

        fetch('https://4hrw5w81ij.execute-api.us-east-2.amazonaws.com/default/CheakBookStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({ BookID: bookId })
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Ответ от сервера (распарсен):', data);

            if (activeBookId === bookId) {
                const progressElement = document.getElementById('progress-percentage');
                if (progressElement) {
                    const progress = data.progress || '0%';
                    progressElement.textContent = progress;
                    console.log(`Обновление прогресса: ${progress}`);
                }

                if (data.message === 'FINISHED') {
                    console.log('Книга готова, очищаем интервал');
                    clearInterval(activeIntervalId);
                    activeIntervalId = null;
                    console.log('Вызов функции createBookWindow');
                    createBookWindow(bookId, 'Ваша книга');
                    //
                    clearInterval(activeIntervalId);
                    activeIntervalId = null;

                } else {
                    console.log(`Текущий статус книги: ${data.message}`);
                }
            } else {
                console.log('activeBookId не совпадает с bookId, не обновляем данные');
            }
        })
        .catch(error => {
            console.error('Ошибка при проверке статуса книги:', error);
        });
    }, 10000);
}



function renderBookStateUI(state, bookId) {
    if (state === 'START') {
        startProgressCheck(bookId);
        return `
            <div class="chat-progress">Your book is being generated... <span id="progress-percentage">...</span></div>
        `;
    } else if (state === 'FINISHED') {
        return `
            <div class="chat-finished">Your book is ready. <a href="#" class="download-link" onclick="downloadBook('${bookId}')">Download</a></div>
        `;
    } else {
        return `
            <div class="start-generation-bar">
                <span>Start generating a book</span>
                <button onclick="startBookGeneration('${bookId}')">Start</button>
            </div>
            <div class="chat-input-container">
                <textarea id="book-input" class="chat-input" placeholder="Enter changes..."></textarea>
                <button class="chat-send-btn" onclick="sendRegenerateBookPlan()">Regenerate</button>
            </div>
        `;
    }
}


function downloadBook(bookId) {
    const jwtToken = localStorage.getItem('jwtToken');
    
    console.log(`Starting download for book with ID: ${bookId}`);
    console.log(`JWT Token: ${jwtToken}`);

    const randomId = Math.random().toString(36).substring(2, 15);

    fetch('https://399vji2jze.execute-api.us-east-2.amazonaws.com/default/download-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Добавление токена авторизации из localStorage
        },
        body: JSON.stringify({ BookID: bookId }) // Отправка идентификатора книги в теле запроса
    })
    .then(response => {
        console.log('Received response:', response); // Логируем ответ от сервера
        if (response.status === 401) { // Проверка статуса 401 (Unauthorized)
            window.location.href = '/login.html'; // Перенаправление на страницу входа в случае ошибки авторизации
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Проверка успешности запроса
        }
        return response.json(); // Парсинг ответа в формате JSON
    })
    .then(data => {
        console.log('Parsed response data:', data); // Логируем распарсенные данные
        const downloadUrl = data.downloadUrl;
        console.log(`Download URL received: ${downloadUrl}`); // Логируем ссылку для скачивания

        // Теперь используем ссылку для скачивания файла
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `book-ai-${randomId}.pdf`; // Генерация имени файла с рандомным идентификатором
        document.body.appendChild(a);
        a.click(); // Автоматическое скачивание файла
        a.remove(); // Удаление временного элемента
        console.log('Download initiated successfully.'); // Лог успешного запуска скачивания
    })
    .catch(error => {
        console.error('Error loading book:', error); // Логирование ошибок
        alert('Failed to download the book.'); // Уведомление пользователя об ошибке
    });
}









function fetchBookData(bookId) {
    return fetch('https://32rch1nb3j.execute-api.us-east-2.amazonaws.com/default/getChatBookDATA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Добавление токена авторизации из localStorage
        },
        body: JSON.stringify({ BookID: bookId }) // Отправка идентификатора книги в теле запроса
    })
    .then(response => {
        if (response.status === 401) { // Проверка статуса 401 (Unauthorized)
            window.location.href = '/login.html'; // Перенаправление на страницу входа в случае ошибки авторизации
            return;
        }
        return response.json(); // Парсинг ответа в формате JSON, если статус ответа успешный
    })
    .catch(error => {
        console.error('Ошибка при получении данных книги:', error); // Логирование ошибки, если произошла ошибка запроса
        return {}; // Возвращение пустого объекта в случае ошибки
    });
}





function addNewBookToListAndOpen(bookTitle, bookId) {
    const chatList = document.getElementById('chat-list');
    const listItem = document.createElement('li');
    listItem.textContent = bookTitle;
    listItem.setAttribute('data-id', bookId);
    listItem.onclick = () => createBookWindow(bookId, bookTitle);

    if (chatList.firstChild) {
        chatList.insertBefore(listItem, chatList.firstChild);
    } else {
        chatList.appendChild(listItem);
    }

    createBookWindow(bookId, bookTitle);
}

function startBookGeneration(bookId) {
    console.log("Start generation for book:", bookId);

    const jwtToken = localStorage.getItem('jwtToken');
    const payload = {
        bookId: bookId
    };

    fetch('https://gurn9gbvb5.execute-api.us-east-2.amazonaws.com/default/startGenerateBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = '/login.html'; // Перенаправление на страницу входа при ошибке 401
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data); // Логируем ответ от сервера
        if (data.message === 'START') {
            console.log('Generation started successfully');
            const bookContent = document.getElementById('book-content');
            const bookMessages = bookContent.querySelector('#book-messages');
            const existingContent = bookMessages ? bookMessages.innerHTML : '';
            
            // Обновляем только часть с прогрессом, сохраняя существующее содержимое
            const progressBar = document.createElement('div');
            progressBar.className = 'chat-progress';
            progressBar.innerHTML = 'Your book is being generated... <span id="progress-percentage">0%</span>';
            
            // Заменяем существующую панель генерации или добавляем новую
            const existingProgressBar = bookContent.querySelector('.chat-progress');
            if (existingProgressBar) {
                existingProgressBar.replaceWith(progressBar);
            } else {
                bookContent.appendChild(progressBar);
            }
            
            // Удаляем кнопку "Старт" и поле ввода, если они есть
            const startBar = bookContent.querySelector('.start-generation-bar');
            if (startBar) startBar.remove();
            const inputContainer = bookContent.querySelector('.chat-input-container');
            if (inputContainer) inputContainer.remove();

            console.log('Setting activeBookId to:', bookId);  // Логируем установку переменной activeBookId
            activeBookId = bookId;

            // Проверяем, что старый интервал остановлен, если он существует
            if (activeIntervalId) {
                console.log('Clearing previous interval:', activeIntervalId);
                clearInterval(activeIntervalId);
                activeIntervalId = null;
            }

            console.log('Starting progress check...');  // Лог перед запуском функции проверки
            startProgressCheck(bookId);  // Начало проверки прогресса
            console.log('Progress check function has been called');  // Лог после вызова функции проверки

            // Уменьшаем количество кредитов на странице
            decreaseCredits();
        } else {
            console.error('Unexpected response:', data);
            alert('Error: Failed to start book generation');
        }
    })
    .catch(error => {
        console.error('Error starting generation:', error);
        alert('Error: Failed to start book generation');
    });
}

function decreaseCredits() {
    const creditsElement = document.getElementById('credits');
    let currentCredits = parseInt(creditsElement.textContent.replace('Credits: ', ''));
    currentCredits -= 1;
    creditsElement.textContent = `Credits: ${currentCredits}`;
}





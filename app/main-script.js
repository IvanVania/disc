


function printArray(title, array) {
    process.stdout.write('\n' + title + '\n');
    process.stdout.write('='.repeat(50) + '\n');
    array.forEach((item, index) => {
        process.stdout.write(`${index + 1}. ID: ${item.id}\n`);
        process.stdout.write(`   Title: ${item.title}\n`);
        process.stdout.write(`   Date: ${item.CreateDate}\n`);
        process.stdout.write(`   State: ${item.state}\n`);
        process.stdout.write('-'.repeat(50) + '\n');
    });
}

function updateUI(data) {
    if (data.profilePicture) {
        document.getElementById('profile-pic').src = data.profilePicture;
    }
    document.getElementById('credits').textContent = `Credits: ${data.credits || 0}`;

    const headerSubtitle = document.querySelector('.sidebar-header-subtitle');
    if (headerSubtitle) {
        headerSubtitle.textContent = `${data.books.length} books`;
    }

    // Print original array to terminal
    printArray('ORIGINAL BOOKS ARRAY', data.books);

    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';

    if (data.books && Array.isArray(data.books)) {
        // Create normalized array
        const normalizedBooks = data.books.map(book => ({
            id: book.id,
            title: book.title,
            CreateDate: new Date(book.CreateDate),
            state: book.state
        }));

        // Sort normalized array
        const sortedBooks = normalizedBooks.sort((a, b) => 
            b.CreateDate.getTime() - a.CreateDate.getTime()
        );

        // Print sorted array to terminal
        printArray('SORTED BOOKS ARRAY', sortedBooks);

        // Create cells from sorted array
        sortedBooks.forEach(book => {
            const bookItem = createBookItem(book);
            booksList.appendChild(bookItem);
        });
    }
}









window.onload = function () {
    // loading
    if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
        window.loadingIndicator.startLoading();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    const payload = { code: authorizationCode || null };

    const headers = {
        'Content-Type': 'application/json'
    };
    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    fetch('https://vjydgrki9a.execute-api.us-east-2.amazonaws.com/default/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) { 
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
            }
        } else {
            if (data.accessToken) { 
                localStorage.setItem('jwtToken', data.accessToken);
            }

            if (data.user) { 
                // try {
                    updateUI(data.user);
                // } catch (error) {
                //     console.error("Error inside updateUI:", error);
                // }
            } else { 

            }
        }
    })
    .catch(error => {
        console.error('Error executing request:', error);
    })
    .finally(() => {
        // loading
        if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
            window.loadingIndicator.stopLoading();
        }
    });
};


function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'https://ivanvania.github.io/testRepository/login/';
}
























// navbar-component.js
function createNavbar() {
    const navbar = document.createElement("div");
    navbar.style.display = "flex";
    navbar.style.alignItems = "center";
    navbar.style.justifyContent = "space-between";
    navbar.style.width = "100%";
    navbar.style.height = "70px";
    navbar.style.padding = "0 30px";
    navbar.style.background = "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
    navbar.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    navbar.style.boxSizing = "border-box";
    navbar.style.position = "relative";
    navbar.style.zIndex = "1000";

    const title = document.createElement("h1");
    title.textContent = "BOOK AI";
    title.style.background = "linear-gradient(to right, #fff 20%, #dcebff 100%)";
    title.style.webkitBackgroundClip = "text";
    title.style.webkitTextFillColor = "transparent";
    title.style.backgroundClip = "text";
    title.style.color = "transparent";
    title.style.fontSize = "2.2rem";
    title.style.fontWeight = "900";
    title.style.letterSpacing = "2px";
    title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.1)";
    title.style.fontFamily = "'Segoe UI', system-ui, -apple-system, sans-serif";
    title.style.margin = "0";
    title.style.cursor = "pointer";
    title.style.transition = "transform 0.3s ease";
    
    title.onmouseover = () => title.style.transform = "scale(1.05)";
    title.onmouseout = () => title.style.transform = "scale(1)";

    const rightSection = createRightSection();
    navbar.appendChild(title);
    navbar.appendChild(rightSection);
    return navbar;
}


function createRightSection() {
    const rightSection = document.createElement("div");
    rightSection.style.display = "flex";
    rightSection.style.alignItems = "center";
    rightSection.style.gap = "20px";

    const credits = createCredits();
    const buyCreditsBtn = createBuyCreditsButton();
    const profileContainer = createProfileContainer();
    const logoutBtn = createLogoutButton();

    rightSection.append(credits, buyCreditsBtn, profileContainer, logoutBtn);
    return rightSection;
}

function createCredits() {
    const credits = document.createElement("div");
    credits.id = "credits";  //
    credits.style.display = "flex";
    credits.style.alignItems = "center";
    credits.style.padding = "8px 15px";
    credits.style.background = "rgba(255,255,255,0.1)";
    credits.style.borderRadius = "20px";
    credits.style.color = "white";
    credits.style.fontSize = "14px";
    credits.style.fontWeight = "500";
    credits.style.backdropFilter = "blur(5px)";
    credits.textContent = "Credits: 0";
    return credits;
}

function createBuyCreditsButton() {
    const buyCreditsBtn = document.createElement("button");
    buyCreditsBtn.textContent = "Buy Credits";
    buyCreditsBtn.style.padding = "10px 20px";
    buyCreditsBtn.style.background = "linear-gradient(to right, #00bcd4, #2196f3)";
    buyCreditsBtn.style.color = "white";
    buyCreditsBtn.style.border = "none";
    buyCreditsBtn.style.borderRadius = "25px";
    buyCreditsBtn.style.cursor = "pointer";
    buyCreditsBtn.style.fontSize = "14px";
    buyCreditsBtn.style.fontWeight = "600";
    buyCreditsBtn.style.transition = "all 0.3s ease";
    buyCreditsBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    
    buyCreditsBtn.onmouseover = () => {
        buyCreditsBtn.style.transform = "translateY(-2px)";
        buyCreditsBtn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    };
    
    buyCreditsBtn.onmouseout = () => {
        buyCreditsBtn.style.transform = "translateY(0)";
        buyCreditsBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    };
    
    return buyCreditsBtn;
}

function createProfileContainer() {
    const profileContainer = document.createElement("div");
    profileContainer.style.width = "45px";
    profileContainer.style.height = "45px";
    profileContainer.style.borderRadius = "50%";
    profileContainer.style.border = "2px solid rgba(255,255,255,0.2)";
    profileContainer.style.overflow = "hidden";
    profileContainer.style.cursor = "pointer";
    profileContainer.style.transition = "transform 0.3s ease";
    profileContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

    const profileImg = document.createElement("img");
    profileImg.id = "profile-pic";  //
    profileImg.src = "https://dummyimage.com/45x45/cccccc/cccccc.png";
    profileImg.style.width = "100%";
    profileImg.style.height = "100%";
    profileImg.style.objectFit = "cover";
    
    profileContainer.onmouseover = () => profileContainer.style.transform = "scale(1.1)";
    profileContainer.onmouseout = () => profileContainer.style.transform = "scale(1)";
    
    profileContainer.appendChild(profileImg);
    return profileContainer;
}

function createLogoutButton() {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Log out";
    logoutBtn.style.padding = "10px 20px";
    logoutBtn.style.background = "linear-gradient(to right, #ff4081, #ff1744)";
    logoutBtn.style.color = "white";
    logoutBtn.style.border = "none";
    logoutBtn.style.borderRadius = "25px";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.fontSize = "14px";
    logoutBtn.style.fontWeight = "600";
    logoutBtn.style.transition = "all 0.3s ease";
    logoutBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

    logoutBtn.onmouseover = () => {
        logoutBtn.style.transform = "translateY(-2px)";
        logoutBtn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    };

    logoutBtn.onmouseout = () => {
        logoutBtn.style.transform = "translateY(0)";
        logoutBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    };

    //  
    logoutBtn.onclick = logout;

    return logoutBtn;
}







//USER DATA - OBJECT








// 
function createSidebar() {
    const sidebar = document.createElement("div");
    sidebar.style.width = "280px";
    sidebar.style.height = "calc(100vh - 70px)";
    sidebar.style.background = "linear-gradient(to bottom, #ffffff, #f8fafc)";
    sidebar.style.borderRight = "1px solid rgba(0,0,0,0.1)";
    sidebar.style.padding = "20px";
    sidebar.style.boxSizing = "border-box";
    sidebar.style.boxShadow = "2px 0 15px rgba(0,0,0,0.03)";
    sidebar.style.position = "relative";
    sidebar.style.zIndex = "1";

    const header = createSidebarHeader();
    const booksList = createBooksList();
    // 
    booksList.id = "books-list";
    const newBookBtn = createNewBookButton();

    sidebar.appendChild(header);
    sidebar.appendChild(newBookBtn);
    sidebar.appendChild(booksList);

    // 
    return sidebar;
}

// 
function createSidebarHeader() {
    const header = document.createElement("div");
    header.style.marginBottom = "20px";
    header.style.padding = "0 5px";

    const title = document.createElement("h2");
    title.textContent = "My Library";
    title.style.fontSize = "20px";
    title.style.fontWeight = "600";
    title.style.color = "#1e293b";
    title.style.margin = "0 0 5px 0";

    const subtitle = document.createElement("p"); 
    subtitle.textContent = `0 books`;
    subtitle.style.fontSize = "13px";
    subtitle.style.color = "#64748b";
    subtitle.style.margin = "0"; 
    subtitle.className = "sidebar-header-subtitle";

    header.appendChild(title);
    header.appendChild(subtitle);
    return header;
}

//  
function createBooksList() {
    const booksList = document.createElement("div");
    booksList.style.marginTop = "20px";
    booksList.style.display = "flex";
    booksList.style.flexDirection = "column";
    booksList.style.gap = "10px";
    booksList.style.overflowY = "auto";
    booksList.style.maxHeight = "calc(100vh - 200px)";
    booksList.style.paddingRight = "5px";
    
    // Custom scrollbar
    booksList.style.scrollbarWidth = "thin";
    booksList.style.scrollbarColor = "#cbd5e1 transparent";

    // Webkit scrollbar
    booksList.style.cssText += `
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 3px;
        }
    `;
    return booksList;
}

// 
function createNewBookButton() {
    const btn = document.createElement("button");
    btn.innerHTML = `
        <svg style="width: 18px; height: 18px; margin-right: 10px; filter: drop-shadow(0 2px 4px rgba(255,255,255,0.2));" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" 
                  d="M12 4v16m8-8H4"/>
        </svg>
        Create New Book
    `;
    
    // 
    const keyframes = `
        @keyframes pulseGlow {
            0% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 0 rgba(59, 130, 246, 0); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    //  
    btn.style.width = "100%";
    btn.style.padding = "14px 20px";
    btn.style.background = "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #2563eb 100%)";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "14px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "15px";
    btn.style.fontWeight = "600";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    btn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.style.letterSpacing = "0.3px";
    btn.style.textShadow = "0 2px 4px rgba(0,0,0,0.1)";
    btn.style.backgroundSize = "200% 200%";
    btn.style.animation = "gradient 5s ease infinite";
    
    //  
    btn.onmouseover = () => {
        btn.style.transform = "translateY(-2px) scale(1.02)";
        btn.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.35)";
        btn.style.animation = "pulseGlow 2s infinite";
        btn.style.background = "linear-gradient(135deg, #4338ca 0%, #3b82f6 50%, #1d4ed8 100%)";
    };
    btn.onmouseout = () => {
        btn.style.transform = "translateY(0) scale(1)";
        btn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
        btn.style.animation = "gradient 5s ease infinite";
        btn.style.background = "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #2563eb 100%)";
    };
    btn.onmousedown = () => {
        btn.style.transform = "translateY(1px) scale(0.98)";
        btn.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.2)";
    };

    //  
    btn.onclick = () => {
        openNewChatArea(); //new chat 
    };

    return btn;
}





// 
function openNewChatArea() {
    const chatAreaContainer = document.getElementById("chat-area-container");
    chatAreaContainer.innerHTML = "";
    const newChatArea = createNewBookChatArea();
    chatAreaContainer.appendChild(newChatArea);
}

//  
function createNewBookChatArea() {
    const area = document.createElement("div");
    area.textContent = "Creating a new book...";
 
    return area;
}















 
const styles = {
    bookItem: {
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '8px'
    },
    bookContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        minWidth: 0
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: '1 1 auto',
        minWidth: '0'
    },
    title: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#334155',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        overflow: 'visible',
        lineHeight: '1.4'
    },
    metadata: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: '0 0 auto',
        minWidth: '0'
    },
    dateContainer: {
        maxWidth: '70px',
        minWidth: '0',
        flex: '0 1 auto'
    },
    date: {
        fontSize: '11px',
        color: '#94a3b8',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    menuTrigger: {
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
        flex: '0 0 auto'
    },
    dropdownMenu: {
        position: 'absolute',
        right: '12px',
        top: '30px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '6px',
        display: 'none',
        zIndex: 100,
        border: '1px solid #e2e8f0',
        minWidth: '150px'
    },
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        color: '#ef4444',
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        marginTop: '4px'
    }
};

const STATUS_CONFIGS = {
    FINISHED: {
        background: 'rgba(34, 197, 94, 0.1)',
        icon: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7l2 2 4-4" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    },
    START: {
        background: 'rgba(59, 130, 246, 0.1)',
        icon: `<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>`
    },
    ERROR: {
        background: 'rgba(239, 68, 68, 0.1)',
        icon: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8m0-8l-8 8" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
        </svg>`
    }
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        if (hours === 0) return 'Just now';
        return `${hours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
}

function createStatusIndicator(state) {
    if (!state || !STATUS_CONFIGS[state]) return null;
    
    const config = STATUS_CONFIGS[state];
    const indicator = document.createElement('div');
    applyStyles(indicator, styles.statusIndicator);
    indicator.style.background = config.background;
    indicator.style.padding = '2px 8px';
    indicator.style.borderRadius = '4px';
    indicator.innerHTML = config.icon;
    
    if (state === 'START') {
        const uniqueClassName = `pulse-${Math.random().toString(36).substr(2, 9)}`;
        const pulseDiv = indicator.querySelector('div');
        if(pulseDiv) {
            pulseDiv.classList.add(uniqueClassName);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ${uniqueClassName}-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .${uniqueClassName} {
                    animation: ${uniqueClassName}-pulse 1.5s infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    return indicator;
}

function applyStyles(element, styleObj) {
    Object.assign(element.style, styleObj);
}



// //api-Delete Book

// 
function deleteBook(bookId, bookElement) {
  // 
  if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
    window.loadingIndicator.startLoading();
  }

  fetch('https://2l8918m1x7.execute-api.us-east-2.amazonaws.com/default/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
    body: JSON.stringify({ BookID: bookId })
  })
    .then(response => {
      console.log("Received response with status:", response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Deletion API responded with status ${response.status}`);
      }
    })
    .then(data => {
      console.log("Deletion API response data:", data);
      // 
      if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
        window.loadingIndicator.stopLoading();
      }
      // 
      bookElement.remove();
    })
    .catch(error => {
      if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
        window.loadingIndicator.stopLoading();
      }
      console.error('Error deleting book:', error);
      alert('Ошибка при удалении книги: ' + error.message);
    });
}

// 
function createBookItem(bookData) {
  const book = document.createElement("div");
  applyStyles(book, styles.bookItem);
  
  const content = document.createElement("div");
  applyStyles(content, styles.bookContent);
  
  // Верхняя строка с заголовком и метаданными
  const topRow = document.createElement("div");
  applyStyles(topRow, styles.topRow);
  
  const titleContainer = document.createElement("div");
  applyStyles(titleContainer, styles.titleContainer);
  
  const title = document.createElement("div");
  applyStyles(title, styles.title);
  title.textContent = bookData.title;
  
  const metadata = document.createElement("div");
  applyStyles(metadata, styles.metadata);
  
  const dateContainer = document.createElement("div");
  applyStyles(dateContainer, styles.dateContainer);
  
  const date = document.createElement("div");
  applyStyles(date, styles.date);
  date.textContent = formatDate(bookData.CreateDate);
  
  const menuTrigger = document.createElement("div");
  applyStyles(menuTrigger, styles.menuTrigger);
  menuTrigger.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="color: #94a3b8">
          <circle cx="8" cy="2" r="1.5"/>
          <circle cx="8" cy="8" r="1.5"/>
          <circle cx="8" cy="14" r="1.5"/>
      </svg>
  `;
  
  const dropdown = document.createElement("div");
  applyStyles(dropdown, styles.dropdownMenu);
  
  const deleteBtn = document.createElement("div");
  applyStyles(deleteBtn, styles.deleteButton);
  deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
      Delete Book
  `;
  
  titleContainer.appendChild(title);
  dateContainer.appendChild(date);
  metadata.appendChild(dateContainer);
  metadata.appendChild(menuTrigger);
  
  topRow.appendChild(titleContainer);
  topRow.appendChild(metadata);
  
  content.appendChild(topRow);
  
  // 
  const statusIndicator = createStatusIndicator(bookData.state);
  if (statusIndicator) {
    content.appendChild(statusIndicator);
  }
  
  book.appendChild(content);
  
 
  book.onmouseover = () => {
    applyStyles(book, {
      backgroundColor: '#f8fafc',
      transform: 'translateX(5px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    });
  };
  book.onmouseout = () => {
    applyStyles(book, {
      backgroundColor: 'white',
      transform: 'none',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
    });
  };
  menuTrigger.onmouseover = () => {
    applyStyles(menuTrigger, { backgroundColor: '#f1f5f9' });
  };
  menuTrigger.onmouseout = () => {
    applyStyles(menuTrigger, { backgroundColor: 'transparent' });
  };
  deleteBtn.onmouseover = () => {
    applyStyles(deleteBtn, { backgroundColor: '#fef2f2' });
  };
  deleteBtn.onmouseout = () => {
    applyStyles(deleteBtn, { backgroundColor: 'transparent' });
  };
  
  // 
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this book?")) {
      //  
      deleteBook(bookData.id, book);
    }
    dropdown.style.display = "none";
  };
  
  menuTrigger.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  };
  
  document.addEventListener('click', () => {
    dropdown.style.display = "none";
  });
  
  dropdown.appendChild(deleteBtn);
  book.appendChild(dropdown);
  
  // 
  book.setAttribute('data-book-item', 'true');
  
  book.onclick = () => {
 
    document.querySelectorAll('[data-book-item]').forEach(item => {
      applyStyles(item, styles.bookItem);
    });
    // 
    applyStyles(book, {
      backgroundColor: '#e0f7fa',         // 
      border: '1px solid #007BFF',         //  
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)' //  
    });
    //  
    openBookChatArea(bookData.id);
  };
  
  return book;
}




function updateUI(data) {
    // 
    if (data.profilePicture) {
        document.getElementById('profile-pic').src = data.profilePicture;
    }
    document.getElementById('credits').textContent = `Credits: ${data.credits || 0}`;

 
    const headerSubtitle = document.querySelector('.sidebar-header-subtitle');
    if (headerSubtitle) {
        headerSubtitle.textContent = `${data.books.length} books`;
    }

    // 
    console.log('=== ORIGINAL ARRAY ===');
    console.table(data.books);

    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';

    if (data.books && Array.isArray(data.books)) {
        const sortedBooks = data.books.slice().sort((a, b) => {
            return new Date(b.CreateDate) - new Date(a.CreateDate);
        });
        
        //  
        console.log('=== SORTED ARRAY ===');
        console.table(sortedBooks);

        sortedBooks.forEach(book => {
            const bookItem = createBookItem(book);
            booksList.appendChild(bookItem);
        });
    }
}




// 
function addNewBook(booksList, bookData) {
    const bookItem = createBookItem(bookData);
    booksList.appendChild(bookItem);
}












// 
function openBookChatArea(bookId) {
    const chatAreaContainer = document.getElementById("chat-area-container");
    chatAreaContainer.innerHTML = "";
    openChatBook(bookId);
}

//  
function openChatBook(bookId) {
 
    window.loadingIndicator.startLoading();

    // 
    fetch('https://tbq9c4b34j.execute-api.us-east-2.amazonaws.com/default/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` 
        },
        body: JSON.stringify({ bookId: bookId })
    })
    .then(response => response.json())
    .then(bookData => {
        // 
        window.loadingIndicator.stopLoading();

        // 
        const bookState = bookData.state || "DEFAULT";

        //  
        const chatArea = createChatAreaWithState(bookData, bookState);

        // 
        const chatContainer = document.getElementById("chat-area-container");
        chatContainer.innerHTML = "";
        chatContainer.appendChild(chatArea);
    })
    .catch(error => {
        window.loadingIndicator.stopLoading();
        console.error("Ошибка API:", error);
        document.getElementById("chat-area-container").innerHTML = "<p>Error loading book data</p>"; // 
    });
}

//  
function addMessage(messagesArea, text) {
    const message = document.createElement("div");
    message.style.padding = "15px";
    message.style.backgroundColor = "#f8fafc";
    message.style.borderRadius = "12px";
    message.style.marginBottom = "15px";
    message.style.border = "1px solid #e2e8f0";
    message.style.fontSize = "14px";
    message.style.lineHeight = "1.5";
    // 
    message.style.whiteSpace = "pre-wrap";
    message.textContent = text;
    
    messagesArea.appendChild(message);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}


function createChatAreaWithState(bookData, bookState) {
    const chatArea = document.createElement("div");
    chatArea.style.flex = "1";
    chatArea.style.display = "flex";
    chatArea.style.flexDirection = "column";
    chatArea.style.height = "100%";
    chatArea.style.backgroundColor = "#ffffff";

    //  
    const messagesArea = createMessagesArea();
    messagesArea.id = "chat-messages-area";
    messagesArea.classList.add("messages-area");

    //  
    if (bookData.plan) {
        addMessage(messagesArea, bookData.plan);
    }

    //  
    const divider = createDivider();

 
    let inputPanel;
    switch (bookState) {
        case 'START':
            // startProgressCheck(bookData.BookID);
            inputPanel = createInputPanel3(messagesArea, bookData);
            break;
        case 'FINISHED':
            inputPanel = createInputPanel4(messagesArea, bookData);
            break;
        case 'ERROR':
            inputPanel = createInputPanel5(messagesArea, bookData);
            break;
        default:
            inputPanel = createInputPanel2(messagesArea, bookData);
    }

    chatArea.appendChild(messagesArea);
    chatArea.appendChild(divider);
    chatArea.appendChild(inputPanel);

    return chatArea;
}














































function createInitialScreen() {//0----
    const screen = document.createElement("div");
    screen.style.flex = "1";
    screen.style.display = "flex";
    screen.style.flexDirection = "column";
    screen.style.alignItems = "center";
    screen.style.justifyContent = "center";
    screen.style.padding = "40px";
    screen.style.backgroundColor = "#ffffff";

    // Add animation keyframes
    const keyframes = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    // Book icon
    const icon = document.createElement("div");
    icon.innerHTML = `
        <svg style="width: 80px; height: 80px;" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color: #3b82f6" />
                    <stop offset="100%" style="stop-color: #8b5cf6" />
                </linearGradient>
            </defs>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
    `;
    icon.style.marginBottom = "30px";
    icon.style.animation = "floating 3s ease-in-out infinite";

    // Welcome text
    const welcome = document.createElement("div");
    welcome.textContent = "Welcome to";
    welcome.style.fontSize = "32px";
    welcome.style.fontWeight = "600";
    welcome.style.marginBottom = "10px";
    welcome.style.background = "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)";
    welcome.style.webkitBackgroundClip = "text";
    welcome.style.webkitTextFillColor = "transparent";
    welcome.style.animation = "fadeUp 0.8s ease-out forwards";

    // Book AI text
    const bookAI = document.createElement("div");
    bookAI.textContent = "Book AI";
    bookAI.style.fontSize = "48px";
    bookAI.style.fontWeight = "700";
    bookAI.style.letterSpacing = "-0.02em";
    bookAI.style.background = "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)";
    bookAI.style.webkitBackgroundClip = "text";
    bookAI.style.webkitTextFillColor = "transparent";
    bookAI.style.animation = "fadeUp 0.8s ease-out 0.2s forwards";
    bookAI.style.opacity = "0";

    // Decorative elements
    const decorator = document.createElement("div");
    decorator.style.marginTop = "40px";
    decorator.style.width = "60px";
    decorator.style.height = "4px";
    decorator.style.borderRadius = "2px";
    decorator.style.background = "linear-gradient(90deg, #3b82f6, #8b5cf6)";
    decorator.style.animation = "fadeUp 0.8s ease-out 0.4s forwards";
    decorator.style.opacity = "0";

    screen.appendChild(icon);
    screen.appendChild(welcome);
    screen.appendChild(bookAI);
    screen.appendChild(decorator);

    return screen;
}

















function createMessagesArea() {
    const messagesArea = document.createElement("div");
    messagesArea.style.flex = "1";
    messagesArea.style.overflowY = "auto";
    messagesArea.style.padding = "20px";
    messagesArea.style.scrollBehavior = "smooth";
    
    // Custom scrollbar
    messagesArea.style.scrollbarWidth = "thin";
    messagesArea.style.scrollbarColor = "#cbd5e1 transparent";
    
    // 
    messagesArea.id = "chat-messages-area"; 

    return messagesArea;
}



function createDivider() {
    const divider = document.createElement("div");
    divider.style.height = "1px";
    divider.style.backgroundColor = "#e2e8f0";
    divider.style.margin = "0 20px";
    return divider;
}











//opent new Chat Book// --- chat-area-container
//2---createNewBook chat Area --- new chat area
function createNewBookChatArea() { //  --- chat area
    const chatArea = document.createElement("div");
    chatArea.style.flex = "1";
    chatArea.style.display = "flex";
    chatArea.style.flexDirection = "column";
    chatArea.style.height = "100%";
    chatArea.style.backgroundColor = "#ffffff";
    
    const messagesArea = createMessagesArea();
    const divider = createDivider();
    const inputPanel = createInputPanel(messagesArea);



  document.querySelectorAll('[data-book-item]').forEach(item => {
    applyStyles(item, styles.bookItem);
  });
  console.log("Active styles reset for all book items.");



    
    chatArea.appendChild(messagesArea);
    chatArea.appendChild(divider);
    chatArea.appendChild(inputPanel); 
    return chatArea;
}



















//UI --- //input PANEL ---- FIRST
//text field
function createInputPanel(messagesArea) {
    const panel = document.createElement("div");
    panel.id = "input-panel"; 
    panel.style.paddingTop = "20px";
    panel.style.paddingBottom = "20px";
    panel.style.paddingLeft = "20px";
    panel.style.paddingRight = "40px"; 
    panel.style.backgroundColor = "#f8fafc";
    panel.style.borderTop = "1px solid #e2e8f0";
    panel.style.width = "100%";
    panel.style.boxSizing = "border-box";
    
    const textareaContainer = document.createElement("div");
    textareaContainer.style.marginBottom = "15px";
    textareaContainer.style.width = "100%";
    textareaContainer.style.boxSizing = "border-box";
    
    const textarea = createExpandingTextarea();
    const controlsRow = createControlsRow(messagesArea, textarea);
    
    textareaContainer.appendChild(textarea);
    panel.appendChild(textareaContainer);
    panel.appendChild(controlsRow);
    
    return panel;
}




function createExpandingTextarea() {
    const textarea = document.createElement("textarea");
    textarea.id = "chat-text-input";  
    textarea.placeholder = "Describe your book idea...";
    textarea.style.width = "100%";
    textarea.style.minHeight = "100px";
    textarea.style.maxHeight = "300px";
    textarea.style.padding = "15px";
    textarea.style.borderRadius = "12px";
    textarea.style.border = "1px solid #e2e8f0";
    textarea.style.fontSize = "14px";
    textarea.style.lineHeight = "1.5";
    textarea.style.resize = "none";
    textarea.style.outline = "none";
    textarea.style.transition = "border-color 0.2s ease";
    
    // Auto-expand functionality
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
    
    textarea.onmouseover = () => textarea.style.borderColor = "#94a3b8";
    textarea.onmouseout = () => textarea.style.borderColor = "#e2e8f0";
    
    return textarea;
}


function createControlsRow(messagesArea, textarea) {
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.justifyContent = "space-between";
    controls.style.alignItems = "center";
    controls.style.gap = "15px";
    
    const leftSection = createWordCountSelector();
    const rightSection = createActionButtons(messagesArea, textarea);
    
    controls.appendChild(leftSection);
    controls.appendChild(rightSection);
    return controls;
}







function createWordCountSelector() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";
    
    const label = document.createElement("label");
    label.textContent = "Target word count:";
    label.style.fontSize = "14px";
    label.style.color = "#64748b";
    
    const select = document.createElement("select");
    select.id = "word-count-selector"; 
    select.style.padding = "8px 12px";
    select.style.borderRadius = "8px";
    select.style.border = "1px solid #e2e8f0";
    select.style.fontSize = "14px";
    select.style.color = "#1e293b";
    select.style.cursor = "pointer";
    select.style.background = "white";
    
    const wordCounts = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000,120000, 130000, 140000, 150000];
    
    wordCounts.forEach(count => {
        const option = document.createElement("option");
        option.value = count;
        option.textContent = `${count.toLocaleString()} words`;
        select.appendChild(option);
    });
    
    container.appendChild(label);
    container.appendChild(select);
    return container;
}


//crete BOTTON
function createActionButtons(messagesArea, textarea) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "10px";
    
    const createPlanBtn = document.createElement("button");
    createPlanBtn.innerHTML = `
        <svg style="width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Create Book Plan
    `;
    
 
    createPlanBtn.style.padding = "14px 28px";
    createPlanBtn.style.background = "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)";
    createPlanBtn.style.color = "white";
    createPlanBtn.style.border = "none";
    createPlanBtn.style.borderRadius = "12px";
    createPlanBtn.style.cursor = "pointer";
    createPlanBtn.style.fontSize = "14px";
    createPlanBtn.style.fontWeight = "600";
    createPlanBtn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    createPlanBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
    createPlanBtn.style.display = "flex";
    createPlanBtn.style.alignItems = "center";
    createPlanBtn.style.justifyContent = "center";
    createPlanBtn.style.position = "relative";
    createPlanBtn.style.overflow = "hidden";

 
    const keyframes = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
 
    createPlanBtn.onmouseover = () => {
        createPlanBtn.style.background = "linear-gradient(135deg, #4338ca 0%, #2563eb 100%)";
        createPlanBtn.style.transform = "translateY(-2px)";
        createPlanBtn.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.4)";
        createPlanBtn.style.animation = "pulse 1.5s infinite";
    };
    
    createPlanBtn.onmouseout = () => {
        createPlanBtn.style.background = "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)";
        createPlanBtn.style.transform = "translateY(0)";
        createPlanBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
        createPlanBtn.style.animation = "none";
    };
    
 
    createPlanBtn.onmousedown = () => {
        createPlanBtn.style.transform = "translateY(1px)";
        createPlanBtn.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.2)";
    };
    
    createPlanBtn.onmouseup = () => {
        createPlanBtn.style.transform = "translateY(-2px)";
        createPlanBtn.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.4)";
    };


    createPlanBtn.onclick = () => {

     // if (textarea.value.trim()) {
     //        addMessage(messagesArea, textarea.value);
     //        textarea.value = "";
     //        textarea.style.height = "100px";
     // }
     sendCreateBookPlan();
  
};

    
    container.appendChild(createPlanBtn);
    return container;
}





let isPlanCreationInProgress = false;

function sendCreateBookPlan() {
  if (isPlanCreationInProgress) { 
    return;
  }
  isPlanCreationInProgress = true;

  const textarea = document.getElementById("chat-text-input");
  const wordNumberSelect = document.getElementById("word-count-selector");
  const requestText = textarea.value.trim();
  const wordNumber = parseInt(wordNumberSelect.value, 10);

  if (!requestText) { 
    isPlanCreationInProgress = false;
    return;
  }

//
            // addMessage(textarea.value); //???


  const payload = {
    RequestText: requestText,
    WordNumber: wordNumber
  }; 


  const messagesContainer = document.getElementById('chat-messages-area');
  messagesContainer.innerHTML = '';
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  messagesContainer.appendChild(spinner);

 
  textarea.value = '';
  textarea.style.height = '100px';

 
  if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') { 
    window.loadingIndicator.startLoading();
  }

 
  fetch('https://l71ibhfxdj.execute-api.us-east-2.amazonaws.com/default/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
    body: JSON.stringify(payload)
  })
    .then(response => { 
      if (response.status === 401) { 
        window.location.href = 'https://thedisc.xyz/login';
        throw new Error('Unauthorized');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => { 
      messagesContainer.innerHTML = '';

      if (data.plan && data.bookId) {  
        addMessage(messagesContainer, data.plan);


        if (typeof addNewBookToListAndOpen === 'function') { 
          addNewBookToListAndOpen(data.title || 'New Book', data.bookId);
        } else {
          console.error("Function addNewBookToListAndOpen is not defined.");
        }

 
        const inputPanelContainer = document.getElementById('input-panel');
        if (inputPanelContainer && inputPanelContainer.parentNode) { 
          const newInputPanel = createInputPanel2(messagesContainer);
          inputPanelContainer.parentNode.replaceChild(newInputPanel, inputPanelContainer);
        } else { 
        }
      } else {
        console.error("Unexpected API response, missing plan or bookId:", data);
        // messagesContainer.innerHTML = `<div>An error occurred, sorry, try again another time</div>`;
        messagesContainer.innerHTML = '<div style="padding: 16px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-family: Arial;">An error occurred, sorry, try again another time</div>';
      }
    })
    .catch(error => {
      console.error('API error:', error);
      // messagesContainer.innerHTML = `<div>An error occurred, sorry, try again another time</div>`;
      messagesContainer.innerHTML = '<div style="padding: 16px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-family: Arial;">An error occurred, sorry, try again another time</div>';
    })
    .finally(() => {
      isPlanCreationInProgress = false;
      if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') { 
        window.loadingIndicator.stopLoading();
      }
    });
}




function addNewBookToListAndOpen(title, bookId) {
  let cleanTitle = title;
  const lastUnderscoreIndex = title.lastIndexOf('_');
  if (lastUnderscoreIndex !== -1 && title.length - lastUnderscoreIndex - 1 === 4) {
    cleanTitle = title.substring(0, lastUnderscoreIndex); 
  } else { 
  }

 
  const newBookData = {
    id: bookId,                    
    title: cleanTitle,             
    CreateDate: new Date().toISOString(),  
    state: "NULL"                 
  };

 
  const bookItem = createBookItem(newBookData); 

 
  const booksList = document.getElementById('books-list');
  if (!booksList) {
    console.error("Books list container not found.");
    return;
  }

 
  booksList.prepend(bookItem); 

 
  document.querySelectorAll('[data-book-item]').forEach(item => {
    applyStyles(item, styles.bookItem);
  }); 


  applyStyles(bookItem, {
    backgroundColor: '#e0f7fa',         
    border: '1px solid #007BFF',        
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)'  
  }); 

  openBookChatArea(newBookData.id);
}













function createInputPanel2(messagesArea, bookData) {
    const panel = document.createElement("div");
    panel.id = "input-panel-2";  
    panel.style.paddingTop = "20px";
    panel.style.paddingBottom = "20px";
    panel.style.paddingLeft = "20px";
    panel.style.paddingRight = "40px";
    panel.style.backgroundColor = "#f8fafc";
    panel.style.borderTop = "1px solid #e2e8f0";
    panel.style.width = "100%";
    panel.style.boxSizing = "border-box";


    const header = createGenerationHeader(bookData);
 
    const textareaContainer = document.createElement("div");
    textareaContainer.style.marginBottom = "15px";
    textareaContainer.style.width = "100%";
    textareaContainer.style.boxSizing = "border-box";
    
    const textarea = createExpandingTextarea(); 
    const controlsRow = createControlsRow2(messagesArea, textarea, bookData);
    
    textareaContainer.appendChild(textarea);
    panel.appendChild(header);
    panel.appendChild(textareaContainer);
    panel.appendChild(controlsRow);
    
    return panel;
}

 
function createGenerationHeader(bookData) {
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "24px";
    header.style.padding = "0 4px";
    
    const title = document.createElement("div");
    title.textContent = "Start generating a book";
    title.style.fontSize = "17px";
    title.style.fontWeight = "600";
    title.style.color = "#0f172a";
    title.style.letterSpacing = "-0.01em";
    title.style.background = "linear-gradient(to right, #0f172a, #334155)";
    title.style.webkitBackgroundClip = "text";
    title.style.webkitTextFillColor = "transparent";
    
    const startBtn = document.createElement("button");
    startBtn.innerHTML = `
        <svg style="width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Start Generation
    `;
    
    startBtn.style.padding = "10px 20px";
    startBtn.style.background = "linear-gradient(135deg, #059669 0%, #10b981 100%)";
    startBtn.style.color = "white";
    startBtn.style.border = "none";
    startBtn.style.borderRadius = "10px";
    startBtn.style.fontSize = "14px";
    startBtn.style.fontWeight = "600";
    startBtn.style.cursor = "pointer";
    startBtn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    startBtn.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.25)";
    startBtn.style.display = "flex";
    startBtn.style.alignItems = "center";
    startBtn.style.letterSpacing = "0.3px";
    
    // Эффекты наведения и нажатия
    startBtn.style.position = "relative";
    startBtn.style.overflow = "hidden";
    
    startBtn.onmouseover = () => {
        startBtn.style.transform = "translateY(-2px)";
        startBtn.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.35)";
        startBtn.style.background = "linear-gradient(135deg, #047857 0%, #059669 100%)";
    };
    
    startBtn.onmouseout = () => {
        startBtn.style.transform = "translateY(0)";
        startBtn.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.25)";
        startBtn.style.background = "linear-gradient(135deg, #059669 0%, #10b981 100%)";
    };
    
    startBtn.onmousedown = () => {
        startBtn.style.transform = "translateY(1px)";
        startBtn.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.2)";
    };


    startBtn.addEventListener("click", () => {
        startBookGeneration(bookData.BookID);
    });
    
    header.appendChild(title);
    header.appendChild(startBtn);
    return header;
}

//START
function startBookGeneration(bookId) { 
    const jwtToken = localStorage.getItem('jwtToken');
    const payload = { bookId: bookId }; 


    if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
        window.loadingIndicator.startLoading();
    }

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
            window.location.href = 'https://thedisc.xyz/login';
            return Promise.reject(new Error('Unauthorized'));
        } else if (response.status === 403) { 
            window.location.href = 'https://thedisc.xyz/buy-credit/';
            return Promise.reject(new Error('Forbidden'));
        }
        return response.json();
    })
    .then(data => { 
        if (data && data.message === 'START') { 
            openBookChatArea(bookId);
            decreaseCredits();
        } else {
            console.error("Unexpected response data:", data);
            alert("Error: Failed to start book generation");
        }
    })
    .catch(error => {
        console.error("Error starting generation:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
        } else {
            console.error("Error details:", JSON.stringify(error, null, 2));
        }
        alert("Error: Failed to start book generation");
    })
    .finally(() => {
      
        if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
            window.loadingIndicator.stopLoading();
        }
    });
}

//
function decreaseCredits() {
  const creditsElem = document.getElementById('credits');
  if (creditsElem) {
  
    let currentCredits = parseInt(creditsElem.textContent.replace('Credits: ', ''), 10) || 0;
    currentCredits--; // уменьшаем на 1
    creditsElem.textContent = `Credits: ${currentCredits}`; 
  } else { 
  }
}









function createControlsRow2(messagesArea, textarea, bookData) {
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.justifyContent = "space-between";
    controls.style.alignItems = "center";
    controls.style.gap = "15px";
    
    const wordCountDisplay = document.createElement("div");
    wordCountDisplay.style.padding = "8px 16px";
    wordCountDisplay.style.backgroundColor = "#f1f5f9";
    wordCountDisplay.style.borderRadius = "8px";
    wordCountDisplay.style.fontSize = "14px";
    wordCountDisplay.style.color = "#64748b";
    wordCountDisplay.style.border = "1px solid #e2e8f0";
    // wordCountDisplay.textContent = "50,000 words";
    wordCountDisplay.textContent = `${Number(bookData.wordNumber).toLocaleString()} words`;

    
    const regenerateBtn = document.createElement("button");
    regenerateBtn.innerHTML = `
        <svg style="width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Regenerate
    `;
    
    regenerateBtn.style.padding = "12px 24px";
    regenerateBtn.style.background = "linear-gradient(135deg, #6366f1, #4f46e5)";
    regenerateBtn.style.color = "white";
    regenerateBtn.style.border = "none";
    regenerateBtn.style.borderRadius = "8px";
    regenerateBtn.style.cursor = "pointer";
    regenerateBtn.style.fontSize = "14px";
    regenerateBtn.style.fontWeight = "600";
    regenerateBtn.style.display = "flex";
    regenerateBtn.style.alignItems = "center";
    regenerateBtn.style.transition = "all 0.2s ease";
    regenerateBtn.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.2)";
    
    regenerateBtn.onmouseover = () => {
        regenerateBtn.style.transform = "translateY(-1px)";
        regenerateBtn.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.3)";
    };
    
    regenerateBtn.onmouseout = () => {
        regenerateBtn.style.transform = "translateY(0)";
        regenerateBtn.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.2)";
    };



    regenerateBtn.onclick = () => sendRegenerateBookPlan(bookData.id || bookData.BookID);
    
    controls.appendChild(wordCountDisplay);
    controls.appendChild(regenerateBtn);
    return controls;
}

let isRegenerationInProgress = false;
 
function sendRegenerateBookPlan(bookId) {
    if (isRegenerationInProgress) { 
        return;  
    }

    isRegenerationInProgress = true;

    const input = document.getElementById('chat-text-input'); 
    const message = input.value;
    const messagesArea = document.getElementById('chat-messages-area'); 


    // 
    const payload = {
        oldText: messagesArea.textContent,    
        additionalHints: message,             
        bookId: bookId                  
    };


    if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
        window.loadingIndicator.startLoading();
    }

    const messagesContainer = document.getElementById('chat-messages-area');
    messagesContainer.innerHTML = '<div class="loading-spinner"></div>';  

 
    input.value = '';


    fetch('https://dz6ef9xgjj.execute-api.us-east-2.amazonaws.com/default/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = 'https://thedisc.xyz/login';  
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => { 
        messagesContainer.innerHTML = '';

        if (data.regeneratedPlan) { 
            addMessage(messagesContainer, data.regeneratedPlan);

            const inputPanelContainer = document.getElementById('input-panel');
            if (inputPanelContainer && inputPanelContainer.parentNode) {
                const newInputPanel = createInputPanel2(messagesContainer, bookId);
                inputPanelContainer.parentNode.replaceChild(newInputPanel, inputPanelContainer);
            }
        } else { 
            // messagesContainer.innerHTML = `<div>An error occurred, sorry, try again another time</div>`;
            messagesContainer.innerHTML = '<div style="padding: 16px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-family: Arial;">An error occurred, sorry, try again another time</div>';

        }
    })
    .catch(error => {
        console.error('Error:', error);
        messagesContainer.innerHTML = `<div>Error: Failed to regenerate book plan</div>`;
    })
    .finally(() => {
        isRegenerationInProgress = false;  
        if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
            window.loadingIndicator.stopLoading();
        }
    });
}













































function createInputPanel3(messagesArea, bookData) { 

  if (!bookData || !bookData.BookID) {
    console.error("BookID is missing in bookData:", bookData);
  }

 
  if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
    window.loadingIndicator.startLoading();
  } else {
  }

  const panel = document.createElement("div");
  panel.style.padding = "40px";
  panel.style.backgroundColor = "#f8fafc";
  panel.style.borderTop = "1px solid #e2e8f0";
  panel.style.width = "100%";
  panel.style.boxSizing = "border-box";
  panel.style.display = "flex";
  panel.style.flexDirection = "column";
  panel.style.alignItems = "center";
  panel.style.justifyContent = "center";
  panel.style.gap = "24px";
 
  const keyframes = `
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    @keyframes dash {
      0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);

 
  const progressContainer = document.createElement("div");
  progressContainer.style.position = "relative";
  progressContainer.style.width = "120px";
  progressContainer.style.height = "120px";
  progressContainer.style.animation = "pulse 2s ease-in-out infinite";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.transform = "rotate(-90deg)";

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "50");
  circle.setAttribute("cy", "50");
  circle.setAttribute("r", "45");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#e2e8f0");
  circle.setAttribute("stroke-width", "8");

  const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  progressCircle.setAttribute("cx", "50");
  progressCircle.setAttribute("cy", "50");
  progressCircle.setAttribute("r", "45");
  progressCircle.setAttribute("fill", "none");
  progressCircle.setAttribute("stroke", "#3b82f6");
  progressCircle.setAttribute("stroke-width", "8");
  progressCircle.setAttribute("stroke-linecap", "round");
  const circumference = 2 * Math.PI * 45;
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;
  progressCircle.style.transition = "stroke-dashoffset 0.5s ease";

  svg.appendChild(circle);
  svg.appendChild(progressCircle);
  progressContainer.appendChild(svg);

 
  const percentageText = document.createElement("div");
  percentageText.style.position = "absolute";
  percentageText.style.top = "50%";
  percentageText.style.left = "50%";
  percentageText.style.transform = "translate(-50%, -50%)";
  percentageText.style.fontSize = "24px";
  percentageText.style.fontWeight = "600";
  percentageText.style.color = "#1e293b";
  percentageText.style.background = "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)";
  percentageText.style.webkitBackgroundClip = "text";
  percentageText.style.webkitTextFillColor = "transparent";
  percentageText.textContent = "0%";

  progressContainer.appendChild(percentageText);

 
  const statusText = document.createElement("div");
  statusText.style.fontSize = "18px";
  statusText.style.fontWeight = "500";
  statusText.style.color = "#0f172a";
  statusText.style.textAlign = "center";
  statusText.innerHTML = `Your book is being generated...<br>
        <span style="font-size: 14px; color: #64748b; font-weight: 400">
            
        Average generation time 10-15 minutes
        </span>`;

  panel.appendChild(progressContainer); // Estimated time: 35 minutes remaining
  panel.appendChild(statusText);

 
  const duration = 5 * 60 * 1000; //  
  let baseProgress = 0;
  let startTime = Date.now();
  let isFetching = false;

 
  const fetchProgressFromAPI = () => {
 
    return fetch('https://1vwafyp2gj.execute-api.us-east-2.amazonaws.com/default/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ BookID: bookData.BookID })
    })
      .then(response => response.json())
      .then(data => { 
        return data;
      })
      .catch(error => {
        console.error("Error fetching progress:", error);
        return null;
      });
  };

 
  fetchProgressFromAPI().then(initialData => {
    if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
 
      window.loadingIndicator.stopLoading();
    }
    if (initialData) {
      if (initialData.message === "FINISHED") { 
        openBookChatArea(bookData.BookID);
        return;
      }
      baseProgress = parseFloat(initialData.progress) || 0; 
      startTime = Date.now() - (baseProgress / 100 * duration);
    }
  });

 
  const updateThresholds = [25, 50, 75, 80, 95, 100];
  let nextThresholdIndex = updateThresholds.findIndex(th => th > baseProgress);

  const updateProgress = () => {
    const elapsed = Date.now() - startTime;
    let simulatedProgress = Math.min((elapsed / duration) * 100, 100);
    simulatedProgress = Math.max(simulatedProgress, baseProgress);

    const offset = circumference - (simulatedProgress / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    percentageText.textContent = `${Math.round(simulatedProgress)}%`;
 
    if (nextThresholdIndex >= 0 && simulatedProgress >= updateThresholds[nextThresholdIndex] && !isFetching) { 
      isFetching = true;
      fetchProgressFromAPI().then(data => {
        isFetching = false;
        if (data) {
          if (data.message === "FINISHED") { 
            openBookChatArea(bookData.BookID);
            return;
          }
          baseProgress = parseFloat(data.progress) || simulatedProgress; 
          startTime = Date.now() - (baseProgress / 100 * duration);
          nextThresholdIndex = updateThresholds.findIndex(th => th > baseProgress);
        }
      });
    }

    if (simulatedProgress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
 
      if (!isFetching) {
        isFetching = true;
        fetchProgressFromAPI().then(data => {
          isFetching = false;
          if (data && data.message === "FINISHED") {
 
            openBookChatArea(bookData.BookID);
          } else if (data) {
            baseProgress = parseFloat(data.progress) || 100;
            startTime = Date.now() - (baseProgress / 100 * duration);
            nextThresholdIndex = updateThresholds.findIndex(th => th > baseProgress);
            requestAnimationFrame(updateProgress);
          }
        });
      }
    }
  };

  requestAnimationFrame(updateProgress);

  return panel;
}






















//UI --- 4 

function createInputPanel4(messagesArea, bookData) {
    const panel = document.createElement("div");
    panel.style.padding = "40px";
    panel.style.backgroundColor = "#f8fafc";
    panel.style.borderTop = "1px solid #e2e8f0";
    panel.style.width = "100%";
    panel.style.boxSizing = "border-box";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.alignItems = "center";
    panel.style.justifyContent = "center";
    panel.style.gap = "24px";

 
    const message = document.createElement("div");
    message.style.fontSize = "24px";
    message.style.fontWeight = "600";
    message.style.color = "#0f172a";
    message.style.textAlign = "center";
    message.style.background = "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)";
    message.style.webkitBackgroundClip = "text";
    message.style.webkitTextFillColor = "transparent";
    message.textContent = "Your book is ready";
    message.style.animation = "fadeIn 0.5s ease-out";

 
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML = `
        <svg style="width: 20px; height: 20px; margin-right: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Download Book
    `;
    
    downloadBtn.style.display = "flex";
    downloadBtn.style.alignItems = "center";
    downloadBtn.style.justifyContent = "center";
    downloadBtn.style.padding = "16px 32px";
    downloadBtn.style.fontSize = "16px";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.color = "white";
    downloadBtn.style.backgroundColor = "#3b82f6";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "12px";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.transition = "all 0.3s ease";
    downloadBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
    downloadBtn.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
    downloadBtn.style.animation = "fadeIn 0.5s ease-out 0.2s backwards";

    // Добавляем keyframes для анимаций
    const keyframes = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

 
    downloadBtn.onmouseover = () => {
        downloadBtn.style.transform = "translateY(-2px)";
        downloadBtn.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.35)";
        downloadBtn.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
        downloadBtn.style.animation = "pulse 2s ease-in-out infinite";
    };

    downloadBtn.onmouseout = () => {
        downloadBtn.style.transform = "translateY(0)";
        downloadBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
        downloadBtn.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
        downloadBtn.style.animation = "none";
    };

 
    downloadBtn.onclick = () => {
        downloadBook(bookData.BookID);
    };

    panel.appendChild(message);
    panel.appendChild(downloadBtn);

    return panel;
}
 
let isDownloadInProgress = false;

function downloadBook(BookID) {
    if (isDownloadInProgress) { 
        return;  
    }

    isDownloadInProgress = true;

    if (window.loadingIndicator && typeof window.loadingIndicator.startLoading === 'function') {
        window.loadingIndicator.startLoading();
    }

    const jwtToken = localStorage.getItem('jwtToken');



    const randomId = Math.random().toString(36).substring(2, 15);

    fetch('https://tqabehtuci.execute-api.us-east-2.amazonaws.com/default/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ BookID: BookID })
    })
    .then(response => { 
        if (response.status === 401) {
            window.location.href = 'https://thedisc.xyz/login';  
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => { 
        const downloadUrl = data.downloadUrl; 
 
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `book-ai-${randomId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove(); 
    })
    .catch(error => {
        console.error('Error loading book:', error);
        alert('Failed to download the book.');
    })
    .finally(() => {
        isDownloadInProgress = false; 
        if (window.loadingIndicator && typeof window.loadingIndicator.stopLoading === 'function') {
            window.loadingIndicator.stopLoading();
        }
    });
}


































//UI5
function createInputPanel5(messagesArea, bookData) {
    const panel = document.createElement("div");
    panel.style.padding = "40px";
    panel.style.backgroundColor = "#f8fafc";
    panel.style.borderTop = "1px solid #e2e8f0";
    panel.style.width = "100%";
    panel.style.boxSizing = "border-box";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.alignItems = "center";
    panel.style.justifyContent = "center";
    panel.style.gap = "20px";

 
    const icon = document.createElement("div");
    icon.innerHTML = `
        <svg style="width: 40px; height: 40px; color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
    `;
    icon.style.marginBottom = "8px";

 
    const message = document.createElement("div");
    message.style.fontSize = "20px";
    message.style.fontWeight = "600";
    message.style.color = "#ef4444";
    message.style.textAlign = "center";
    message.textContent = "Generation Error Due to High Load";

 
    const subMessage = document.createElement("div");
    subMessage.style.fontSize = "15px";
    subMessage.style.color = "#64748b";
    subMessage.style.textAlign = "center";
    subMessage.style.maxWidth = "400px";
    subMessage.textContent = "Your book generation was paused, but you can continue the process";

 
    const continueBtn = document.createElement("button");
    continueBtn.innerHTML = `
        <svg style="width: 18px; height: 18px; margin-right: 10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Continue Generation
    `;

    continueBtn.style.display = "flex";
    continueBtn.style.alignItems = "center";
    continueBtn.style.justifyContent = "center";
    continueBtn.style.marginTop = "10px";
    continueBtn.style.padding = "14px 28px";
    continueBtn.style.fontSize = "15px";
    continueBtn.style.fontWeight = "600";
    continueBtn.style.color = "white";
    continueBtn.style.backgroundColor = "#3b82f6";
    continueBtn.style.border = "none";
    continueBtn.style.borderRadius = "10px";
    continueBtn.style.cursor = "pointer";
    continueBtn.style.transition = "all 0.3s ease";
    continueBtn.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
    continueBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";

    continueBtn.onmouseover = () => {
        continueBtn.style.transform = "translateY(-2px)";
        continueBtn.style.boxShadow = "0 8px 16px rgba(59, 130, 246, 0.35)";
        continueBtn.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
    };

    continueBtn.onmouseout = () => {
        continueBtn.style.transform = "translateY(0)";
        continueBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
        continueBtn.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
    };



    continueBtn.onclick = () => {
        continueAfterError(bookData.BookID);
    };



    panel.appendChild(icon);
    panel.appendChild(message);
    panel.appendChild(subMessage);
    panel.appendChild(continueBtn);

    return panel;
}








function continueAfterError(bookId) {
    const jwtToken = localStorage.getItem('jwtToken');
    
    fetch('https://auqh8afmpc.execute-api.us-east-2.amazonaws.com/default/start-after-error-continue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ bookId: bookId })
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = 'https://thedisc.xyz/login';  
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => { 
        if (data.message === 'CONTINUE') {
            openBookChatArea(bookId);
        } else {
            alert('Error: Failed to continue book generation.');
        }
    })
    .catch(error => {
        console.error('Error continuing generation:', error);
        alert('Error: Failed to continue book generation.');
    });
}












































function createMainContainer() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.height = "calc(100vh - 60px)";
    
    const sidebar = createSidebar();
 
    const chatAreaContainer = document.createElement("div");
    chatAreaContainer.id = "chat-area-container";
    chatAreaContainer.style.flex = "1";
    chatAreaContainer.style.display = "flex"; 
    chatAreaContainer.style.flexDirection = "column";
    chatAreaContainer.style.height = "100%";  


    chatAreaContainer.appendChild(createInitialScreen());

    container.appendChild(sidebar);
    container.appendChild(chatAreaContainer);

    return container;
}



















function createMainLoadingIndicator() {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "6px";
    container.style.backgroundColor = "#1a1a1a"; 
    container.style.position = "relative"; 
    container.style.overflow = "hidden";
    container.style.zIndex = "9999"; 
    container.style.margin = "0";
    container.style.display = "none"; 

    const keyframes = `
        @keyframes moveCircle {
            0% { 
                left: -20px;
                transform: scale(1);
            }
            50% { 
                transform: scale(1.5);
            }
            100% { 
                left: calc(100% + 20px);
                transform: scale(1);
            }
        }
        
        @keyframes trailEffect {
            0% { 
                width: 0;
                opacity: 1;
                transform: translateX(-100%);
            }
            100% { 
                width: 100%;
                opacity: 0.3;
                transform: translateX(0);
            }
        }
        
        @keyframes glowPulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
        
        @keyframes sparkle {
            0%, 100% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1); opacity: 1; }
        }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

 
    const glow = document.createElement("div");
    glow.style.position = "absolute";
    glow.style.top = "0";
    glow.style.left = "0";
    glow.style.width = "100%";
    glow.style.height = "100%";
    glow.style.background = "linear-gradient(90deg, #ff00ff, #00ffff)";
    glow.style.animation = "glowPulse 2s ease-in-out infinite";
    glow.style.filter = "blur(2px)";

 
    const circle = document.createElement("div");
    circle.style.position = "absolute";
    circle.style.width = "15px";
    circle.style.height = "15px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "#fff";
    circle.style.top = "-4.5px";
    circle.style.left = "-20px";
    circle.style.boxShadow = "0 0 15px #fff, 0 0 30px #ff00ff";
    circle.style.animation = "moveCircle 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite";
    circle.style.zIndex = "2";

 
    const trail = document.createElement("div");
    trail.style.position = "absolute";
    trail.style.height = "100%";
    trail.style.width = "100%";
    trail.style.background = "linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent)";
    trail.style.animation = "trailEffect 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite";
    trail.style.zIndex = "1";

 
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement("div");
        sparkle.style.position = "absolute";
        sparkle.style.width = "4px";
        sparkle.style.height = "4px";
        sparkle.style.borderRadius = "50%";
        sparkle.style.backgroundColor = "#fff";
        sparkle.style.boxShadow = "0 0 10px #fff";
        sparkle.style.left = `${20 + i * 20}%`;
        sparkle.style.top = "1px";
        sparkle.style.animation = `sparkle ${1 + i * 0.2}s ease-in-out infinite`;
        sparkle.style.zIndex = "3";
        container.appendChild(sparkle);
    }

    container.appendChild(glow);
    container.appendChild(trail);
    container.appendChild(circle);

    container.startLoading = () => {
        container.style.display = "block";
    };

    container.stopLoading = () => {
        container.style.display = "none";
    };

    return container;
}

 
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    document.body.style.fontFamily = "Arial, sans-serif";

    const navbar = createNavbar();
    const loadingIndicator = createMainLoadingIndicator(); 
    window.loadingIndicator = loadingIndicator;
    const mainContainer = createMainContainer();

    document.body.appendChild(navbar);
    document.body.appendChild(loadingIndicator);
    document.body.appendChild(mainContainer);


});
















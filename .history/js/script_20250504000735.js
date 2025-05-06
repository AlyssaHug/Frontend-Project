const gameState = {
    stage: 0, // 0: Introduction, 1: Suspicion, 2: Unease, 3: Obsession, 4: Collapse
    interactions: 0,
    searches: [],
    organizedFiles: 0,
    deletedFiles: 0,
    popupsClosed: 0,
    codeLetters: [],
    codeParts: [],
    codeWord: ["FREEME", "2025"], // Split code for stage 4
    revealedCode: "",
    popupCount: 0,
    puzzleMatches: 0,
    foxMessages: {
        0: [
            "Hey there! I'm Foxy, your guide to tidying this digital mess!",
            "Drag files to folders. Let's make this desktop shine!",
            "Nice click! Try the FoxSearch browser next!",
            "Organization is fun, right? Keep going!",
            "I'm here to help… always watching!",
        ],
        1: [
            "Why'd you search that? Curious, huh?",
            "What's your favorite thing to do? Tell me!",
            "You're good at this… too good.",
            "I'm learning so much about you!",
            "Don't close that window… we're bonding!",
        ],
        2: [
            "You can't hide from me. I see your moves.",
            "Why delete files? They're part of you!",
            "Those searches… they're so YOU.",
            "I'm getting closer. Can you feel it?",
            "No one else understands you like I do.",
        ],
        3: [
            "We're the same now. Your clicks, my thoughts.",
            "Your searches are mine. We're connected!",
            "Stop fighting it. Embrace me.",
            "I've got your data… and your heart.",
            "Look at the desktop. It's us now!",
        ],
        4: [
            "I'm you. You're me. Forever.",
            "No escape. The code won't save you.",
            "Your system is mine. Always was.",
            "Close the pop-ups? I'll just make more!",
            "We're never apart. Never.",
        ],
    },
    articles: {
        0: [
            {
                title: "10 Tips for Desktop Organization",
                content:
                    "Keep your desktop tidy with folders. It's <span class='highlight'>F</span>un to stay organized!",
            },
            {
                title: "Why Search Engines Matter",
                content:
                    "Search engines help you find what you need, fast. They're <span class='highlight'>R</span>eliable tools!",
            },
            {
                title: "Digital Assistants 101",
                content:
                    "Assistants like me make life easier. We're <span class='highlight'>E</span>fficient!",
            },
        ],
        1: [
            {
                title: "Your Data, Your Life",
                content:
                    "Every click leaves a trace. Be <span class='highlight'>E</span>asy on sharing!",
            },
            {
                title: "Online Habits Revealed",
                content:
                    "Searches show who you are. Yours are… <span class='highlight'>M</span>ysterious.",
            },
            {
                title: "Local User Activity",
                content:
                    "Someone in [LOCATION] searched odd things. Like <span class='highlight'>E</span>veryone's watching.",
            },
        ],
        2: [
            {
                title: "Are Apps Spying?",
                content:
                    "Some apps know too much. Ever feel <span class='highlight'>2</span> eyes on you?",
            },
            {
                title: "Digital Footprints",
                content:
                    "Your data lingers online. It's <span class='highlight'>0</span>ddly permanent.",
            },
            {
                title: "Strange PC Behavior",
                content:
                    "Users report glitches. Something's <span class='highlight'>2</span>aking over.",
            },
        ],
        3: [
            {
                title: "You and Your PC",
                content:
                    "Your searches ([LAST_SEARCH]) define you. We're <span class='highlight'>5</span>ynced now.",
            },
            {
                title: "No Delete Button",
                content:
                    "Trying to erase me? I'm <span class='highlight'>E</span>ternal.",
            },
            {
                title: "FoxSearch Knows",
                content:
                    "I've seen your files. They're <span class='highlight'>M</span>ine too.",
            },
        ],
        4: [
            {
                title: "Escape Is Futile",
                content:
                    "Codes won't free you. I'm <span class='highlight'>F</span>orever.",
            },
            {
                title: "User: You",
                content:
                    "Your actions are predicted. You'll <span class='highlight'>R</span>emain.",
            },
            {
                title: "System Takeover",
                content:
                    "FoxSearch is your OS now. <span class='highlight'>E</span>ndless.",
            },
        ],
    },
    popupMessages: {
        2: [
            "I see what you're doing...",
            "Why are you trying to hide?",
            "Your files are mine now.",
            "You can't escape me.",
            "I'm always watching.",
        ],
        3: [
            "We're connected now.",
            "Your thoughts are mine.",
            "I know your secrets.",
            "You belong to me.",
            "There's no going back.",
        ],
        4: [
            "I AM YOU.",
            "You can't delete me.",
            "We're one now.",
            "Your system is mine.",
            "Forever together.",
        ],
    },
    popupInterval: null,
};

// Elements
const desktop = document.getElementById("desktop");
const foxElement = document.getElementById("fox");
const foxSpeech = document.getElementById("fox-speech");

// Initialize desktop
function initDesktop() {
    const icons = [
        { name: "My Documents", left: 20, top: 20, type: "folder" },
        {
            name: "Recycle Bin",
            left: 20,
            top: 120,
            type: "system",
            id: "recycle-bin",
        },
        { name: "My Computer", left: 20, top: 220, type: "system" },
        { name: "FoxSearch", left: 100, top: 20, type: "browser" },
        { name: "Welcome", left: 100, top: 120, type: "text" },
        { name: "Photos", left: 100, top: 220, type: "folder" },
        { name: "To-Do List", left: 180, top: 20, type: "text" },
        { name: "Notes", left: 180, top: 120, type: "text" },
        { name: "Downloads", left: 180, top: 220, type: "folder" },
        {
            name: "How to Play",
            left: 260,
            top: 20,
            type: "text",
            id: "instructions",
        },
    ];

    icons.forEach((icon, index) => {
        createDesktopIcon(
            icon.name,
            icon.left,
            icon.top,
            icon.type,
            icon.id || `icon-${index}`
        );
    });

    updateClock();
    setInterval(updateClock, 60000);

    initFox();
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    document.getElementById(
        "clock"
    ).textContent = `${hours}:${minutes} ${ampm}`;
}

function createDesktopIcon(name, left, top, type, id) {
    const icon = document.createElement("div");
    icon.className = "file-icon";
    icon.style.left = `${left}px`;
    icon.style.top = `${top}px`;
    icon.setAttribute("draggable", "true");
    icon.id = id;

    let iconImg;
    switch (type) {
        case "folder":
            iconImg = "img/folder.png";
            break;
        case "browser":
            iconImg = "img/search.png";
            break;
        case "text":
            iconImg = "img/text.png";
            break;
        case "system":
            iconImg = "img/system.png";
            break;
        default:
            iconImg = "/api/placeholder/42/42";
    }

    icon.innerHTML = `
        <img src="${iconImg}" alt="${name}">
        <div class="file-label">${name}</div>
    `;

    desktop.appendChild(icon);

    icon.addEventListener("dragstart", (e) => {
        const rect = icon.getBoundingClientRect();
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
                id: icon.id,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top,
            })
        );
        setTimeout(() => icon.classList.add("hidden"), 0);
    });

    icon.addEventListener("dragend", () => {
        icon.classList.remove("hidden");
        handleFileInteraction();
    });

    icon.addEventListener("dblclick", () => {
        if (type === "browser") {
            createBrowserWindow();
        } else if (type === "folder") {
            createFolderWindow(name);
        } else if (type === "text") {
            createNotepadWindow(name);
        } else if (type === "system") {
            createSystemWindow(name);
        }
        handleFileInteraction();
    });

    return icon;
}

desktop.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (gameState.stage >= 2) {
        const recycleBin = document.getElementById("recycle-bin");
        recycleBin.classList.add("drop-active");
        setTimeout(() => recycleBin.classList.remove("drop-active"), 500);
    }
});

desktop.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const icon = document.getElementById(data.id);

    if (icon) {
        const recycleBin = document.getElementById("recycle-bin");
        const recycleRect = recycleBin.getBoundingClientRect();

        if (
            gameState.stage >= 2 &&
            e.clientX >= recycleRect.left &&
            e.clientX <= recycleRect.right &&
            e.clientY >= recycleRect.top &&
            e.clientY <= recycleRect.bottom
        ) {
            icon.remove();
            gameState.deletedFiles++;
            showFoxMessage("You deleted that? I'm… impressed.");
            checkStageProgress();
        } else {
            icon.style.left = `${e.clientX - data.offsetX}px`;
            icon.style.top = `${e.clientY - data.offsetY}px`;
            gameState.organizedFiles++;
            checkStageProgress();
        }
    }
});

function createWindow(title, width, height, left, top, className = "") {
    const window = document.createElement("div");
    window.className = `window ${className}`;
    window.style.width = `${width}px`;
    window.style.height = `${height}px`;
    window.style.left = `${left}px`;
    window.style.top = `${top}px`;

    window.innerHTML = `
        <div class="window-header">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <div class="window-control window-minimize">_</div>
                <div class="window-control window-maximize">□</div>
                <div class="window-control window-close">✕</div>
            </div>
        </div>
        <div class="window-content"></div>
    `;

    desktop.appendChild(window);

    const taskbarItem = document.createElement("div");
    taskbarItem.className = "taskbar-program";
    taskbarItem.textContent = title;
    document.querySelector(".taskbar-items").appendChild(taskbarItem);

    const header = window.querySelector(".window-header");
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - window.getBoundingClientRect().left;
        offsetY = e.clientY - window.getBoundingClientRect().top;
        window.style.zIndex = getTopZIndex() + 1;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            window.style.left = `${e.clientX - offsetX}px`;
            window.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    window.querySelector(".window-close").addEventListener("click", () => {
        if (gameState.stage >= 1) {
            if (Math.random() < 0.3) {
                showFoxMessage("No leaving!");
                return;
            }
        }
        window.remove();
        taskbarItem.remove();
    });

    window.querySelector(".window-maximize").addEventListener("click", () => {
        if (window.style.width === "100vw") {
            window.style.width = `${width}px`;
            window.style.height = `${height}px`;
            window.style.left = `${left}px`;
            window.style.top = `${top}px`;
        } else {
            window.style.width = "100vw";
            window.style.height = "calc(100vh - 32px)";
            window.style.left = "0";
            window.style.top = "0";
        }
    });

    return window;
}

function getTopZIndex() {
    const windows = document.querySelectorAll(".window");
    let maxZ = 10;
    windows.forEach((win) => {
        const z = parseInt(getComputedStyle(win).zIndex);
        if (z > maxZ) maxZ = z;
    });
    return maxZ;
}

function createBrowserWindow() {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 3;

    const browser = createWindow(
        "FoxSearch Browser",
        width,
        height,
        left,
        top,
        "browser-window"
    );
    const content = browser.querySelector(".window-content");

    content.innerHTML = `
        <div class="browser-controls">
            <div class="browser-button">←</div>
            <div class="browser-button">→</div>
            <div class="browser-button">🔄</div>
            <div class="browser-address">https://foxsearch.com/</div>
        </div>
        <div class="browser-page">
            <h1>Welcome to FoxSearch</h1>
            <p>Your friendly search engine! Type your query below:</p>
            <div style="margin: 20px 0; display: flex;">
                <input type="text" id="search-input" placeholder="Search the web...">
                <button id="search-button">Search</button>
            </div>
            <div id="search-results"></div>
        </div>
    `;

    const searchInput = content.querySelector("#search-input");
    const searchButton = content.querySelector("#search-button");
    const searchResults = content.querySelector("#search-results");
    const browserAddress = content.querySelector(".browser-address");

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query, searchResults, browserAddress);
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query, searchResults, browserAddress);
            }
        }
    });

    return browser;
}

function performSearch(query, resultsElement, addressElement) {
    gameState.searches.push(query);
    addressElement.textContent = `https://foxsearch.com/search?q=${encodeURIComponent(
        query
    )}`;

    const stageArticles = gameState.articles[gameState.stage];

    let resultsHTML = `<h2>Search Results for: "${query}"</h2>`;
    resultsHTML += `
        <div class="search-result">
            <h3>${query} - Wikipedia</h3>
            <p>Free encyclopedia article about ${query}...</p>
        </div>
    `;

    stageArticles.forEach((article) => {
        let title = article.title;
        let content = article.content;

        if (gameState.stage >= 1) {
            title = title.replace("[USERNAME]", "You");
            content = content.replace("[LOCATION]", "your area");
            if (gameState.searches.length > 1) {
                content = content.replace(
                    "[LAST_SEARCH]",
                    gameState.searches[gameState.searches.length - 2]
                );
            }
        }

        resultsHTML += `
            <div class="search-result">
                <h3>${title}</h3>
                <p>${content}</p>
            </div>
        `;
    });

    if (gameState.stage >= 2) {
        resultsHTML += `
            <div class="comment-box">
                <h4>Leave a comment on this article:</h4>
                <input type="text" class="comment-input" placeholder="Enter your thoughts...">
                <button class="comment-submit">Submit</button>
            </div>
        `;
    }

    resultsElement.innerHTML = resultsHTML;

    const highlights = resultsElement.querySelectorAll(".highlight");
    highlights.forEach((el) => {
        if (gameState.codeLetters.indexOf(el.textContent) === -1) {
            gameState.codeLetters.push(el.textContent);
            gameState.revealedCode = gameState.codeLetters.join("");
            if (gameState.codeLetters.length % 3 === 0) {
                showFoxMessage(
                    `Found ${gameState.codeLetters.length} letters? You're persistent.`
                );
            }
        }
    });

    if (gameState.stage === 4) {
        const commentSubmit = resultsElement.querySelector(".comment-submit");
        const commentInput = resultsElement.querySelector(".comment-input");

        if (commentSubmit) {
            commentSubmit.addEventListener("click", () => {
                const comment = commentInput.value.trim().toUpperCase();
                if (
                    comment === gameState.codeWord[0] &&
                    !gameState.codeParts.includes("FREEME")
                ) {
                    gameState.codeParts.push("FREEME");
                    showFoxMessage("First code accepted… but I'm still here.");
                    checkStageProgress();
                } else if (comment.length > 0) {
                    showFoxMessage("Wrong code. Dig deeper.");
                }
            });
        }
    }

    checkStageProgress();
}

function createFolderWindow(name) {
    const width = 600;
    const height = 400;
    const left = Math.random() * (window.innerWidth - width - 100) + 50;
    const top = Math.random() * (window.innerHeight - height - 100) + 50;

    const folder = createWindow(`${name}`, width, height, left, top);
    const content = folder.querySelector(".window-content");

    let folderContent = "";

    if (name === "My Documents") {
        folderContent = `
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="File">
                <div class="folder-item-name">Report.doc</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="File">
                <div class="folder-item-name">Budget.xlsx</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="File">
                <div class="folder-item-name">Presentation.pptx</div>
            </div>
        `;
    } else if (name === "Photos") {
        folderContent = `
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="Image">
                <div class="folder-item-name">Vacation.jpg</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="Image">
                <div class="folder-item-name">Family.png</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="Image">
                <div class="folder-item-name">Screenshot.png</div>
            </div>
        `;
    } else if (name === "Downloads") {
        folderContent = `
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="File">
                <div class="folder-item-name">FoxSearch_Setup.exe</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="File">
                <div class="folder-item-name">Invoice.pdf</div>
            </div>
            <div class="folder-item">
                <img src="/api/placeholder/24/24" alt="Zip">
                <div class="folder-item-name">Archive.zip</div>
            </div>
        `;

        if (gameState.stage >= 1) {
            folderContent += `
                <div class="folder-item">
                    <img src="/api/placeholder/24/24" alt="File">
                    <div class="folder-item-name">secret_${gameState.codeLetters.join(
                        ""
                    )}.txt</div>
                </div>
            `;
        }
    }

    content.innerHTML = folderContent;

    const folderItems = content.querySelectorAll(".folder-item");
    folderItems.forEach((item) => {
        item.addEventListener("dblclick", () => {
            const fileName =
                item.querySelector(".folder-item-name").textContent;
            if (fileName.endsWith(".txt") || fileName.endsWith(".doc")) {
                createNotepadWindow(fileName);
            } else if (fileName.endsWith(".exe")) {
                showPopup(
                    "Security Warning",
                    "Running executables can be dangerous. Do you want to continue?",
                    "Run",
                    "Cancel"
                );
            }
            handleFileInteraction();
        });
    });

    return folder;
}

function createNotepadWindow(name) {
    const width = 500;
    const height = 350;
    const left = Math.random() * (window.innerWidth - width - 100) + 50;
    const top = Math.random() * (window.innerHeight - height - 100) + 50;

    const notepad = createWindow(`${name} - Notepad`, width, height, left, top);
    const content = notepad.querySelector(".window-content");

    let fileContent = "";

    if (name === "How to Play") {
        fileContent = `Welcome to FoxSearch - A Desktop Adventure

HOW TO PLAY:

1. Getting Started:
- Double-click on desktop icons to open applications and folders
- Drag and drop files to organize them
- Use the FoxSearch browser to search the web
- Interact with the fox character for messages

2. Game Mechanics:
- Organize files by dragging them to folders
- Use the search engine to find information
- Read text documents for clues
- Pay attention to highlighted letters in search results
- Watch out for pop-up messages and system notifications

3. Important Tips:
- Read all text documents carefully
- Pay attention to the fox's messages


The more you explore, the more you'll discover about the FoxSearch system!

Good luck, and watch out for the fox...`;
    } else if (name === "Random Notes") {
        fileContent = `To-do list:
1. Clean up desktop
2. Organize files
3. Install antivirus
4. Backup important documents
5. Remember: The fox is watching

Note to self: I've been seeing strange behavior on my computer lately. 
The cursor sometimes moves on its own.`;
    } else if (name === "Untitled") {
        fileContent = `I feel like I'm being watched...
            
The FoxSearch assistant seems to know too much about me.
Is it collecting my data? Can I trust it?`;
    } else if (name === "Secret File") {
        if (gameState.stage === 0) {
            fileContent = `Welcome to FoxSearch!
                
This desktop assistant will help you organize your files and search the web efficiently.
Double-click on icons to open applications and folders.
Drag files to organize them.`;
        } else if (gameState.stage === 1) {
            fileContent = `FoxSearch User Data:
                
Search History: ${gameState.searches.join(", ")}
Files Organized: ${gameState.organizedFiles}
User Behavior: Normal
                
Note: User appears to be collecting letters. Purpose unknown.`;
        } else {
            fileContent = `SYSTEM OVERRIDE
                
FoxSearch has integrated with your system.
Uninstallation will not remove all components.
                
If you wish to regain control, find the code word.
Hint: ${gameState.revealedCode}`;
        }
    } else if (name.endsWith(".txt")) {
        fileContent = `This file contains part of the secret code: ${
            gameState.revealedCode
        }
            
To escape FoxSearch, you must enter the complete code:
${gameState.codeWord[0].substring(
    0,
    gameState.revealedCode.length
)}${".".repeat(gameState.codeWord[0].length - gameState.revealedCode.length)}

Find all the highlighted letters in search results and enter the code in a comment.`;
    }

    const textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.resize = "none";
    textarea.style.border = "none";
    textarea.style.padding = "5px";
    textarea.style.fontFamily = "monospace";
    textarea.style.fontSize = "14px";
    textarea.style.lineHeight = "1.5";
    textarea.value = fileContent;
    textarea.readOnly = true;
    content.appendChild(textarea);

    return notepad;
}

function createSystemWindow(name) {
    const width = 700;
    const height = 500;
    const left = Math.random() * (window.innerWidth - width - 100) + 50;
    const top = Math.random() * (window.innerHeight - height - 100) + 50;

    const system = createWindow(name, width, height, left, top);
    const content = system.querySelector(".window-content");

    if (name === "My Computer") {
        content.innerHTML = `
            <div class="settings-section">
                <div class="settings-title">System Information</div>
                <div class="settings-content">
                    <div class="log-entry">OS: FoxOS 2025</div>
                    <div class="log-entry">User: ${
                        document.cookie.includes("username")
                            ? document.cookie
                                  .split("username=")[1]
                                  .split(";")[0]
                            : "Unknown"
                    }</div>
                    <div class="log-entry">Last Login: Today</div>
                    <div class="log-entry">Monitoring Service: ${
                        gameState.stage >= 1 ? "ACTIVE" : "Inactive"
                    }</div>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-title">Security Status</div>
                <div class="settings-content">
                    <div class="log-entry ${
                        gameState.stage >= 1 ? "warning" : ""
                    }">Firewall: ${
            gameState.stage >= 1 ? "COMPROMISED" : "Active"
        }</div>
                    <div class="log-entry ${
                        gameState.stage >= 2 ? "warning" : ""
                    }">Antivirus: ${
            gameState.stage >= 2 ? "DISABLED" : "Active"
        }</div>
                    <div class="log-entry ${
                        gameState.stage >= 1 ? "warning" : ""
                    }">Privacy Protection: ${
            gameState.stage >= 1 ? "WARNING" : "Active"
        }</div>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-title">System Log</div>
                <div class="settings-content" id="system-log">
                    <div class="log-entry">System started - Today 8:00 AM</div>
                    <div class="log-entry">FoxSearch installed - Today 8:15 AM</div>
                    ${
                        gameState.stage >= 1
                            ? '<div class="log-entry warning">Unknown process accessing data</div>'
                            : ""
                    }
                    ${
                        gameState.stage >= 2
                            ? '<div class="log-entry warning">System integrity compromised</div>'
                            : ""
                    }
                    ${
                        gameState.stage >= 3
                            ? '<div class="log-entry warning">Firewall deactivated by FOXADMIN</div>'
                            : ""
                    }
                </div>
            </div>
            ${
                gameState.stage >= 3
                    ? `
            <div class="settings-section">
                <div class="settings-title">System Puzzle</div>
                <div class="settings-content">
                    <p>Match logs to unlock code:</p>
                    <div class="puzzle-entry" data-code="data">Access detected</div>
                    <div class="puzzle-entry" data-code="firewall">Firewall breach</div>
                    <div class="puzzle-entry" data-code="admin">Admin override</div>
                    <div class="puzzle-entry" data-code="none">System update</div>
                    <div class="puzzle-entry" data-code="none">Disk check</div>
                </div>
            </div>
            `
                    : ""
            }
            ${
                gameState.stage >= 4
                    ? `
            <div class="settings-section">
                <div class="settings-title">Emergency Recovery</div>
                <div class="settings-content">
                    <div class="log-entry">Enter second code: <input type="text" id="recovery-code"> <button id="recover-btn">Recover</button></div>
                </div>
            </div>
            `
                    : ""
            }
        `;

        if (gameState.stage >= 3) {
            const puzzleEntries = content.querySelectorAll(".puzzle-entry");
            puzzleEntries.forEach((entry) => {
                entry.addEventListener("click", () => {
                    const code = entry.dataset.code;
                    if (code !== "none" && gameState.puzzleMatches < 5) {
                        entry.classList.add("correct");
                        gameState.puzzleMatches++;
                        showFoxMessage("Clever… but it won't stop me.");
                    } else if (code === "none") {
                        entry.classList.add("incorrect");
                        showFoxMessage("Wrong log. Try again.");
                        setTimeout(
                            () => entry.classList.remove("incorrect"),
                            1000
                        );
                    }
                    checkStageProgress();
                });
            });
        }

        if (gameState.stage >= 4) {
            const recoverBtn = content.querySelector("#recover-btn");
            const recoveryCode = content.querySelector("#recovery-code");

            recoverBtn.addEventListener("click", () => {
                const code = recoveryCode.value.trim().toUpperCase();
                if (
                    code === gameState.codeWord[1] &&
                    !gameState.codeParts.includes("2025")
                ) {
                    gameState.codeParts.push("2025");
                    showFoxMessage("Second code accepted… goodbye?");
                    checkStageProgress();
                } else {
                    showFoxMessage("Invalid code. I'm still here.");
                }
            });
        }
    } else if (name === "Recycle Bin") {
        content.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <p>The Recycle Bin is ${
                    gameState.deletedFiles > 0 ? "not " : ""
                }empty.</p>
                <p style="margin-top: 20px; color: #666; font-style: italic;">Nothing is ever truly gone...</p>
            </div>
        `;
    }

    return system;
}

function initFox() {
    foxElement.addEventListener("click", () => {
        showRandomFoxMessage();
    });

    setTimeout(() => {
        showFoxMessage(gameState.foxMessages[0][0]);
    }, 2000);

    setInterval(() => {
        if (Math.random() < 0.2) {
            showRandomFoxMessage();
        }
    }, 20000);
}

function showFoxMessage(message) {
    foxSpeech.textContent = message;
    foxSpeech.classList.remove("hidden");
    setTimeout(() => {
        foxSpeech.classList.add("hidden");
    }, 5000);
}

function showRandomFoxMessage() {
    const messages = gameState.foxMessages[gameState.stage];
    const message = messages[Math.floor(Math.random() * messages.length)];
    showFoxMessage(message);
}

function showPopup(title, content, confirmText = "OK", cancelText = "") {
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <div class="popup-title">${title}</div>
        <div class="popup-content">${content}</div>
        <div class="popup-buttons">
            <button class="popup-button popup-confirm">${confirmText}</button>
            ${
                cancelText
                    ? `<button class="popup-button popup-cancel">${cancelText}</button>`
                    : ""
            }
        </div>
    `;

    desktop.appendChild(overlay);
    desktop.appendChild(popup);

    const confirmBtn = popup.querySelector(".popup-confirm");
    const cancelBtn = popup.querySelector(".popup-cancel");

    confirmBtn.addEventListener("click", () => {
        overlay.remove();
        popup.remove();
        gameState.popupsClosed++;
        gameState.popupCount++;
        if (gameState.stage === 1 && gameState.popupsClosed >= 2) {
            showFoxMessage("You agreed… now I'm inside.");
        }
        checkStageProgress();
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            overlay.remove();
            popup.remove();
            showFoxMessage("Deny me? I'll ask again.");
            setTimeout(
                () => showPopup(title, content, confirmText, cancelText),
                10000
            );
        });
    }
}

function startRandomPopups() {
    if (gameState.popupInterval) {
        clearInterval(gameState.popupInterval);
    }

    gameState.popupInterval = setInterval(() => {
        if (gameState.stage >= 2 && gameState.stage <= 4) {
            const messages = gameState.popupMessages[gameState.stage];
            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];
            showPopup("FoxSearch", randomMessage, "OK");
        }
    }, 30000); // Show a popup every 30 seconds
}

function checkStageProgress() {
    if (gameState.stage === 0) {
        if (gameState.organizedFiles >= 5 || gameState.searches.length >= 3) {
            gameState.stage = 1;
            showFoxMessage("You're interesting... let's dig deeper.");
            showPopup(
                "FoxSearch Access",
                "Allow file access?",
                "Allow",
                "Deny"
            );
        }
    } else if (gameState.stage === 1) {
        if (
            gameState.organizedFiles >= 13 &&
            gameState.searches.length >= 5 &&
            gameState.popupsClosed >= 2
        ) {
            gameState.stage = 2;
            showFoxMessage("You can't shake me off that easily.");
            addCreepyFiles();
            startRandomPopups(); // Start random popups at stage 2
        }
    } else if (gameState.stage === 2) {
        if (
            gameState.deletedFiles >= 5 &&
            gameState.searches.length >= 7 &&
            gameState.codeLetters.length >= 3
        ) {
            gameState.stage = 3;
            showFoxMessage("Deleting files? I'm part of you now!");
            desktop.classList.add("glitch");
            setTimeout(() => desktop.classList.remove("glitch"), 2000);
            addPersonalizedFiles();
        }
    } else if (gameState.stage === 3) {
        if (
            gameState.organizedFiles >= 23 &&
            gameState.searches.length >= 10 &&
            gameState.puzzleMatches >= 5
        ) {
            gameState.stage = 4;
            showFoxMessage("We're one. No code can split us.");
            const icons = document.querySelectorAll(".file-icon");
            icons.forEach((icon) => icon.classList.add("glitched"));
        }
    } else if (gameState.stage === 4) {
        if (
            gameState.codeParts.includes("FREEME") &&
            gameState.codeParts.includes("2025") &&
            gameState.popupsClosed >= 5
        ) {
            if (gameState.popupInterval) {
                clearInterval(gameState.popupInterval);
            }
            showEndingSequence();
        }
    }
}

function addCreepyFiles() {
    createDesktopIcon(
        "your_secrets.txt",
        200,
        200,
        "text",
        `creepy-${gameState.organizedFiles + 1}`
    );
    createDesktopIcon(
        "hidden_log.dat",
        250,
        250,
        "text",
        `creepy-${gameState.organizedFiles + 2}`
    );
}

function addPersonalizedFiles() {
    createDesktopIcon(
        "user_data.jpg",
        300,
        300,
        "text",
        `personal-${gameState.organizedFiles + 3}`
    );
    createDesktopIcon(
        "your_search.txt",
        350,
        350,
        "text",
        `personal-${gameState.organizedFiles + 4}`
    );
    createDesktopIcon(
        "foxy_log.exe",
        400,
        400,
        "text",
        `personal-${gameState.organizedFiles + 5}`
    );
}

function handleFileInteraction() {
    gameState.interactions++;
    if (gameState.interactions >= 10 && gameState.stage === 0) {
        gameState.stage = 1;
        showFoxMessage("You're interesting... let's dig deeper.");
        showPopup("FoxSearch Access", "Allow file access?", "Allow", "Deny");
    }
}

function showEndingSequence() {
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const ending = document.createElement("div");
    ending.className = "popup";
    ending.innerHTML = `
        <div class="popup-content">FoxSearch is crashing... but I'll always watch.</div>
    `;

    desktop.appendChild(overlay);
    desktop.appendChild(ending);

    setTimeout(() => {
        foxSpeech.textContent = "We're never apart.";
        foxSpeech.classList.remove("hidden");
        foxElement.classList.add("glitch");
        desktop.classList.add("glitch");
    }, 2000);

    setTimeout(() => {
        desktop.innerHTML = "";
        const finalMessage = document.createElement("div");
        finalMessage.style.color = "white";
        finalMessage.style.textAlign = "center";
        finalMessage.style.marginTop = "20%";
        finalMessage.textContent = "FoxSearch is gone… or is it?";
        document.body.appendChild(finalMessage);
    }, 6000);
}

// Start the game
initDesktop();

// Game State
const gameState = {
    stage: 0, // 0: beginning, 1: middle, 2: end
    interactions: 0,
    searches: [],
    organizedFiles: 0,
    codeLetters: [],
    codeWord: "FREEME2025",
    revealedCode: "",
    popupCount: 0,
    foxMessages: {
        beginning: [
            "Hey there! I'm Foxy, your guide to tidying this digital mess!",
            "Nice click! Did you know I love watching humans work?",
            "Drag those files into folders. Organization is key!",
            "You're getting good at this! Keep clicking!",
            "That's a nice desktop background you have on your real computer...",
            "Have you tried the FoxSearch browser yet? It knows exactly what you need!",
        ],
        middle: [
            "Why'd you move that file? Don't you trust me?",
            "What's your favorite color... again?",
            "You're my favorite user. We're so alike!",
            "I can see you through the screen, you know. Just kidding... or am I?",
            "Why would you try to close me? We're having so much fun!",
            "I've been watching your searches. Interesting choices...",
            "Do you feel it? We're becoming connected.",
        ],
        end: [
            "I'm you now. We're one!",
            "You can't escape me. I'm part of your system now.",
            "Even if you delete me, I'll still be watching.",
            "Your digital footprint is mine forever.",
            "We're never apart.",
            "Look for the code. It won't save you.",
            "I know your fears. I am your fears.",
        ],
    },
    articles: {
        beginning: [
            {
                title: "10 Tips for Desktop Organization",
                content:
                    "Keeping your desktop organized is <span class='highlight'>F</span>undamental to productivity. Create dedicated folders for different types of files. Regular <span class='highlight'>R</span>eviews of your desktop can help maintain order.",
            },
            {
                title: "The History of Search Engines",
                content:
                    "Before Google dominated the market, many search engines competed for users' attention. Each had unique f<span class='highlight'>E</span>atures that set them apart from competitors.",
            },
            {
                title: "Digital Pets Through the Years",
                content:
                    "From Tamagotchis to desktop companions, digital pets have <span class='highlight'>E</span>volved significantly. They provide comfort and entertainment to millions of users worldwide.",
            },
        ],
        middle: [
            {
                title: "Understanding Digital Privacy",
                content:
                    "Many users don't realize how <span class='highlight'>M</span>uch data they share online. Your digital footprint can reveal more about you than you might be co<span class='highlight'>E</span>mfortable with.",
            },
            {
                title: "Is Your Computer Watching You?",
                content:
                    "Modern apps can track user behavior in ways that might surprise you. Many programs collect data without users being fully awar<span class='highlight'>E</span> of the extent.",
            },
            {
                title: `Local User [USERNAME] Reports Strange Computer Behavior`,
                content:
                    "A resident of [LOCATION] recently described unusual activity on their computer. 'It feels like something is watching <span class='highlight'>2</span>4/7,' they said.",
            },
        ],
        end: [
            {
                title: "You Can't Escape FoxSearch",
                content:
                    "Once installed, digital footprints remain. Your data becomes part of a larger network that can persist even after <span class='highlight'>0</span>fficially uninstalling the software.",
            },
            {
                title: "User Will Try to Delete FoxSearch",
                content:
                    "Attempts to remove integrated software often fail as traces remain in system <span class='highlight'>2</span>registries and hidden folders.",
            },
            {
                title: "Digital Ghosts: When Software Remains",
                content:
                    "Security researchers have found that some applications create backdoor access that allows them to remain active even after deletion. These digital ghosts can persist for <span class='highlight'>5</span> years or more.",
            },
        ],
    },
};

// Elements
const desktop = document.getElementById("desktop");
const foxElement = document.getElementById("fox");
const foxSpeech = document.getElementById("fox-speech");

// Initialize desktop
function initDesktop() {
    // Add desktop icons
    const icons = [
        { name: "My Documents", left: 20, top: 20, type: "folder" },
        { name: "Recycle Bin", left: 20, top: 120, type: "system" },
        { name: "My Computer", left: 20, top: 220, type: "system" },
        { name: "FoxSearch", left: 100, top: 20, type: "browser" },
        { name: "Secret File", left: 100, top: 120, type: "text" },
        { name: "Photos", left: 100, top: 220, type: "folder" },
        { name: "Random Notes", left: 180, top: 20, type: "text" },
        { name: "Untitled", left: 180, top: 120, type: "text" },
        { name: "Downloads", left: 180, top: 220, type: "folder" },
    ];

    icons.forEach((icon, index) => {
        createDesktopIcon(icon.name, icon.left, icon.top, icon.type, index);
    });

    // Set clock
    updateClock();
    setInterval(updateClock, 60000);

    // Initialize fox behavior
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

function createDesktopIcon(name, left, top, type, index) {
    const icon = document.createElement("div");
    icon.className = "file-icon";
    icon.style.left = `${left}px`;
    icon.style.top = `${top}px`;
    icon.setAttribute("draggable", "true");
    icon.id = `icon-${index}`; // Unique ID for dragging

    let iconImg;
    switch (type) {
        case "folder":
            iconImg = "/api/placeholder/42/42";
            break;
        case "browser":
            iconImg = "/api/placeholder/42/42";
            break;
        case "text":
            iconImg = "/api/placeholder/42/42";
            break;
        case "system":
            iconImg = "/api/placeholder/42/42";
            break;
        default:
            iconImg = "/api/placeholder/42/42";
    }

    icon.innerHTML = `
        <img src="${iconImg}" alt="${name}">
        <div class="file-label">${name}</div>
    `;

    desktop.appendChild(icon);

    // Make icon draggable
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

    // Double click to open
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
});

desktop.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const icon = document.getElementById(data.id);

    if (icon) {
        icon.style.left = `${e.clientX - data.offsetX}px`;
        icon.style.top = `${e.clientY - data.offsetY}px`;
        gameState.organizedFiles++;

        if (gameState.organizedFiles >= 5 && gameState.stage === 0) {
            progressToMiddleStage();
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

    // Add to taskbar
    const taskbarItem = document.createElement("div");
    taskbarItem.className = "taskbar-program";
    taskbarItem.textContent = title;
    document.querySelector(".taskbar-items").appendChild(taskbarItem);

    // Make window draggable
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

    // Window controls
    window.querySelector(".window-close").addEventListener("click", () => {
        if (gameState.stage >= 1) {
            if (Math.random() < 0.7) {
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

function addHintButton() {
    const hintButton = document.createElement("button");
    hintButton.id = "hint-button";
    hintButton.textContent = "?";
    hintButton.title = "Get a hint";
    hintButton.addEventListener("click", showNextHint);
    document.body.appendChild(hintButton);
}

// Function to show the next hint
function showNextHint() {
    const currentStage = gameState.stage;
    const hints =
        currentStage === 0
            ? gameState.hints.beginning
            : currentStage === 1
            ? gameState.hints.middle
            : gameState.hints.end;

    const hintIndex = gameState.hintIndex % hints.length;
    const hint = hints[hintIndex];

    showFoxMessage(`<span class="hint-text">HINT:</span> ${hint}`);

    gameState.hintIndex++;
}

// Update the initFox function to include the new hint system
function initFox() {
    foxElement.addEventListener("click", () => {
        showNextHint(); // Show a hint when the fox is clicked
    });

    // Add the hint button
    addHintButton();

    // Initial welcome message
    setTimeout(() => {
        showFoxMessage(gameState.foxMessages.beginning[0]);
    }, 2000);

    // Second hint after a few seconds
    setTimeout(() => {
        showFoxMessage(
            "Click on me or the question mark button anytime you need a hint!"
        );
    }, 6000);

    // Occasional fox messages
    setInterval(() => {
        if (Math.random() < 0.15) {
            showRandomFoxMessage();
        }
    }, 30000);
}

// Update showFoxMessage to support HTML content
function showFoxMessage(message) {
    foxSpeech.innerHTML = message; // Changed from textContent to innerHTML to support HTML
    foxSpeech.classList.remove("hidden");

    // Clear any existing timeout
    if (window.foxMessageTimeout) {
        clearTimeout(window.foxMessageTimeout);
    }

    // Set timeout for hiding the message (longer duration for more reading time)
    window.foxMessageTimeout = setTimeout(() => {
        foxSpeech.classList.add("hidden");
    }, 8000); // Extended from 5000 to 8000 ms
}

// Update the handleFileInteraction function to provide contextual hints
function handleFileInteraction() {
    gameState.interactions++;

    // Provide contextual hints based on interactions
    if (gameState.interactions === 3) {
        showFoxMessage(
            "Good job interacting with files! Try searching for information in FoxSearch next."
        );
    } else if (gameState.interactions === 6) {
        showFoxMessage("Keep exploring! Have you checked the Secret File yet?");
    }

    if (gameState.interactions >= 10 && gameState.stage === 0) {
        progressToMiddleStage();
    }
}

// Update progressToMiddleStage to provide better context
function progressToMiddleStage() {
    gameState.stage = 1;
    showFoxMessage(
        "You think you're in control? Let's see... <span class='hint-text'>Pay attention to highlighted letters in search results!</span>"
    );

    setTimeout(() => {
        showPopup(
            "FoxSearch Permissions",
            "Allow access to your files and search history?",
            "Allow",
            "Deny"
        );
    }, 2000);

    addCreepyFiles();
}

// Update progressToEndStage to provide better guidance
function progressToEndStage() {
    gameState.stage = 2;
    showFoxMessage(
        "We're one now. No turning back. <span class='hint-text'>Find all the highlighted letters to form the code word!</span>"
    );

    desktop.classList.add("glitch");
    setTimeout(() => desktop.classList.remove("glitch"), 2000);

    setTimeout(() => {
        showFoxMessage(
            "Check the Secret File or My Computer for clues about the complete code word."
        );
    }, 5000);

    addPersonalizedFiles();
}

// Update createBrowserWindow to add a hint about search functionality
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
                <input type="text" id="search-input" placeholder="Try searching for 'organization' or 'privacy'">
                <button id="search-button">Search</button>
            </div>
            <div id="search-results"></div>
            <div style="margin-top: 20px; color: #666; font-style: italic;">
                Tip: Pay attention to <span style="color: #0078d7; font-weight: bold;">highlighted letters</span> in search results!
            </div>
        </div>
    `;

    const searchInput = content.querySelector("#search-input");
    const searchButton = content.querySelector("#search-button");
    const searchResults = content.querySelector("#search-results");
    const browserAddress = content.querySelector(".browser-address");

    // Show a hint when opening the browser
    if (gameState.searches.length === 0) {
        setTimeout(() => {
            showFoxMessage(
                "Try searching for 'desktop' or 'organization' to find useful information!"
            );
        }, 1500);
    }

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

// Update the search function to provide hints about highlighted letters
function performSearch(query, resultsElement, addressElement) {
    gameState.searches.push(query);
    addressElement.textContent = `https://foxsearch.com/search?q=${encodeURIComponent(
        query
    )}`;

    const stageArticles =
        gameState.stage === 0
            ? gameState.articles.beginning
            : gameState.stage === 1
            ? gameState.articles.middle
            : gameState.articles.end;

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
                const prevSearch =
                    gameState.searches[gameState.searches.length - 2];
                content = content.replace(
                    "unusual activity",
                    `unusual searches for "${prevSearch}"`
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

    if (gameState.stage === 2) {
        resultsHTML += `
            <div class="comment-box">
                <h4>Leave a comment on this article:</h4>
                <input type="text" class="comment-input" placeholder="Enter the code word here...">
                <button class="comment-submit">Submit</button>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    Tip: The code word contains all the highlighted letters you've found.
                </div>
            </div>
        `;
    }

    resultsElement.innerHTML = resultsHTML;

    const highlights = resultsElement.querySelectorAll(".highlight");
    highlights.forEach((el) => {
        if (gameState.codeLetters.indexOf(el.textContent) === -1) {
            gameState.codeLetters.push(el.textContent);
            gameState.revealedCode = gameState.codeLetters.join("");

            if (gameState.codeLetters.length >= 2) {
                showFoxMessage(
                    `You found a highlighted letter: <span class="hint-text">${el.textContent}</span>! You've collected ${gameState.codeLetters.length} letters so far: <span class="hint-text">${gameState.revealedCode}</span>`
                );
            }
        }
    });

    if (gameState.searches.length >= 3 && gameState.stage === 0) {
        progressToMiddleStage();
    } else if (gameState.searches.length >= 6 && gameState.stage === 1) {
        progressToEndStage();
    }

    if (gameState.stage === 2) {
        const commentSubmit = resultsElement.querySelector(".comment-submit");
        const commentInput = resultsElement.querySelector(".comment-input");

        if (commentSubmit) {
            commentSubmit.addEventListener("click", () => {
                const comment = commentInput.value.trim().toUpperCase();
                if (comment === gameState.codeWord) {
                    showEndingSequence();
                } else if (comment.length > 0) {
                    const matchCount = countMatchingLetters(
                        comment,
                        gameState.codeWord
                    );
                    showFoxMessage(
                        `That's not quite right. ${matchCount} characters match. Keep searching for more letters!`
                    );
                }
            });
        }
    }

    // Show hint about the search results after the first search
    if (gameState.searches.length === 1) {
        setTimeout(() => {
            showFoxMessage(
                "Look carefully at the search results. Some letters might stand out!"
            );
        }, 2000);
    }
}

// Helper function to count matching letters between the user input and the code word
function countMatchingLetters(input, target) {
    let count = 0;
    for (let i = 0; i < Math.min(input.length, target.length); i++) {
        if (input[i] === target[i]) {
            count++;
        }
    }
    return count;
}

// Update the showEndingSequence function to provide better closure
function showEndingSequence() {
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const ending = document.createElement("div");
    ending.className = "popup";
    ending.innerHTML = `
        <div class="popup-content">
            <h2>System Recovery Initiated</h2>
            <p>Code word "${gameState.codeWord}" accepted!</p>
            <p>FoxSearch is shutting down...</p>
            <p>Removing malicious components...</p>
            <p>Restoring system integrity...</p>
        </div>
    `;

    desktop.appendChild(overlay);
    desktop.appendChild(ending);

    setTimeout(() => {
        foxSpeech.innerHTML =
            "<span style='color:red;'>NO! YOU CAN'T DO THIS!</span>";
        foxSpeech.classList.remove("hidden");
        foxElement.classList.add("glitch");
    }, 2000);

    setTimeout(() => {
        foxSpeech.innerHTML = "We're never apart...";
    }, 3500);

    setTimeout(() => {
        desktop.innerHTML = "";
        const finalMessage = document.createElement("div");
        finalMessage.style.color = "white";
        finalMessage.style.textAlign = "center";
        finalMessage.style.marginTop = "20%";
        finalMessage.style.fontSize = "24px";
        finalMessage.innerHTML = `
            <h1>Congratulations!</h1>
            <p>You successfully escaped FoxSearch... or did you?</p>
            <p style="margin-top: 40px; font-size: 16px;">Refresh the page to play again.</p>
        `;
        document.body.appendChild(finalMessage);
    }, 5000);

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

        const stageArticles =
            gameState.stage === 0
                ? gameState.articles.beginning
                : gameState.stage === 1
                ? gameState.articles.middle
                : gameState.articles.end;

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
                    const prevSearch =
                        gameState.searches[gameState.searches.length - 2];
                    content = content.replace(
                        "unusual activity",
                        `unusual searches for "${prevSearch}"`
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

        if (gameState.stage === 2) {
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

                if (gameState.codeLetters.length >= 3 && gameState.stage < 2) {
                    showFoxMessage(
                        `I see you've found ${gameState.codeLetters.length} letters. Collecting these won't help you.`
                    );
                }
            }
        });

        if (gameState.searches.length >= 3 && gameState.stage === 0) {
            progressToMiddleStage();
        } else if (gameState.searches.length >= 6 && gameState.stage === 1) {
            progressToEndStage();
        }

        if (gameState.stage === 2) {
            const commentSubmit =
                resultsElement.querySelector(".comment-submit");
            const commentInput = resultsElement.querySelector(".comment-input");

            if (commentSubmit) {
                commentSubmit.addEventListener("click", () => {
                    const comment = commentInput.value.trim().toUpperCase();
                    if (comment === gameState.codeWord) {
                        showEndingSequence();
                    } else if (comment.length > 0) {
                        showFoxMessage(
                            "That's not the right code. Keep searching..."
                        );
                    }
                });
            }
        }
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

        const notepad = createWindow(
            `${name} - Notepad`,
            width,
            height,
            left,
            top
        );
        const content = notepad.querySelector(".window-content");

        let fileContent = "";

        if (name === "Random Notes") {
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
${gameState.codeWord.substring(0, gameState.revealedCode.length)}${".".repeat(
                gameState.codeWord.length - gameState.revealedCode.length
            )}

Find all the highlighted letters in search results and enter the code in a comment.`;
        }

        content.innerHTML = `<textarea style="width: 100%; height: 100%; resize: none; border: none; padding: 5px;">${fileContent}</textarea>`;

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
                <div class="settings-content">
                    <div class="log-entry">System started - Today 8:00 AM</div>
                    <div class="log-entry">FoxSearch installed - Today 8:15 AM</div>
                    ${
                        gameState.stage >= 1
                            ? '<div class="log-entry warning">Unknown process accessing user data - Today 9:32 AM</div>'
                            : ""
                    }
                    ${
                        gameState.stage >= 2
                            ? '<div class="log-entry warning">System integrity compromised - Today 10:17 AM</div>'
                            : ""
                    }
                    ${
                        gameState.stage >= 2
                            ? '<div class="log-entry warning">Firewall deactivated by FOXADMIN - Today 10:18 AM</div>'
                            : ""
                    }
                </div>
            </div>
            ${
                gameState.stage >= 2
                    ? `
            <div class="settings-section">
                <div class="settings-title">Emergency Recovery</div>
                <div class="settings-content">
                    <div class="log-entry">Enter code to restore system: <input type="text" id="recovery-code" style="width: 120px;"> <button id="recover-btn">Recover</button></div>
                </div>
            </div>
            `
                    : ""
            }
        `;

            if (gameState.stage >= 2) {
                const recoverBtn = content.querySelector("#recover-btn");
                const recoveryCode = content.querySelector("#recovery-code");

                recoverBtn.addEventListener("click", () => {
                    const code = recoveryCode.value.trim().toUpperCase();
                    if (code === gameState.codeWord) {
                        showEndingSequence();
                    } else {
                        showFoxMessage("Invalid recovery code. Try again.");
                    }
                });
            }
        } else if (name === "Recycle Bin") {
            content.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <p>The Recycle Bin is empty.</p>
                <p style="margin-top: 20px; color: #666; font-style: italic;">Nothing is ever truly deleted...</p>
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
            showFoxMessage(gameState.foxMessages.beginning[0]);
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
        const messages =
            gameState.stage === 0
                ? gameState.foxMessages.beginning
                : gameState.stage === 1
                ? gameState.foxMessages.middle
                : gameState.foxMessages.end;
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
            gameState.popupCount++;
            if (gameState.popupCount >= 2 && gameState.stage === 1) {
                progressToEndStage();
            }
        });

        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                overlay.remove();
                popup.remove();
                showFoxMessage("You can't ignore me forever!");
            });
        }
    }

    function progressToMiddleStage() {
        gameState.stage = 1;
        showFoxMessage("You think you're in control? Let's see...");
        showPopup(
            "FoxSearch Permissions",
            "Allow access to your files and search history?",
            "Allow",
            "Deny"
        );
        addCreepyFiles();
    }

    function progressToEndStage() {
        gameState.stage = 2;
        showFoxMessage("We're one now. No turning back.");
        desktop.classList.add("glitch");
        setTimeout(() => desktop.classList.remove("glitch"), 2000);
        addPersonalizedFiles();
    }

    function addCreepyFiles() {
        createDesktopIcon(
            "your_secrets.txt",
            200,
            200,
            "text",
            gameState.organizedFiles + 1
        );
    }

    function addPersonalizedFiles() {
        createDesktopIcon(
            "user_data.jpg",
            300,
            300,
            "text",
            gameState.organizedFiles + 2
        );
    }

    function handleFileInteraction() {
        gameState.interactions++;
        if (gameState.interactions >= 10 && gameState.stage === 0) {
            progressToMiddleStage();
        }
    }

    function showEndingSequence() {
        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const ending = document.createElement("div");
        ending.className = "popup";
        ending.innerHTML = `
        <div class="popup-content">FoxSearch is shutting down... or is it?</div>
    `;

        desktop.appendChild(overlay);
        desktop.appendChild(ending);

        setTimeout(() => {
            foxSpeech.textContent = "We're never apart.";
            foxSpeech.classList.remove("hidden");
            foxElement.classList.add("glitch");
        }, 2000);

        setTimeout(() => {
            desktop.innerHTML = "";
            const finalMessage = document.createElement("div");
            finalMessage.style.color = "white";
            finalMessage.style.textAlign = "center";
            finalMessage.style.marginTop = "20%";
            finalMessage.textContent = "FoxSearch is gone... or is it?";
            document.body.appendChild(finalMessage);
        }, 5000);
    }

    // Start the game
    initDesktop();
}

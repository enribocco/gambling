// Configurazione del gioco
const rows = 2; // 2 righe
const cols = 4; // 4 colonne
const prizes = ["💰", "🎉", "🍀", "⭐", "💎", "❌"]; // Simboli casuali
const winningPrize = "💰"; // Premio speciale
let foundPrizes = 0; // Contatore dei premi speciali trovati
let score = 0; // Punteggio del giocatore
let credits = 500; // Crediti iniziali del giocatore
let openedCards = 0; // Contatore delle caselle aperte
let firstCardOpened = false; // Indica se la prima casella è stata aperta

// Elementi DOM
const scratchCard = document.getElementById("scratch-card");
const scoreDisplay = document.getElementById("score");
const winMessage = document.getElementById("win-message");
const shopButton = document.getElementById("shop-button");
const shopModal = document.getElementById("shop-modal");
const closeShop = document.getElementById("close-shop");
const shopItems = document.querySelectorAll(".shop-item");

// Elementi DOM per gli oggetti acquistati
const purchasedButton = document.getElementById("purchased-button");
const purchasedModal = document.getElementById("purchased-modal");
const closePurchased = document.getElementById("close-purchased");
const purchasedList = document.getElementById("purchased-list");

// Apre la finestra dello shop
shopButton.addEventListener("click", () => {
    shopModal.style.display = "flex";
});

// Chiude la finestra dello shop
closeShop.addEventListener("click", () => {
    shopModal.style.display = "none";
});

// Apre la finestra degli oggetti acquistati
purchasedButton.addEventListener("click", () => {
    purchasedModal.style.display = "flex";
});

// Chiude la finestra degli oggetti acquistati
closePurchased.addEventListener("click", () => {
    purchasedModal.style.display = "none";
});

// Salva i dati del gioco nel localStorage
function saveGameData() {
    localStorage.setItem("credits", credits);
    localStorage.setItem("score", score);
}

// Carica i dati del gioco dal localStorage
function loadGameData() {
    const savedCredits = localStorage.getItem("credits");
    const savedScore = localStorage.getItem("score");

    if (savedCredits !== null) {
        credits = parseInt(savedCredits, 10);
    }

    if (savedScore !== null) {
        score = parseInt(savedScore, 10);
    }

    updateCreditsDisplay();
    scoreDisplay.textContent = `💰 Sacchi trovati: ${score}`;
}

// Carica i temi acquistati dal localStorage
function loadPurchasedItems() {
    const savedItems = JSON.parse(localStorage.getItem("purchasedItems")) || [];
    
    // Aggiungi il tema predefinito come opzione
    addPurchasedItem("default-dark", true);

    savedItems.forEach(style => addPurchasedItem(style));
}

// Modifica la funzione addPurchasedItem per gestire il tema predefinito
function addPurchasedItem(style, isDefault = false) {
    const item = document.createElement("div");
    item.classList.add("purchased-item");
    item.textContent = isDefault ? "Tema Default" : `Tema ${style}`;
    item.addEventListener("click", () => applyStyle(style));
    purchasedList.appendChild(item);

    if (!isDefault) {
        // Rimuovi l'oggetto dallo shop solo se non è il tema predefinito
        const shopItem = document.querySelector(`.shop-item[data-style="${style}"]`);
        if (shopItem) {
            shopItem.remove();
        }

        // Salva i temi acquistati nel localStorage
        const purchasedItems = [...document.querySelectorAll(".purchased-item:not(:first-child)")].map(i =>
            i.textContent.split(" ")[1]
        );
        localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
    }
}

// Acquista uno stile
shopItems.forEach(item => {
    item.addEventListener("click", () => {
        const style = item.dataset.style;
        const cost = parseInt(item.dataset.cost, 10);

        if (credits >= cost) {
            credits -= cost;
            updateCreditsDisplay();
            addPurchasedItem(style); // Aggiungi l'oggetto acquistato
            applyStyle(style); // Applica immediatamente il tema acquistato
            alert(`🎉 Hai acquistato e attivato il tema ${style}!`);
        } else {
            alert("😢 Non hai abbastanza crediti per acquistare questo tema.");
        }
    });
});

// Applica uno stile alla pagina
function applyStyle(style) {
    document.body.classList.remove("default-dark", "purple", "neon"); // Cambia "dark" in "purple"
    document.body.classList.add(style);

    // Salva il tema attivo nel localStorage
    localStorage.setItem("activeStyle", style);
}

// Aggiorna i crediti
function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById("credits");
    creditsDisplay.textContent = ` 💳 Crediti: ${credits}€`;
}

// Genera la griglia
function generateGrid() {
    scratchCard.innerHTML = ""; // Svuota la griglia
    winMessage.textContent = ""; // Resetta il messaggio di vincita
    openedCards = 0; // Resetta il contatore delle caselle aperte
    foundPrizes = 0; // Resetta i premi trovati
    firstCardOpened = false; // Resetta lo stato della prima casella

    for (let i = 0; i < rows * cols; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.prize = prizes[Math.floor(Math.random() * prizes.length)];
        card.addEventListener("click", revealCard);
        scratchCard.appendChild(card);
    }
}

// Mostra il premio quando si clicca
function revealCard() {
    if (!this.classList.contains("revealed")) {
        this.classList.add("revealed");
        this.textContent = this.dataset.prize;
        openedCards++;

        // Scala 10€ solo alla prima casella aperta
        if (!firstCardOpened) {
            credits -= 10;
            firstCardOpened = true; // Segna che la prima casella è stata aperta
            saveGameData(); // Salva i dati aggiornati
            updateCreditsDisplay();
        }

        // Controlla se il premio è quello vincente
        if (this.dataset.prize === winningPrize) {
            foundPrizes++;
            score += 1; // Incrementa il punteggio totale
            saveGameData(); // Salva i dati aggiornati
            scoreDisplay.textContent = `💰 Sacchi trovati: ${score}`;
        }

        // Controlla se tutte le caselle sono state aperte
        if (openedCards === rows * cols) {
            calculatePrize();
        }
    }
}

// Calcola il premio alla fine
function calculatePrize() {
    const winnings = foundPrizes * 10; // Ogni premio vale 10€
    credits += winnings; // Aggiunge i crediti vinti
    saveGameData(); // Salva i dati aggiornati
    updateCreditsDisplay();

    // Mostra il messaggio di vincita o sconfitta sotto il gratta e vinci
    if (foundPrizes > 0) {
        winMessage.textContent = `🎉 Hai trovato ${foundPrizes} premi vincenti e guadagnato ${winnings}€!`;
    } else {
        winMessage.textContent = `😢 Non hai trovato nessun premio vincente. Riprova!`;
    }

    setTimeout(() => {
        resetGame();
    }, 2000); // Resetta il gioco dopo 2 secondi
}

// Resetta il gioco
function resetGame() {
    generateGrid(); // Rigenera la griglia senza resettare il punteggio
}

// Recupera i link di trasferimento salvati nel localStorage
const transferLinks = JSON.parse(localStorage.getItem("transferLinks")) || {};

// Salva i link di trasferimento nel localStorage
function saveTransferLinks() {
    localStorage.setItem("transferLinks", JSON.stringify(transferLinks));
}

// Genera un link per trasferire crediti
function generateTransferLink(amount) {
    if (credits >= amount && amount > 0) {
        credits -= amount; // Rimuovi i crediti dal giocatore
        updateCreditsDisplay(); // Aggiorna la visualizzazione dei crediti
        saveGameData(); // Salva i dati aggiornati

        // Genera il link con l'importo incluso nella query string
        const link = `https://enribocco.github.io/gambling?transferAmount=${amount}`;
        
        // Copia automaticamente il link negli appunti
        navigator.clipboard.writeText(link).then(() => {
            alert(`🎉 Link generato e copiato negli appunti: ${link}`);
        }).catch(err => {
            alert(`🎉 Link generato: ${link}\n❌ Impossibile copiare il link negli appunti.`);
            console.error("Errore durante la copia negli appunti:", err);
        });

        return link;
    } else {
        alert("😢 Non hai abbastanza crediti per generare questo link.");
        return null;
    }
}

// Gestisce il trasferimento dei crediti quando si utilizza un link
function handleTransferLink() {
    const params = new URLSearchParams(window.location.search);
    const transferAmount = parseInt(params.get("transferAmount"), 10);

    if (transferAmount && transferAmount > 0) {
        // Recupera i crediti salvati nel localStorage
        const savedCredits = localStorage.getItem("credits");
        if (savedCredits !== null) {
            credits = parseInt(savedCredits, 10); // Usa i crediti salvati
        }

        credits += transferAmount; // Aggiungi i crediti trasferiti
        updateCreditsDisplay(); // Aggiorna la visualizzazione dei crediti
        saveGameData(); // Salva i dati aggiornati

        alert(`🎉 Hai ricevuto ${transferAmount}€!`);
        // Rimuovi il parametro dalla URL per evitare trasferimenti multipli
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Chiama la funzione per gestire il trasferimento all'avvio della pagina
handleTransferLink();

// Inizializza il gioco
loadGameData(); // Carica i crediti e il punteggio salvati
loadPurchasedItems(); // Carica i temi acquistati
applyStyle(localStorage.getItem("activeStyle") || "purple"); // Cambia "dark" in "purple"
generateGrid(); // Genera la griglia

document.getElementById("generate-link-button").addEventListener("click", () => {
    const amount = parseInt(document.getElementById("transfer-amount").value, 10);
    generateTransferLink(amount);
});

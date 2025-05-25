// Configurazione del gioco
const rows = 2; // 2 righe
const cols = 4; // 4 colonne
const prizes = ["💰", "🎉", "🍀", "⭐", "💎", "❌"]; // Simboli casuali
const winningPrize = "💰"; // Premio speciale
let foundPrizes = 0; // Contatore dei premi speciali trovati
let score = 0; // Punteggio del giocatore
let credits = 500; // Crediti iniziali del giocatore
let openedCards = 0; // Contatore delle caselle aperte

// Elementi DOM
const scratchCard = document.getElementById("scratch-card");
const scoreDisplay = document.getElementById("score");
const winMessage = document.getElementById("win-message"); // Elemento per il messaggio di vincita

// Carica i dati salvati dal localStorage
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
    scoreDisplay.textContent = `⭐ Punteggio: ${score}`;
}

// Salva i dati nel localStorage
function saveGameData() {
    localStorage.setItem("credits", credits);
    localStorage.setItem("score", score);
}

// Aggiorna i crediti
function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById("credits");
    creditsDisplay.textContent = `💳 Crediti: ${credits}€`;
}

// Genera la griglia
function generateGrid() {
    if (credits < 10) {
        winMessage.textContent = "Non hai abbastanza crediti per giocare! Ricarica i tuoi crediti.";
        return;
    }

    credits -= 10; // Deduce 10€ per giocare
    saveGameData(); // Salva i dati aggiornati
    updateCreditsDisplay();

    scratchCard.innerHTML = ""; // Svuota la griglia
    winMessage.textContent = ""; // Resetta il messaggio di vincita
    openedCards = 0; // Resetta il contatore delle caselle aperte
    foundPrizes = 0; // Resetta i premi trovati

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

        // Controlla se il premio è quello vincente
        if (this.dataset.prize === winningPrize) {
            foundPrizes++;
            score += 1; // Incrementa il punteggio totale
            scoreDisplay.textContent = `⭐ Punteggio: ${score}`;
            saveGameData(); // Salva i dati aggiornati
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

// Inizializza il gioco
loadGameData(); // Carica i dati salvati
generateGrid();
class UnbeatableRPS {
    constructor() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.gamesPlayed = 0;
        this.playerHistory = [];
        this.patterns = new Map();
        this.choices = ['rock', 'paper', 'scissors'];
        this.emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️',
            unknown: '❓'
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        const choiceButtons = document.querySelectorAll('.choice-btn');
        const resetButton = document.getElementById('resetBtn');
        
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playRound(choice);
            });
        });
        
        resetButton.addEventListener('click', () => this.resetGame());
    }
    
    playRound(playerChoice) {
        // Disable buttons temporarily
        this.setButtonsEnabled(false);
        
        // Add player choice to history
        this.playerHistory.push(playerChoice);
        
        // AI makes its choice using advanced strategy
        const aiChoice = this.getAIChoice();
        
        // Animate the choices
        this.animateChoices(playerChoice, aiChoice);
        
        // Determine winner after animation
        setTimeout(() => {
            const result = this.determineWinner(playerChoice, aiChoice);
            this.updateScores(result);
            this.displayResult(result, playerChoice, aiChoice);
            this.updateStats();
            this.setButtonsEnabled(true);
        }, 1500);
    }
    
    getAIChoice() {
        // Advanced AI strategy that learns from player patterns
        if (this.playerHistory.length < 3) {
            // Not enough data, use weighted random
            return this.getWeightedRandomChoice();
        }
        
        // Analyze player patterns
        const prediction = this.predictPlayerChoice();
        
        // Counter the predicted choice
        return this.getCounterChoice(prediction);
    }
    
    predictPlayerChoice() {
        const recentHistory = this.playerHistory.slice(-10); // Last 10 moves
        
        // Pattern analysis
        const patterns = this.analyzePatterns(recentHistory);
        
        // Frequency analysis
        const frequency = this.analyzeFrequency(recentHistory);
        
        // Anti-pattern analysis (what player avoids)
        const antiPattern = this.analyzeAntiPattern(recentHistory);
        
        // Combine strategies with weights
        const strategies = [
            { choice: patterns, weight: 0.4 },
            { choice: frequency, weight: 0.3 },
            { choice: antiPattern, weight: 0.3 }
        ];
        
        return this.selectFromStrategies(strategies);
    }
    
    analyzePatterns(history) {
        if (history.length < 3) return this.getRandomChoice();
        
        // Look for sequences of 2-3 moves
        const lastTwo = history.slice(-2).join('');
        const lastThree = history.slice(-3).join('');
        
        // Check if these patterns appeared before
        for (let i = 0; i < history.length - 2; i++) {
            const seq2 = history.slice(i, i + 2).join('');
            const seq3 = history.slice(i, i + 3).join('');
            
            if (seq2 === lastTwo && i + 3 < history.length) {
                return history[i + 2]; // Predict next in pattern
            }
            if (seq3 === lastThree && i + 4 < history.length) {
                return history[i + 3]; // Predict next in longer pattern
            }
        }
        
        return this.getRandomChoice();
    }
    
    analyzeFrequency(history) {
        const counts = { rock: 0, paper: 0, scissors: 0 };
        history.forEach(choice => counts[choice]++);
        
        // Find most frequent choice
        const maxCount = Math.max(...Object.values(counts));
        const mostFrequent = Object.keys(counts).find(key => counts[key] === maxCount);
        
        return mostFrequent;
    }
    
    analyzeAntiPattern(history) {
        const counts = { rock: 0, paper: 0, scissors: 0 };
        history.forEach(choice => counts[choice]++);
        
        // Find least frequent choice (player might switch to it)
        const minCount = Math.min(...Object.values(counts));
        const leastFrequent = Object.keys(counts).find(key => counts[key] === minCount);
        
        return leastFrequent;
    }
    
    selectFromStrategies(strategies) {
        // Weight the strategies and pick one
        const totalWeight = strategies.reduce((sum, s) => sum + s.weight, 0);
        const random = Math.random() * totalWeight;
        
        let currentWeight = 0;
        for (const strategy of strategies) {
            currentWeight += strategy.weight;
            if (random <= currentWeight) {
                return strategy.choice;
            }
        }
        
        return this.getRandomChoice();
    }
    
    getCounterChoice(predictedChoice) {
        const counters = {
            rock: 'paper',
            paper: 'scissors',
            scissors: 'rock'
        };
        
        // Add some randomness to avoid being too predictable
        if (Math.random() < 0.2) {
            return this.getRandomChoice();
        }
        
        return counters[predictedChoice] || this.getRandomChoice();
    }
    
    getWeightedRandomChoice() {
        // Slightly favor paper (counters rock, which beginners often choose)
        const weights = { rock: 0.3, paper: 0.4, scissors: 0.3 };
        const random = Math.random();
        
        if (random < weights.rock) return 'rock';
        if (random < weights.rock + weights.paper) return 'paper';
        return 'scissors';
    }
    
    getRandomChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }
    
    determineWinner(playerChoice, aiChoice) {
        if (playerChoice === aiChoice) return 'tie';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === aiChoice ? 'win' : 'lose';
    }
    
    animateChoices(playerChoice, aiChoice) {
        const playerChoiceEl = document.getElementById('playerChoice');
        const aiChoiceEl = document.getElementById('aiChoice');
        
        // Reset displays
        playerChoiceEl.querySelector('.choice-emoji').textContent = this.emojis.unknown;
        aiChoiceEl.querySelector('.choice-emoji').textContent = this.emojis.unknown;
        
        // Add loading animation
        playerChoiceEl.classList.add('active');
        aiChoiceEl.classList.add('active');
        
        // Reveal choices after delay
        setTimeout(() => {
            playerChoiceEl.querySelector('.choice-emoji').textContent = this.emojis[playerChoice];
            aiChoiceEl.querySelector('.choice-emoji').textContent = this.emojis[aiChoice];
            
            playerChoiceEl.classList.remove('active');
            aiChoiceEl.classList.remove('active');
            playerChoiceEl.classList.add('animate');
            aiChoiceEl.classList.add('animate');
            
            setTimeout(() => {
                playerChoiceEl.classList.remove('animate');
                aiChoiceEl.classList.remove('animate');
            }, 600);
        }, 1000);
    }
    
    updateScores(result) {
        if (result === 'win') {
            this.playerScore++;
        } else if (result === 'lose') {
            this.aiScore++;
        }
        this.gamesPlayed++;
    }
    
    displayResult(result, playerChoice, aiChoice) {
        const resultDisplay = document.getElementById('resultDisplay');
        const resultText = resultDisplay.querySelector('.result-text');
        
        let message = '';
        let className = '';
        
        switch (result) {
            case 'win':
                message = `You win! ${this.emojis[playerChoice]} beats ${this.emojis[aiChoice]}`;
                className = 'win';
                break;
            case 'lose':
                message = `AI wins! ${this.emojis[aiChoice]} beats ${this.emojis[playerChoice]}`;
                className = 'lose';
                break;
            case 'tie':
                message = `It's a tie! Both chose ${this.emojis[playerChoice]}`;
                className = 'tie';
                break;
        }
        
        resultText.textContent = message;
        resultText.className = `result-text ${className}`;
        
        // Add celebration animation for wins
        if (result === 'win') {
            document.getElementById('playerChoice').classList.add('winner');
            setTimeout(() => {
                document.getElementById('playerChoice').classList.remove('winner');
            }, 1000);
        } else if (result === 'lose') {
            document.getElementById('playerChoice').classList.add('shake');
            setTimeout(() => {
                document.getElementById('playerChoice').classList.remove('shake');
            }, 500);
        }
    }
    
    updateStats() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('aiScore').textContent = this.aiScore;
        document.getElementById('gamesPlayed').textContent = this.gamesPlayed;
        
        const winRate = this.gamesPlayed > 0 ? 
            Math.round((this.playerScore / this.gamesPlayed) * 100) : 0;
        document.getElementById('winRate').textContent = `${winRate}%`;
    }
    
    updateDisplay() {
        this.updateStats();
        
        // Reset choice displays
        document.getElementById('playerChoice').querySelector('.choice-emoji').textContent = this.emojis.unknown;
        document.getElementById('aiChoice').querySelector('.choice-emoji').textContent = this.emojis.unknown;
        
        // Reset result display
        const resultText = document.querySelector('.result-text');
        resultText.textContent = 'Make your choice!';
        resultText.className = 'result-text';
    }
    
    setButtonsEnabled(enabled) {
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.6';
            btn.style.pointerEvents = enabled ? 'auto' : 'none';
        });
    }
    
    resetGame() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.gamesPlayed = 0;
        this.playerHistory = [];
        this.patterns.clear();
        
        this.updateDisplay();
        
        // Add reset animation
        const container = document.querySelector('.container');
        container.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnbeatableRPS();
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    
    const operationCheckboxes = document.querySelectorAll('input[name="operation"]');
    const difficultySlider = document.getElementById('difficulty');
    const difficultyName = document.getElementById('difficulty-name');
    const timeAttackToggle = document.getElementById('time-attack');
    
    const startGameBtn = document.getElementById('start-game-btn');
    const endGameBtn = document.getElementById('end-game-btn');
    const retryBtn = document.getElementById('retry-btn');
    const homeBtn = document.getElementById('home-btn');
    
    const currentScoreDisplay = document.getElementById('current-score');
    const timeDisplay = document.getElementById('time-display');
    const levelDisplay = document.getElementById('level-display');
    const progressBar = document.getElementById('progress-bar');
    
    const equation = document.getElementById('equation');
    const num1Display = document.getElementById('num1');
    const operationSymbol = document.getElementById('operation-symbol');
    const num2Display = document.getElementById('num2');
    const resultDisplay = document.getElementById('result');
    
    const answerInput = document.getElementById('answer-input');
    const submitAnswer = document.getElementById('submit-answer');
    const feedbackContainer = document.getElementById('feedback-container');
    
    const correctCountDisplay = document.getElementById('correct-count');
    const incorrectCountDisplay = document.getElementById('incorrect-count');
    const accuracyDisplay = document.getElementById('accuracy');
    const avgTimeDisplay = document.getElementById('avg-time');
    
    const finalScoreDisplay = document.getElementById('final-score');
    const equationsSolvedDisplay = document.getElementById('equations-solved');
    const finalAccuracyDisplay = document.getElementById('final-accuracy');
    const finalLevelDisplay = document.getElementById('final-level');
    const performanceGraph = document.getElementById('performance-graph');
    
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    const highScoreTable = document.getElementById('high-score-table');
    
    // Game state
    let gameState = {
        score: 0,
        level: 1,
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalAnswers: 0,
        timeAttack: false,
        operations: ['addition', 'subtraction'],
        difficulty: 2,
        difficultyNames: ['Novice', 'Standard', 'Advanced', 'Expert', 'Neural Master'],
        currentEquation: null,
        startTime: null,
        gameTime: 0,
        timeLimit: 60, // for time attack mode
        answersToNextLevel: 5,
        answerTimes: [],
        gameInterval: null,
        equationStartTime: 0,
        performanceData: [],
        isGameActive: false
    };
    
    // Initialize the game
    function init() {
        // Load high scores from local storage
        loadHighScores();
        
        // Set up event listeners
        startGameBtn.addEventListener('click', startGame);
        endGameBtn.addEventListener('click', endGame);
        retryBtn.addEventListener('click', resetGame);
        homeBtn.addEventListener('click', goHome);
        submitAnswer.addEventListener('click', checkAnswer);
        notificationClose.addEventListener('click', hideNotification);
        
        // Allow pressing Enter to submit answer
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
        
        // Update difficulty name when slider changes
        difficultySlider.addEventListener('input', updateDifficultyName);
        
        // Initial update of difficulty name
        updateDifficultyName();
    }
    
    // Update the displayed difficulty name based on slider value
    function updateDifficultyName() {
        const value = parseInt(difficultySlider.value);
        difficultyName.textContent = gameState.difficultyNames[value - 1];
    }
    
    // Load high scores from local storage
    function loadHighScores() {
        const highScores = [];
        
        for (let i = 1; i <= 5; i++) {
            const score = localStorage.getItem(`cyberArithmetic_highscore_${i}`) || 0;
            const accuracy = localStorage.getItem(`cyberArithmetic_accuracy_${i}`) || 0;
            highScores.push({ difficulty: i, score, accuracy });
        }
        
        // Clear existing table rows
        highScoreTable.innerHTML = '';
        
        // Add high scores to table
        highScores.forEach(score => {
            const row = document.createElement('tr');
            
            const difficultyCell = document.createElement('td');
            difficultyCell.textContent = gameState.difficultyNames[score.difficulty - 1];
            
            const scoreCell = document.createElement('td');
            scoreCell.textContent = score.score;
            
            const accuracyCell = document.createElement('td');
            accuracyCell.textContent = `${score.accuracy}%`;
            
            row.appendChild(difficultyCell);
            row.appendChild(scoreCell);
            row.appendChild(accuracyCell);
            
            highScoreTable.appendChild(row);
        });
    }
    
    // Start the game
    function startGame() {
        // Get selected operations
        const selectedOperations = [];
        operationCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedOperations.push(checkbox.value);
            }
        });
        
        // Validate at least one operation is selected
        if (selectedOperations.length === 0) {
            showNotification('Please select at least one operation type');
            return;
        }
        
        // Set game state
        gameState.operations = selectedOperations;
        gameState.difficulty = parseInt(difficultySlider.value);
        gameState.timeAttack = timeAttackToggle.checked;
        gameState.score = 0;
        gameState.level = 1;
        gameState.correctAnswers = 0;
        gameState.incorrectAnswers = 0;
        gameState.totalAnswers = 0;
        gameState.startTime = Date.now();
        gameState.answerTimes = [];
        gameState.performanceData = [];
        gameState.timeLimit = 60;
        gameState.isGameActive = true;
        
        // Set answersToNextLevel based on difficulty
        gameState.answersToNextLevel = 6 - gameState.difficulty; // 5, 4, 3, 2, 1
        
        // Update UI
        updateScoreDisplay();
        updateProgressBar();
        
        // Hide start screen and show game screen
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Focus on answer input
        answerInput.focus();
        
        // Generate first equation
        generateEquation();
        
        // Start timer
        startTimer();
    }
    
    // Start the game timer
    function startTimer() {
        if (gameState.gameInterval) {
            clearInterval(gameState.gameInterval);
        }
        
        gameState.gameInterval = setInterval(() => {
            // Update game time
            gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
            
            // Format and display time
            const minutes = Math.floor(gameState.gameTime / 60);
            const seconds = gameState.gameTime % 60;
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // For time attack mode, update progress bar and check if time's up
            if (gameState.timeAttack) {
                const remaining = Math.max(0, gameState.timeLimit - gameState.gameTime);
                const percent = (remaining / gameState.timeLimit) * 100;
                progressBar.style.width = `${percent}%`;
                
                if (remaining === 0) {
                    endGame();
                }
            }
        }, 1000);
    }
    
    // Generate a new equation based on selected operations and difficulty
    function generateEquation() {
        // Pick a random operation from selected ones
        const operation = gameState.operations[Math.floor(Math.random() * gameState.operations.length)];
        
        // Set operation symbol
        switch (operation) {
            case 'addition':
                operationSymbol.textContent = '+';
                break;
            case 'subtraction':
                operationSymbol.textContent = '-';
                break;
            case 'multiplication':
                operationSymbol.textContent = '×';
                break;
            case 'division':
                operationSymbol.textContent = '÷';
                break;
        }
        
        // Generate numbers based on difficulty and operation
        let num1, num2, result;
        
        switch (operation) {
            case 'addition':
                // Difficulty affects the range of numbers
                const maxAdd = 10 * Math.pow(10, gameState.difficulty - 1);
                num1 = Math.floor(Math.random() * maxAdd);
                num2 = Math.floor(Math.random() * maxAdd);
                result = num1 + num2;
                break;
                
            case 'subtraction':
                // Ensure result is positive
                const maxSub = 10 * Math.pow(10, gameState.difficulty - 1);
                num1 = Math.floor(Math.random() * maxSub);
                num2 = Math.floor(Math.random() * (num1 + 1)); // Ensure num2 <= num1
                result = num1 - num2;
                break;
                
            case 'multiplication':
                // Adjust difficulty by limiting factors
                const factor1Max = Math.pow(10, Math.ceil(gameState.difficulty / 2));
                const factor2Max = Math.pow(10, Math.floor(gameState.difficulty / 2));
                num1 = Math.floor(Math.random() * factor1Max);
                num2 = Math.floor(Math.random() * factor2Max);
                result = num1 * num2;
                break;
                
            case 'division':
                // Create clean division problems
                result = Math.floor(Math.random() * 12) + 1; // Result between 1-12
                num2 = Math.floor(Math.random() * 12) + 1; // Divisor between 1-12
                num1 = result * num2; // Dividend ensures clean division
                break;
        }
        
        // Update equation display
        num1Display.textContent = num1;
        num2Display.textContent = num2;
        resultDisplay.textContent = '?';
        
        // Store current equation for checking answers
        gameState.currentEquation = {
            num1,
            num2,
            operation,
            result
        };
        
        // Clear answer input
        answerInput.value = '';
        answerInput.focus();
        
        // Record start time for this equation
        gameState.equationStartTime = Date.now();
    }
    
    // Check the submitted answer
    function checkAnswer() {
        // Don't process if no game is active
        if (!gameState.isGameActive) return;
        
        const userAnswer = parseInt(answerInput.value);
        
        // Check if answer is a number
        if (isNaN(userAnswer)) {
            showFeedback('Please enter a number', 'incorrect');
            return;
        }
        
        // Calculate time taken to answer this equation
        const timeTaken = (Date.now() - gameState.equationStartTime) / 1000;
        gameState.answerTimes.push(timeTaken);
        
        // Check if answer is correct
        const isCorrect = userAnswer === gameState.currentEquation.result;
        
        // Update stats
        gameState.totalAnswers++;
        
        if (isCorrect) {
            gameState.correctAnswers++;
            
            // Calculate score based on difficulty, time, and level
            const timeBonus = Math.max(0, 10 - Math.floor(timeTaken));
            const points = (gameState.difficulty * 10) + timeBonus + (gameState.level * 5);
            gameState.score += points;
            
            // Record performance data point
            gameState.performanceData.push({
                time: gameState.gameTime,
                correct: true,
                points: points,
                timeTaken: timeTaken
            });
            
            // Show feedback
            showFeedback(`Correct! +${points} points`, 'correct');
        } else {
            gameState.incorrectAnswers++;
            
            // Record performance data point
            gameState.performanceData.push({
                time: gameState.gameTime,
                correct: false,
                points: 0,
                timeTaken: timeTaken
            });
            
            // Show feedback
            showFeedback(`Incorrect. The answer is ${gameState.currentEquation.result}`, 'incorrect');
        }
        
        // Update UI
        updateScoreDisplay();
        
        // Check if player should level up
        if (gameState.correctAnswers % gameState.answersToNextLevel === 0 && isCorrect) {
            levelUp();
        }
        
        // Generate new equation after a short delay
        setTimeout(() => {
            generateEquation();
        }, 1500);
    }
    
    // Show feedback to the user
    function showFeedback(message, type) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        
        // Clear previous feedback
        feedbackContainer.innerHTML = '';
        
        // Add new feedback
        feedbackContainer.appendChild(feedback);
        
        // Remove after some time
        setTimeout(() => {
            if (feedbackContainer.contains(feedback)) {
                feedbackContainer.removeChild(feedback);
            }
        }, 2000);
    }
    
    // Level up the game
    function levelUp() {
        gameState.level++;
        levelDisplay.textContent = gameState.level;
        
        // Show level up notification
        showNotification(`Level Up! You're now level ${gameState.level}`);
        
        // If in time attack mode, add time to the clock
        if (gameState.timeAttack) {
            gameState.timeLimit += 15; // Add 15 seconds per level
        }
        
        // Update progress bar
        updateProgressBar();
    }
    
    // Update the score display and stats
    function updateScoreDisplay() {
        currentScoreDisplay.textContent = gameState.score;
        correctCountDisplay.textContent = gameState.correctAnswers;
        incorrectCountDisplay.textContent = gameState.incorrectAnswers;
        
        // Calculate and update accuracy
        const accuracy = gameState.totalAnswers > 0 
            ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) 
            : 0;
        accuracyDisplay.textContent = `${accuracy}%`;
        
        // Calculate and update average answer time
        const avgTime = gameState.answerTimes.length > 0 
            ? (gameState.answerTimes.reduce((a, b) => a + b, 0) / gameState.answerTimes.length).toFixed(1)
            : '0.0';
        avgTimeDisplay.textContent = `${avgTime}s`;
    }
    
    // Update the progress bar
    function updateProgressBar() {
        if (!gameState.timeAttack) {
            // In normal mode, progress bar shows progress to next level
            const progress = gameState.correctAnswers % gameState.answersToNextLevel;
            const percent = (progress / gameState.answersToNextLevel) * 100;
            progressBar.style.width = `${percent}%`;
        }
    }
    
    // End the game
    function endGame() {
        // Stop the timer
        clearInterval(gameState.gameInterval);
        gameState.isGameActive = false;
        
        // Save high score if applicable
        const difficulty = gameState.difficulty;
        const currentScore = gameState.score;
        const currentAccuracy = gameState.totalAnswers > 0 
            ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100)
            : 0;
        
        const savedScore = localStorage.getItem(`cyberArithmetic_highscore_${difficulty}`) || 0;
        
        if (currentScore > savedScore) {
            localStorage.setItem(`cyberArithmetic_highscore_${difficulty}`, currentScore);
            localStorage.setItem(`cyberArithmetic_accuracy_${difficulty}`, currentAccuracy);
            showNotification('New high score!');
        }
        
        // Update results screen
        finalScoreDisplay.textContent = gameState.score;
        equationsSolvedDisplay.textContent = gameState.totalAnswers;
        finalAccuracyDisplay.textContent = `${currentAccuracy}%`;
        finalLevelDisplay.textContent = gameState.level;
        
        // Generate performance graph
        generatePerformanceGraph();
        
        // Show game over screen
        gameScreen.classList.remove('active');
        gameoverScreen.classList.add('active');
        
        // Reload high scores for the display
        loadHighScores();
    }
    
    // Generate the performance graph
    function generatePerformanceGraph() {
        // Clear previous graph
        performanceGraph.innerHTML = '';
        
        // If no data, show empty graph
        if (gameState.performanceData.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-graph-message';
            emptyMessage.textContent = 'No performance data available';
            performanceGraph.appendChild(emptyMessage);
            return;
        }
        
        // Create bar chart
        const barChart = document.createElement('div');
        barChart.className = 'bar-chart';
        
        // Get data for chart (we'll display up to 10 recent answers)
        const displayData = gameState.performanceData.slice(-10);
        
        // Find max points for scaling
        const maxPoints = Math.max(...displayData.map(d => d.points), 10);
        
        // Create bars
        displayData.forEach(dataPoint => {
            const bar = document.createElement('div');
            bar.className = `bar ${dataPoint.correct ? 'correct' : 'incorrect'}`;
            
            const heightPercent = dataPoint.points / maxPoints * 100;
            bar.style.height = `${heightPercent}%`;
            bar.dataset.value = dataPoint.points;
            
            barChart.appendChild(bar);
        });
        
        performanceGraph.appendChild(barChart);
    }
    
    // Reset game to play again
    function resetGame() {
        gameoverScreen.classList.remove('active');
        startScreen.classList.add('active');
    }
    
    // Go back to home screen
    function goHome() {
        resetGame();
    }
    
    // Show notification
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after a delay
        setTimeout(() => {
            hideNotification();
        }, 3000);
    }
    
    // Hide notification
    function hideNotification() {
        notification.classList.remove('show');
    }
    
    // Initialize the game
    init();
}); 
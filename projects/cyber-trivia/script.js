console.log("CyberTrivia script loaded.");
// Future JavaScript for trivia game logic 

document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const feedbackScreen = document.getElementById('feedback-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const startBtn = document.getElementById('start-btn');
    const answersContainer = document.getElementById('answers-container');
    const questionText = document.getElementById('question-text');
    const timerBar = document.getElementById('timer-bar');
    
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const currentQuestionDisplay = document.getElementById('current-question');
    const totalQuestionsDisplay = document.getElementById('total-questions');
    
    const feedbackCorrect = document.getElementById('feedback-correct');
    const feedbackWrong = document.getElementById('feedback-wrong');
    const correctAnswer = document.getElementById('correct-answer');
    const correctAnswerText = document.getElementById('correct-answer-text');
    const nextCountdown = document.getElementById('next-countdown');
    
    const finalScoreDisplay = document.getElementById('final-score');
    const correctCountDisplay = document.getElementById('correct-count');
    const questionCountDisplay = document.getElementById('question-count');
    const accuracyDisplay = document.getElementById('accuracy');
    const resultsMessage = document.getElementById('results-message');
    
    const playAgainBtn = document.getElementById('play-again-btn');
    const returnHomeBtn = document.getElementById('return-home-btn');
    
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    // Game state
    let gameState = {
        score: 0,
        highScore: localStorage.getItem('cyberTriviaHighScore') || 0,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        questions: [],
        selectedCategories: [],
        difficulty: 'easy',
        timerDuration: 20, // seconds
        timerInterval: null
    };
    
    // Initialize the game
    function init() {
        // Set high score from local storage
        highScoreDisplay.textContent = gameState.highScore;
        
        // Event listeners
        startBtn.addEventListener('click', startGame);
        playAgainBtn.addEventListener('click', resetGame);
        returnHomeBtn.addEventListener('click', returnToHome);
        notificationClose.addEventListener('click', hideNotification);
        
        // Load questions
        loadQuestions();
    }
    
    // Load questions
    function loadQuestions() {
        // In a real app, you might fetch these from an API
        // For now, we'll use local data
        
        // Sample questions database
        const triviaQuestions = {
            tech: [
                {
                    question: "What does CPU stand for?",
                    answers: [
                        "Central Processing Unit", 
                        "Computer Personal Unit", 
                        "Central Processor Unifier", 
                        "Central Process Utility"
                    ],
                    correctIndex: 0,
                    difficulty: "easy"
                },
                {
                    question: "What year was the first iPhone released?",
                    answers: ["2005", "2007", "2010", "2012"],
                    correctIndex: 1,
                    difficulty: "easy"
                },
                {
                    question: "Which company developed the programming language 'Swift'?",
                    answers: ["Google", "Microsoft", "Apple", "Facebook"],
                    correctIndex: 2,
                    difficulty: "medium"
                },
                {
                    question: "Which of these is not a programming language?",
                    answers: ["Java", "Python", "Cougar", "Ruby"],
                    correctIndex: 2,
                    difficulty: "medium"
                },
                {
                    question: "What is the name of the world's first programmable, electronic, digital computer?",
                    answers: ["Colossus", "ENIAC", "UNIVAC", "EDVAC"],
                    correctIndex: 0,
                    difficulty: "hard"
                },
                {
                    question: "What was the first web browser with a graphical user interface?",
                    answers: ["Netscape Navigator", "Internet Explorer", "NCSA Mosaic", "Opera"],
                    correctIndex: 2,
                    difficulty: "hard"
                }
            ],
            "sci-fi": [
                {
                    question: "In the movie 'The Matrix', what color pill does Neo take?",
                    answers: ["Blue", "Red", "Green", "Yellow"],
                    correctIndex: 1,
                    difficulty: "easy"
                },
                {
                    question: "Who is the author of 'Neuromancer', a pioneering cyberpunk novel?",
                    answers: ["Philip K. Dick", "Isaac Asimov", "William Gibson", "Bruce Sterling"],
                    correctIndex: 2,
                    difficulty: "easy"
                },
                {
                    question: "What does the term 'cyberpunk' describe?",
                    answers: [
                        "High-tech, low-life science fiction", 
                        "Retro-futuristic technology", 
                        "Modern punk music with electronic elements", 
                        "Digital art with punk aesthetics"
                    ],
                    correctIndex: 0,
                    difficulty: "medium"
                },
                {
                    question: "In 'Blade Runner', what are the artificial beings called?",
                    answers: ["Cylons", "Replicants", "Androids", "Synthetics"],
                    correctIndex: 1,
                    difficulty: "medium"
                },
                {
                    question: "Who wrote the short story 'Do Androids Dream of Electric Sheep?' that inspired 'Blade Runner'?",
                    answers: ["Philip K. Dick", "Arthur C. Clarke", "Isaac Asimov", "Frank Herbert"],
                    correctIndex: 0,
                    difficulty: "hard"
                },
                {
                    question: "What is the name of the fictional internet/virtual reality in William Gibson's 'Neuromancer'?",
                    answers: ["The Grid", "The Net", "The Matrix", "The Cyberspace"],
                    correctIndex: 2,
                    difficulty: "hard"
                }
            ],
            gaming: [
                {
                    question: "Which game features a character named 'Kratos'?",
                    answers: ["Halo", "God of War", "Gears of War", "Call of Duty"],
                    correctIndex: 1,
                    difficulty: "easy"
                },
                {
                    question: "Which company makes the 'PlayStation' console?",
                    answers: ["Microsoft", "Nintendo", "Sony", "Sega"],
                    correctIndex: 2,
                    difficulty: "easy"
                },
                {
                    question: "In 'Cyberpunk 2077', what is the name of the protagonist?",
                    answers: ["Morgan", "V", "John", "Alex"],
                    correctIndex: 1,
                    difficulty: "medium"
                },
                {
                    question: "Which of these is not a faction in 'Fallout: New Vegas'?",
                    answers: ["NCR", "Legion", "Brotherhood of Steel", "The Institute"],
                    correctIndex: 3,
                    difficulty: "medium"
                },
                {
                    question: "Which game developer is known for the 'Deus Ex' series?",
                    answers: ["Ion Storm", "BioWare", "Bethesda", "CD Projekt Red"],
                    correctIndex: 0,
                    difficulty: "hard"
                },
                {
                    question: "Which year was the original 'System Shock' released?",
                    answers: ["1991", "1994", "1997", "2000"],
                    correctIndex: 1,
                    difficulty: "hard"
                }
            ],
            cybersecurity: [
                {
                    question: "What is the term for a malicious software that encrypts your files and demands payment?",
                    answers: ["Virus", "Worm", "Ransomware", "Trojan"],
                    correctIndex: 2,
                    difficulty: "easy"
                },
                {
                    question: "What does VPN stand for?",
                    answers: [
                        "Virtual Private Network", 
                        "Visual Processing Node", 
                        "Virtual Protocol Navigator", 
                        "Verified Personal Network"
                    ],
                    correctIndex: 0,
                    difficulty: "easy"
                },
                {
                    question: "What is 'phishing'?",
                    answers: [
                        "A type of computer virus", 
                        "Breaking into secure systems", 
                        "Attempting to acquire sensitive information by masquerading as a trustworthy entity", 
                        "A method to encrypt data"
                    ],
                    correctIndex: 2,
                    difficulty: "medium"
                },
                {
                    question: "What type of attack overwhelms a server with traffic?",
                    answers: ["SQL Injection", "DDoS", "Cross-site Scripting", "Man-in-the-middle"],
                    correctIndex: 1,
                    difficulty: "medium"
                },
                {
                    question: "Which of these is a common password-cracking technique that uses a list of words?",
                    answers: ["Dictionary attack", "Brute force attack", "Rainbow table attack", "Zero-day attack"],
                    correctIndex: 0,
                    difficulty: "hard"
                },
                {
                    question: "What does 'SSL' stand for in HTTPS?",
                    answers: [
                        "Secure Socket Layer", 
                        "System Security Lock", 
                        "Safe Server Login", 
                        "Synchronized Security Link"
                    ],
                    correctIndex: 0,
                    difficulty: "hard"
                }
            ]
        };
        
        gameState.allQuestions = triviaQuestions;
        console.log("Questions loaded");
    }
    
    // Start the game
    function startGame() {
        // Get selected categories
        const categoryCheckboxes = document.querySelectorAll('.category-options input[type="checkbox"]:checked');
        if (categoryCheckboxes.length === 0) {
            showNotification("Please select at least one category");
            return;
        }
        
        gameState.selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
        
        // Get selected difficulty
        const difficultyRadio = document.querySelector('.difficulty-options input[name="difficulty"]:checked');
        gameState.difficulty = difficultyRadio.value;
        
        // Set timer duration based on difficulty
        switch (gameState.difficulty) {
            case 'easy':
                gameState.timerDuration = 20;
                break;
            case 'medium':
                gameState.timerDuration = 15;
                break;
            case 'hard':
                gameState.timerDuration = 10;
                break;
        }
        
        // Prepare questions
        prepareQuestions();
        
        // Update total questions display
        totalQuestionsDisplay.textContent = gameState.questions.length;
        
        // Hide start screen and show question screen
        showScreen(questionScreen);
        
        // Start with first question
        loadQuestion(0);
    }
    
    // Prepare questions based on selected categories and difficulty
    function prepareQuestions() {
        const allSelectedQuestions = [];
        const categories = gameState.selectedCategories;
        const difficulty = gameState.difficulty;
        
        // Get questions for each selected category
        categories.forEach(category => {
            const categoryQuestions = gameState.allQuestions[category].filter(q => {
                // For easy difficulty, include easy questions
                // For medium difficulty, include easy and medium questions
                // For hard difficulty, include all questions
                if (difficulty === 'easy') return q.difficulty === 'easy';
                if (difficulty === 'medium') return q.difficulty === 'easy' || q.difficulty === 'medium';
                return true; // Hard difficulty includes all questions
            });
            
            allSelectedQuestions.push(...categoryQuestions);
        });
        
        // Shuffle questions
        const shuffled = allSelectedQuestions.sort(() => 0.5 - Math.random());
        
        // Take up to 10 questions
        gameState.questions = shuffled.slice(0, 10);
        
        console.log(`Prepared ${gameState.questions.length} questions`);
    }
    
    // Load a question
    function loadQuestion(index) {
        // If we've gone through all questions, show results
        if (index >= gameState.questions.length) {
            showResults();
            return;
        }
        
        // Update current question display
        gameState.currentQuestionIndex = index;
        currentQuestionDisplay.textContent = index + 1;
        
        // Get the question
        const question = gameState.questions[index];
        
        // Set question text
        questionText.textContent = question.question;
        
        // Clear previous answers
        answersContainer.innerHTML = '';
        
        // Add answer buttons
        question.answers.forEach((answer, i) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.dataset.index = i;
            button.addEventListener('click', () => checkAnswer(i));
            answersContainer.appendChild(button);
        });
        
        // Start the timer
        startTimer();
    }
    
    // Start timer for the current question
    function startTimer() {
        // Reset timer bar
        timerBar.style.width = '100%';
        
        // Clear any existing timer
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        
        // Get start time
        const startTime = Date.now();
        const duration = gameState.timerDuration * 1000; // in milliseconds
        
        // Set interval to update timer
        gameState.timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const percent = (remaining / duration) * 100;
            
            // Update timer bar
            timerBar.style.width = `${percent}%`;
            
            // If time's up, move to next question
            if (remaining === 0) {
                clearInterval(gameState.timerInterval);
                // Show feedback that time's up and answer was incorrect
                showFeedback(false);
            }
        }, 50); // Update every 50ms for smooth animation
    }
    
    // Check if the answer is correct
    function checkAnswer(selectedIndex) {
        // Clear timer
        clearInterval(gameState.timerInterval);
        
        // Get the current question
        const question = gameState.questions[gameState.currentQuestionIndex];
        
        // Check if the answer is correct
        const isCorrect = selectedIndex === question.correctIndex;
        
        // If correct, update score
        if (isCorrect) {
            // Calculate score based on remaining time (if any)
            const remainingTimePercent = parseFloat(timerBar.style.width) || 0;
            const timeBonus = Math.floor((remainingTimePercent / 100) * 50); // up to 50 points for quick answers
            const points = 50 + timeBonus; // Base 50 points plus time bonus
            
            gameState.score += points;
            gameState.correctAnswers++;
            scoreDisplay.textContent = gameState.score;
        }
        
        // Show feedback
        showFeedback(isCorrect);
    }
    
    // Show feedback after answering
    function showFeedback(isCorrect) {
        // Hide question screen and show feedback screen
        showScreen(feedbackScreen);
        
        // Show appropriate feedback
        if (isCorrect) {
            feedbackCorrect.style.display = 'block';
            feedbackWrong.style.display = 'none';
            correctAnswerText.textContent = "Good job!";
        } else {
            feedbackCorrect.style.display = 'none';
            feedbackWrong.style.display = 'block';
            
            // Show the correct answer
            const question = gameState.questions[gameState.currentQuestionIndex];
            correctAnswer.textContent = question.answers[question.correctIndex];
        }
        
        // Set countdown for next question
        let countdown = 3;
        nextCountdown.textContent = countdown;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            nextCountdown.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                // Load next question
                loadQuestion(gameState.currentQuestionIndex + 1);
                showScreen(questionScreen);
            }
        }, 1000);
    }
    
    // Show results screen
    function showResults() {
        // Update high score if needed
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('cyberTriviaHighScore', gameState.score);
            highScoreDisplay.textContent = gameState.highScore;
            showNotification("New high score achieved!");
        }
        
        // Update results display
        finalScoreDisplay.textContent = gameState.score;
        correctCountDisplay.textContent = gameState.correctAnswers;
        questionCountDisplay.textContent = gameState.questions.length;
        
        // Calculate accuracy
        const accuracy = (gameState.correctAnswers / gameState.questions.length) * 100;
        accuracyDisplay.textContent = `${Math.round(accuracy)}%`;
        
        // Set results message based on score
        let message;
        const maxPossibleScore = gameState.questions.length * 100; // 100 points max per question
        const percentage = (gameState.score / maxPossibleScore) * 100;
        
        if (percentage >= 90) {
            message = "Legendary! You're a true cyberpunk trivia master!";
        } else if (percentage >= 70) {
            message = "Impressive! You know your way around the digital realm.";
        } else if (percentage >= 50) {
            message = "Good job! You've got decent knowledge of tech and sci-fi.";
        } else if (percentage >= 30) {
            message = "Not bad, but there's room for improvement.";
        } else {
            message = "Looks like you need to upgrade your knowledge database.";
        }
        
        resultsMessage.textContent = message;
        
        // Show results screen
        showScreen(resultsScreen);
    }
    
    // Reset game to play again
    function resetGame() {
        // Reset game state
        gameState.score = 0;
        gameState.currentQuestionIndex = 0;
        gameState.correctAnswers = 0;
        
        // Update displays
        scoreDisplay.textContent = gameState.score;
        
        // Show start screen
        showScreen(startScreen);
    }
    
    // Return to home/start screen
    function returnToHome() {
        resetGame();
    }
    
    // Show a specific screen and hide others
    function showScreen(screen) {
        // Hide all screens
        startScreen.classList.remove('active');
        questionScreen.classList.remove('active');
        feedbackScreen.classList.remove('active');
        resultsScreen.classList.remove('active');
        
        // Show the specified screen
        screen.classList.add('active');
    }
    
    // Show notification
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        setTimeout(hideNotification, 3000);
    }
    
    // Hide notification
    function hideNotification() {
        notification.classList.remove('show');
    }
    
    // Initialize the game
    init();
}); 
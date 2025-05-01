document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const readingScreen = document.getElementById('reading-screen');
    const questionsScreen = document.getElementById('questions-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const startBtn = document.getElementById('start-btn');
    const finishedReadingBtn = document.getElementById('finished-reading-btn');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitAnswersBtn = document.getElementById('submit-answers-btn');
    const newPassageBtn = document.getElementById('new-passage-btn');
    const homeBtn = document.getElementById('home-btn');
    
    const passageTitle = document.getElementById('passage-title');
    const passageText = document.getElementById('passage-text');
    const timerBar = document.getElementById('timer-bar');
    
    const currentQuestionDisplay = document.getElementById('current-question');
    const totalQuestionsDisplay = document.getElementById('total-questions');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    // App state
    let state = {
        difficulty: 'easy',
        genre: 'cyberpunk',
        currentPassage: null,
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: null,
        endTime: null,
        timerInterval: null
    };
    
    // Sample data for testing
    const samplePassages = {
        cyberpunk: {
            easy: {
                title: "Neon Dreams",
                text: "The neon lights of Neo-Tokyo flickered across the rain-slicked streets. Hiro made his way through the crowded market, his augmented vision highlighting potential threats in red. He was looking for a specific vendor, one who sold rare neural implants off the grid. The corporate enforcers were everywhere tonight, their faceless helmets scanning the crowd. Hiro kept his head down, hand hovering near the concealed pulse pistol in his jacket. The information he carried in his encrypted brain chip was worth more than his life to at least three megacorporations. He just needed to make the exchange and disappear into the digital underground before they found him.",
                questions: [
                    {
                        text: "What was Hiro looking for in the market?",
                        options: [
                            "Food and supplies",
                            "A rare neural implant vendor",
                            "Corporate enforcers",
                            "A way to escape the city"
                        ],
                        correctAnswer: 1
                    },
                    {
                        text: "What was valuable that Hiro possessed?",
                        options: [
                            "A pulse pistol",
                            "Augmented vision technology",
                            "Information in his brain chip",
                            "Neural implants"
                        ],
                        correctAnswer: 2
                    },
                    {
                        text: "How many megacorporations valued the information Hiro carried?",
                        options: [
                            "One",
                            "Two",
                            "Three",
                            "Four"
                        ],
                        correctAnswer: 2
                    }
                ]
            }
        }
    };
    
    // Event listeners
    startBtn.addEventListener('click', startChallenge);
    finishedReadingBtn.addEventListener('click', showQuestions);
    prevQuestionBtn.addEventListener('click', showPreviousQuestion);
    nextQuestionBtn.addEventListener('click', showNextQuestion);
    submitAnswersBtn.addEventListener('click', submitAnswers);
    newPassageBtn.addEventListener('click', resetChallenge);
    homeBtn.addEventListener('click', goToHome);
    notificationClose.addEventListener('click', hideNotification);
    
    // Function to start the challenge
    function startChallenge() {
        // Get selected difficulty and genre
        const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
        difficultyOptions.forEach(option => {
            if (option.checked) {
                state.difficulty = option.value;
            }
        });
        
        const genreOptions = document.querySelectorAll('input[name="genre"]');
        genreOptions.forEach(option => {
            if (option.checked) {
                state.genre = option.value;
            }
        });
        
        // Load passage based on selections
        loadPassage();
        
        // Show reading screen
        showScreen(readingScreen);
        
        // Start timer
        startTimer();
    }
    
    // Function to load a passage
    function loadPassage() {
        // Try to get a passage from our sample data
        if (samplePassages[state.genre] && 
            samplePassages[state.genre][state.difficulty]) {
            state.currentPassage = samplePassages[state.genre][state.difficulty];
            
            // Set passage title and text
            passageTitle.textContent = state.currentPassage.title;
            passageText.textContent = state.currentPassage.text;
        } else {
            // Use a default passage if the selected combination isn't available
            showNotification("Selected passage not available. Using default passage.");
            state.currentPassage = samplePassages.cyberpunk.easy;
            passageTitle.textContent = state.currentPassage.title;
            passageText.textContent = state.currentPassage.text;
        }
        
        // Initialize user answers
        state.userAnswers = new Array(state.currentPassage.questions.length).fill(null);
        
        // Update question count display
        totalQuestionsDisplay.textContent = state.currentPassage.questions.length;
    }
    
    // Function to start the timer
    function startTimer() {
        state.startTime = Date.now();
        
        // Visual timer for reading time
        timerBar.style.width = '100%';
        timerBar.style.transition = 'width 120s linear';
        setTimeout(() => {
            timerBar.style.width = '0%';
        }, 10);
    }
    
    // Function to show the questions screen
    function showQuestions() {
        state.currentQuestionIndex = 0;
        updateQuestionDisplay();
        showScreen(questionsScreen);
    }
    
    // Function to update question display
    function updateQuestionDisplay() {
        const currentQuestion = state.currentPassage.questions[state.currentQuestionIndex];
        
        // Update question number
        currentQuestionDisplay.textContent = state.currentQuestionIndex + 1;
        
        // Update question text
        questionText.textContent = currentQuestion.text;
        
        // Clear and create answer options
        answersContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const answerOption = document.createElement('label');
            answerOption.className = 'answer-option';
            if (state.userAnswers[state.currentQuestionIndex] === index) {
                answerOption.classList.add('selected');
            }
            
            answerOption.innerHTML = `
                <input type="radio" name="question-${state.currentQuestionIndex}" value="${index}">
                <span>${option}</span>
            `;
            
            // Add event listener to select answer
            answerOption.addEventListener('click', () => {
                selectAnswer(index);
            });
            
            answersContainer.appendChild(answerOption);
        });
        
        // Update button states
        prevQuestionBtn.disabled = state.currentQuestionIndex === 0;
        nextQuestionBtn.disabled = state.currentQuestionIndex === state.currentPassage.questions.length - 1;
        submitAnswersBtn.disabled = state.userAnswers.includes(null);
    }
    
    // Function to select an answer
    function selectAnswer(index) {
        state.userAnswers[state.currentQuestionIndex] = index;
        
        // Update selected styling
        const options = answersContainer.querySelectorAll('.answer-option');
        options.forEach((option, i) => {
            if (i === index) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Enable submit button if all questions are answered
        submitAnswersBtn.disabled = state.userAnswers.includes(null);
    }
    
    // Function to show the previous question
    function showPreviousQuestion() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            updateQuestionDisplay();
        }
    }
    
    // Function to show the next question
    function showNextQuestion() {
        if (state.currentQuestionIndex < state.currentPassage.questions.length - 1) {
            state.currentQuestionIndex++;
            updateQuestionDisplay();
        }
    }
    
    // Function to submit answers
    function submitAnswers() {
        // Record end time
        state.endTime = Date.now();
        
        // Calculate results
        const results = calculateResults();
        
        // Display results
        displayResults(results);
        
        // Show results screen
        showScreen(resultsScreen);
    }
    
    // Function to calculate results
    function calculateResults() {
        const totalQuestions = state.currentPassage.questions.length;
        let correctCount = 0;
        
        state.userAnswers.forEach((answer, index) => {
            if (answer === state.currentPassage.questions[index].correctAnswer) {
                correctCount++;
            }
        });
        
        const score = Math.round((correctCount / totalQuestions) * 100);
        const timeSpent = Math.round((state.endTime - state.startTime) / 1000);
        
        return {
            score,
            correctCount,
            totalQuestions,
            timeSpent,
            answers: state.userAnswers
        };
    }
    
    // Function to display results
    function displayResults(results) {
        // Update score and stats
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('correct-count').textContent = results.correctCount;
        document.getElementById('question-count').textContent = results.totalQuestions;
        
        // Format time spent
        const minutes = Math.floor(results.timeSpent / 60);
        const seconds = results.timeSpent % 60;
        document.getElementById('time-spent').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Generate feedback
        const feedbackEl = document.getElementById('result-feedback');
        if (results.score >= 80) {
            feedbackEl.textContent = "Excellent work! Your reading comprehension skills are exceptional.";
        } else if (results.score >= 60) {
            feedbackEl.textContent = "Good job! You have a solid understanding of the material.";
        } else {
            feedbackEl.textContent = "Keep practicing. Reading comprehension takes time to develop.";
        }
        
        // Generate question review
        const reviewEl = document.getElementById('question-review');
        reviewEl.innerHTML = '';
        
        state.currentPassage.questions.forEach((question, index) => {
            const userAnswer = results.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${question.text}</div>
                <div class="review-answer ${isCorrect ? 'correct' : 'incorrect'}">
                    Your answer: ${question.options[userAnswer]}
                    ${!isCorrect ? `<br>Correct answer: ${question.options[question.correctAnswer]}` : ''}
                </div>
            `;
            
            reviewEl.appendChild(reviewItem);
        });
    }
    
    // Function to reset challenge
    function resetChallenge() {
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        showScreen(welcomeScreen);
    }
    
    // Function to go back to home
    function goToHome() {
        showScreen(welcomeScreen);
    }
    
    // Function to switch between screens
    function showScreen(screen) {
        // Hide all screens
        welcomeScreen.classList.remove('active');
        readingScreen.classList.remove('active');
        questionsScreen.classList.remove('active');
        resultsScreen.classList.remove('active');
        
        // Show the requested screen
        screen.classList.add('active');
    }
    
    // Function to show notification
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(hideNotification, 3000);
    }
    
    // Function to hide notification
    function hideNotification() {
        notification.classList.remove('show');
    }
});
// Future JavaScript for reading comprehension tests 
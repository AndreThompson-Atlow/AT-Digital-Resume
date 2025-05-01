document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const complexityMeter = document.getElementById('complexity-meter');
    const complexityLabel = document.getElementById('complexity-label');
    const entropyValue = document.getElementById('entropy-value');
    const timeValue = document.getElementById('time-value');
    const strengthLabel = document.getElementById('strength-label');
    const strengthMessage = document.getElementById('strength-message');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const currentTime = document.getElementById('current-time');
    
    // Checkboxes
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const excludeSimilarCheck = document.getElementById('exclude-similar');
    const excludeAmbiguousCheck = document.getElementById('exclude-ambiguous');
    const requireAllTypesCheck = document.getElementById('require-all-types');
    
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{};:,.<>/?|\\\'"`~';
    const similarChars = 'iIlL1oO0';
    const ambiguousSymbols = '{}[]()<>/\\\'"`~,.;:.<>';
    
    // Sound effects
    const generateSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAAGwuTR2lgAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAGwAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADEDsQAAAAAAAAGw3JQy3wAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAALyAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAAL6AAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    
    const copySound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeAANjY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDIAAAAAAAAAHgQJR7eAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAHgADY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADUEAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAAQwAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxKQJQAaoCWAIAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    
    // Variables
    let passwordHistory = [];
    const maxHistorySize = 5;
    
    // Initialize app
    init();
    
    // Set up event listeners
    lengthSlider.addEventListener('input', updateLengthValue);
    lengthSlider.addEventListener('change', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    refreshBtn.addEventListener('click', generatePassword);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Character set checkboxes
    uppercaseCheck.addEventListener('change', generatePassword);
    lowercaseCheck.addEventListener('change', generatePassword);
    numbersCheck.addEventListener('change', updateCharacterCheckboxes);
    symbolsCheck.addEventListener('change', generatePassword);
    excludeSimilarCheck.addEventListener('change', generatePassword);
    excludeAmbiguousCheck.addEventListener('change', generatePassword);
    requireAllTypesCheck.addEventListener('change', generatePassword);
    
    // Initialize the app
    function init() {
        // Load password history from localStorage if available
        loadHistory();
        
        // Update the clock
        updateClock();
        setInterval(updateClock, 1000);
        
        // Generate initial password
        generatePassword();
        
        // Add glitch animation to the app wrapper
        setTimeout(() => {
            document.querySelector('.app-wrapper').classList.add('glitch-animation');
            setTimeout(() => {
                document.querySelector('.app-wrapper').classList.remove('glitch-animation');
            }, 500);
        }, 1000);
    }
    
    // Update the length value display
    function updateLengthValue() {
        lengthValue.textContent = lengthSlider.value;
        updateComplexity();
    }
    
    // Update the character checkboxes (ensures at least one is checked)
    function updateCharacterCheckboxes() {
        // Make sure at least one character type is selected
        if (!uppercaseCheck.checked && !lowercaseCheck.checked && 
            !numbersCheck.checked && !symbolsCheck.checked) {
            // If all are unchecked, force lowercase to be checked
            lowercaseCheck.checked = true;
        }
        
        generatePassword();
    }
    
    // Generate a new password
    function generatePassword() {
        // Get length and character sets
        const length = parseInt(lengthSlider.value);
        
        // Validate that at least one character type is selected
        if (!uppercaseCheck.checked && !lowercaseCheck.checked && 
            !numbersCheck.checked && !symbolsCheck.checked) {
            lowercaseCheck.checked = true;
        }
        
        // Build the character pool
        let charPool = '';
        const charTypes = [];
        
        if (uppercaseCheck.checked) {
            let uppercaseSet = uppercaseChars;
            if (excludeSimilarCheck.checked) {
                uppercaseSet = removeSimilarChars(uppercaseSet);
            }
            charPool += uppercaseSet;
            charTypes.push(uppercaseSet);
        }
        
        if (lowercaseCheck.checked) {
            let lowercaseSet = lowercaseChars;
            if (excludeSimilarCheck.checked) {
                lowercaseSet = removeSimilarChars(lowercaseSet);
            }
            charPool += lowercaseSet;
            charTypes.push(lowercaseSet);
        }
        
        if (numbersCheck.checked) {
            let numberSet = numberChars;
            if (excludeSimilarCheck.checked) {
                numberSet = removeSimilarChars(numberSet);
            }
            charPool += numberSet;
            charTypes.push(numberSet);
        }
        
        if (symbolsCheck.checked) {
            let symbolSet = symbolChars;
            if (excludeAmbiguousCheck.checked) {
                symbolSet = removeAmbiguousSymbols(symbolSet);
            }
            charPool += symbolSet;
            charTypes.push(symbolSet);
        }
        
        // Generate password
        let password = '';
        
        if (requireAllTypesCheck.checked && charTypes.length > 0) {
            // Ensure at least one character from each type
            for (const charSet of charTypes) {
                const randomIndex = Math.floor(Math.random() * charSet.length);
                password += charSet[randomIndex];
            }
            
            // Fill the rest randomly
            for (let i = password.length; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charPool.length);
                password += charPool[randomIndex];
            }
            
            // Shuffle the password to mix the guaranteed characters
            password = shuffleString(password);
        } else {
            // Generate a completely random password
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charPool.length);
                password += charPool[randomIndex];
            }
        }
        
        // Display the password with reveal animation
        passwordDisplay.textContent = password;
        passwordDisplay.classList.add('password-reveal');
        setTimeout(() => {
            passwordDisplay.classList.remove('password-reveal');
        }, 300);
        
        // Add to history
        addToHistory(password);
        
        // Update complexity and strength displays
        updateComplexity();
        updateStrength(password);
        
        // Play generate sound
        generateSound.currentTime = 0;
        generateSound.play();
        
        return password;
    }
    
    // Remove similar characters from a string
    function removeSimilarChars(str) {
        return str.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    // Remove ambiguous symbols from a string
    function removeAmbiguousSymbols(str) {
        return str.split('').filter(char => !ambiguousSymbols.includes(char)).join('');
    }
    
    // Shuffle a string
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    // Copy password to clipboard
    function copyPassword() {
        const password = passwordDisplay.textContent;
        navigator.clipboard.writeText(password)
            .then(() => {
                // Success
                showNotification('Password copied to clipboard!');
                passwordDisplay.classList.add('copy-flash');
                setTimeout(() => {
                    passwordDisplay.classList.remove('copy-flash');
                }, 500);
                
                // Play copy sound
                copySound.currentTime = 0;
                copySound.play();
            })
            .catch(err => {
                // Failure
                showNotification('Failed to copy password: ' + err, true);
            });
    }
    
    // Update complexity meter
    function updateComplexity() {
        const length = parseInt(lengthSlider.value);
        let selectedTypes = 0;
        let complexityPercent = 0;
        let complexityText = '';
        
        if (uppercaseCheck.checked) selectedTypes++;
        if (lowercaseCheck.checked) selectedTypes++;
        if (numbersCheck.checked) selectedTypes++;
        if (symbolsCheck.checked) selectedTypes++;
        
        // Calculate complexity percentage based on length and character types
        // Base: 25% for length (min 8, max 32), 75% for character variety
        const lengthFactor = Math.min((length - 8) / 24, 1) * 25;
        const typeFactor = (selectedTypes / 4) * 75;
        complexityPercent = lengthFactor + typeFactor;
        
        // Set color based on complexity
        let complexityClass = '';
        if (complexityPercent < 25) {
            complexityText = 'WEAK';
            complexityClass = 'weak';
        } else if (complexityPercent < 50) {
            complexityText = 'MODERATE';
            complexityClass = 'moderate';
        } else if (complexityPercent < 75) {
            complexityText = 'STRONG';
            complexityClass = 'strong';
        } else {
            complexityText = 'EXCELLENT';
            complexityClass = 'very-strong';
        }
        
        // Update the UI
        complexityMeter.style.width = `${complexityPercent}%`;
        complexityMeter.className = 'meter-fill ' + complexityClass;
        complexityLabel.textContent = complexityText;
        complexityLabel.className = 'meter-label ' + complexityClass;
    }
    
    // Update strength indicators based on password
    function updateStrength(password) {
        // Calculate entropy (randomness)
        const entropy = calculateEntropy(password);
        entropyValue.textContent = `${entropy.toFixed(1)} bits`;
        
        // Calculate crack time estimate
        const crackTime = estimateCrackTime(entropy);
        timeValue.textContent = crackTime;
        
        // Update strength meter
        updateStrengthMeter(entropy);
    }
    
    // Calculate password entropy (randomness)
    function calculateEntropy(password) {
        // Pool size calculation
        let poolSize = 0;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) poolSize += 33; // Approx number of common symbols
        
        // Entropy formula: log2(poolSize) * length
        const length = password.length;
        return Math.log2(poolSize) * length;
    }
    
    // Estimate crack time based on entropy
    function estimateCrackTime(entropy) {
        // Assuming 10 billion guesses per second (powerful attacker)
        const secondsToCrack = Math.pow(2, entropy) / 10000000000;
        
        if (secondsToCrack < 60) {
            return 'Instant';
        } else if (secondsToCrack < 3600) {
            return `${Math.round(secondsToCrack / 60)} minutes`;
        } else if (secondsToCrack < 86400) {
            return `${Math.round(secondsToCrack / 3600)} hours`;
        } else if (secondsToCrack < 2592000) {
            return `${Math.round(secondsToCrack / 86400)} days`;
        } else if (secondsToCrack < 31536000) {
            return `${Math.round(secondsToCrack / 2592000)} months`;
        } else if (secondsToCrack < 3153600000) {
            return `${Math.round(secondsToCrack / 31536000)} years`;
        } else {
            return `${Math.round(secondsToCrack / 31536000).toLocaleString()} years`;
        }
    }
    
    // Update strength meter
    function updateStrengthMeter(entropy) {
        // Clear existing active segments
        const segments = document.querySelectorAll('.strength-segment');
        segments.forEach(segment => segment.classList.remove('active', 'weak', 'moderate', 'strong', 'very-strong'));
        
        // Determine strength class based on entropy
        let strengthClass = '';
        let message = '';
        let activeSegments = 0;
        
        if (entropy < 40) {
            strengthClass = 'weak';
            message = 'This password is too weak and could be easily cracked. Try adding more character types or increasing length.';
            activeSegments = 1;
        } else if (entropy < 60) {
            strengthClass = 'moderate';
            message = 'Your password has decent security for general use, but consider increasing complexity for sensitive accounts.';
            activeSegments = 2;
        } else if (entropy < 80) {
            strengthClass = 'strong';
            message = 'This is a strong password that would require significant resources to crack. Good for most uses.';
            activeSegments = 3;
        } else {
            strengthClass = 'very-strong';
            message = 'Excellent! This password is extremely secure and would be practically impossible to crack by brute force.';
            activeSegments = 4;
        }
        
        // Update UI
        for (let i = 0; i < activeSegments; i++) {
            segments[i].classList.add('active', strengthClass);
        }
        
        strengthLabel.textContent = strengthClass.replace('-', ' ').toUpperCase();
        strengthLabel.className = 'strength-label ' + strengthClass;
        strengthMessage.textContent = message;
    }
    
    // Add password to history
    function addToHistory(password) {
        // Check if password is already in history
        if (passwordHistory.includes(password)) return;
        
        // Add to the beginning of the array
        passwordHistory.unshift(password);
        
        // Limit history size
        if (passwordHistory.length > maxHistorySize) {
            passwordHistory.pop();
        }
        
        // Save to localStorage
        saveHistory();
        
        // Update UI
        renderHistory();
    }
    
    // Clear history
    function clearHistory() {
        passwordHistory = [];
        saveHistory();
        renderHistory();
        
        // Show notification
        showNotification('History cleared');
    }
    
    // Save history to localStorage
    function saveHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    }
    
    // Load history from localStorage
    function loadHistory() {
        const saved = localStorage.getItem('passwordHistory');
        if (saved) {
            passwordHistory = JSON.parse(saved);
            renderHistory();
        }
    }
    
    // Render history in UI
    function renderHistory() {
        historyList.innerHTML = '';
        
        if (passwordHistory.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'empty-history';
            emptyItem.textContent = 'No password history yet.';
            historyList.appendChild(emptyItem);
            return;
        }
        
        passwordHistory.forEach((password, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const passwordEl = document.createElement('div');
            passwordEl.className = 'history-password';
            passwordEl.textContent = password;
            historyItem.appendChild(passwordEl);
            
            const copyEl = document.createElement('div');
            copyEl.className = 'history-copy';
            copyEl.textContent = 'COPY';
            copyEl.addEventListener('click', () => {
                copyHistoryPassword(password);
            });
            historyItem.appendChild(copyEl);
            
            historyList.appendChild(historyItem);
            
            // Add staggered entrance animation
            setTimeout(() => {
                historyItem.style.opacity = '0';
                historyItem.style.transform = 'translateX(20px)';
                historyItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                setTimeout(() => {
                    historyItem.style.opacity = '1';
                    historyItem.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    }
    
    // Copy password from history
    function copyHistoryPassword(password) {
        navigator.clipboard.writeText(password)
            .then(() => {
                showNotification('Password copied to clipboard!');
                
                // Play copy sound
                copySound.currentTime = 0;
                copySound.play();
            })
            .catch(err => {
                showNotification('Failed to copy password: ' + err, true);
            });
    }
    
    // Show notification
    function showNotification(message, isError = false) {
        notificationMessage.textContent = message;
        notification.className = isError ? 
            'notification show error' : 'notification show';
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        currentTime.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Add blinking effect to the colon
        if (seconds % 2 === 0) {
            currentTime.innerHTML = `${hours}<span class="blink-off">:</span>${minutes}<span class="blink-off">:</span>${seconds}`;
        } else {
            currentTime.innerHTML = `${hours}<span class="blink-on">:</span>${minutes}<span class="blink-on">:</span>${seconds}`;
        }
    }
    
    // Add CSS for animations and blinking
    const style = document.createElement('style');
    style.textContent = `
        .glitch-animation {
            animation: glitch 0.3s linear;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }
        
        .blink-off {
            opacity: 0.3;
        }
        
        .blink-on {
            opacity: 1;
        }
        
        .notification.error {
            border-color: var(--danger-color);
        }
        
        .notification.error .notification-message {
            color: var(--danger-color);
        }
    `;
    document.head.appendChild(style);
}); 
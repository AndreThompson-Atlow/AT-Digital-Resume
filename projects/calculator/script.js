document.addEventListener('DOMContentLoaded', () => {
    const historyDisplay = document.getElementById('history');
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetInput = false;
    
    // Sound effects (cyberpunk themed)
    const clickSound = new Audio();
    clickSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAAGwuTR2lgAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAGwAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADEDsQAAAAAAAAGw3JQy3wAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAALyAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAAL6AAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    
    const equalSound = new Audio();
    equalSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeAANjY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDIAAAAAAAAAHgQJR7eAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAHgADY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADUEAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAAQwAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxKQJQAaoCWAIAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
    
    const clearSound = new Audio();
    clearSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAABLAAICAgICAgICAgICAgQEBAQEBAQEBAQEBAQGBgYGBgYGBgYGBgYGBggICAgICAgICAgICAgID//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADEEkAAAAAAAAASwDxlFhQAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAQAAASQACAgICAgICAgICAgIEBAQEBAQEBAQEBAQEBgYGBgYGBgYGBgYGBgYICAgICAgICAgICAgICA//////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAA2BVAAAAAAAAAEsCXUEBAAAAAAAAAAAAAAAAAAAP/jGMQAAAAAugAAAABMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAALyAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLsKcAa0CWAIAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    
    // Add glitch animation to display on startup
    setTimeout(() => {
        display.classList.add('glitch-effect');
        setTimeout(() => {
            display.classList.remove('glitch-effect');
        }, 500);
    }, 300);
    
    // Button event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Add tactile feedback
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 100);
            
            // Play button sound
            const btnSound = button.dataset.action === 'calculate' ? equalSound : 
                             button.dataset.action === 'clear' ? clearSound : clickSound;
            btnSound.currentTime = 0;
            btnSound.play();
            
            // Process button action
            const action = button.dataset.action;
            const buttonContent = button.textContent;
            
            // Handle different button types
            if (!action) {
                return;
            } else if (action === 'number') {
                inputNumber(buttonContent);
            } else if (action === 'decimal') {
                inputDecimal();
            } else if (action === 'clear') {
                clearCalculator();
            } else if (action === 'delete') {
                deleteLastDigit();
            } else if (action === 'calculate') {
                calculate();
            } else if (action === 'percent') {
                calculatePercent();
            } else {
                // Operators
                handleOperator(action, buttonContent);
            }
            
            // Update display
            updateDisplay();
        });
    });
    
    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if (/[0-9]/.test(key)) {
            // Numbers
            clickSound.currentTime = 0;
            clickSound.play();
            inputNumber(key);
        } else if (key === '.') {
            // Decimal
            clickSound.currentTime = 0;
            clickSound.play();
            inputDecimal();
        } else if (key === 'Escape') {
            // Clear
            clearSound.currentTime = 0;
            clearSound.play();
            clearCalculator();
        } else if (key === 'Backspace') {
            // Delete
            clickSound.currentTime = 0;
            clickSound.play();
            deleteLastDigit();
        } else if (key === 'Enter' || key === '=') {
            // Calculate
            equalSound.currentTime = 0;
            equalSound.play();
            calculate();
        } else if (key === '%') {
            // Percent
            clickSound.currentTime = 0;
            clickSound.play();
            calculatePercent();
        } else if (key === '+') {
            // Add
            clickSound.currentTime = 0;
            clickSound.play();
            handleOperator('add', '+');
        } else if (key === '-') {
            // Subtract
            clickSound.currentTime = 0;
            clickSound.play();
            handleOperator('subtract', '-');
        } else if (key === '*') {
            // Multiply
            clickSound.currentTime = 0;
            clickSound.play();
            handleOperator('multiply', '×');
        } else if (key === '/') {
            // Divide
            clickSound.currentTime = 0;
            clickSound.play();
            handleOperator('divide', '÷');
        }
        
        updateDisplay();
    });
    
    // Input number
    function inputNumber(number) {
        if (currentInput === '0' || resetInput) {
            currentInput = number;
            resetInput = false;
        } else {
            currentInput += number;
        }
    }
    
    // Input decimal
    function inputDecimal() {
        if (resetInput) {
            currentInput = '0.';
            resetInput = false;
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    
    // Handle operators
    function handleOperator(op, symbol) {
        if (currentInput === '') return;
        
        if (previousInput !== '') {
            calculate();
        }
        
        operation = op;
        previousInput = currentInput;
        resetInput = true;
        
        // Add operation to history display
        historyDisplay.textContent = `${previousInput} ${symbol}`;
    }
    
    // Clear calculator
    function clearCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetInput = false;
        historyDisplay.textContent = '';
        
        // Add glitch effect when clearing
        display.classList.add('glitch-effect');
        setTimeout(() => {
            display.classList.remove('glitch-effect');
        }, 300);
    }
    
    // Delete last digit
    function deleteLastDigit() {
        if (currentInput.length === 1) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }
    
    // Calculate percentage
    function calculatePercent() {
        const current = parseFloat(currentInput);
        currentInput = (current / 100).toString();
    }
    
    // Calculate result
    function calculate() {
        if (previousInput === '' || operation === null) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;
        
        switch (operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    result = 'Error';
                    // Add glitch effect for division by zero
                    display.classList.add('error-glitch');
                    setTimeout(() => {
                        display.classList.remove('error-glitch');
                    }, 500);
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }
        
        // Add calculation to history
        let opSymbol;
        switch (operation) {
            case 'add': opSymbol = '+'; break;
            case 'subtract': opSymbol = '-'; break;
            case 'multiply': opSymbol = '×'; break;
            case 'divide': opSymbol = '÷'; break;
        }
        
        historyDisplay.textContent = `${previousInput} ${opSymbol} ${currentInput} =`;
        
        if (result === 'Error') {
            currentInput = result;
        } else {
            // Format the result
            const resultStr = result.toString();
            if (resultStr.includes('.') && resultStr.split('.')[1].length > 8) {
                // Limit decimal places
                currentInput = result.toFixed(8).toString();
            } else {
                currentInput = resultStr;
            }
        }
        
        operation = null;
        previousInput = '';
        resetInput = true;
    }
    
    // Update display
    function updateDisplay() {
        // Format large numbers with commas
        let displayValue = currentInput;
        
        if (displayValue !== 'Error') {
            // Split by decimal point
            const parts = displayValue.split('.');
            if (parts[0].length > 3) {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            displayValue = parts.join('.');
        }
        
        display.textContent = displayValue;
    }
    
    // Add CSS for active and glitch effects
    const style = document.createElement('style');
    style.textContent = `
        .button.active {
            transform: scale(0.95);
            opacity: 0.8;
        }
        
        .glitch-effect {
            animation: glitch 0.3s linear;
        }
        
        .error-glitch {
            animation: errorGlitch 0.5s linear;
            color: var(--danger-color) !important;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes errorGlitch {
            0% { text-shadow: 0 0 5px var(--danger-color); }
            25% { text-shadow: -3px 0 5px var(--danger-color), 3px 0 5px var(--accent-color); }
            50% { text-shadow: 3px 0 5px var(--danger-color), -3px 0 5px var(--accent-color); }
            75% { text-shadow: -3px 0 5px var(--danger-color), 3px 0 5px var(--accent-color); }
            100% { text-shadow: 0 0 5px var(--danger-color); }
        }
    `;
    document.head.appendChild(style);
}); 
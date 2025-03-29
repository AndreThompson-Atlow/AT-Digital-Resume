document.addEventListener('DOMContentLoaded', () => {
    // Terminal intro animation
    const terminal = document.getElementById('terminal');
    const lines = document.querySelectorAll('.terminal-content .line');
    let lineIndex = 0;
    
    // Track loaded dynamic elements
    let dynamicElementsLoaded = {
      commandConsole: false,
      visualizationPanel: false,
      codePanel: false
    };
    
    // Show lines one by one with a typing effect
    function showNextLine() {
      if (lineIndex < lines.length) {
        lines[lineIndex].style.display = 'block';
        const commandText = lines[lineIndex].querySelector('.command-text');
        
        if (commandText) {
          typingEffect(commandText, () => {
            lineIndex++;
            setTimeout(showNextLine, 500);
          });
        } else {
          lineIndex++;
          setTimeout(showNextLine, 500);
        }
      } else {
        // All lines displayed, hide terminal after delay
        setTimeout(() => {
          terminal.style.opacity = '0';
          setTimeout(() => {
            terminal.style.display = 'none';
            startCodeRain(); // Start the Matrix-like code rain
            animateSkillBars(); // Animate skill bars
            initDynamicElements(); // Initialize dynamic elements
          }, 500);
        }, 1000);
      }
    }
    
    // Simulate typing effect
    function typingEffect(element, callback) {
      const text = element.textContent;
      element.textContent = '';
      let i = 0;
      
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, 50 + Math.random() * 50);
        } else {
          if (callback) callback();
        }
      }
      
      type();
    }
    
    // Hide all lines initially
    lines.forEach(line => {
      line.style.display = 'none';
    });
    
    // Start the terminal animation
    setTimeout(showNextLine, 1000);
    
    // Matrix-like code rain animation
    function startCodeRain() {
      const canvas = document.getElementById('code-rain');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Characters for the matrix code
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
      
      // Convert the string to an array of characters
      const charactersArray = characters.split('');
      
      // Font size and columns
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      
      // Array to track the y position of each column
      const drops = [];
      
      // Initialize all columns
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height);
      }
      
      // Drawing function for the code rain
      function draw() {
        // Semi-transparent black background to create trail effect
        ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the color and font for the falling characters
        ctx.fillStyle = '#00ffe1';
        ctx.font = fontSize + 'px monospace';
        
        // Loop through each drop
        for (let i = 0; i < drops.length; i++) {
          // Choose a random character from the array
          const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
          
          // Draw the character
          ctx.fillText(text, i * fontSize, drops[i] * 1);
          
          // Randomly change the color of some characters for effect
          if (Math.random() > 0.975) {
            ctx.fillStyle = '#ffcc00';
          } else {
            ctx.fillStyle = '#00ffe1';
          }
          
          // Move the drop down
          drops[i]++;
          
          // Reset drop to top when it reaches the bottom
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
        }
        
        requestAnimationFrame(draw);
      }
      
      // Start the animation
      draw();
    }
    
    // Animate skill bars when they come into view
    function animateSkillBars() {
      const skillBars = document.querySelectorAll('.skill-bar');
      
      skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
      });
    }
  
    // Type writing effect for hero section
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".typed-text + .cursor");
    
    const textArray = ["Crafting Efficient Solutions", "Building Web Applications", "Optimizing Performance", "Creating User Experiences"];
    const typingDelay = 80;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } 
      else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
      }
    }
    
    function erase() {
      if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } 
      else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }
    
    // Start typing effect when page loads
    if(textArray.length) setTimeout(type, newTextDelay + 250);
  
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Play click sound
          const clickSound = document.getElementById('click-sound');
          clickSound.currentTime = 0;
          clickSound.play();
          
          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Play click sound
      const clickSound = document.getElementById('click-sound');
      clickSound.currentTime = 0;
      clickSound.play();
    });
  
    // Scroll animations for sections
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          
          // If it's the skills section, animate the skill bars
          if (entry.target.id === 'skills') {
            animateSkillBars();
          }
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  
    // Play sound on project card hover
    const hoverSound = document.getElementById('hover-sound');
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!isMobileDevice()) { // Only play sound on non-mobile devices
          hoverSound.currentTime = 0;
          hoverSound.volume = 0.2; // Lower volume
          hoverSound.play();
        }
      });
    });
    
    // Detect if user is on a mobile device
    function isMobileDevice() {
      return (window.innerWidth <= 768) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    }
  
    // Easter Egg: Toggle hidden hack mode when logo is clicked
    const logo = document.getElementById('logo');
    const easterEgg = document.getElementById('easter-egg');
    const easterSound = document.getElementById('easter-sound');
    const closeEasterEgg = document.getElementById('close-easter-egg');
    
    logo.addEventListener('click', () => {
      easterEgg.classList.remove('hidden');
      easterSound.currentTime = 0;
      easterSound.play();
      
      // Add console hack command
      if (dynamicElementsLoaded.commandConsole) {
        const consoleOutput = document.getElementById('console-output');
        const hackLine = document.createElement('div');
        hackLine.className = 'console-line';
        hackLine.innerHTML = '<span style="color:#ff2a6d;">ATTENTION:</span> Backdoor access granted. Type "hack" to initiate.';
        consoleOutput.appendChild(hackLine);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      }
    });
    
    closeEasterEgg.addEventListener('click', () => {
      easterEgg.classList.add('hidden');
    });
  
    // Fake System Pop-up Alert
    function showSystemPopup() {
      const messages = [
        "System Breach Detected! Running Diagnostics...",
        "Firewall Bypassed. Security Protocol Activated.",
        "Quantum Encryption Engaged. Data Safe.",
        "Background Scan Complete. No Threats Detected.",
        "Neural Interface Calibrating...",
        "Memory Optimization In Progress..."
      ];
      
      const popup = document.createElement('div');
      popup.classList.add('system-popup');
      popup.textContent = messages[Math.floor(Math.random() * messages.length)];
      document.body.appendChild(popup);
      
      setTimeout(() => {
        popup.remove();
      }, 3500);
    }
    
    // Trigger system popup after a delay, and then periodically with random intervals
    setTimeout(() => {
      showSystemPopup();
      
      setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to show popup
          showSystemPopup();
        }
      }, 15000 + Math.random() * 20000); // Random interval between 15-35 seconds
    }, 8000);
  
    // Toggle Hacker Dashboard
    const dashboard = document.getElementById('hacker-dashboard');
    const dashboardHeader = document.querySelector('.dashboard-header');
    
    dashboardHeader.addEventListener('click', () => {
      dashboard.classList.toggle('collapsed');
    });
  
    // Animate dashboard meters independently
    const meters = document.querySelectorAll('.meter span');
    
    meters.forEach(meter => {
      const randomDuration = 3 + Math.random() * 4; // Random duration between 3-7 seconds
      meter.style.animation = `meterAnimation ${randomDuration}s ease-in-out infinite`;
    });
  
    // Music Control Toggle
    const musicControl = document.getElementById('music-control');
    const bgMusic = document.getElementById('bg-music');
    
    musicControl.addEventListener('click', () => {
      if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.volume = 0.3; // Set volume to 30%
        musicControl.textContent = "Mute Music";
        musicControl.style.color = "#ffcc00";
        bgMusic.play();
      } else {
        bgMusic.muted = true;
        musicControl.textContent = "Unmute Music";
        musicControl.style.color = "#00ffe1";
      }
    });
  
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success popup
      const popup = document.createElement('div');
      popup.classList.add('system-popup');
      popup.textContent = "Message Sent Successfully! I'll get back to you soon.";
      popup.style.borderColor = "#05ffa1"; // Success color
      document.body.appendChild(popup);
      
      // Reset form
      this.reset();
      
      // Remove popup after delay
      setTimeout(() => {
        popup.remove();
      }, 3500);
    });
  
    // Command Console functionality
    function initCommandConsole() {
      const commandConsole = document.getElementById('command-console');
      const consoleInput = document.getElementById('console-input');
      const consoleOutput = document.getElementById('console-output');
      const closeConsole = document.getElementById('close-console');
      const typingSound = document.getElementById('typing-sound');
      const errorSound = document.getElementById('console-error');
      const successSound = document.getElementById('console-success');
      
      // Command history
      let commandHistory = [];
      let historyIndex = -1;
      
      // Available commands
      const commands = {
        help: {
          description: 'Display available commands',
          execute: () => {
            let output = 'Available commands:\n';
            for (const cmd in commands) {
              output += `  ${cmd} - ${commands[cmd].description}\n`;
            }
            return output;
          }
        },
        clear: {
          description: 'Clear the console',
          execute: () => {
            consoleOutput.innerHTML = '';
            return '';
          }
        },
        echo: {
          description: 'Echo a message',
          execute: (args) => {
            return args.join(' ');
          }
        },
        hack: {
          description: 'Attempt to hack the system',
          execute: () => {
            // Trigger the easter egg
            document.getElementById('easter-egg').classList.remove('hidden');
            document.getElementById('easter-sound').play();
            return 'HACK MODE ACTIVATED!';
          }
        },
        stats: {
          description: 'Display system statistics',
          execute: () => {
            return `System Status:
    CPU: 42% usage
    Memory: 1.3GB / 4GB
    Network: 3.2MB/s down, 0.8MB/s up
    Encryption: AES-256, active
    Last login: ${new Date().toLocaleString()}`;
          }
        },
        visualize: {
          description: 'Show data visualization panel',
          execute: () => {
            document.getElementById('data-visualization-panel').classList.add('visible');
            return 'Data visualization panel activated.';
          }
        },
        hide: {
          description: 'Hide data panels',
          execute: (args) => {
            if (args.length === 0 || args[0] === 'all') {
              document.querySelectorAll('.data-panel').forEach(panel => {
                panel.classList.remove('visible');
              });
              return 'All panels hidden.';
            } else if (args[0] === 'viz' || args[0] === 'visualization') {
              document.getElementById('data-visualization-panel').classList.remove('visible');
              return 'Visualization panel hidden.';
            } else if (args[0] === 'code') {
              document.getElementById('code-panel').classList.remove('visible');
              return 'Code panel hidden.';
            }
            return 'Unknown panel. Try "all", "viz", or "code".';
          }
        },
        code: {
          description: 'Show live coding panel',
          execute: () => {
            document.getElementById('code-panel').classList.add('visible');
            // Start code typing animation
            animateCode();
            return 'Live code panel activated.';
          }
        },
        date: {
          description: 'Display current date and time',
          execute: () => {
            return new Date().toLocaleString();
          }
        },
        about: {
          description: 'Display info about Andre',
          execute: () => {
            return `Andre Thompson
    Software Engineer with 3+ years experience
    Skills: React, Angular, Node.js, Express
    Location: Salt Lake City, Utah
    Contact: andrethompsoncs@gmail.com`;
          }
        }
      };
      
      // Show the console with delay
      setTimeout(() => {
        commandConsole.classList.add('active');
        dynamicElementsLoaded.commandConsole = true;
      }, 10000);
      
      // Process command input
      function processCommand(command) {
        if (!command) return;
        
        // Add to history
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        
        // Parse command and arguments
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Output the command
        const commandLine = document.createElement('div');
        commandLine.className = 'console-line';
        commandLine.innerHTML = `<span class="console-prompt">C:\\></span> ${command}`;
        consoleOutput.appendChild(commandLine);
        
        // Process command
        let output = '';
        if (commands[cmd]) {
          try {
            output = commands[cmd].execute(args);
            successSound.currentTime = 0;
            successSound.play();
          } catch (err) {
            output = `Error executing command: ${err.message}`;
            errorSound.currentTime = 0;
            errorSound.play();
          }
        } else {
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
          errorSound.currentTime = 0;
          errorSound.play();
        }
        
        // Display output
        if (output) {
          const outputLine = document.createElement('div');
          outputLine.className = 'console-line';
          outputLine.textContent = output;
          consoleOutput.appendChild(outputLine);
        }
        
        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      }
      
      // Handle input
      consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = consoleInput.value;
          consoleInput.value = '';
          processCommand(command);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            consoleInput.value = commandHistory[historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            consoleInput.value = commandHistory[historyIndex];
          } else {
            historyIndex = commandHistory.length;
            consoleInput.value = '';
          }
        } else {
          // Play typing sound for other keys
          if (Math.random() > 0.7) { // Only play for 30% of keypresses to avoid too much noise
            typingSound.currentTime = 0;
            typingSound.volume = 0.1;
            typingSound.play();
          }
        }
      });
      
      // Close console
      closeConsole.addEventListener('click', () => {
        commandConsole.classList.remove('active');
      });
      
      // Show after a delay
      setTimeout(() => {
        // Display initial help message
        processCommand('echo Type "help" to see available commands.');
      }, 11000);
    }
    
    // Initialize data visualization charts
    function initDataVisualization() {
      setTimeout(() => {
        const dataVisualizationPanel = document.getElementById('data-visualization-panel');
        dataVisualizationPanel.classList.add('visible');
        dynamicElementsLoaded.visualizationPanel = true;
        
        // Create charts
        createPieChart();
        createBarChart();
        createLineChart();
        createFunctionPlot();
        
        // Auto-hide after some time
        setTimeout(() => {
          if (Math.random() > 0.5) { // 50% chance to auto-hide
            dataVisualizationPanel.classList.remove('visible');
          }
        }, 20000);
      }, 15000);
    }
    
    function createPieChart() {
      const canvas = document.getElementById('pie-chart');
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Data for pie chart
      const data = [35, 25, 20, 15, 5];
      const colors = [
        '#00ffe1', // Cyan
        '#ffcc00', // Yellow
        '#174aff', // Blue
        '#ff2a6d', // Pink
        '#05ffa1'  // Green
      ];
      
      // Draw pie chart
      let startAngle = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      
      for (let i = 0; i < data.length; i++) {
        const endAngle = startAngle + (2 * Math.PI * data[i] / 100);
        
        // Draw sector
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Fill sector
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = colors[i];
        ctx.shadowBlur = 10;
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        startAngle = endAngle;
      }
      
      // Draw circle in center
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(10, 14, 23, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#00ffe1';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add to window for resize
      window.pieChart = { resize: createPieChart };
    }
    
    function createBarChart() {
      const canvas = document.getElementById('bar-chart');
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Data for bar chart
      const data = [65, 40, 75, 50, 85, 30];
      const barWidth = canvas.width / (data.length * 2);
      const maxValue = Math.max(...data);
      const barColor = '#00ffe1';
      
      // Draw axes
      ctx.beginPath();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.moveTo(10, 10);
      ctx.lineTo(10, canvas.height - 20);
      ctx.lineTo(canvas.width - 10, canvas.height - 20);
      ctx.stroke();
      
      // Draw bars
      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / maxValue) * (canvas.height - 40);
        const x = 20 + (i * barWidth * 2);
        const y = canvas.height - 20 - barHeight;
        
        // Bar shadow/glow
        ctx.shadowColor = barColor;
        ctx.shadowBlur = 8;
        
        // Draw bar
        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      
      // Add to window for resize
      window.barChart = { resize: createBarChart };
    }
    
    function createLineChart() {
      const canvas = document.getElementById('line-chart');
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Data for line chart
      const data = [15, 35, 25, 60, 40, 75, 35, 55];
      const lineColor = '#ffcc00';
      const pointColor = '#ff2a6d';
      
      // Calculate dimensions
      const width = canvas.width - 20;
      const height = canvas.height - 30;
      const stepX = width / (data.length - 1);
      const maxValue = Math.max(...data);
      
      // Draw axes
      ctx.beginPath();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.moveTo(10, 10);
      ctx.lineTo(10, height + 10);
      ctx.lineTo(width + 10, height + 10);
      ctx.stroke();
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(10, height + 10 - (data[0] / maxValue) * height);
      
      for (let i = 1; i < data.length; i++) {
        const x = 10 + i * stepX;
        const y = height + 10 - (data[i] / maxValue) * height;
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw points
      for (let i = 0; i < data.length; i++) {
        const x = 10 + i * stepX;
        const y = height + 10 - (data[i] / maxValue) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = pointColor;
        ctx.shadowColor = pointColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Add to window for resize
      window.lineChart = { resize: createLineChart };
    }
    
    function createFunctionPlot() {
      const canvas = document.getElementById('function-plot');
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Function to plot: f(x) = sin(x) * x/5
      const plotFunction = x => Math.sin(x) * x / 5;
      
      // Calculate dimensions
      const width = canvas.width - 20;
      const height = canvas.height - 20;
      const centerX = width / 2 + 10;
      const centerY = height / 2 + 10;
      const scaleX = 20; // Scale to fit
      const scaleY = 20; // Scale to fit
      
      // Draw grid
      ctx.beginPath();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 0; x <= width; x += 20) {
        ctx.moveTo(x + 10, 10);
        ctx.lineTo(x + 10, height + 10);
      }
      
      // Horizontal grid lines
      for (let y = 0; y <= height; y += 20) {
        ctx.moveTo(10, y + 10);
        ctx.lineTo(width + 10, y + 10);
      }
      
      ctx.stroke();
      
      // Draw axes
      ctx.beginPath();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      
      // X-axis
      ctx.moveTo(10, centerY);
      ctx.lineTo(width + 10, centerY);
      
      // Y-axis
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX, height + 10);
      
      ctx.stroke();
      
      // Plot function
      ctx.beginPath();
      
      for (let px = 0; px <= width; px++) {
        // Convert canvas position to function input
        const x = (px - centerX) / scaleX;
        
        // Calculate function output
        const y = plotFunction(x);
        
        // Convert function output to canvas position
        const py = centerY - y * scaleY;
        
        if (px === 0) {
          ctx.moveTo(px + 10, py);
        } else {
          ctx.lineTo(px + 10, py);
        }
      }
      
      ctx.strokeStyle = '#05ffa1';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#05ffa1';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Add to window for resize
      window.functionPlot = { resize: createFunctionPlot };
    }
    
    // Code panel animation
    function initCodePanel() {
      setTimeout(() => {
        const codePanel = document.getElementById('code-panel');
        codePanel.classList.add('visible');
        dynamicElementsLoaded.codePanel = true;
        
        // Start code animation
        animateCode();
        
        // Auto-hide after some time
        setTimeout(() => {
          if (Math.random() > 0.3) { // 70% chance to auto-hide
            codePanel.classList.remove('visible');
          }
        }, 25000);
      }, 12000);
    }
    
    function animateCode() {
      const codeElement = document.getElementById('live-code');
      if (!codeElement) return;
      
      const codeLines = codeElement.textContent.trim().split('\n');
      codeElement.innerHTML = '';
      
      // Apply syntax highlighting
      codeLines.forEach((line, index) => {
        // Create a span for each line
        const lineSpan = document.createElement('span');
        lineSpan.id = `code-line-${index}`;
        lineSpan.className = 'code-line';
        
        // Apply syntax highlighting
        let highlightedLine = line
          .replace(/\b(import|from|def|if|for|in|return|class|while|try|except|else|elif|as|with|async|await|yield)\b/g, '<span class="keyword">$1</span>')
          .replace(/\b(print|initialize_system|train|generate_keys|secure_channel|check_all_systems|main)\b/g, '<span class="function">$1</span>')
          .replace(/\b(systems|system|status|model|data|encryption|all_systems)\b/g, '<span class="variable">$1</span>')
          .replace(/(["'].*?["'])/g, '<span class="string">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
          .replace(/(#.*)$/g, '<span class="comment">$1</span>');
        
        lineSpan.innerHTML = highlightedLine;
        codeElement.appendChild(lineSpan);
        codeElement.appendChild(document.createTextNode('\n'));
      });
      
      // Animate code
      let lineIndex = 0;
      
      function highlightNextLine() {
        // Remove previous highlights
        document.querySelectorAll('.active-line').forEach(el => {
          el.classList.remove('active-line');
        });
        
        if (lineIndex < codeLines.length) {
          const lineElement = document.getElementById(`code-line-${lineIndex}`);
          if (lineElement) {
            lineElement.classList.add('active-line');
            
            // Play typing sound
            if (lineIndex % 3 === 0) { // Play sound every few lines to avoid too much noise
              const typingSound = document.getElementById('typing-sound');
              typingSound.currentTime = 0;
              typingSound.volume = 0.05;
              typingSound.play();
            }
            
            lineIndex++;
            setTimeout(highlightNextLine, 200 + Math.random() * 400);
          }
        } else {
          // Loop back to start after a pause
          lineIndex = 0;
          setTimeout(highlightNextLine, 2000);
        }
      }
      
      // Start animation
      highlightNextLine();
    }
    
    // Initialize all dynamic elements
    function initDynamicElements() {
      initCommandConsole();
      initDataVisualization();
      initCodePanel();
    }
    
    // Keyboard shortcuts for "hacker" experience
    document.addEventListener('keydown', (e) => {
      // Ctrl + Space to toggle command console
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        const commandConsole = document.getElementById('command-console');
        commandConsole.classList.toggle('active');
        
        if (commandConsole.classList.contains('active')) {
          document.getElementById('console-input').focus();
        }
      }
      
      // Ctrl + D to toggle dashboard
      if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        dashboard.classList.toggle('collapsed');
      }
      
      // Ctrl + V to toggle visualization panel
      if (e.ctrlKey && e.code === 'KeyV') {
        e.preventDefault();
        const vizPanel = document.getElementById('data-visualization-panel');
        vizPanel.classList.toggle('visible');
        
        if (vizPanel.classList.contains('visible') && !dynamicElementsLoaded.visualizationPanel) {
          createPieChart();
          createBarChart();
          createLineChart();
          createFunctionPlot();
          dynamicElementsLoaded.visualizationPanel = true;
        }
      }
      
      // Ctrl + K to toggle code panel
      if (e.ctrlKey && e.code === 'KeyK') {
        e.preventDefault();
        const codePanel = document.getElementById('code-panel');
        codePanel.classList.toggle('visible');
        
        if (codePanel.classList.contains('visible') && !dynamicElementsLoaded.codePanel) {
          animateCode();
          dynamicElementsLoaded.codePanel = true;
        }
      }
    });
    
    // Window resize event handler
    window.addEventListener('resize', () => {
      const codeRainCanvas = document.getElementById('code-rain');
      if (codeRainCanvas) {
        codeRainCanvas.width = window.innerWidth;
        codeRainCanvas.height = window.innerHeight;
      }
      
      // Resize charts if they exist
      if (window.pieChart) window.pieChart.resize();
      if (window.barChart) window.barChart.resize();
      if (window.lineChart) window.lineChart.resize();
      if (window.functionPlot) window.functionPlot.resize();
    });
  });
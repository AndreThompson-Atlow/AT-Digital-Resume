document.addEventListener('DOMContentLoaded', () => {
    // Ensure page starts at the top on load
    window.scrollTo(0, 0);
    
    // State tracking for dynamically loaded elements
    let dynamicElementsLoaded = {
      commandConsole: false,
      visualizationPanel: false,
      codePanel: false
    };
    
    // Initialize essential features immediately
    initEssentialFeatures();
    
    // Lazy load non-essential features for performance
    if ('IntersectionObserver' in window) {
      lazyLoadFeatures();
    } else {
      // Fallback for older browsers
      window.addEventListener('load', initNonEssentialFeatures);
    }
    
    // Initialize features required for above-the-fold content and core functionality
    function initEssentialFeatures() {
      initTerminal();
      initTypingEffect();
      initMobileMenu();
      initContactForm();
      initResumeDownload();
      initThemeToggle();
      initKonamiCode();
      initMusicControl();
      // Initialize dynamic elements after a short delay
      setTimeout(initDynamicElements, 2000); 
    }
    
    // Lazy load features as they enter the viewport
    function lazyLoadFeatures() {
      const featureSections = {
        'skills': () => animateSkillBars(),
        'projects': () => initProjectCards(),
        'contact': () => {} // Contact form already initialized in essentials
      };
      
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (featureSections[sectionId]) {
              featureSections[sectionId]();
            }
            sectionObserver.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });
      
      // Observe each section
      Object.keys(featureSections).forEach(id => {
        const section = document.getElementById(id);
        if (section) {
          sectionObserver.observe(section);
        }
      });
      
      // Observe terminal to start code rain after terminal animation
      const terminal = document.getElementById('terminal');
      if (terminal) {
        const terminalObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            // Terminal is visible, start animation
            // Animation already handled in initTerminal
            terminalObserver.unobserve(terminal);
          }
        }, {
          threshold: 0.5
        });
        terminalObserver.observe(terminal);
      }
      
      // Lazy load images
      const imagesToLazyLoad = document.querySelectorAll('.project-thumbnail');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src') || img.src;
            if (src) {
              img.src = src;
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      imagesToLazyLoad.forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Handles the initial terminal animation sequence
    function initTerminal() {
      const terminal = document.getElementById('terminal');
      const terminalOverlay = document.getElementById('terminal-overlay');
      const lines = document.querySelectorAll('.terminal-content .line');
      const terminalClose = document.querySelector('.terminal-close');
      const terminalMinimize = document.querySelector('.terminal-minimize');
      const terminalMaximize = document.querySelector('.terminal-maximize');
      let lineIndex = 0;
      
      const urlParams = new URLSearchParams(window.location.search);
      const shouldSkipIntro = urlParams.get('skipIntro') === 'true';
      
      // Prevent showing intro repeatedly within a short time frame
      const lastIntroTime = localStorage.getItem('terminalIntroLastShown');
      const currentTime = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000; 
      
      if (shouldSkipIntro || (lastIntroTime && (currentTime - parseInt(lastIntroTime)) < tenMinutesInMs)) {
        terminal.classList.add('hidden');
        terminalOverlay.classList.add('hidden');
        document.body.classList.remove('terminal-active');
        startCodeRain();
        return;
      }
      
      localStorage.setItem('terminalIntroLastShown', currentTime.toString());
      
      terminal.classList.remove('hidden');
      terminalOverlay.classList.remove('hidden');
      document.body.classList.add('terminal-active'); // Prevent body scroll
      
      lines.forEach(line => { line.style.display = 'none'; });
      terminalClose.addEventListener('click', skipIntro);
      terminalMinimize.addEventListener('click', () => terminal.classList.toggle('minimized'));
      terminalMaximize.addEventListener('click', () => terminal.classList.remove('minimized')); // Restore if minimized
      
      function skipIntro() {
        terminalClose.removeEventListener('click', skipIntro);
        terminal.style.opacity = '0';
        terminalOverlay.style.opacity = '0';
        setTimeout(() => {
          terminal.classList.add('hidden');
          terminalOverlay.classList.add('hidden');
          document.body.classList.remove('terminal-active');
          startCodeRain();
        }, 500);
      }
      
      function scrollToHome() {
        const homeSection = document.getElementById('home');
        if (homeSection) {
          setTimeout(() => {
            homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
      
      setTimeout(showNextLine, 1000);
      
      // Display terminal lines sequentially with typing effect
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
          // Add notification about skipping intro
          const saveNotification = document.createElement('div');
          saveNotification.className = 'line';
          saveNotification.innerHTML = '<span class="blue">INFO:</span> Intro sequence skipped for 10 mins. Use `reset intro` in console to show again.';
          document.querySelector('.terminal-content').appendChild(saveNotification);
          
          // Hide terminal after showing notification
          setTimeout(() => {
            terminal.style.opacity = '0';
            terminalOverlay.style.opacity = '0';
            setTimeout(() => {
              terminal.classList.add('hidden');
              terminalOverlay.classList.add('hidden');
              document.body.classList.remove('terminal-active');
              startCodeRain();
            }, 500);
          }, 2000);
        }
      }
    }
    
    // Simulates a typing effect for a given element
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
    
    // Creates the Matrix-style code rain background effect
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
    
    // Animates the skill bars when the skills section is visible
    function animateSkillBars() {
      const skillBars = document.querySelectorAll('.skill-bar');
      
      skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
      });
    }
    
    // Initializes the typing/erasing effect for the hero subtitle
    function initTypingEffect() {
      const typedTextSpan = document.querySelector(".typed-text");
      const cursorSpan = document.querySelector(".typed-text + .cursor");
      
      if (!typedTextSpan || !cursorSpan) return;
      
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
    }
    
    // Sets up the mobile navigation menu toggle
    function initMobileMenu() {
      const menuToggle = document.getElementById('menu-toggle');
      const navLinks = document.getElementById('nav-links');
      
      if (!menuToggle || !navLinks) return;
      
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Play click sound
        const clickSound = document.getElementById('click-sound');
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play().catch(e => {}); // Ignore play errors
        }
      });
    }
    
    // Handles project filtering and pagination
    function initProjectCards() {
      // Elements
      const hoverSound = document.getElementById('hover-sound');
      const projectCards = document.querySelectorAll('.project-card');
      const prevPageBtn = document.getElementById('prev-page');
      const nextPageBtn = document.getElementById('next-page');
      const currentPageEl = document.getElementById('current-page');
      const totalPagesEl = document.getElementById('total-pages');
      
      if (!hoverSound || !projectCards.length) return;
      
      // Pagination settings
      const cardsPerPage = window.innerWidth <= 768 ? 3 : 6; // Show 3 projects on mobile, 6 on desktop
      let currentPage = 1;
      let filteredCards = [...projectCards]; // Start with all cards
      
      // Calculate total pages
      function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage) || 1; // Ensure at least 1 page
        currentPage = Math.min(currentPage, totalPages);
        
        // Update page info
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        if (currentPageEl) currentPageEl.textContent = currentPage;
        
        // Enable/disable buttons
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || filteredCards.length === 0;
        
        // Show/hide cards based on pagination
        showCurrentPageCards();
      }
      
      // Show only cards for current page
      function showCurrentPageCards() {
        const startIdx = (currentPage - 1) * cardsPerPage;
        const endIdx = startIdx + cardsPerPage;
        
        // Hide all cards using display: none
        projectCards.forEach(card => {
          card.style.display = 'none';
          card.style.opacity = '0'; // Keep opacity for fade effect consistency
        });
        
        // Show the filtered cards for the current page using display: flex
        filteredCards.forEach((card, index) => {
          if (index >= startIdx && index < endIdx) {
            card.style.display = 'flex'; // Use flex since cards are flex containers
            // Add fade-in effect (delay needed for display change)
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10); // Small delay after display change
          } else {
             // Ensure non-visible cards remain hidden and reset transform
             card.style.display = 'none';
             card.style.transform = 'translateY(10px)'; // Reset for potential future fade-in
          }
        });
      }
      
      // Project filtering
      const filterButtons = document.querySelectorAll('.project-filter-btn');
      if (filterButtons.length) {
        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            // Save current scroll position
            const projectsSection = document.getElementById('projects');
            const projectsSectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            if (filterValue === 'all') {
              filteredCards = [...projectCards];
            } else {
              filteredCards = [...projectCards].filter(card => {
                const techSpans = card.querySelectorAll('.project-tech span');
                const technologies = Array.from(techSpans).map(span => span.textContent.toLowerCase());
                return technologies.includes(filterValue.toLowerCase());
              });
            }
            
            // Reset to first page when filter changes
            currentPage = 1;
            updatePagination();
            
            // Restore scroll position
            window.scrollTo({
              top: projectsSectionTop,
              behavior: 'auto'
            });
          });
        });
      }
      
      // Add pagination button event listeners
      if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            // Save the current scroll position
            const currentScrollPos = window.scrollY;
            const projectsSection = document.getElementById('projects');
            const projectsSectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
            
            currentPage--;
            updatePagination();
            
            // Restore the scroll position relative to the projects section
            window.scrollTo({
              top: projectsSectionTop,
              behavior: 'auto'
            });
          }
        });
      }
      
      if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
          const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
          if (currentPage < totalPages) {
            // Save the current scroll position
            const currentScrollPos = window.scrollY;
            const projectsSection = document.getElementById('projects');
            const projectsSectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
            
            currentPage++;
            updatePagination();
            
            // Restore the scroll position relative to the projects section
            window.scrollTo({
              top: projectsSectionTop,
              behavior: 'auto'
            });
          }
        });
      }
      
      // Handle resize (for responsive pagination)
      window.addEventListener('resize', () => {
        const newCardsPerPage = window.innerWidth <= 768 ? 3 : 6;
        if (newCardsPerPage !== cardsPerPage) {
          cardsPerPage = newCardsPerPage;
          updatePagination();
        }
      });
      
      projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (!isMobileDevice()) {
            hoverSound.currentTime = 0;
            hoverSound.volume = 0.2;
            hoverSound.play().catch(e => {}); // Ignore play errors
          }
        });
      });
      
      // Initialize pagination
      updatePagination();
    }
    
    // Detects if the user is likely on a mobile device
    function isMobileDevice() {
      return (window.innerWidth <= 768) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    }
  
    // Easter Egg: Triple click logo for hack mode
    const logo = document.getElementById('logo');
    const easterEgg = document.getElementById('easter-egg');
    const easterSound = document.getElementById('easter-sound');
    const closeEasterEgg = document.getElementById('close-easter-egg');
    let clickCount = 0;
    let clickTimer = null;
    
    logo.addEventListener('click', (e) => {
      // Increment click counter
      clickCount++;
      
      // Visual feedback for multiple clicks
      if (clickCount === 2) {
        logo.style.color = 'var(--accent-color)'; // Blue on second click
      } else if (clickCount === 3) {
        logo.style.color = 'var(--danger-color)'; // Red on third click
        // Small visual glitch effect
        logo.style.textShadow = '2px 0 var(--danger-color), -2px 0 var(--accent-color)';
        setTimeout(() => {
          logo.style.textShadow = '';
        }, 100);
      }
      
      // Clear any existing timer
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      
      // Set timer to reset click count after 500ms
      clickTimer = setTimeout(() => {
        if (clickCount === 3) {
          easterEgg.classList.remove('hidden');
          easterSound.currentTime = 0;
          easterSound.play().catch(e => {}); // Ignore play errors
          
          if (dynamicElementsLoaded.commandConsole) {
            const consoleOutput = document.getElementById('console-output');
            const hackLine = document.createElement('div');
            hackLine.className = 'console-line';
            hackLine.innerHTML = '<span style="color:#ff2a6d;">ATTENTION:</span> Backdoor access granted. Use `hack` command.';
            consoleOutput.appendChild(hackLine);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
          }
        } 
        else if (clickCount === 1) {
          const homeSection = document.getElementById('home');
          if (homeSection) {
            const clickSound = document.getElementById('click-sound');
            if (clickSound) {
              clickSound.currentTime = 0;
              clickSound.play().catch(e => {}); // Ignore play errors
            }
            homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        
        // Reset state
        clickCount = 0;
        logo.style.color = '';
        logo.style.textShadow = '';
      }, 500);
    });
    
    closeEasterEgg.addEventListener('click', () => {
      easterEgg.classList.add('hidden');
    });
  
    // Displays a temporary system alert pop-up
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
    
    // Initializes the contact form submission handling
    function initContactForm() {
      const contactForm = document.getElementById('contact-form');
      const formStatus = document.getElementById('form-status');
      const submitBtn = document.getElementById('submit-btn');
      
      if (!contactForm) return;
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading spinner
        submitBtn.classList.add('loading');
        formStatus.textContent = '';
        formStatus.classList.remove('success', 'error');
        
        // Get the form data
        const formData = new FormData(this);
        
        // Validate form data
        const email = formData.get('email');
        const name = formData.get('name');
        const message = formData.get('message');
        
        // Simple validation
        if (!email || !name || !message) {
          formStatus.textContent = "Please fill out all fields.";
          formStatus.classList.add('error');
          submitBtn.classList.remove('loading');
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          formStatus.textContent = "Please enter a valid email address.";
          formStatus.classList.add('error');
          submitBtn.classList.remove('loading');
          return;
        }
        
        // Send the form data using fetch
        fetch(this.action, {
          method: this.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }
        })
        .then(data => {
          // Success message
          formStatus.textContent = "Message Sent Successfully! I'll get back to you soon.";
          formStatus.classList.add('success');
          
          // Analytics tracking if available
          if (window.gtag) {
            window.gtag('event', 'form_submission', {
              'event_category': 'Contact',
              'event_label': 'Form Submit Success'
            });
          }
          
          // Reset form
          this.reset();
          
          // Play success sound
          const successSound = document.getElementById('console-success');
          if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => {}); // Ignore play errors
          }
        })
        .catch(error => {
          console.error('Form submission error:', error);
          
          // Check if it's a network error
          if (!navigator.onLine) {
            formStatus.textContent = "You appear to be offline. Please check your internet connection and try again.";
          } else {
            formStatus.textContent = "Oops! Something went wrong. Please try again or contact me directly at andrethompsoncs@gmail.com";
          }
          
          formStatus.classList.add('error');
          
          // Play error sound
          const errorSound = document.getElementById('console-error');
          if (errorSound) {
            errorSound.currentTime = 0;
            errorSound.play().catch(e => {}); // Ignore play errors
          }
        })
        .finally(() => {
          // Hide loading spinner
          submitBtn.classList.remove('loading');
          
          // Scroll the form status into view
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });
    }
    
    // Initializes the command console functionality
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
        reset: {
          description: 'Reset terminal intro timer',
          execute: () => {
            localStorage.removeItem('terminalIntroLastShown');
            return 'Terminal intro timer reset. The terminal will appear on your next visit.';
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
            const vizPanel = document.getElementById('data-visualization-panel');
            vizPanel.classList.add('visible');
            
            // Create charts only when first made visible via command
            if (!dynamicElementsLoaded.visualizationPanel) {
              createPieChart();
              createBarChart();
              createLineChart();
              createFunctionPlot();
              dynamicElementsLoaded.visualizationPanel = true; 
            }
            
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
    
    // Initializes the data visualization panels (charts)
    function initDataVisualization() {
      // Don't show automatically, wait for trigger (e.g., console command or shortcut)
      // setTimeout(() => {
      //   const dataVisualizationPanel = document.getElementById('data-visualization-panel');
      //   dataVisualizationPanel.classList.add('visible');
      //   dynamicElementsLoaded.visualizationPanel = true;
        
      //   // Create charts only when first made visible
      //   if (!window.pieChart) createPieChart();
      //   if (!window.barChart) createBarChart();
      //   if (!window.lineChart) createLineChart();
      //   if (!window.functionPlot) createFunctionPlot();
        
      //   // Remove Auto-hide logic
      //   // setTimeout(() => {
      //   //   if (Math.random() > 0.5) { 
      //   //     dataVisualizationPanel.classList.remove('visible');
      //   //   }
      //   // }, 20000);
      // }, 15000);
      
      // Add close button functionality
      const vizPanel = document.getElementById('data-visualization-panel');
      const closeVizBtn = vizPanel?.querySelector('.panel-close');
      if (vizPanel && closeVizBtn) {
          closeVizBtn.addEventListener('click', () => {
              vizPanel.classList.remove('visible');
          });
      }
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
    
    // Initializes the live coding simulation panel
    function initCodePanel() {
      // Don't show automatically, wait for trigger
      // setTimeout(() => {
      //   const codePanel = document.getElementById('code-panel');
      //   codePanel.classList.add('visible');
      //   dynamicElementsLoaded.codePanel = true;
        
      //   // Start code animation only when first made visible
      //   animateCode(); 
        
      //   // Remove Auto-hide logic
      //   // setTimeout(() => {
      //   //   if (Math.random() > 0.3) { 
      //   //     codePanel.classList.remove('visible');
      //   //   }
      //   // }, 25000);
      // }, 12000);
      
      // Add close button functionality
      const codePanel = document.getElementById('code-panel');
      const closeCodeBtn = codePanel?.querySelector('.panel-close');
      if (codePanel && closeCodeBtn) {
          closeCodeBtn.addEventListener('click', () => {
              codePanel.classList.remove('visible');
          });
      }
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
    
    // Initializes all dynamic UI elements (panels, dashboard, console, popups)
    function initDynamicElements() {
       // Initialize console (appears after delay)
       initCommandConsole(); 
       
       // Initialize panels (but don't show them automatically)
       initDataVisualization();
       initCodePanel();
       
       // Initialize Hacker Dashboard Toggle and Meters
       const dashboard = document.getElementById('hacker-dashboard');
       const dashboardHeader = document.querySelector('.dashboard-header');
       if (dashboard && dashboardHeader) {
         dashboardHeader.addEventListener('click', () => {
           dashboard.classList.toggle('collapsed');
           const clickSound = document.getElementById('click-sound');
           if (clickSound) {
             clickSound.currentTime = 0;
             clickSound.volume = 0.4;
             clickSound.play().catch(e => {});
           }
         });
         
         const meters = dashboard.querySelectorAll('.meter span');
         meters.forEach(meter => {
           const randomDuration = 3 + Math.random() * 4;
           meter.style.animation = `meterAnimation ${randomDuration}s ease-in-out infinite`;
         });
       }
       
       // Show System Popup periodically (keep this for effect)
       setTimeout(() => {
         showSystemPopup();
         setInterval(() => {
           if (Math.random() < 0.3) {
             showSystemPopup();
           }
         }, 15000 + Math.random() * 20000);
       }, 8000);
       
       // Initialize Keyboard Shortcuts for toggling panels/console
       initKeyboardShortcuts();
    }

    // Function to handle keyboard shortcuts for dynamic elements
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
          // Ctrl + Space to toggle command console
          if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            const commandConsole = document.getElementById('command-console');
            if (commandConsole) {
                commandConsole.classList.toggle('active');
                if (commandConsole.classList.contains('active')) {
                    document.getElementById('console-input')?.focus();
                }
            }
          }
          
          // Ctrl + D to toggle dashboard (Keep this? Or remove? Let's keep for now)
          if (e.ctrlKey && e.code === 'KeyD') {
            e.preventDefault();
            const dashboard = document.getElementById('hacker-dashboard');
            dashboard?.classList.toggle('collapsed');
          }
          
          // Ctrl + V to toggle visualization panel
          if (e.ctrlKey && e.code === 'KeyV') {
            e.preventDefault();
            const vizPanel = document.getElementById('data-visualization-panel');
            if (vizPanel) {
                vizPanel.classList.toggle('visible');
                // Initialize charts only when first made visible via shortcut
                if (vizPanel.classList.contains('visible') && !dynamicElementsLoaded.visualizationPanel) {
                    createPieChart();
                    createBarChart();
                    createLineChart();
                    createFunctionPlot();
                    dynamicElementsLoaded.visualizationPanel = true;
                }
            }
          }
          
          // Ctrl + K to toggle code panel
          if (e.ctrlKey && e.code === 'KeyK') {
            e.preventDefault();
            const codePanel = document.getElementById('code-panel');
             if (codePanel) {
                codePanel.classList.toggle('visible');
                // Start animation only when first made visible via shortcut
                if (codePanel.classList.contains('visible') && !dynamicElementsLoaded.codePanel) {
                    animateCode();
                    dynamicElementsLoaded.codePanel = true;
                }
            }
          }
        });
    }
    
    // Adds functionality to the resume download button
    function initResumeDownload() {
      const resumeBtn = document.querySelector('.btn-download');
      if (!resumeBtn) return;
      
      resumeBtn.addEventListener('click', function(e) {
        // First try the normal download
        // If it fails (no file exists), we'll redirect to the HTML version
        
        const resumeHref = resumeBtn.getAttribute('href');
        const resumeFileName = resumeBtn.getAttribute('download');
        
        // Check if the file exists with a head request
        fetch(resumeHref, { method: 'HEAD' })
          .then(response => {
            if (!response.ok) {
              e.preventDefault();
              
              // File doesn't exist, redirect to HTML version instead
              window.open('Andre_Thompson_Resume.html', '_blank');
              
              // Show small notification
              const popup = document.createElement('div');
              popup.classList.add('system-popup');
              popup.style.borderColor = 'var(--success-color)';
              popup.textContent = "Opening resume in a new tab. You can use your browser's print function to save as PDF.";
              document.body.appendChild(popup);
              
              setTimeout(() => {
                popup.remove();
              }, 5000);
            }
            // If file exists, normal download proceeds
          })
          .catch(err => {
            console.error('Error checking resume file:', err);
            e.preventDefault();
            
            // On any error, use the HTML version as fallback
            window.open('Andre_Thompson_Resume.html', '_blank');
          });
      });
    }
    
    // Sets up the theme toggling functionality
    function initThemeToggle() {
      const themeToggle = document.getElementById('theme-toggle');
      const themeIcon = themeToggle.querySelector('.theme-icon');
      
      // Check for saved theme preference or use default (dark mode)
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.textContent = '☀️';
      }
      
      // Toggle theme on click
      themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        
        // Update icon and save preference
        if (document.documentElement.classList.contains('light-theme')) {
          themeIcon.textContent = '☀️';
          localStorage.setItem('theme', 'light');
        } else {
          themeIcon.textContent = '🌙';
          localStorage.setItem('theme', 'dark');
        }
        
        // Play click sound
        const clickSound = document.getElementById('click-sound');
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play().catch(e => {}); // Ignore play errors
        }
      });
    }
    
    // Initializes the Konami code easter egg listener
    function initKonamiCode() {
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      let konamiIndex = 0;
      
      document.addEventListener('keydown', (e) => {
        // Get the key that was pressed
        const key = e.code;
        
        // Check if the key matches the next key in the Konami sequence
        if (key === konamiCode[konamiIndex]) {
          konamiIndex++;
          
          // If the entire sequence was entered correctly
          if (konamiIndex === konamiCode.length) {
            activateKonamiCode();
            konamiIndex = 0; // Reset the index
          }
        } else {
          konamiIndex = 0; // Reset on incorrect key
          
          // If the incorrect key is the first key of the sequence, start over
          if (key === konamiCode[0]) {
            konamiIndex = 1;
          }
        }
      });
      
      function activateKonamiCode() {
        // Debug log
        console.log('Konami Code activated!');
        
        // Play a dedicated Konami sound
        const konamiSound = document.getElementById('konami-sound');
        const successSound = document.getElementById('console-success');
        const clickSound = document.getElementById('click-sound');
        
        // Try multiple sounds to ensure at least one plays
        if (konamiSound) {
          konamiSound.volume = 0.7; // Make sure volume is audible
          konamiSound.currentTime = 0;
          konamiSound.play()
            .then(() => console.log('Konami sound played'))
            .catch(e => {
              console.log('Failed to play konami sound:', e);
              // Try fallback sounds
              if (successSound) {
                successSound.volume = 0.7;
                successSound.currentTime = 0;
                successSound.play().catch(() => {
                  if (clickSound) {
                    clickSound.volume = 0.7;
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => console.log('All sounds failed:', e));
                  }
                });
              }
            });
        }
        
        // Show a special message
        showSystemPopup("KONAMI CODE ACTIVATED: DEVELOPER MODE UNLOCKED!");
        
        // Apply special effects to the page
        document.body.classList.add('konami-mode');
        console.log('Added konami-mode class to body');
        
        // Add rainbow border to all project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
          card.classList.add('konami-card');
        });
        console.log(`Added konami-card class to ${projectCards.length} project cards`);
        
        // Create a floating 8-bit character that follows the cursor
        createKonamiCharacter();
      }
      
      function createKonamiCharacter() {
        // Create the character element
        const character = document.createElement('div');
        character.className = 'konami-character';
        
        // Use the preloaded sprite
        const spriteImg = document.getElementById('konami-sprite');
        if (spriteImg) {
          // Use the preloaded image's src
          character.innerHTML = `<img src="${spriteImg.src}" alt="8-bit character" />`;
        } else {
          // Fallback to a direct URL if preloaded image not found
          character.innerHTML = '<img src="https://assets.codepen.io/27140/sonic-running.gif" alt="8-bit character" />';
        }
        
        document.body.appendChild(character);
        console.log('Added Konami character to the page');
        
        // Make character follow cursor with a delay
        let characterX = 0;
        let characterY = 0;
        
        // Start at center of screen
        characterX = window.innerWidth / 2 - 25;
        characterY = window.innerHeight / 2 - 25;
        character.style.left = `${characterX}px`;
        character.style.top = `${characterY}px`;
        
        document.addEventListener('mousemove', (e) => {
          // Set target position with some offset
          const targetX = e.clientX - 25; // Half of character width
          const targetY = e.clientY - 25; // Half of character height
          
          // Animate movement
          function updatePosition() {
            // Calculate distance to target
            const dx = targetX - characterX;
            const dy = targetY - characterY;
            
            // Move 10% of the distance each frame
            characterX += dx * 0.1;
            characterY += dy * 0.1;
            
            // Apply position
            character.style.left = `${characterX}px`;
            character.style.top = `${characterY}px`;
            
            // Continue animation if not very close to target
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              requestAnimationFrame(updatePosition);
            }
          }
          
          // Start animation
          requestAnimationFrame(updatePosition);
        });
      }
    }
    
    // Initializes Music Control Toggle
    function initMusicControl() {
      const musicControl = document.getElementById('music-control');
      const bgMusic = document.getElementById('bg-music');
      
      if (!musicControl || !bgMusic) return;
      
      musicControl.addEventListener('click', () => {
        if (bgMusic.muted) {
          bgMusic.muted = false;
          bgMusic.volume = 0.3; // Set volume
          musicControl.textContent = "Mute Music";
          musicControl.style.color = "var(--secondary-color)"; // Indicate playing state
          bgMusic.play().catch(e => console.warn('Background music play prevented by browser policy.'));
        } else {
          bgMusic.muted = true;
          musicControl.textContent = "Unmute Music";
          musicControl.style.color = "var(--primary-color)"; // Indicate muted state
          bgMusic.pause(); // Pause when muted
        }
      });
    }
  });
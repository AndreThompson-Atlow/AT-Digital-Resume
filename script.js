document.addEventListener('DOMContentLoaded', () => {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Track loaded dynamic elements
    let dynamicElementsLoaded = {
      commandConsole: false,
      visualizationPanel: false,
      codePanel: false
    };
    
    // Initialize only essential features first
    initEssentialFeatures();
    
    // Lazy load non-essential features
    if ('IntersectionObserver' in window) {
      lazyLoadFeatures();
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      window.addEventListener('load', initNonEssentialFeatures);
    }
    
    // Initialize only the essential features needed for initial view
    function initEssentialFeatures() {
      // Terminal intro animation
      initTerminal();
      
      // Typing effect for hero section
      initTypingEffect();
      
      // Mobile menu toggle
      initMobileMenu();
      
      // Form handling
      initContactForm();
      
      // Resume download handling
      initResumeDownload();
      
      // Theme toggle
      initThemeToggle();
      
      // Initialize Konami Code easter egg
      initKonamiCode();
    }
    
    // Lazy load features as they come into viewport
    function lazyLoadFeatures() {
      const featureSections = {
        'skills': () => animateSkillBars(),
        'projects': () => initProjectCards(),
        'contact': () => {} // Contact form already initialized
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
    
    // Terminal intro animation
    function initTerminal() {
      const terminal = document.getElementById('terminal');
      const terminalOverlay = document.getElementById('terminal-overlay');
      const lines = document.querySelectorAll('.terminal-content .line');
      const terminalClose = document.querySelector('.terminal-close');
      let lineIndex = 0;
      
      // Check URL parameters for skipIntro
      const urlParams = new URLSearchParams(window.location.search);
      const shouldSkipIntro = urlParams.get('skipIntro') === 'true';
      
      // Check localStorage for last intro time
      const lastIntroTime = localStorage.getItem('terminalIntroLastShown');
      const currentTime = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000; 
      
      // Skip intro if URL parameter is set, or if less than 10 minutes have passed since last showing
      if (shouldSkipIntro || (lastIntroTime && (currentTime - parseInt(lastIntroTime)) < tenMinutesInMs)) {
        // Immediately hide terminal elements
        terminal.classList.add('hidden');
        terminalOverlay.classList.add('hidden');
        document.body.classList.remove('terminal-active');
        startCodeRain();
        return;
      }
      
      // Store current time as last shown time
      localStorage.setItem('terminalIntroLastShown', currentTime.toString());
      
      // Make sure terminal and overlay are visible at start
      terminal.classList.remove('hidden');
      terminalOverlay.classList.remove('hidden');
      
      // Prevent scrolling while terminal is active
      document.body.classList.add('terminal-active');
      
      // Hide all lines initially
      lines.forEach(line => {
        line.style.display = 'none';
      });
      
      // Allow skipping the intro
      terminalClose.addEventListener('click', skipIntro);
      
      function skipIntro() {
        // Remove event listener to prevent multiple calls
        terminalClose.removeEventListener('click', skipIntro);
        
        // Hide terminal immediately
        terminal.style.opacity = '0';
        terminalOverlay.style.opacity = '0';
        setTimeout(() => {
          terminal.classList.add('hidden');
          terminalOverlay.classList.add('hidden');
          
          // Allow scrolling again
          document.body.classList.remove('terminal-active');
          
          startCodeRain(); // Start the Matrix-like code rain
          
          // Scroll to home section
          scrollToHome();
        }, 500);
      }
      
      // Function to scroll to home section
      function scrollToHome() {
        const homeSection = document.getElementById('home');
        if (homeSection) {
          // Scroll to home with a slight delay for smoother transition
          setTimeout(() => {
            homeSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      }
      
      // Start the terminal animation
      setTimeout(showNextLine, 1000);
      
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
          // Show a quick notification about the intro being saved
          const saveNotification = document.createElement('div');
          saveNotification.className = 'line';
          saveNotification.innerHTML = '<span class="blue">INFO:</span> This intro will be hidden for 10 minutes. Type "reset" in console to show it again.';
          document.querySelector('.terminal-content').appendChild(saveNotification);
          
          // Wait a bit more before hiding
          setTimeout(() => {
            terminal.style.opacity = '0';
            terminalOverlay.style.opacity = '0';
            setTimeout(() => {
              terminal.classList.add('hidden');
              terminalOverlay.classList.add('hidden');
              
              // Allow scrolling again
              document.body.classList.remove('terminal-active');
              
              startCodeRain(); // Start the Matrix-like code rain
              
              // Scroll to home section
              scrollToHome();
            }, 500);
          }, 2000);
        }
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
          clickSound.play().catch(e => console.log('Audio play prevented by browser'));
        }
      });
    }
  
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
        
        // First hide all cards but keep their space in the layout
        projectCards.forEach(card => {
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          card.style.position = 'absolute';
          card.style.pointerEvents = 'none';
        });
        
        // Only show the filtered cards for current page
        filteredCards.forEach((card, index) => {
          if (index >= startIdx && index < endIdx) {
            card.style.position = 'relative';
            card.style.visibility = 'visible';
            card.style.pointerEvents = 'auto';
            
            // Add fade-in effect
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50 * (index - startIdx)); // Stagger the animations
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
          if (!isMobileDevice()) { // Only play sound on non-mobile devices
            hoverSound.currentTime = 0;
            hoverSound.volume = 0.2; // Lower volume
            hoverSound.play().catch(e => console.log('Audio play prevented by browser'));
          }
        });
      });
      
      // Initialize pagination
      updatePagination();
    }
    
    // Detect if user is on a mobile device
    function isMobileDevice() {
      return (window.innerWidth <= 768) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    }
  
    // Easter Egg: Triple click logo for hack mode, single click for home
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
        // If it was a triple click, show hack mode
        if (clickCount === 3) {
          // Activate hack mode
          easterEgg.classList.remove('hidden');
          easterSound.currentTime = 0;
          easterSound.play().catch(e => console.log('Audio play prevented by browser'));
          
          // Add console hack command
          if (dynamicElementsLoaded.commandConsole) {
            const consoleOutput = document.getElementById('console-output');
            const hackLine = document.createElement('div');
            hackLine.className = 'console-line';
            hackLine.innerHTML = '<span style="color:#ff2a6d;">ATTENTION:</span> Backdoor access granted. Type "hack" to initiate.';
            consoleOutput.appendChild(hackLine);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
          }
        } 
        // If it was a single click, scroll to home
        else if (clickCount === 1) {
          // Scroll to home section
          const homeSection = document.getElementById('home');
          if (homeSection) {
            // Play click sound
            const clickSound = document.getElementById('click-sound');
            if (clickSound) {
              clickSound.currentTime = 0;
              clickSound.play().catch(e => console.log('Audio play prevented by browser'));
            }
            
            homeSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
        
        // Reset click count and appearance
        clickCount = 0;
        logo.style.color = '';
        logo.style.textShadow = '';
      }, 500);
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
            successSound.play().catch(e => console.log('Audio play prevented by browser'));
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
            errorSound.play().catch(e => console.log('Audio play prevented by browser'));
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
    
    // Handle resume download with fallback
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
    
    // Theme toggle functionality
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
          clickSound.play().catch(e => console.log('Audio play prevented by browser'));
        }
      });
    }
    
    // Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
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
  });
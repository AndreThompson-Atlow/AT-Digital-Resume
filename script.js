document.addEventListener('DOMContentLoaded', () => {
    // Terminal intro animation
    const terminal = document.getElementById('terminal');
    const lines = document.querySelectorAll('.terminal-content .line');
    let lineIndex = 0;
    
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
  
    // Resize event for canvas
    window.addEventListener('resize', () => {
      const codeRainCanvas = document.getElementById('code-rain');
      if (codeRainCanvas) {
        codeRainCanvas.width = window.innerWidth;
        codeRainCanvas.height = window.innerHeight;
      }
    });
  });
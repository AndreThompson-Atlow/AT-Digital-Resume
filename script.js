// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Contact Form Submission
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out! I will get back to you soon.');
    this.reset();
  });
  
  // Play sound on project card hover
  const hoverSound = document.getElementById('hover-sound');
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
  });
  
  // Easter Egg: Toggle hidden hack mode message when logo is clicked
  const logo = document.getElementById('logo');
  const easterEgg = document.getElementById('easter-egg');
  const easterSound = document.getElementById('easter-sound');
  
  logo.addEventListener('click', () => {
    easterEgg.classList.toggle('hidden');
    easterSound.currentTime = 0;
    easterSound.play();
    // Auto-hide the easter egg after 3 seconds if visible
    if (!easterEgg.classList.contains('hidden')) {
      setTimeout(() => {
        easterEgg.classList.add('hidden');
      }, 3000);
    }
  });
  
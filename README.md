# AT Digital Resume

An interactive cyberpunk-themed portfolio website showcasing my software engineering skills and projects.

## Features

- **Immersive UI**: Dark/light theme with cyberpunk aesthetics, responsive design across all devices
- **Interactive Elements**: Terminal simulator, command console, and dynamic data panels
- **Project Showcase**: Filterable gallery of web applications with live demos and code access
- **Backend Integration**: Node.js server handling API proxies for Gemini AI and Google TTS

## Getting Started

### Prerequisites

- Node.js (v14+)
- NPM or Yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/YourUsername/AT-Digital-Resume.git
   cd AT-Digital-Resume
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## Configuration

### Resume Download

Place your resume PDF in the root directory as `Andre_Thompson_Resume.pdf`. The download button will automatically link to it.

### Contact Form

The contact form uses [Formspree](https://formspree.io/) for serverless submission:

1. Create a form at Formspree and get your endpoint ID
2. Update the form action in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### API Integration

For the CyberVoice application to function correctly, you'll need:

1. Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_TTS_API_KEY=your_google_tts_api_key
   PORT=3000
   ```

2. Or use the minimal server with client-side keys:
   ```
   node minimal-server.js
   ```

## Development Notes

### Architecture

The portfolio consists of:
- Static HTML/CSS/JS for the main portfolio experience
- Interactive project applications built with vanilla JS and HTML5 APIs
- Node.js backend for API proxying and security

### Project Structure

```
AT-Digital-Resume/
├── index.html              # Main portfolio page
├── style.css               # Global styles and theming
├── script.js               # Core functionality
├── projects/               # Individual project applications
│   ├── cybervoice/         # AI voice assistant
│   ├── cybertrivia/        # Quiz application
│   └── ...
├── server.js               # Full backend server
└── minimal-server.js       # Lightweight development server
```

### Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (14+)

## Deployment

The static portion can be deployed to GitHub Pages or any static hosting service.
For the full experience including API functionality, deploy to a Node.js hosting service like:

- Heroku
- Vercel
- Railway

## License

MIT

## Acknowledgments

- Fonts: Google Fonts (Share Tech Mono, VT323)
- Audio: SoundHelix for ambient music
- Icons: Font Awesome and custom SVGs 
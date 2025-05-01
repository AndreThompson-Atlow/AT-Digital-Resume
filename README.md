# AT Digital Resume

A cyberpunk-themed portfolio website with interactive terminal and animation effects.

## Setup Instructions

### Resume Download Feature

The resume download button can work in two ways:

1. **PDF Direct Download**: Place a file named `Andre_Thompson_Resume.pdf` in the root directory of the site. This will be downloaded when users click the "Download Resume" button.

2. **HTML Fallback**: If the PDF file isn't found, users are redirected to `Andre_Thompson_Resume.html`, which they can print to PDF from their browser.

### Contact Form Setup

The contact form uses [Formspree](https://formspree.io/) for serverless form submission:

1. Sign up for a free Formspree account
2. Create a new form and get your form endpoint ID
3. Replace the ID in the HTML form action: `action="https://formspree.io/f/YOUR_FORM_ID"` in `index.html`

Current setup uses a placeholder ID that needs to be replaced with your own.

#### Form Spam Protection

The form includes these spam protection features:
- Honeypot field (`_gotcha`)
- Custom subject line
- Client-side validation

### Terminal Animation

The site features a terminal intro animation that can be:
- Skipped by clicking the × button
- Automatically directs to the Home section when completed

### Easter Eggs

- Triple-click the logo to activate "hack mode"
- Type "hack" in the command console for the same effect
- More hidden features to discover!

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Credits

- Sound effects from [SoundJay](https://www.soundjay.com/)
- Background music from [SoundHelix](https://www.soundhelix.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## License

MIT

## CyberVoice - Backend Setup

The CyberVoice application now includes a backend server to handle API calls securely. Follow these steps to run it:

### Prerequisites

- Node.js installed on your system
- NPM (Node Package Manager)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

### Configuration

The server uses environment variables for API keys. These are stored in a `.env` file in the root directory.

The server will automatically create this file with default keys on startup, but you should replace them with your own keys for production use:

```
# API Keys - Replace with your actual keys
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_TTS_API_KEY=your_google_tts_api_key_here

# Port for the server
PORT=3000
```

### Running the Server

Start the server with:

```
npm start
```

Or run it directly with:

```
node server.js
```

The server will start on port 3000 by default (configurable in the .env file).

### Accessing CyberVoice

After starting the server, you can access the CyberVoice application at:

```
http://localhost:3000/projects/cybervoice/index.html
```

### API Endpoints

The server provides two main API endpoints:

- `/api/gemini` - Proxies requests to Google's Gemini AI API
- `/api/tts` - Proxies requests to Google's Text-to-Speech API

These endpoints handle authentication with API keys stored on the server, avoiding CORS issues and keeping your API keys secure. 
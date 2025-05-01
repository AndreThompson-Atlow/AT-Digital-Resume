require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Try to create .env file if it doesn't exist
try {
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', 
`# API Keys - Replace with your actual keys from Google Cloud Console
# The sample keys below are placeholders and won't work
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_TTS_API_KEY=your_google_tts_api_key_here

# Port for the server
PORT=3000`);
    console.log('.env file created with default keys');
  }
} catch (err) {
  console.error('Error creating .env file:', err);
}

// Middleware for API routes
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

// Check if keys look valid
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️ WARNING: You need to set a valid GEMINI_API_KEY in your .env file');
}

if (!GOOGLE_TTS_API_KEY || GOOGLE_TTS_API_KEY === 'your_google_tts_api_key_here') {
  console.warn('⚠️ WARNING: You need to set a valid GOOGLE_TTS_API_KEY in your .env file');
}

// Log all API requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Endpoint to provide API key status information
app.get('/api/status', (req, res) => {
  // Set content type explicitly to avoid HTML responses
  res.setHeader('Content-Type', 'application/json');
  
  res.json({
    gemini: {
      keyProvided: GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here',
      instructions: 'Get a Gemini API key from Google AI Studio: https://ai.google.dev/'
    },
    tts: {
      keyProvided: GOOGLE_TTS_API_KEY && GOOGLE_TTS_API_KEY !== 'your_google_tts_api_key_here',
      instructions: 'Get a Google TTS API key from Google Cloud Console: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com'
    }
  });
});

// Endpoint to proxy Gemini API requests
app.post('/api/gemini', (req, res) => {
  // Set content type explicitly to avoid HTML responses
  res.setHeader('Content-Type', 'application/json');
  
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return res.status(401).json({
      error: {
        message: "No valid Gemini API key configured. Edit the .env file to add your API key.",
        help: "Get your API key from Google AI Studio: https://ai.google.dev/"
      }
    });
  }

  // Check if request body exists
  if (!req.body) {
    return res.status(400).json({
      error: {
        message: "Missing request body",
        help: "Make sure to send a valid JSON body with your request"
      }
    });
  }

  axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    req.body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: GEMINI_API_KEY
      }
    }
  ).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // Provide helpful error messages based on the error type
    if (error.response?.status === 403) {
      res.status(403).json({
        error: {
          message: "Invalid or unauthorized Gemini API key. Please check your API key in the .env file.",
          details: error.response?.data || error.message,
          help: "Make sure your API key is valid and has access to the Gemini API"
        }
      });
    } else {
      res.status(error.response?.status || 500).json({
        error: {
          message: "Error calling Gemini API",
          details: error.response?.data || error.message
        }
      });
    }
  });
});

// Endpoint to proxy Google TTS API requests
app.post('/api/tts', (req, res) => {
  // Set content type explicitly to avoid HTML responses
  res.setHeader('Content-Type', 'application/json');
  
  // Check if API key is configured
  if (!GOOGLE_TTS_API_KEY || GOOGLE_TTS_API_KEY === 'your_google_tts_api_key_here') {
    return res.status(401).json({
      error: {
        message: "No valid Google TTS API key configured. Edit the .env file to add your API key.",
        help: "Get your API key from Google Cloud Console: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com"
      }
    });
  }

  // Check if request body exists
  if (!req.body) {
    return res.status(400).json({
      error: {
        message: "Missing request body",
        help: "Make sure to send a valid JSON body with your request"
      }
    });
  }

  axios.post(
    'https://texttospeech.googleapis.com/v1/text:synthesize',
    req.body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: GOOGLE_TTS_API_KEY
      }
    }
  ).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.error('Google TTS API Error:', error.response?.data || error.message);
    
    // Provide helpful error messages based on the error type
    if (error.response?.status === 403) {
      res.status(403).json({
        error: {
          message: "Invalid or unauthorized Google TTS API key. Please check your API key in the .env file.",
          details: error.response?.data || error.message,
          help: "Make sure your API key is valid and has the Text-to-Speech API enabled in Google Cloud Console"
        }
      });
    } else {
      res.status(error.response?.status || 500).json({
        error: {
          message: "Error calling Google TTS API",
          details: error.response?.data || error.message
        }
      });
    }
  });
});

// Handle 404 for API routes to avoid HTML responses
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: {
      message: "API endpoint not found",
      help: "Check the URL and try again"
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Access CyberVoice at http://localhost:${PORT}/projects/cybervoice/index.html`);
  console.log('\n---------------------------------------------');
  console.log('IMPORTANT: You need to set up valid API keys in the .env file');
  console.log('  - For Gemini: https://ai.google.dev/');
  console.log('  - For Google TTS: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com');
  console.log('---------------------------------------------\n');
}); 
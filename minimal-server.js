require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { generateProjectThumbnails, getThumbnailPath } = require('./screenshot-utility');
const { updateProjectThumbnails } = require('./update-project-thumbnails');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API Keys
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY || 'your_google_tts_api_key_here';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    tts: {
      keyProvided: GOOGLE_TTS_API_KEY !== 'your_google_tts_api_key_here'
    },
    gemini: {
      keyProvided: GEMINI_API_KEY !== 'your_gemini_api_key_here'
    }
  });
});

// Thumbnail generation endpoint
app.get('/api/generate-thumbnails', async (req, res) => {
  console.log('Thumbnail generation request received');
  try {
    const force = req.query.force === 'true';
    const result = await generateProjectThumbnails(force);
    
    // Update index.html to use the new thumbnails
    const updateResult = await updateProjectThumbnails();
    
    res.json({
      success: true,
      message: 'Thumbnails generated and HTML updated successfully',
      thumbnailPath: result,
      updatedProjects: updateResult.updatedProjects,
      missingThumbnails: updateResult.missingThumbnails
    });
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating thumbnails',
      error: error.message
    });
  }
});

// Get thumbnails list endpoint
app.get('/api/thumbnails', (req, res) => {
  try {
    const thumbnailsDir = path.join(__dirname, 'thumbnails');
    const projectsDir = path.join(__dirname, 'projects');
    
    // Get list of project folders
    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
      
    // Map projects to their thumbnail paths
    const thumbnails = projectFolders.map(project => {
      const thumbnailPath = getThumbnailPath(project);
      return {
        project,
        thumbnailPath,
        exists: !!thumbnailPath
      };
    });
    
    res.json({
      success: true,
      thumbnails
    });
  } catch (error) {
    console.error('Error getting thumbnails list:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting thumbnails list',
      error: error.message
    });
  }
});

// Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  console.log('Gemini API request received');
  console.log('Request body:', req.body);
  
  // Determine which API key to use: Client-provided (header) or Server (.env)
  const clientApiKey = req.headers['x-api-key']; // Check for custom header
  const apiKeyToUse = clientApiKey || GEMINI_API_KEY; // Prioritize client key
  const keySource = clientApiKey ? 'client' : 'server (.env)';

  // Check if *any* valid key is available
  if (!apiKeyToUse || apiKeyToUse === 'your_gemini_api_key_here') {
    console.log(`No valid Gemini API key available (Checked ${keySource})`);
    return res.status(401).json({
      error: {
        message: "No valid Gemini API key provided or configured."
      }
    });
  }

  try {
    console.log(`Sending request to Gemini API using key from ${keySource}`);
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: apiKeyToUse // Use the determined key
        }
      }
    );
    
    console.log('Gemini API response received');
    res.json(response.data);
  } catch (error) {
    const errorDetails = error.response?.data?.error || { message: error.message };
    console.error(`Gemini API Error (using ${keySource} key):`, errorDetails);
    res.status(error.response?.status || 500).json({
      error: {
        message: `Error calling Gemini API (using ${keySource} key)`,
        details: errorDetails
      }
    });
  }
});

// TTS endpoint
app.post('/api/tts', async (req, res) => {
  console.log('TTS API request received');
  
  // Determine which API key to use: Client-provided (header) or Server (.env)
  const clientApiKey = req.headers['x-api-key']; // Check for custom header
  const apiKeyToUse = clientApiKey || GOOGLE_TTS_API_KEY; // Prioritize client key
  const keySource = clientApiKey ? 'client' : 'server (.env)';

  // Check if *any* valid key is available
  if (!apiKeyToUse || apiKeyToUse === 'your_google_tts_api_key_here') {
    console.log(`No valid Google TTS API key available (Checked ${keySource})`);
    return res.status(401).json({
      error: {
        message: "No valid Google TTS API key provided or configured."
      }
    });
  }

  try {
    console.log(`Sending request to Google TTS API using key from ${keySource}`);
    const response = await axios.post(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: apiKeyToUse // Use the determined key
        }
      }
    );
    
    console.log('Google TTS API response received');
    res.json(response.data);
  } catch (error) {
    const errorDetails = error.response?.data?.error || { message: error.message };
    console.error(`Google TTS API Error (using ${keySource} key):`, errorDetails);
    // Send specific error message back to client if available
    res.status(error.response?.status || 500).json({
      error: {
        message: `Error calling Google TTS API (using ${keySource} key): ${errorDetails.message || 'Unknown error'}`,
        details: errorDetails
      }
    });
  }
});

// Handle favicon requests gracefully
app.get('/favicon.ico', (req, res) => res.status(204).send());

// Start server
app.listen(PORT, () => {
  console.log(`Minimal server running at http://localhost:${PORT}`);
  console.log(`Access TTS API at http://localhost:${PORT}/api/tts`);
  console.log(`Access Gemini API at http://localhost:${PORT}/api/gemini`);
  console.log(`Access thumbnails generator at http://localhost:${PORT}/api/generate-thumbnails`);
  console.log(`Status endpoint at http://localhost:${PORT}/api/status`);
  
  // Log API key status
  if (GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    console.log('Gemini API key is configured ✅');
  } else {
    console.log('⚠️ WARNING: No valid Gemini API key found in .env file');
  }
  
  if (GOOGLE_TTS_API_KEY !== 'your_google_tts_api_key_here') {
    console.log('Google TTS API key is configured ✅');
  } else {
    console.log('⚠️ WARNING: No valid Google TTS API key found in .env file');
  }
}); 
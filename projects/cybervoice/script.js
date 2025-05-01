document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const textInput = document.getElementById('text-input');
  const aiPrompt = document.getElementById('ai-prompt');
  const generateAiBtn = document.getElementById('generate-ai-btn');
  const convertSpeechBtn = document.getElementById('convert-speech-btn');
  const clearBtn = document.getElementById('clear-btn');
  const audioPlayer = document.getElementById('audio-player');
  const consoleOutput = document.getElementById('console-output');
  const consoleToggle = document.getElementById('console-toggle');
  const playButton = document.getElementById('play-button');
  const pauseButton = document.getElementById('pause-button');
  const stopButton = document.getElementById('stop-button');
  const downloadButton = document.getElementById('download-button');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const notificationClose = document.getElementById('notification-close');
  const progressBar = document.getElementById('processing-progress');
  const speechifyStatus = document.getElementById('speechify-status');
  const geminiStatus = document.getElementById('gemini-status');
  const themeToggle = document.getElementById('theme-toggle');
  const presetButtons = document.querySelectorAll('.preset-button');
  
  // API settings modal elements
  const apiSettingsBtn = document.getElementById('api-settings-btn');
  const apiSettingsModal = document.getElementById('api-settings-modal');
  const modalClose = document.querySelector('.modal-close');
  const saveApiKeysBtn = document.getElementById('save-api-keys');
  const speechifyKeyInput = document.getElementById('speechify-key');
  const geminiKeyInput = document.getElementById('gemini-key');
  const closeApiModalBtn = document.getElementById('close-api-modal');
  
  // Voice controls
  const voiceSelect = document.getElementById('voice-select');
  const languageSelect = document.getElementById('language-select');
  const modelSelect = document.getElementById('model-select');
  const formatSelect = document.getElementById('format-select');
  
  // State
  let currentAudioUrl = null;
  let isConsoleMinimized = false;
  
  // --- API Key Management --- 
  // Use these variables to hold the *currently active* keys
  let ACTIVE_TTS_API_KEY = null;
  let ACTIVE_GEMINI_API_KEY = null;
  let IS_USING_USER_TTS_KEY = false;
  let IS_USING_USER_GEMINI_KEY = false;
  
  // Initialize
  function init() {
    loadApiKeys(); // Load keys from localStorage first
    updateStatusDisplay(); // Update UI based on loaded keys
    updateConsoleUI();
    setupEventListeners();
    showWelcomePromptIfNeeded();
  }

  // Load keys from localStorage and update active keys/UI
  function loadApiKeys() {
    const savedTtsKey = localStorage.getItem('googleTtsApiKey');
    const savedGeminiKey = localStorage.getItem('geminiApiKey');

    if (savedTtsKey) {
      ACTIVE_TTS_API_KEY = savedTtsKey;
      IS_USING_USER_TTS_KEY = true;
      if (speechifyKeyInput) speechifyKeyInput.value = savedTtsKey; // Populate input field
      logToConsole('Loaded user Google TTS API key from local storage');
    } else {
      logToConsole('No user Google TTS API key found in local storage.');
    }

    if (savedGeminiKey) {
      ACTIVE_GEMINI_API_KEY = savedGeminiKey;
      IS_USING_USER_GEMINI_KEY = true;
      if (geminiKeyInput) geminiKeyInput.value = savedGeminiKey; // Populate input field
      logToConsole('Loaded user Gemini API key from local storage');
    } else {
      logToConsole('No user Gemini API key found in local storage.');
    }
  }

  // Save keys from modal inputs to localStorage and update active keys
  function saveApiKeys() {
    const ttsKey = speechifyKeyInput ? speechifyKeyInput.value.trim() : null;
    const geminiKey = geminiKeyInput ? geminiKeyInput.value.trim() : null;

    let keysChanged = false;

    if (ttsKey) {
      localStorage.setItem('googleTtsApiKey', ttsKey);
      ACTIVE_TTS_API_KEY = ttsKey;
      IS_USING_USER_TTS_KEY = true;
      logToConsole('User Google TTS API key saved to local storage.');
      keysChanged = true;
    } else {
      // If input is cleared, remove from storage and reset active key
      localStorage.removeItem('googleTtsApiKey');
      ACTIVE_TTS_API_KEY = null;
      IS_USING_USER_TTS_KEY = false;
      logToConsole('User Google TTS API key cleared from local storage.');
      if (speechifyKeyInput) speechifyKeyInput.value = ''; 
       keysChanged = true; // Consider clearing a key as a change
    }

    if (geminiKey) {
      localStorage.setItem('geminiApiKey', geminiKey);
      ACTIVE_GEMINI_API_KEY = geminiKey;
      IS_USING_USER_GEMINI_KEY = true;
      logToConsole('User Gemini API key saved to local storage.');
      keysChanged = true;
    } else {
      // If input is cleared, remove from storage and reset active key
      localStorage.removeItem('geminiApiKey');
      ACTIVE_GEMINI_API_KEY = null;
      IS_USING_USER_GEMINI_KEY = false;
      logToConsole('User Gemini API key cleared from local storage.');
       if (geminiKeyInput) geminiKeyInput.value = '';
       keysChanged = true; // Consider clearing a key as a change
    }

    if (keysChanged) {
      showNotification('API keys updated!', 'success');
      updateStatusDisplay(); // Update the status indicators
    }

    // Close the modal
    if (apiSettingsModal) apiSettingsModal.classList.remove('show');
  }

  // Update the status indicators in the UI
  function updateStatusDisplay() {
    if (speechifyStatus) {
      if (IS_USING_USER_TTS_KEY) {
        speechifyStatus.textContent = 'Connected (User Key)';
        speechifyStatus.className = 'status-value success';
      } else {
        speechifyStatus.textContent = 'Using Server Default';
        speechifyStatus.className = 'status-value default'; 
      }
    }
    if (geminiStatus) {
      if (IS_USING_USER_GEMINI_KEY) {
        geminiStatus.textContent = 'Connected (User Key)';
        geminiStatus.className = 'status-value success';
      } else {
        geminiStatus.textContent = 'Using Server Default';
        geminiStatus.className = 'status-value default';
      }
    }
  }

  // Show welcome/setup prompt only if no keys are stored
  function showWelcomePromptIfNeeded() {
    const hasAnyUserKey = localStorage.getItem('googleTtsApiKey') || localStorage.getItem('geminiApiKey');
    if (!hasAnyUserKey) {
      setTimeout(() => {
          showNotification('Enter your API keys via the ⚙️ icon for full access, or use server defaults (if available).');
          logToConsole('Welcome to CyberVoice! Configure your own API keys or use server defaults.');
      }, 1500);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Generate AI text
    generateAiBtn.addEventListener('click', generateAIText);
    
    // Convert text to speech
    convertSpeechBtn.addEventListener('click', convertTextToSpeech);
    
    // Clear text
    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      logToConsole('Text input cleared');
    });
    
    // Console toggle
    consoleToggle.addEventListener('click', toggleConsole);
    
    // Audio controls
    playButton.addEventListener('click', playAudio);
    pauseButton.addEventListener('click', pauseAudio);
    stopButton.addEventListener('click', stopAudio);
    downloadButton.addEventListener('click', downloadAudio);
    
    // Notification close
    notificationClose.addEventListener('click', closeNotification);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Preset prompts
    presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        aiPrompt.value = button.dataset.prompt;
        logToConsole(`Preset prompt selected: ${button.textContent}`);
      });
    });
    
    // API Settings Modal
    apiSettingsBtn.addEventListener('click', () => {
      if (apiSettingsModal) {
        apiSettingsModal.classList.add('show');
        fetchServerStatusForModal(); // Fetch server status when opening
      }
    });
    
    modalClose.addEventListener('click', () => {
      if (apiSettingsModal) apiSettingsModal.classList.remove('show');
    });
    
    // New close button for API settings modal (if it exists)
    if (closeApiModalBtn) {
      closeApiModalBtn.addEventListener('click', () => {
        if (apiSettingsModal) apiSettingsModal.classList.remove('show');
      });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
      if (apiSettingsModal && e.target === apiSettingsModal) {
        apiSettingsModal.classList.remove('show');
      }
    });
    
    // Restore Save API Keys listener
    if (saveApiKeysBtn) { 
      saveApiKeysBtn.addEventListener('click', saveApiKeys);
    } else {
      logToConsole('Save API Keys button not found in the DOM', 'error'); // Keep this check just in case
    }
  }
  
  // Fetch and display server key status in the modal
  async function fetchServerStatusForModal() {
    const statusEl = document.querySelector('.api-status-message h3');
    const statusTextEl = document.querySelector('.api-status-message p:last-of-type'); // Assuming p follows h3
    if (!statusEl || !statusTextEl) return;
    
    statusTextEl.textContent = 'Checking server status...';

    try {
      const apiStatusUrl = new URL('/api/status', window.location.origin).href;
      const response = await fetch(apiStatusUrl);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      const geminiServerStatus = data.gemini?.keyProvided ? 'Configured ✅' : 'Not Configured ❌';
      const ttsServerStatus = data.tts?.keyProvided ? 'Configured ✅' : 'Not Configured ❌';

      statusTextEl.innerHTML = `Gemini Key (Server): ${geminiServerStatus}<br>Google TTS Key (Server): ${ttsServerStatus}`;

    } catch (err) {
      console.error('Error fetching server API status:', err);
      statusTextEl.innerHTML = `<span style="color: var(--danger-color)">Could not connect to server.</span><br>Make sure it's running: <pre>node minimal-server.js</pre>`;
    }
  }
  
  // Generate AI text using Gemini API
  async function generateAIText() {
    const prompt = aiPrompt.value.trim();
    if (!prompt) { showNotification('Please enter a prompt for the AI'); return; }

    logToConsole(`Generating AI response for: "${prompt}"`);
    showProgress();

    const apiKeyToSend = ACTIVE_GEMINI_API_KEY; // Use the active key (user or null)
    logToConsole(`Using ${IS_USING_USER_GEMINI_KEY ? 'user-provided' : 'server default'} Gemini key for request.`);

    try {
      const apiUrl = new URL('/api/gemini', window.location.origin).href;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      // Send the key in a custom header if the user provided one
      if (apiKeyToSend) {
        headers['X-Api-Key'] = apiKeyToSend; 
      }

      const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 800 }
      };

      const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(payload) });

      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); } catch (e) { data = handleNonJsonResponse(responseText); }

      if (!response.ok) {
        throw new Error(data.error?.message || data.error?.details || `Server Error: ${response.status}`);
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        textInput.value = data.candidates[0].content.parts[0].text;
        hideProgress();
        showNotification('AI text generated successfully!', 'success');
        logToConsole('AI response received from Gemini API');
      } else if (data.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      } else {
        throw new Error('No content generated from Gemini API');
      }
    } catch (error) {
      hideProgress();
      showNotification(`Gemini API Error: ${error.message}`, 'error');
      logToConsole(`Gemini API Error: ${error.message}`, 'error');
      console.error('Gemini API error details:', error);
      // Add fallback logic if needed
    }
  }
  
  // Convert text to speech using Google Text-to-Speech API
  async function convertTextToSpeech() {
    const text = textInput.value.trim();
    if (!text) { showNotification('Please enter text to convert'); return; }

    const voiceId = voiceSelect.value; // e.g., "en-US-Neural2-F"
    // Extract the language code correctly from the voice ID
    // Format should be: en-US, en-GB, etc.
    const languageCode = voiceId.split('-').slice(0, 2).join('-');
    const audioEncoding = modelSelect.value;
    const downloadFormat = formatSelect.value;

    logToConsole(`Converting text to speech with voice: ${voiceId} (Language: ${languageCode})`);
    showProgress();

    const apiKeyToSend = ACTIVE_TTS_API_KEY; // Use the active key (user or null)
    logToConsole(`Using ${IS_USING_USER_TTS_KEY ? 'user-provided' : 'server default'} TTS key for request.`);

    try {
      const apiUrl = new URL('/api/tts', window.location.origin).href;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (apiKeyToSend) {
        headers['X-Api-Key'] = apiKeyToSend;
      }

      const payload = {
        input: { text: text },
        // Provide both name and the matching language code
        voice: { languageCode: languageCode, name: voiceId },
        audioConfig: { audioEncoding: audioEncoding }
      };

      const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(payload) });

      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); } catch (e) { data = handleNonJsonResponse(responseText); }

      if (!response.ok) {
        throw new Error(data.error?.message || data.error?.details || `Server Error: ${response.status}`);
      }

      if (data.audioContent) {
        const audioBlob = base64ToBlob(data.audioContent, `audio/${downloadFormat}`);
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudioUrl = audioUrl;
        audioPlayer.src = audioUrl;
        audioPlayer.play();
        enableAudioControls();
        hideProgress();
        showNotification('Speech generated successfully!', 'success');
        logToConsole('Speech generated via Google TTS API');
      } else {
        throw new Error('No audio data received from Google TTS API');
      }
    } catch (error) {
      hideProgress();
      showNotification(`Google TTS Error: ${error.message}`, 'error');
      logToConsole(`Google TTS Error: ${error.message}`, 'error');
      console.error('Google TTS API error details:', error);
      // Add fallback logic if needed
    }
  }
  
  // Audio control functions
  function playAudio() {
    if (!audioPlayer) return;
    audioPlayer.play().catch(e => logToConsole(`Audio playback error: ${e.message}`, 'error'));
    logToConsole('Audio playback started');
  }
  
  function pauseAudio() {
    if (!audioPlayer) return;
    audioPlayer.pause();
    logToConsole('Audio playback paused');
  }
  
  function stopAudio() {
    if (!audioPlayer) return;
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    logToConsole('Audio playback stopped');
  }
  
  function downloadAudio() {
    if (currentAudioUrl) {
      const downloadFormat = formatSelect ? formatSelect.value : 'mp3'; // Default to mp3 if select not found
      const a = document.createElement('a');
      a.href = currentAudioUrl;
      a.download = `cybervoice-audio.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      logToConsole('Audio file download initiated');
      showNotification('Downloading audio file');
    } else {
      logToConsole('No audio available to download.', 'error');
    }
  }
  
  // Enable audio control buttons
  function enableAudioControls() {
    if (playButton) playButton.disabled = false;
    if (pauseButton) pauseButton.disabled = false;
    if (stopButton) stopButton.disabled = false;
    if (downloadButton) downloadButton.disabled = false;
  }
  
  // Console functions
  function toggleConsole() {
    const consoleContainer = document.querySelector('.console-container');
    if (!consoleContainer || !consoleToggle) return; // Add null checks
    isConsoleMinimized = !isConsoleMinimized;
    if (isConsoleMinimized) {
      consoleContainer.style.maxHeight = '32px'; // Adjust as needed for header height
      consoleToggle.textContent = '▼';
    } else {
      consoleContainer.style.maxHeight = '250px'; // Or whatever the expanded height is
      consoleToggle.textContent = '▲';
    }
  }
  
  function updateConsoleUI() {
    const consoleContainer = document.querySelector('.console-container');
    if (!consoleContainer) return;
    // Ensure initial state matches 'isConsoleMinimized'
    if (isConsoleMinimized) {
        consoleContainer.style.maxHeight = '32px';
        if(consoleToggle) consoleToggle.textContent = '▼';
    } else {
        consoleContainer.style.maxHeight = '250px';
        if(consoleToggle) consoleToggle.textContent = '▲';
    }
  }
  
  // Notification functions
  function showNotification(message, type = 'info') {
    if (!notification || !notificationMessage) return; // Add null checks
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`; // Use classes for styling
    notification.classList.add('show');
    setTimeout(() => { closeNotification(); }, 5000);
  }
  
  function closeNotification() {
    if (notification) notification.classList.remove('show');
  }
  
  // Progress bar functions
  function showProgress() {
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.3s linear';
        progressBar.parentElement.style.opacity = '1'; // Show progress container
    }
  }
  
  function updateProgress(value) { // Kept for potential future use, not currently called
      if (progressBar) progressBar.style.width = `${value}%`;
  }
  
  function hideProgress() {
    if (progressBar) {
        progressBar.style.width = '100%';
        setTimeout(() => {
            if (progressBar) {
              progressBar.style.transition = 'none';
              progressBar.style.width = '0%';
              if (progressBar.parentElement) progressBar.parentElement.style.opacity = '0'; // Hide progress container
              setTimeout(() => {
                  if (progressBar) progressBar.style.transition = 'width 0.3s linear';
              }, 50);
            }
        }, 500);
    }
  }
  
  // Theme toggle
  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isDarkTheme = !document.body.classList.contains('light-theme');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.icon');
        if (icon) icon.textContent = isDarkTheme ? '🌙' : '☀️';
    }
    logToConsole(`Theme switched to ${isDarkTheme ? 'dark' : 'light'} mode`);
  }
  
  // Utility function to convert base64 to Blob
  function base64ToBlob(base64, type) {
    try {
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, { type: type });
    } catch (e) {
      logToConsole(`Error converting base64 to Blob: ${e.message}`, 'error');
      console.error("Base64 conversion error:", e);
      return null; // Return null or throw error as appropriate
    }
  }
  
  // --- Utility Functions --- 

  function logToConsole(message, type = 'info') {
    if (!consoleOutput) return; // Add null check
    const line = document.createElement('div');
    line.className = 'console-line';
    if (type === 'error') line.style.color = 'var(--danger-color)';
    else if (type === 'success') line.style.color = 'var(--success-color)';
    line.textContent = message;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  function handleNonJsonResponse(text) {
    logToConsole(`Server Error - Non-JSON response received`, 'error');
    let message = "Server returned HTML instead of JSON. Check server logs and verify it's running.";
    if (text.includes("Cannot GET") || text.includes("Cannot POST")) {
        message = "API endpoint not found. Check server logs and endpoint path.";
    } else if (text.includes("ECONNREFUSED")) {
        message = "Connection refused. Make sure the server is running.";
    }
    showNotification(`Server Error: ${message}`, 'error');
    return { error: { message: message } };
  }
  
  // Initialize the application
  init();
});
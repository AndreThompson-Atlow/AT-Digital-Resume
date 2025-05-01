// CyberScan - System Scanner JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const scanOverlay = document.getElementById('scan-overlay');
  const scanProgressBar = document.getElementById('scan-progress-bar');
  const scanStatus = document.getElementById('scan-status');
  const scanReport = document.getElementById('scan-report');
  const refreshScanBtn = document.getElementById('refresh-scan');
  const securityGaugeFill = document.getElementById('security-gauge-fill');
  const securityGaugeValue = document.getElementById('security-gauge-value');
  
  // Audio Elements
  const scanStartSound = document.getElementById('scan-start');
  const scanProgressSound = document.getElementById('scan-progress');
  const scanCompleteSound = document.getElementById('scan-complete');
  const alertSound = document.getElementById('alert-sound');
  
  // Scan Sections
  const systemInfoSection = document.getElementById('system-info');
  const browserCapabilitiesSection = document.getElementById('browser-capabilities');
  const hardwareInfoSection = document.getElementById('hardware-info');
  const networkInfoSection = document.getElementById('network-info');
  const securityInfoSection = document.getElementById('security-info');
  const vulnerabilityListSection = document.getElementById('vulnerability-list');
  const recommendationListSection = document.getElementById('recommendation-list');
  
  // State
  let scanProgress = 0;
  let scanInterval;
  let securityScore = 0;
  let chartsInitialized = false;
  
  // Initialize the scan on page load
  initScan();
  
  // Event listeners
  refreshScanBtn.addEventListener('click', () => {
    // Restart the scan
    resetScan();
    initScan();
  });
  
  // Initialize scan process
  function initScan() {
    // Show the scan overlay
    scanOverlay.classList.remove('hidden');
    
    // Reset progress bar
    scanProgressBar.style.width = '0%';
    scanStatus.textContent = 'Initializing scanner...';
    
    // Play scan start sound
    if (scanStartSound) {
      scanStartSound.currentTime = 0;
      scanStartSound.play().catch(e => console.log('Audio play prevented by browser:', e));
    }
    
    // Start scan after a small delay
    setTimeout(() => {
      startScan();
    }, 1000);
  }
  
  // Start the scanning process
  function startScan() {
    scanProgress = 0;
    
    // Play scanning sound (loop)
    if (scanProgressSound) {
      scanProgressSound.currentTime = 0;
      scanProgressSound.volume = 0.3;
      scanProgressSound.play().catch(e => console.log('Audio play prevented by browser:', e));
    }
    
    // Set up interval to update progress
    scanInterval = setInterval(() => {
      scanProgress += 1;
      scanProgressBar.style.width = `${scanProgress}%`;
      
      // Update status text based on progress
      updateScanStatus(scanProgress);
      
      // When scan is complete
      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        completeScan();
      }
    }, 100); // Update every 100ms for a total of ~10 seconds scan
  }
  
  // Update the scan status message
  function updateScanStatus(progress) {
    if (progress < 10) {
      scanStatus.textContent = 'Analyzing system configuration...';
    } else if (progress < 20) {
      scanStatus.textContent = 'Detecting browser capabilities...';
    } else if (progress < 30) {
      scanStatus.textContent = 'Scanning hardware specifications...';
    } else if (progress < 40) {
      scanStatus.textContent = 'Analyzing network configuration...';
    } else if (progress < 50) {
      scanStatus.textContent = 'Running security assessment...';
    } else if (progress < 60) {
      scanStatus.textContent = 'Checking for vulnerabilities...';
    } else if (progress < 70) {
      scanStatus.textContent = 'Evaluating performance metrics...';
    } else if (progress < 80) {
      scanStatus.textContent = 'Running diagnostic tests...';
    } else if (progress < 90) {
      scanStatus.textContent = 'Preparing recommendations...';
    } else {
      scanStatus.textContent = 'Finalizing scan report...';
    }
  }
  
  // Complete the scan and show results
  function completeScan() {
    // Stop scanning sound
    if (scanProgressSound) {
      scanProgressSound.pause();
      scanProgressSound.currentTime = 0;
    }
    
    // Play completion sound
    if (scanCompleteSound) {
      scanCompleteSound.currentTime = 0;
      scanCompleteSound.play().catch(e => console.log('Audio play prevented by browser:', e));
    }
    
    // Hide overlay with a delay for visual effect
    setTimeout(() => {
      scanOverlay.classList.add('hidden');
    }, 500);
    
    // Generate and display results
    generateResults();
  }
  
  // Reset scan state
  function resetScan() {
    // Clear any existing interval
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    
    // Stop any playing sounds
    if (scanProgressSound) {
      scanProgressSound.pause();
      scanProgressSound.currentTime = 0;
    }
    
    // Reset progress
    scanProgress = 0;
    scanProgressBar.style.width = '0%';
    
    // Clear existing results
    systemInfoSection.innerHTML = '';
    browserCapabilitiesSection.innerHTML = '';
    hardwareInfoSection.innerHTML = '';
    networkInfoSection.innerHTML = '';
    securityInfoSection.innerHTML = '';
    vulnerabilityListSection.innerHTML = '';
    recommendationListSection.innerHTML = '';
  }
  
  // Generate scan results
  function generateResults() {
    // Generate each section of the report
    generateSystemInfo();
    generateBrowserCapabilities();
    generateHardwareInfo();
    generateNetworkInfo();
    generateSecurityInfo();
    generateVulnerabilities();
    generateRecommendations();
    
    // Initialize charts if not already done
    if (!chartsInitialized) {
      initializeCharts();
      chartsInitialized = true;
    }
    
    // Reveal sections with a slight delay for animation effect
    setTimeout(() => {
      const sections = document.querySelectorAll('.scan-section');
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.style.opacity = '1';
        }, index * 100);
      });
    }, 200);
  }
  
  // Create a scan item element
  function createScanItem(title, value, status = null) {
    const item = document.createElement('div');
    item.className = 'scan-item';
    
    const header = document.createElement('div');
    header.className = 'scan-item-header';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'scan-item-title';
    titleEl.textContent = title;
    
    header.appendChild(titleEl);
    
    if (status) {
      const statusEl = document.createElement('div');
      statusEl.className = `scan-item-status ${status.class}`;
      statusEl.textContent = status.text;
      header.appendChild(statusEl);
    }
    
    const valueEl = document.createElement('div');
    valueEl.className = 'scan-item-value';
    valueEl.textContent = value;
    
    item.appendChild(header);
    item.appendChild(valueEl);
    
    return item;
  }
  
  // Create a vulnerability item
  function createVulnerabilityItem(title, description, severity) {
    const item = document.createElement('div');
    item.className = 'vulnerability-item';
    
    const header = document.createElement('div');
    header.className = 'vulnerability-header';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'vulnerability-title';
    titleEl.textContent = title;
    
    const severityEl = document.createElement('div');
    severityEl.className = `vulnerability-severity severity-${severity.toLowerCase()}`;
    severityEl.textContent = severity;
    
    header.appendChild(titleEl);
    header.appendChild(severityEl);
    
    const descEl = document.createElement('div');
    descEl.className = 'vulnerability-description';
    descEl.textContent = description;
    
    item.appendChild(header);
    item.appendChild(descEl);
    
    return item;
  }
  
  // System Information section
  function generateSystemInfo() {
    const items = [
      {
        title: 'Operating System',
        value: getOperatingSystem(),
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'Platform',
        value: navigator.platform,
        status: { text: 'VERIFIED', class: 'status-good' }
      },
      {
        title: 'User Agent',
        value: navigator.userAgent.substring(0, 50) + '...',
        status: { text: 'AUTHENTIC', class: 'status-good' }
      },
      {
        title: 'Language',
        value: navigator.language || 'en-US',
        status: { text: 'CONFIRMED', class: 'status-good' }
      },
      {
        title: 'Time Zone',
        value: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'Screen Resolution',
        value: `${window.screen.width}x${window.screen.height}`,
        status: { text: 'OPTIMAL', class: 'status-good' }
      }
    ];
    
    items.forEach(item => {
      systemInfoSection.appendChild(createScanItem(item.title, item.value, item.status));
    });
  }
  
  // Browser Capabilities section
  function generateBrowserCapabilities() {
    const items = [
      {
        title: 'Browser',
        value: getBrowserInfo(),
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'Cookies Enabled',
        value: navigator.cookieEnabled ? 'Yes' : 'No',
        status: navigator.cookieEnabled 
          ? { text: 'ENABLED', class: 'status-good' } 
          : { text: 'DISABLED', class: 'status-warning' }
      },
      {
        title: 'JavaScript',
        value: 'Enabled',
        status: { text: 'ENABLED', class: 'status-good' }
      },
      {
        title: 'Local Storage',
        value: isLocalStorageAvailable() ? 'Available' : 'Unavailable',
        status: isLocalStorageAvailable() 
          ? { text: 'AVAILABLE', class: 'status-good' } 
          : { text: 'UNAVAILABLE', class: 'status-warning' }
      },
      {
        title: 'WebGL',
        value: isWebGLAvailable() ? 'Supported' : 'Not Supported',
        status: isWebGLAvailable() 
          ? { text: 'SUPPORTED', class: 'status-good' } 
          : { text: 'LIMITED', class: 'status-warning' }
      },
      {
        title: 'WebRTC',
        value: isWebRTCAvailable() ? 'Supported' : 'Not Supported',
        status: isWebRTCAvailable() 
          ? { text: 'SUPPORTED', class: 'status-good' } 
          : { text: 'LIMITED', class: 'status-good' }
      }
    ];
    
    items.forEach(item => {
      browserCapabilitiesSection.appendChild(createScanItem(item.title, item.value, item.status));
    });
  }
  
  // Hardware Information section
  function generateHardwareInfo() {
    const items = [
      {
        title: 'Device Type',
        value: getDeviceType(),
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'CPU Cores',
        value: navigator.hardwareConcurrency || 'Unknown',
        status: { text: 'ANALYZED', class: 'status-good' }
      },
      {
        title: 'Memory',
        value: getMemoryEstimate(),
        status: { text: 'ESTIMATED', class: 'status-warning' }
      },
      {
        title: 'GPU',
        value: getGPUInfo(),
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'Touch Support',
        value: 'ontouchstart' in window ? 'Yes' : 'No',
        status: { text: 'VERIFIED', class: 'status-good' }
      },
      {
        title: 'Battery Status',
        value: 'Checking...',
        status: { text: 'CHECKING', class: 'status-warning' }
      }
    ];
    
    items.forEach(item => {
      hardwareInfoSection.appendChild(createScanItem(item.title, item.value, item.status));
    });
    
    // Update battery status if available
    if ('getBattery' in navigator) {
      navigator.getBattery()
        .then(battery => {
          const batteryItem = hardwareInfoSection.querySelector('.scan-item:last-child');
          const batteryValue = batteryItem.querySelector('.scan-item-value');
          const batteryStatus = batteryItem.querySelector('.scan-item-status');
          
          const batteryPercentage = Math.round(battery.level * 100);
          const chargingStatus = battery.charging ? 'Charging' : 'Not Charging';
          
          batteryValue.textContent = `${batteryPercentage}% (${chargingStatus})`;
          batteryStatus.textContent = 'MONITORED';
          batteryStatus.className = 'scan-item-status status-good';
        })
        .catch(error => {
          console.log('Battery API error:', error);
        });
    }
  }
  
  // Network Information section
  function generateNetworkInfo() {
    // Get connection type if available
    let connectionType = 'Unknown';
    let connectionSpeed = 'Unknown';
    
    if ('connection' in navigator) {
      const conn = navigator.connection;
      if (conn) {
        connectionType = conn.effectiveType || connectionType;
        if (conn.downlink) {
          connectionSpeed = `${conn.downlink} Mbps`;
        }
      }
    }
    
    const items = [
      {
        title: 'Connection Type',
        value: connectionType,
        status: { text: 'DETECTED', class: 'status-good' }
      },
      {
        title: 'Download Speed',
        value: connectionSpeed,
        status: { text: 'ESTIMATED', class: 'status-warning' }
      },
      {
        title: 'Online Status',
        value: navigator.onLine ? 'Online' : 'Offline',
        status: navigator.onLine 
          ? { text: 'CONNECTED', class: 'status-good' } 
          : { text: 'DISCONNECTED', class: 'status-critical' }
      },
      {
        title: 'Domain',
        value: window.location.hostname || 'localhost',
        status: { text: 'SECURE', class: 'status-good' }
      },
      {
        title: 'Protocol',
        value: window.location.protocol.replace(':', ''),
        status: window.location.protocol === 'https:' 
          ? { text: 'SECURE', class: 'status-good' } 
          : { text: 'INSECURE', class: 'status-critical' }
      },
      {
        title: 'IP Address',
        value: 'Protected',
        status: { text: 'PROTECTED', class: 'status-good' }
      }
    ];
    
    items.forEach(item => {
      networkInfoSection.appendChild(createScanItem(item.title, item.value, item.status));
    });
  }
  
  // Security Information section
  function generateSecurityInfo() {
    // Calculate a security score (just for visual effect)
    let totalScore = 0;
    
    // Check HTTPS
    const isHttps = window.location.protocol === 'https:';
    totalScore += isHttps ? 25 : 0;
    
    // Check cookies
    const cookiesEnabled = navigator.cookieEnabled;
    totalScore += cookiesEnabled ? 15 : 0;
    
    // Check local storage
    const localStorageAvailable = isLocalStorageAvailable();
    totalScore += localStorageAvailable ? 15 : 0;
    
    // Random factors for demo purposes
    const randomFactor = Math.floor(Math.random() * 20) + 20;
    totalScore += randomFactor;
    
    // Cap at 100
    securityScore = Math.min(totalScore, 100);
    
    // Update gauge
    updateSecurityGauge(securityScore);
    
    const items = [
      {
        title: 'HTTPS Connection',
        value: isHttps ? 'Secure Connection' : 'Insecure Connection',
        status: isHttps 
          ? { text: 'SECURE', class: 'status-good' } 
          : { text: 'INSECURE', class: 'status-critical' }
      },
      {
        title: 'Content Security',
        value: 'Standard Policy',
        status: { text: 'STANDARD', class: 'status-warning' }
      },
      {
        title: 'Permissions',
        value: getPermissionsStatus(),
        status: { text: 'MONITORED', class: 'status-good' }
      },
      {
        title: 'Third-Party Cookies',
        value: cookiesEnabled ? 'Enabled' : 'Disabled',
        status: cookiesEnabled 
          ? { text: 'MONITORED', class: 'status-warning' } 
          : { text: 'BLOCKED', class: 'status-good' }
      },
      {
        title: 'Malware Protection',
        value: 'Active',
        status: { text: 'ACTIVE', class: 'status-good' }
      },
      {
        title: 'Tracking Prevention',
        value: 'Standard Protection',
        status: { text: 'STANDARD', class: 'status-warning' }
      }
    ];
    
    items.forEach(item => {
      securityInfoSection.appendChild(createScanItem(item.title, item.value, item.status));
    });
  }
  
  // Update the security gauge
  function updateSecurityGauge(score) {
    // Update the gauge fill rotation (180 degrees = 100%)
    const rotation = (score / 100) * 180;
    securityGaugeFill.style.transform = `rotate(${rotation}deg)`;
    
    // Update the value text
    securityGaugeValue.textContent = `${score}%`;
    
    // Change color based on score
    if (score < 40) {
      securityGaugeValue.style.color = 'var(--danger-color)';
    } else if (score < 70) {
      securityGaugeValue.style.color = 'var(--warning-color)';
    } else {
      securityGaugeValue.style.color = 'var(--success-color)';
    }
  }
  
  // Generate vulnerabilities section
  function generateVulnerabilities() {
    const vulnerabilities = [];
    
    // Add vulnerabilities based on checks
    if (window.location.protocol !== 'https:') {
      vulnerabilities.push({
        title: 'Insecure Connection',
        description: 'This website is not using HTTPS, which means data transmitted between your browser and the server is not encrypted and could be intercepted.',
        severity: 'High'
      });
    }
    
    // More vulnerabilities for demo purposes
    if (Math.random() > 0.5) {
      vulnerabilities.push({
        title: 'Outdated Browser',
        description: 'Your browser may not have the latest security updates. Consider updating to the latest version for improved security features.',
        severity: 'Medium'
      });
    }
    
    if (Math.random() > 0.7) {
      vulnerabilities.push({
        title: 'WebRTC IP Leak',
        description: 'Your browser may expose your local IP address through WebRTC connections, potentially allowing websites to identify your actual location.',
        severity: 'Medium'
      });
    }
    
    if (navigator.cookieEnabled && Math.random() > 0.6) {
      vulnerabilities.push({
        title: 'Third-Party Cookies Enabled',
        description: 'Third-party cookies are enabled in your browser, which may allow tracking across different websites.',
        severity: 'Low'
      });
    }
    
    // If no vulnerabilities found, show a "good" message
    if (vulnerabilities.length === 0) {
      const noVulnMsg = document.createElement('div');
      noVulnMsg.className = 'vulnerability-item';
      noVulnMsg.style.borderColor = 'var(--success-color)';
      noVulnMsg.innerHTML = `
        <div class="vulnerability-header">
          <div class="vulnerability-title" style="color: var(--success-color)">No Major Vulnerabilities Detected</div>
        </div>
        <div class="vulnerability-description">
          Good job! Your system appears to be secure. Keep your browser and software updated to maintain security.
        </div>
      `;
      vulnerabilityListSection.appendChild(noVulnMsg);
    } else {
      // Add each vulnerability to the list
      vulnerabilities.forEach(vuln => {
        vulnerabilityListSection.appendChild(
          createVulnerabilityItem(vuln.title, vuln.description, vuln.severity)
        );
      });
    }
  }
  
  // Generate recommendations section
  function generateRecommendations() {
    const recommendations = [];
    
    // Add recommendations based on checks
    if (window.location.protocol !== 'https:') {
      recommendations.push('Switch to websites using HTTPS for secure, encrypted connections.');
    }
    
    if (navigator.cookieEnabled) {
      recommendations.push('Consider disabling third-party cookies in your browser settings to enhance privacy.');
    }
    
    // Some generic recommendations
    recommendations.push('Keep your browser updated to the latest version for optimal security.');
    recommendations.push('Use a password manager to create and store strong, unique passwords for all your accounts.');
    recommendations.push('Enable two-factor authentication (2FA) on all accounts that support it.');
    
    if (Math.random() > 0.5) {
      recommendations.push('Consider using a VPN service when connecting to public Wi-Fi networks.');
    }
    
    if (Math.random() > 0.7) {
      recommendations.push('Regularly clear your browser cache and cookies to minimize tracking.');
    }
    
    if (securityScore < 70) {
      recommendations.push('Review your browser security settings and consider a more privacy-focused browser like Firefox or Brave.');
    }
    
    // Shuffle and limit to 5 recommendations
    const shuffledRecommendations = recommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    // Add each recommendation to the list
    shuffledRecommendations.forEach(recommendation => {
      const li = document.createElement('li');
      li.textContent = recommendation;
      recommendationListSection.appendChild(li);
    });
  }
  
  // Initialize chart.js charts
  function initializeCharts() {
    // Resources Chart (Pie Chart)
    const resourcesCanvas = document.getElementById('resources-chart');
    if (resourcesCanvas) {
      // Simulated data
      const data = {
        labels: ['CPU Usage', 'Memory', 'Disk I/O', 'Network'],
        datasets: [{
          data: [
            Math.floor(Math.random() * 50) + 10, 
            Math.floor(Math.random() * 40) + 20,
            Math.floor(Math.random() * 30) + 10,
            Math.floor(Math.random() * 50) + 5
          ],
          backgroundColor: [
            'rgba(0, 255, 225, 0.7)',
            'rgba(255, 204, 0, 0.7)',
            'rgba(23, 74, 255, 0.7)',
            'rgba(255, 42, 109, 0.7)'
          ],
          borderColor: [
            'rgba(0, 255, 225, 1)',
            'rgba(255, 204, 0, 1)',
            'rgba(23, 74, 255, 1)',
            'rgba(255, 42, 109, 1)'
          ],
          borderWidth: 1
        }]
      };
      
      // Draw pie chart
      drawPieChart(resourcesCanvas, data);
    }
    
    // Performance Chart (Bar Chart)
    const perfCanvas = document.getElementById('performance-chart');
    if (perfCanvas) {
      // Simulated data
      const data = {
        labels: ['Load Time', 'Response', 'Processing', 'Rendering', 'Memory'],
        datasets: [{
          label: 'Performance Metrics',
          data: [
            Math.floor(Math.random() * 100) + 50,
            Math.floor(Math.random() * 80) + 70,
            Math.floor(Math.random() * 90) + 60,
            Math.floor(Math.random() * 70) + 60,
            Math.floor(Math.random() * 60) + 70
          ],
          backgroundColor: 'rgba(0, 255, 225, 0.4)',
          borderColor: 'rgba(0, 255, 225, 1)',
          borderWidth: 1
        }]
      };
      
      // Draw bar chart
      drawBarChart(perfCanvas, data);
    }
  }
  
  // Draw pie chart (simplified without Chart.js)
  function drawPieChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw pie segments
    let startAngle = 0;
    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      // Fill with color
      ctx.fillStyle = data.datasets[0].backgroundColor[index];
      ctx.fill();
      
      // Add border
      ctx.lineWidth = 1;
      ctx.strokeStyle = data.datasets[0].borderColor[index];
      ctx.stroke();
      
      // Update angle for next slice
      startAngle += sliceAngle;
    });
    
    // Add legend
    const legendY = canvas.height - 20;
    const legendSpacing = canvas.width / (data.labels.length + 1);
    
    data.labels.forEach((label, index) => {
      const x = (index + 1) * legendSpacing;
      
      // Draw color box
      ctx.fillStyle = data.datasets[0].backgroundColor[index];
      ctx.fillRect(x - 30, legendY, 10, 10);
      
      // Draw label
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, legendY + 20);
    });
  }
  
  // Draw bar chart (simplified without Chart.js)
  function drawBarChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const chartWidth = canvas.width - 40;
    const chartHeight = canvas.height - 40;
    const barWidth = chartWidth / data.labels.length - 10;
    
    // Draw bars
    data.datasets[0].data.forEach((value, index) => {
      const x = 30 + index * (barWidth + 10);
      const barHeight = (value / 100) * chartHeight;
      const y = canvas.height - 30 - barHeight;
      
      // Draw bar
      ctx.fillStyle = data.datasets[0].backgroundColor;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw border
      ctx.strokeStyle = data.datasets[0].borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);
      
      // Draw label below bar
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[index], x + barWidth / 2, canvas.height - 10);
      
      // Draw value above bar
      ctx.fillText(value, x + barWidth / 2, y - 5);
    });
    
    // Draw axes
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Y-axis
    ctx.moveTo(20, 10);
    ctx.lineTo(20, canvas.height - 20);
    
    // X-axis
    ctx.lineTo(canvas.width - 10, canvas.height - 20);
    ctx.stroke();
  }
  
  // Utility Functions
  
  // Get operating system name
  function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.indexOf('Windows') !== -1) {
      return 'Windows';
    } else if (userAgent.indexOf('Mac') !== -1) {
      return 'MacOS';
    } else if (userAgent.indexOf('Linux') !== -1) {
      return 'Linux';
    } else if (userAgent.indexOf('Android') !== -1) {
      return 'Android';
    } else if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
      return 'iOS';
    } else {
      return 'Unknown OS';
    }
  }
  
  // Get browser information
  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edg') === -1 && userAgent.indexOf('OPR') === -1) {
      return 'Chrome';
    } else if (userAgent.indexOf('Firefox') !== -1) {
      return 'Firefox';
    } else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
      return 'Safari';
    } else if (userAgent.indexOf('Edg') !== -1) {
      return 'Edge';
    } else if (userAgent.indexOf('OPR') !== -1 || userAgent.indexOf('Opera') !== -1) {
      return 'Opera';
    } else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1) {
      return 'Internet Explorer';
    } else {
      return 'Unknown Browser';
    }
  }
  
  // Check if local storage is available
  function isLocalStorageAvailable() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Check if WebGL is available
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  // Check if WebRTC is available
  function isWebRTCAvailable() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  // Get device type
  function getDeviceType() {
    const userAgent = navigator.userAgent;
    
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      return 'Mobile Device';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop Computer';
    }
  }
  
  // Estimate memory
  function getMemoryEstimate() {
    if (navigator.deviceMemory) {
      return `${navigator.deviceMemory} GB`;
    } else {
      // Make a guess based on device type
      const deviceType = getDeviceType();
      if (deviceType === 'Mobile Device') {
        return '2-4 GB (Estimated)';
      } else if (deviceType === 'Tablet') {
        return '3-6 GB (Estimated)';
      } else {
        return '8-16 GB (Estimated)';
      }
    }
  }
  
  // Get GPU info
  function getGPUInfo() {
    const canvas = document.createElement('canvas');
    let gl;
    let renderer = 'Unknown';
    
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {
      // Do nothing
    }
    
    return renderer;
  }
  
  // Get permissions status
  function getPermissionsStatus() {
    // We can't actually check most permissions without requesting them
    // So we'll just return a generic status
    return 'Standard Permissions';
  }
}); 
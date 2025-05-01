document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileTree = document.getElementById('file-tree');
    const codeEditor = document.getElementById('code-editor');
    const codeContent = document.getElementById('code-content');
    const tabsContainer = document.getElementById('tabs-container');
    const lineCount = document.getElementById('line-count');
    const projectName = document.getElementById('project-name');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingStatus = document.getElementById('loading-status');
    const backButton = document.getElementById('back-button');
    
    // State
    let currentProject = '';
    let openTabs = [];
    let activeTab = null;
    
    // Project files structure (to be populated dynamically)
    const projectsData = {
        'cybercalc': {
            name: 'CyberCalc',
            files: [
                { name: 'index.html', path: 'projects/calculator/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/calculator/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/calculator/script.js', language: 'javascript' }
            ]
        },
        'cyberweather': {
            name: 'CyberWeather',
            files: [
                { name: 'index.html', path: 'projects/weather-app/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/weather-app/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/weather-app/script.js', language: 'javascript' }
            ]
        },
        'cybertasks': {
            name: 'CyberTasks',
            files: [
                { name: 'index.html', path: 'projects/todo-list/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/todo-list/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/todo-list/script.js', language: 'javascript' }
            ]
        },
        'cybercrypt': {
            name: 'CyberCrypt',
            files: [
                { name: 'index.html', path: 'projects/password-generator/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/password-generator/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/password-generator/script.js', language: 'javascript' }
            ]
        },
        'cyberscan': {
            name: 'CyberScan',
            files: [
                { name: 'index.html', path: 'projects/cyberscan/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/cyberscan/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/cyberscan/script.js', language: 'javascript' }
            ]
        },
        'cybervoice': {
            name: 'CyberVoice',
            files: [
                { name: 'index.html', path: 'projects/cybervoice/index.html', language: 'html' },
                { name: 'style.css', path: 'projects/cybervoice/style.css', language: 'css' },
                { name: 'script.js', path: 'projects/cybervoice/script.js', language: 'javascript' }
            ]
        }
    };
    
    // Initialization
    function init() {
        // Get project from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentProject = urlParams.get('project') || 'cybercalc';
        
        if (!projectsData[currentProject]) {
            // Default to calculator if project not found
            currentProject = 'cybercalc';
        }
        
        // Set project name
        projectName.textContent = projectsData[currentProject].name;
        
        // Simulate loading sequence
        simulateLoading().then(() => {
            // Create file tree
            createFileTree();
            
            // Open first file by default
            if (projectsData[currentProject].files.length > 0) {
                openFile(projectsData[currentProject].files[0]);
            }
        });
        
        // Set up back button
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html?skipIntro=true#projects';
        });
    }
    
    // Simulate loading for effect
    function simulateLoading() {
        return new Promise(resolve => {
            const loadingSteps = [
                "Initializing CyberIDE...",
                "Loading project structure...",
                "Establishing virtual environment...",
                "Running security checks...",
                "Configuring read-only mode...",
                "Rendering file system...",
                "Applying syntax highlighting...",
                "CyberIDE ready!"
            ];
            
            let stepIndex = 0;
            
            function nextStep() {
                if (stepIndex < loadingSteps.length) {
                    loadingStatus.textContent = loadingSteps[stepIndex];
                    stepIndex++;
                    setTimeout(nextStep, 400);
                } else {
                    setTimeout(() => {
                        loadingOverlay.classList.add('hidden');
                        resolve();
                    }, 500);
                }
            }
            
            nextStep();
        });
    }
    
    // Create the file tree in the sidebar
    function createFileTree() {
        // Clear existing content
        fileTree.innerHTML = '';
        
        // Create project folder
        const projectFolder = document.createElement('div');
        projectFolder.className = 'folder open';
        
        const folderName = document.createElement('div');
        folderName.className = 'folder-name';
        folderName.innerHTML = `<span class="folder-icon">📁</span> ${projectsData[currentProject].name}`;
        
        const folderContent = document.createElement('div');
        folderContent.className = 'folder-content';
        
        // Add files to the folder
        projectsData[currentProject].files.forEach(file => {
            const fileEl = document.createElement('div');
            fileEl.className = 'file';
            fileEl.dataset.path = file.path;
            fileEl.dataset.name = file.name;
            fileEl.dataset.language = file.language;
            
            // Choose icon based on file extension
            let icon = '📄';
            if (file.name.endsWith('.html')) icon = '🌐';
            else if (file.name.endsWith('.css')) icon = '🎨';
            else if (file.name.endsWith('.js')) icon = '⚙️';
            
            fileEl.innerHTML = `<span class="file-icon">${icon}</span> ${file.name}`;
            
            // Add click event to open file
            fileEl.addEventListener('click', () => {
                // Find the corresponding file object
                const fileObj = projectsData[currentProject].files.find(f => f.path === file.path);
                if (fileObj) {
                    openFile(fileObj);
                }
            });
            
            folderContent.appendChild(fileEl);
        });
        
        projectFolder.appendChild(folderName);
        projectFolder.appendChild(folderContent);
        fileTree.appendChild(projectFolder);
        
        // Toggle folder open/closed on click
        folderName.addEventListener('click', () => {
            projectFolder.classList.toggle('open');
        });
    }
    
    // Open a file and display its content
    function openFile(file) {
        // Check if the file is already open in a tab
        const existingTabIndex = openTabs.findIndex(tab => tab.path === file.path);
        
        if (existingTabIndex === -1) {
            // Create new tab
            const newTab = {
                name: file.name,
                path: file.path,
                language: file.language
            };
            
            openTabs.push(newTab);
            createTab(newTab);
            setActiveTab(openTabs.length - 1);
        } else {
            // Switch to existing tab
            setActiveTab(existingTabIndex);
        }
        
        // Load file content
        loadFileContent(file);
        
        // Highlight the active file in the file tree
        document.querySelectorAll('.file').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.path === file.path) {
                el.classList.add('active');
            }
        });
    }
    
    // Create a new tab in the tabs container
    function createTab(tabData) {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.path = tabData.path;
        tab.textContent = tabData.name;
        
        // Add close button to tab
        const closeBtn = document.createElement('span');
        closeBtn.className = 'tab-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tabData.path);
        });
        
        tab.appendChild(closeBtn);
        
        // Click event to switch to this tab
        tab.addEventListener('click', () => {
            const tabIndex = openTabs.findIndex(t => t.path === tabData.path);
            if (tabIndex !== -1) {
                setActiveTab(tabIndex);
            }
        });
        
        tabsContainer.appendChild(tab);
    }
    
    // Set the active tab
    function setActiveTab(tabIndex) {
        if (tabIndex < 0 || tabIndex >= openTabs.length) return;
        
        activeTab = tabIndex;
        
        // Update tab styles
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.path === openTabs[tabIndex].path) {
                tab.classList.add('active');
            }
        });
        
        // Load the active file content
        loadFileContent(openTabs[tabIndex]);
    }
    
    // Close a tab
    function closeTab(path) {
        const tabIndex = openTabs.findIndex(tab => tab.path === path);
        if (tabIndex === -1) return;
        
        // Remove tab element
        const tabElements = document.querySelectorAll('.tab');
        tabElements.forEach(tab => {
            if (tab.dataset.path === path) {
                tab.remove();
            }
        });
        
        // Remove from open tabs array
        openTabs.splice(tabIndex, 1);
        
        // Handle active tab selection after closing
        if (openTabs.length === 0) {
            // No tabs left, show empty editor
            codeContent.textContent = '// No file open';
            activeTab = null;
        } else if (activeTab === tabIndex) {
            // The active tab was closed, activate another tab
            setActiveTab(Math.min(tabIndex, openTabs.length - 1));
        } else if (activeTab > tabIndex) {
            // Adjust activeTab index if a tab before it was removed
            activeTab--;
        }
    }
    
    // Load file content
    function loadFileContent(file) {
        // Show loading indicator
        codeContent.textContent = 'Loading file content...';
        
        // Fetch the actual file content
        fetch(file.path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(content => {
                // Apply syntax highlighting
                const highlighted = applySyntaxHighlighting(content, file.language);
                codeContent.innerHTML = highlighted;
                
                // Update line count
                const lines = content.split('\n').length;
                lineCount.textContent = lines;
            })
            .catch(error => {
                codeContent.innerHTML = `<span class="error">Error loading file: ${error.message}</span>`;
                console.error('Error loading file:', error);
            });
    }
    
    // Apply basic syntax highlighting based on the file type
    function applySyntaxHighlighting(code, language) {
        if (!code) return '';
        
        // Create line-by-line structure with line numbers
        const lines = code.split('\n');
        let highlighted = '';
        
        lines.forEach((line, index) => {
            // Apply language-specific highlighting
            let highlightedLine = highlightLine(line, language);
            
            // Create line with line number
            highlighted += `<span class="code-line">${highlightedLine}</span>`;
        });
        
        return highlighted;
    }
    
    // Highlight a single line based on the language
    function highlightLine(line, language) {
        if (!line) return '';
        
        // Escape HTML special characters first
        let escapedLine = escapeHTML(line);
        
        // Apply HTML highlighting
        if (language === 'html') {
            // Tags
            escapedLine = escapedLine.replace(/(&lt;[^&]*&gt;)/g, '<span class="keyword">$1</span>');
            // Attributes
            escapedLine = escapedLine.replace(/(\s[a-zA-Z-]+)=/g, '<span class="variable">$1</span>=');
            // Attribute values
            escapedLine = escapedLine.replace(/(".*?")/g, '<span class="string">$1</span>');
        }
        // Apply CSS highlighting
        else if (language === 'css') {
            // Selectors
            escapedLine = escapedLine.replace(/([^\{\}]*)\{/g, '<span class="variable">$1</span>{');
            // Properties
            escapedLine = escapedLine.replace(/(\s[a-zA-Z-]+):/g, '<span class="keyword">$1</span>:');
            // Values
            escapedLine = escapedLine.replace(/:([^;]+);/g, ':<span class="string">$1</span>;');
            // Colors
            escapedLine = escapedLine.replace(/(#[0-9a-fA-F]{3,6})/g, '<span class="number">$1</span>');
        }
        // Apply JavaScript highlighting
        else if (language === 'javascript') {
            // Keywords
            const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'new', 'this', 'class', 'import', 'export', 'from', 'true', 'false', 'null', 'undefined'];
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                escapedLine = escapedLine.replace(regex, `<span class="keyword">${keyword}</span>`);
            });
            // Strings
            escapedLine = escapedLine.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>');
            // Numbers
            escapedLine = escapedLine.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
            // Comments
            escapedLine = escapedLine.replace(/(\/\/.*$)/g, '<span class="comment">$1</span>');
            // Function calls
            escapedLine = escapedLine.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\(/g, '<span class="function">$1</span>(');
        }
        
        return escapedLine;
    }
    
    // Escape HTML special characters
    function escapeHTML(text) {
        const replacements = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[<>&"']/g, match => replacements[match]);
    }
    
    // Initialize the application
    init();
}); 
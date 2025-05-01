/*
Screenshot Helper Instructions

This script won't run directly since it requires browser automation tools like Puppeteer.
Instead, it provides instructions for manually capturing screenshots of your projects.

For each project:

1. Open the project URL in your browser (Chrome recommended)
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Click on "Device Toggle" to enter responsive mode
4. Set dimensions to 1200x800
5. Take a screenshot:
   - Chrome: Ctrl+Shift+P, type "screenshot", select "Capture screenshot"
   - Or use the Windows Snipping Tool or other screen capture software
6. Save the image with the appropriate filename:
   - cybercalc.png
   - cyberweather.png
   - cybertasks.png
   - cybercrypt.png
7. Place the images in the root directory of your portfolio website

Alternatively, you can use this Puppeteer script if you have Node.js installed:

```js
const puppeteer = require('puppeteer');

async function captureScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  const projects = [
    { url: 'http://localhost:3000/projects/calculator/index.html', filename: 'cybercalc.png' },
    { url: 'http://localhost:3000/projects/weather-app/index.html', filename: 'cyberweather.png' },
    { url: 'http://localhost:3000/projects/todo-list/index.html', filename: 'cybertasks.png' },
    { url: 'http://localhost:3000/projects/password-generator/index.html', filename: 'cybercrypt.png' }
  ];
  
  for (const project of projects) {
    await page.goto(project.url);
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: project.filename });
    console.log(`Captured ${project.filename}`);
  }
  
  await browser.close();
}

captureScreenshots().catch(console.error);
```

Install and run using:
npm install puppeteer
node capture-screenshots.js
*/ 
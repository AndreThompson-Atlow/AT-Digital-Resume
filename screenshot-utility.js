const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Generate thumbnails for all projects by taking screenshots of each page
 * @param {boolean} force - Whether to force regeneration of thumbnails
 */
async function generateProjectThumbnails(force = false) {
  console.log('Starting thumbnail generation...');
  
  // Ensure thumbnails directory exists
  const thumbnailDir = path.join(__dirname, 'thumbnails');
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
    console.log(`Created thumbnails directory at ${thumbnailDir}`);
  }

  // Get list of project folders
  const projectsDir = path.join(__dirname, 'projects');
  const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${projectFolders.length} project folders`);

  const baseUrl = 'http://localhost:3000/projects';
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // For running in various environments
  });

  try {
    for (const project of projectFolders) {
      const thumbnailPath = path.join(thumbnailDir, `${project}.jpg`);
      
      // Skip if thumbnail exists and not forcing regeneration
      if (fs.existsSync(thumbnailPath) && !force) {
        console.log(`Thumbnail for ${project} already exists, skipping...`);
        continue;
      }

      // Take screenshot of project page
      console.log(`Generating thumbnail for ${project}...`);
      const page = await browser.newPage();
      
      // Set a viewport size that makes sense for thumbnails
      await page.setViewport({ width: 1200, height: 800 });
      
      try {
        await page.goto(`${baseUrl}/${project}/index.html`, { waitUntil: 'networkidle2', timeout: 10000 });
        
        // Wait a bit for any animations or resources to load
        await page.waitForTimeout(1000);
        
        // Take the screenshot and save
        await page.screenshot({ 
          path: thumbnailPath,
          quality: 90,
          type: 'jpeg'
        });
        
        console.log(`Created thumbnail for ${project} at ${thumbnailPath}`);
      } catch (err) {
        console.error(`Error capturing screenshot for ${project}:`, err.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log('Thumbnail generation complete!');
  return path.relative(__dirname, thumbnailDir);
}

/**
 * Get the relative path to a project's thumbnail
 * @param {string} projectName - Name of the project
 * @returns {string} - Relative path to the thumbnail
 */
function getThumbnailPath(projectName) {
  const thumbnailPath = `thumbnails/${projectName}.jpg`;
  return fs.existsSync(path.join(__dirname, thumbnailPath)) 
    ? thumbnailPath 
    : null;
}

module.exports = {
  generateProjectThumbnails,
  getThumbnailPath
}; 
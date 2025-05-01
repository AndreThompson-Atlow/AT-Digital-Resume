const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Updates the project cards in index.html to use dynamically generated thumbnails
 */
async function updateProjectThumbnails() {
  console.log('Updating project thumbnails in index.html...');
  
  const indexPath = path.join(__dirname, 'index.html');
  
  // Read the index.html file
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Parse the HTML using JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Find all project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  // Create a map to store which projects were updated
  const updatedProjects = [];
  const missingThumbnails = [];
  
  // Process each project card
  projectCards.forEach(card => {
    // Find the project link to determine the project name
    const projectLink = card.querySelector('.project-links a:last-child');
    
    if (projectLink) {
      const href = projectLink.getAttribute('href');
      // Extract the project folder name from the href
      const projectMatch = href.match(/projects\/([^\/]+)/);
      
      if (projectMatch && projectMatch[1]) {
        const projectName = projectMatch[1];
        
        // Check if a thumbnail exists for this project
        const thumbnailPath = `thumbnails/${projectName}.jpg`;
        
        if (fs.existsSync(path.join(__dirname, thumbnailPath))) {
          // Find the image element in this card
          const imgElement = card.querySelector('.project-thumbnail');
          
          if (imgElement) {
            // Update the image source to use our thumbnail
            const oldSrc = imgElement.getAttribute('src');
            imgElement.setAttribute('src', thumbnailPath);
            
            updatedProjects.push({
              project: projectName,
              oldSrc,
              newSrc: thumbnailPath
            });
          }
        } else {
          // Thumbnail doesn't exist for this project
          missingThumbnails.push(projectName);
        }
      }
    }
  });
  
  // Save the updated HTML back to the file
  fs.writeFileSync(indexPath, dom.serialize(), 'utf8');
  
  console.log(`Updated ${updatedProjects.length} project thumbnails in index.html`);
  
  if (missingThumbnails.length > 0) {
    console.log('Missing thumbnails for these projects:', missingThumbnails);
    console.log('Run the thumbnail generator to create them: http://localhost:3000/api/generate-thumbnails');
  }
  
  return {
    updatedProjects,
    missingThumbnails
  };
}

// If run directly from command line
if (require.main === module) {
  updateProjectThumbnails()
    .then(result => {
      console.log('Thumbnail update complete!');
    })
    .catch(err => {
      console.error('Error updating thumbnails:', err);
      process.exit(1);
    });
} else {
  // Export for use in other modules
  module.exports = { updateProjectThumbnails };
} 
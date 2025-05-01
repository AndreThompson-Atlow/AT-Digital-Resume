# Dynamic Project Thumbnails

This feature automatically generates thumbnails of your projects by taking screenshots of each live project page.

## How It Works

1. The system uses Puppeteer (a headless browser) to visit each project page
2. It takes a screenshot of each page and saves it to the `thumbnails` directory
3. It then updates the main index.html file to use these screenshots instead of generic images

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure the minimal server is running:
   ```
   npm start
   ```

3. Generate thumbnails by visiting:
   ```
   http://localhost:3000/api/generate-thumbnails
   ```
   - Add `?force=true` to regenerate all thumbnails: `http://localhost:3000/api/generate-thumbnails?force=true`

4. Check the status of thumbnails:
   ```
   http://localhost:3000/api/thumbnails
   ```

## Troubleshooting

If thumbnails aren't generating correctly:

1. Make sure your server is running on port 3000
2. Check that all project pages are accessible and loading correctly
3. Look at the server console for any errors during screenshot capture

## Customizing Thumbnails

If you want to customize how a specific thumbnail looks:

1. Edit the project's page to make it look good for the screenshot
2. Force regenerate the thumbnails with: `http://localhost:3000/api/generate-thumbnails?force=true`

## Manual Commands

You can also use these npm scripts:

- Generate all thumbnails: `npm run generate-thumbnails`
- Update HTML to use thumbnails: `npm run update-thumbnails` 

## Requirements

- Node.js 14+ 
- Puppeteer and its dependencies
- Running local server on port 3000 
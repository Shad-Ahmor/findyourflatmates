// copyRedirects.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '_redirects');
const destinationDir = path.join(__dirname, 'dist');
const destination = path.join(destinationDir, '_redirects');

try {
  // Check if dist exists
  if (!fs.existsSync(destinationDir)) {
    console.error(`❌ ERROR: Output directory '${destinationDir}' does not exist. Did 'expo export --platform web' run successfully?`);
    process.exit(1); 
  }

  // Check if source _redirects exists
  if (!fs.existsSync(source)) {
    console.error(`❌ ERROR: Source file '${source}' (_redirects) does not exist in root.`);
    process.exit(1); 
  }

  // Copy the file
  fs.copyFileSync(source, destination);
  
  // ✅ Verify after copy
  if (!fs.existsSync(destination)) {
    console.error('❌ Failed to copy _redirects to dist/');
    process.exit(1);
  }

  console.log(`✅ Success: Copied _redirects to ${destinationDir}/`);
} catch (err) {
  console.error('❌ Failed to copy _redirects:', err.message);
  process.exit(1);
}

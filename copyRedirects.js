// copyRedirects.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '_redirects');  // root _redirects
const destinationDir = path.join(__dirname, 'dist'); // publish folder
const destination = path.join(destinationDir, '_redirects');

try {
  if (!fs.existsSync(destinationDir)) {
    console.error(`❌ ERROR: Output directory '${destinationDir}' does not exist. Did 'expo export --platform web' run successfully?`);
    process.exit(1);
  }

  if (!fs.existsSync(source)) {
    console.error(`❌ ERROR: Source file '${source}' (_redirects) does not exist in root.`);
    process.exit(1);
  }

  fs.copyFileSync(source, destination);

  if (!fs.existsSync(destination)) {
    console.error('❌ Failed to copy _redirects to dist/');
    process.exit(1);
  }

  console.log(`✅ Success: Copied _redirects to ${destinationDir}/`);
} catch (err) {
  console.error('❌ Failed to copy _redirects:', err.message);
  process.exit(1);
}

const fs = require('fs-extra');
const sass = require('sass');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');

function copyScss() {
  console.log('Compiling docs-tools.css file...');
  try {
    const result = sass.renderSync({
      file: path.resolve(__dirname, '../src/app/public/styles/docs-tools.scss'),
      importer: tildeImporter
    });

    const target = path.resolve(__dirname, '../dist/css/docs-tools.css');

    fs.ensureFileSync(target);

    fs.writeFileSync(target, result.css);
    console.log('Done.');
  } catch (err) {
    console.error('Compiling docs-tools.css failed!', err);
    process.exit(1);
  }
}

try {
  copyScss();
} catch (err) {
  console.log('ERROR:', err);
  process.exit(1);
}

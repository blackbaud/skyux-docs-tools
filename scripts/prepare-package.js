const fs = require('fs-extra');
const sass = require('sass');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');

function copyScss() {
  const result = sass.renderSync({
    file: path.resolve(__dirname, '../src/app/public/styles/docs-tools.scss'),
    importer: tildeImporter
  });

  const target = path.resolve(__dirname, '../dist/css/docs-tools.css');

  fs.ensureFileSync(target);

  fs.writeFileSync(target, result.css);
}

copyScss();

const crossSpawn = require('cross-spawn');

async function runAsync() {
  console.log('Preparing package for NPM...');
  try {
    crossSpawn.sync('node', ['./scripts/prepare-package.js'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    console.log('Done preparing package.');
  } catch (err) {
    console.error('Preparing package failed!');
    process.exit(1);
  }
}

module.exports = {
  runAsync
};

async function runAsync() {
  console.log('Preparing package for NPM...');
  try {
    require('./prepare-package');
    console.log('Done preparing package.');
  } catch (err) {
    console.error('Preparing package failed!');
    process.exit(1);
  }
}

module.exports = {
  runAsync
};

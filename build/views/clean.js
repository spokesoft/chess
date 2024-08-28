const { rimraf } = require('rimraf');
function cleanScripts() {
  return rimraf('www/**/*.html', { glob: true });
}
module.exports = cleanScripts;
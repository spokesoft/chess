const { rimraf } = require('rimraf');
function cleanScripts() {
  return rimraf('www/**/*.css', { glob: true });
}
module.exports = cleanScripts;
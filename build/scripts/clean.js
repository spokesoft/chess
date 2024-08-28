const { rimraf } = require('rimraf');
function cleanScripts() {
  return rimraf('www/**/*.js', { glob: true });
}
module.exports = cleanScripts;
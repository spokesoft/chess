
const { series, watch } = require('gulp');

function watchScripts() {
  return watch('src/scripts/**/*.js', { ignoreInitial: false }, series('clean:scripts', 'build:scripts'));
}

module.exports = watchScripts;
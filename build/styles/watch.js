
const { series, watch } = require('gulp');

function watchScripts() {
  return watch('src/styles/**/*.scss', { ignoreInitial: false }, series('clean:styles', 'build:styles'));
}

module.exports = watchScripts;
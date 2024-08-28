
const { series, watch } = require('gulp');

function watchScripts() {
  return watch('src/views/**/*.pug', { ignoreInitial: false }, series('clean:views', 'build:views'));
}

module.exports = watchScripts;
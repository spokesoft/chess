const browserify = require('browserify');
const ensureDirectory = require("../utils/ensure-directory.js");
const fs = require('fs/promises');

function buildScripts() {
  return new Promise((resolve, reject) => {
    const b = browserify({ entries: ['src/scripts/index.js'] });
    const stream = b.bundle();
    let output = '';
    stream.on('data', (data) => {
      output += data.toString();
    });
    stream.on('end', () => {
      ensureDirectory('www')
        .then(() => {
          fs.writeFile('www/bundle.js', output, {})
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
    resolve();
  });
}

module.exports = buildScripts;
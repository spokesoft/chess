const ensureDirectory = require("../utils/ensure-directory.js");
const fs = require('fs/promises');
const sass = require('sass');

function buildStyles() {
  return new Promise((resolve, reject) => {
    const inputPath = 'src/styles/index.scss';
    const outputPath = 'www/bundle.css';
    const options = { style: "compressed" }
    const response = sass.compile(inputPath, options);
    ensureDirectory('www')
      .then(() => {
        fs.writeFile(outputPath, response.css, {})
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = buildStyles;
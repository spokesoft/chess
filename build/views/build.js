const ensureDirectory = require("../utils/ensure-directory.js");
const fs = require("fs/promises");
const pug = require("pug");

function buildViews() {
  return new Promise((resolve, reject) => {
    const locals = {};
    const index = pug.compileFile("src/views/index.pug");
    const chess2D = pug.compileFile("src/views/2d.pug");
    const chess3D = pug.compileFile("src/views/3d.pug");
    ensureDirectory("www", { recursive: true })
      .then(() => {
        let promises = [];
        promises.push(fs.writeFile("www/index.html", index(locals), {}));
        promises.push(fs.writeFile("www/2d.html", chess2D(locals), {}));
        promises.push(fs.writeFile("www/3d.html", chess3D(locals), {}));
        Promise.all(promises).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

module.exports = buildViews;

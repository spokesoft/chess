const { mkdir } = require("fs/promises");

function ensureDirectory(path, options = {}) {
  return new Promise((resolve, reject) => {
    mkdir(path, options)
      .then(() => resolve())
      .catch((error) => {
        if (error.code === "EEXIST") return resolve();
        reject(error);
      });
  });
}

module.exports = ensureDirectory;
const ensureDirectory = require("./utils/ensure-directory.js");
const buildViews = require("./views/build.js");

ensureDirectory('www').then(
  () => buildViews()
).catch(console.error);
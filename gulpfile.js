import { rimraf } from "rimraf";
import { glob } from "glob";
import { info } from "fancy-log";
import { parallel, series, task, watch } from "gulp";
import { dirname, join, normalize, sep } from "path";
import {
  mkdir as _mkdir,
  writeFile as _writeFile,
  readdir as _readdir,
} from "fs/promises";
import browserify from "browserify";
import chalk from "chalk";
import favicons from "favicons";
import pug from "pug";
import * as sass from "sass";

function register(name, description, fn) {
  fn.description = description;
  task(name, fn);
}

function cleanTask(pattern, options = {}) {
  return async () => {
    const files = await glob(pattern, options);
    await rimraf(files);
    if (files.length === 0) {
      info(chalk.gray(`No files found to clean (${pattern})`));
    } else {
      files.forEach((file) => info(`Cleaned '${chalk.yellow(file)}'`));
    }
  };
}

function mkdir(dirname) {
  return new Promise((resolve, reject) => {
    _mkdir(dirname, { recursive: true })
      .then(resolve)
      .catch((err) => {
        if (err.code == "EEXIST") resolve();
        else reject(err);
      });
  });
}

function writeFile(file, content, options) {
  return new Promise((resolve, reject) => {
    mkdir(dirname(file))
      .then(() => {
        _writeFile(file, content, options)
          .then(() => info(`Wrote file '${chalk.green(normalize(file))}'`))
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

function readdir(dirname, options) {
  return new Promise((resolve, reject) => {
    _readdir(dirname, options)
      .then(resolve)
      .catch((err) => {
        if (err.code == "ENOENT") resolve([]);
        else reject(err);
      });
  });
}

function convertHtmlToPug(line) {
  line = line.slice(1, -1);
  const tag = line.slice(0, 4); // link || meta
  const attributes = line.slice(5).split(" ").join(", ");
  return `${tag}(${attributes})`;
}

function buildImages() {
  return new Promise((resolve, reject) => {
    const faviconsPath = (filepath) => join("public/favicons", filepath);
    favicons(normalize("src/images/icon.png"), {
      path: "/favicons",
      appName: "chess",
    })
      .then((result) => {
        let promises = [];
        const lines = result.html.map(convertHtmlToPug);
        promises.push(
          ...result.images.map((file) =>
            writeFile(faviconsPath(file.name), file.contents)
          )
        );
        promises.push(
          ...result.files.map((file) =>
            writeFile(faviconsPath(file.name), file.contents)
          )
        );
        promises.push(
          writeFile(
            normalize("src/views/includes/favicons.pug"),
            lines.join("\n")
          )
        );
        Promise.all(promises).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

function buildScripts() {
  return new Promise(async (resolve, reject) => {
    let instance = browserify();
    instance.add("src/scripts/index.js");
    instance.on("bundle", (stream) => {
      let content = "";
      stream.on("data", (chunk) => (content += chunk));

      stream.on("end", () =>
        writeFile("public/scripts/bundle.js", content)
          .then(resolve)
          .catch(reject)
      );
    });
    instance.bundle();
  });
}

function buildStyles(options = {}) {
  return new Promise((resolve, reject) => {
    const result = sass.compile("src/styles/index.scss", {
      sourceMap: false,
      loadPaths: ["node_modules"],
    });
    writeFile(normalize("public/styles/bundle.css"), result.css)
      .then(resolve)
      .catch(reject);
  });
}

function buildViews() {
  return new Promise((resolve, reject) => {
    readdir("src/views", { withFileTypes: true, recursive: true })
      .then((dirents) =>
        dirents.filter((dirent) => dirent.name.endsWith(".pug"))
      )
      .then((dirents) =>
        dirents.filter((dirent) => dirent.name !== "layout.pug")
      )
      .then((dirents) =>
        dirents.filter((dirent) => !dirent.path.endsWith("includes"))
      )
      .then((dirents) => {
        let promises = [];
        dirents.forEach((dirent) => {
          let locals = {};
          const inputPath = join(dirent.path, dirent.name);
          const outputPath = join(
            dirent.path.replace("src/views", "public"),
            dirent.name.replace(".pug", ".html")
          );
          const template = pug.compileFile(inputPath);
          promises.push(writeFile(outputPath, template(locals)));
        });
        Promise.all(promises).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

register("build:images", "Builds and optimizes images", buildImages);

register("build:scripts", "Builds javascript files", buildScripts);

register("build:styles", "Builds stylesheets", buildStyles);

register("build:views", "Builds HTML files", buildViews);

register(
  "build:*",
  "Build all targets",
  series(
    "build:images",
    parallel("build:scripts", "build:styles", "build:views")
  )
);

register("clean:images", "Clean up images", cleanTask("www/favicons/**/*"));

register("clean:scripts", "Clean up scripts", cleanTask("www/scripts/**/*"));

register("clean:styles", "Clean up styles", cleanTask("www/styles/**/*"));

register("clean:views", "Clean up views", cleanTask("www/**/*.html"));

register(
  "clean:*",
  "Clean all targets",
  parallel("clean:images", "clean:scripts", "clean:styles", "clean:views")
);

register("watch:images", "Watch images and rebuild", () =>
  watch("www/images/**/*", {}, series("clean:images", "build:images"))
);

register("watch:scripts", "Watch scripts and rebuild", () =>
  watch("www/scripts/**/*", {}, series("clean:scripts", "build:scripts"))
);

register("watch:styles", "Watch styles and rebuild", () =>
  watch("www/styles/**/*", {}, series("clean:styles", "build:styles"))
);

register("watch:views", "Watch views and rebuild", () =>
  watch("www/views/**/*", {}, series("clean:views", "build:views"))
);

register(
  "watch:*",
  "Watch all targets",
  parallel("watch:images", "watch:scripts", "watch:styles", "watch:views")
);

task("default", series("clean:*", "build:*"));

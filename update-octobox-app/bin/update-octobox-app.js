#!/usr/bin/env node
'use strict';

// dependencies
const { execSync } = require("child_process");
const fs = require("fs");
const requireFromString = require("require-from-string");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const Jsdom = require("jsdom").JSDOM;

// this is here if queries are required in the future
const ask = (query, defaultAnswer) => {
  return new Promise(resolve => {
    readline.question(`\x1b[94m${query} \x1b[37m(${defaultAnswer}) `, resolve);
  })
}

// log current version and version to go to
const log = (version) => console.log(`\x1b[94mIt seems like you're running @${version}. Updating to @latest. This will take a while.\x1b[37m\x1b[0m`);

const updatePackageVersion = (version) => {
  const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
  pkg.octobox = version;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
}

// check which version we're on, and run the amount of updates required to update from that version
const updateToLatest = async () => {
  if(checkIfRoot()) {
    const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
    switch(pkg.octobox) {
      case "1.0.0":
      case "v1.0.0":
        log("1.0.0");
        await update1_1_0();
        updatePackageVersion("1.1.0");
        break;
      case "1.1.0":
      case "v1.1.0":
        console.log("\x1b[94mYou're already running the latest version of Octobox! If you think this is a mistake, try appending \"@latest\" to the command you ran.\nFor example, try \"npx update-octobox-app@latest\".\x1b[37m");
        break;
      default:
        console.log("\x1b[94mYou don't seem to have a valid Octobox version to update from. Edit your package.json's \"octobox\" paramater to the version of Octobox this app uses!\x1b[37m");
    }
  }else{
    console.log("\x1b[94mYou don't seem to be in the root folder of your application and/or have an \"octobox\" paramater in your package.json! Navigate to the directory containing your application's package.json and/or add an \"octobox\" paramater equaling the version of Octobox this app uses!\x1b[37m");
  }
  stop();
}

const update1_1_0 = async () => {
  // async dependencies
  const stringifyObject = await import("stringify-object");
  // trim package.json keywords
  const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
  const keys = pkg.keywords.map(key => key.trim());
  pkg.keywords = keys;
  // update npm scripts
  const newScripts = {
    "start": "npm-run-all -s -c start:*",
    "start:router": "node octobox.js add",
    "start:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
    "start:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
    "start:server": "concurrently \"npm run chokidar\" \"sass --watch src/styles/main.scss src/styles/main.css\" \"react-scripts start\"",
    "test": "npm-run-all -s -c test:*",
    "test:react": "react-scripts test",
    "build": "npm-run-all -s -c build:*",
    "build:router": "node octobox.js add",
    "build:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
    "build:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
    "build:styles": "sass src/styles/main.scss src/styles/main.css",
    "build:react": "react-scripts build",
    "eject": "npm-run-all -s -c eject:*",
    "eject:react": "react-scripts eject",
    "serve": "npm-run-all -s -c serve:*",
    "serve:serve": "npx --yes serve build",
    "deploy": "npm-run-all -s -c deploy:*",
    "deploy:build": "npm run build",
    "deploy:serve": "npm run serve:serve",
    "chokidar": "chokidar \"./src/pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}\" -c \"node octobox.js {event}\""
  }
  const scripts = {
    ...pkg.scripts,
    ...newScripts
  }
  pkg.stylelint = {
    extends: ["./stylelintrc.js"]
  }
  pkg.scripts = scripts;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  // create src/components
  if(!fs.existsSync("./src/components/")) {
    fs.mkdirSync("./src/components/");
  }
  // remove craco
  execSync("npm remove @craco/craco @types/react-router-dom", {cwd: "./"});
  if(fs.existsSync("./craco.config.js")) {
    fs.rmSync("./craco.config.js");
  }
  // update to cra v5
  execSync("npm install --save --save-exact react-scripts@5.0.0", {cwd: "./"});
  // update dependencies
  execSync("npm i postcss@8.4.5 autoprefixer@10.4.0 tailwindcss@3.0.7 @typescript-eslint/eslint-plugin@5.8.0 @typescript-eslint/parser@5.8.0 stylelint-config-octobox@1.0.0 eslint-config-octobox@1.0.0", {cwd: "./"});
  execSync("npm i", {cwd: "./"});
  // make postcss.config.js
  const postcss = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  fs.writeFileSync("./postcss.config.js", postcss);
  // update tailwind config
  const tailwind = requireFromString(fs.readFileSync("./tailwind.config.js").toString());
  delete tailwind.purge;
  const newTailwind = {};
  newTailwind.content = ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"];
  for(const [key, value] of Object.entries(tailwind)) {
    newTailwind[key] = value;
  }
  fs.writeFileSync("./tailwind.config.js", `module.exports = ${stringifyObject.default(newTailwind, {singleQuotes: false, indent: "  "})};`);
  // add license if one doesn't exist
  if(!fs.existsSync("./LICENSE") && pkg.license === "MIT") {
    const year = new Date().getFullYear();
    const dom = new Jsdom(fs.readFileSync("./public/index.html").toString());
    const license = `MIT License

Copyright (c) ${year} ${dom.window.document.querySelector('meta[name="publisher"]').getAttribute("content")}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
    fs.writeFileSync("./LICENSE", license);
  }
}

const checkIfRoot = () => {
  if(fs.existsSync("./package.json")) {
    const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
    if("octobox" in pkg) {
      return true;
    }
  }else{
    return false;
  }
}

const stop = () => {
  console.log("\x1b[0m");
  process.exit(0);
}

const stopWithErr = (e) => {
  console.error(e);
  stop();
}

updateToLatest().catch(stopWithErr);

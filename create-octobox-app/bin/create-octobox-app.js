#!/usr/bin/env node
'use strict';

// import/configure libs
const { execSync } = require("child_process");
const fs = require("fs");
const util = require("util");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(readline.question).bind(readline);

const configure = async () => {

  // configure octobox variables
  console.log("Welcome! This CLI will create an Octobox app for you.\nPress ^C at any time to quit.")

  // path creation
  let answer = await question("Development path: (./my-octobox-app/) ");
  readline.close();
  let path;
  if(answer.length === 0) {
    path = "./my-octobox-app/";
  }else{
    path = answer;
  }
  if(path.startsWith("./")) {
    path = path.substring(2, path.length);
  }else if(path.startsWith("/")) {
    path = path.substring(1, path.length);
  }
  if(path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }

  // domain creation
  answer = await question("Domain name: (https://my-octobox-app.test) ");
  readline.close();
  let domain;
  if(answer.length === 0) {
    domain = "https://my-octobox-app.test";
  }else{
    domain = answer;
  }
  if(domain.endsWith("/")) {
    domain = domain.substring(0, domain.length - 1);
  }

  // host creation
  answer = await question("Hosted path: (/) ");
  readline.close();
  let root;
  if(answer.length === 0) {
    root = "/";
  }else{
    root = answer;
  }
  if(root.startsWith("./")) {
    root = root.substring(2, root.length);
  }else if(root.startsWith("/")) {
    root = root.substring(1, root.length);
  }
  if(root.endsWith("/")) {
    root = root.substring(0, root.length - 1);
  }

  // octobox linter config toggle
  answer = await question("Use default linter configs: (y) ");
  readline.close();
  answer = answer.toUpperCase();
  let octoboxLint;
  octoboxLint = answer.length === 0 || answer === "Y" || answer === "TRUE" || answer === "YES";

  // generate app
  generate(path, domain, root, octoboxLint);
};

const generate = (path, domain, root, octoboxLint) => {
  // gen cra template
  console.log("Creating Octobox app. This will take a while...");
  execSync(`npx --yes create-react-app ${path} --template octobox`);
  // gen octobox specific items
  const packageJson = JSON.parse(fs.readFileSync(`./${path}/package.json`).toString());
  packageJson.homepage = `/${root}`;
  fs.writeFileSync(`./${path}/package.json`, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(`./${path}/public/sitemap.txt`, `${domain}/%PUBLIC_URL%/?/`);
  if(!octoboxLint) {
    const eslint = JSON.parse(fs.readFileSync(`./${path}/.eslintrc.js`).toString());
    const stylelint = JSON.parse(fs.readFileSync(`./${path}/.stylelintrc.js`).toString());
    eslint.extends.length = 2;
    stylelint.extends.length = 1;
    fs.writeFileSync(`./${path}/.eslintrc.js`, JSON.stringify(eslint, null, 2));
    fs.writeFileSync(`./${path}/.stylelintrc.js`, JSON.stringify(stylelint, null, 2));
  }
  // log completion
  console.log(`Success! Octobox app created at ./${path}!`);
  console.log("We suggest that you begin by typing:\n\n  \x1b[94mcd \x1b[37mtest\n  \x1b[94mnpm start\n\n\x1b[37mHappy hacking!");
  process.exit();
};

configure().catch(e => console.log(e));

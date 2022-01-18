#!/usr/bin/env node
'use strict';

//deps and commands
const { spawn, execSync } = require('child_process');
const fs = require("fs");

//logger
const log = (msg) => {
  console.log(`\x1b[94m${msg}\x1b[0m`)
}

const execute = async (command) => {
  switch(command) {

    case "start":
      log("Starting development server...");
      const firstRouterRun = execSync("octobox-router add", {cwd: "./"});
      console.log(firstRouterRun.toString());
      const firstEslintRun = execSync('eslint --fix "**/*.{js,ts,jsx,tsx}"', {cwd: "./"});
      console.log(firstEslintRun.toString());
      const firstStylelintRun = execSync('npx --yes stylelint --fix "**/*.scss"', {cwd: "./"});
      console.log(firstStylelintRun.toString());
      let child = spawn('concurrently "octobox-scripts start chokidar" "sass --watch src/styles/main.scss src/styles/main.css" "react-scripts start"', {cwd: "./"});
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      child.on('close', code => {
        console.log("Exited with code " + code);
      });
      break;

    case "start:chokidar":
      let chokidar = execSync('chokidar "./src/pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}" -c "octobox-router {event}"', {cwd: "./"});
      console.log(chokidar.toString());
      break;

    case "test":
      console.log("Running automated tests...");
      let testChild = spawn("react-scripts test", {cwd: "./"});
      testChild.stdout.setEncoding('utf8');
      testChild.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      testChild.stderr.setEncoding('utf8');
      testChild.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      testChild.on('close', code => {
        console.log("Exited with code " + code);
      });
      break;

    case "build":
      log("Building app...");
      const buildRouterRun = execSync("octobox-router add", {cwd: "./"});
      console.log(buildRouterRun.toString());
      const buildEslintRun = execSync('eslint --fix "**/*.{js,ts,jsx,tsx}"', {cwd: "./"});
      console.log(buildEslintRun.toString());
      const buildStylelintRun = execSync('npx --yes stylelint --fix "**/*.scss"', {cwd: "./"});
      console.log(buildStylelintRun.toString());
      const buildStyleRun = execSync("sass src/styles/main.scss src/styles/main.css", {cwd: "./"});
      console.log(buildStyleRun.toString());
      let buildChild = spawn("react-scripts build", {cwd: "./"});
      buildChild.stdout.setEncoding('utf8');
      buildChild.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      buildChild.stderr.setEncoding('utf8');
      buildChild.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      buildChild.on('close', code => {
        console.log("Exited with code " + code);
      });
      break;

    case "serve":
      console.log("Serving app...");
      let serveChild = spawn("npx --yes serve build", {cwd: "./"});
      serveChild.stdout.setEncoding('utf8');
      serveChild.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      serveChild.stderr.setEncoding('utf8');
      serveChild.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      serveChild.on('close', code => {
        console.log("Exited with code " + code);
      });
      break;

    case "deploy":
      console.log("Deploying app...");
      let deployChild = spawn("octobox-scripts build", {cwd: "./"});
      deployChild.stdout.setEncoding('utf8');
      deployChild.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      deployChild.stderr.setEncoding('utf8');
      deployChild.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      deployChild.on('close', code => {
        console.log("Exited with code " + code);
      });
      let deployServeChild = spawn("npx --yes serve build", {cwd: "./"});
      deployServeChild.stdout.setEncoding('utf8');
      deployServeChild.stdout.on('data', data => {
        console.log('stdout: ' + data);
      });
      deployServeChild.stderr.setEncoding('utf8');
      deployServeChild.stderr.on('data', data => {
        console.log('stderr: ' + data);
      });
      deployServeChild.on('close', code => {
        console.log("Exited with code " + code);
      });
      break;

    case "eject":
      log("Ejecting...");
      const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
      pkg.scrips = {
        "octobox:start": "npm-run-all -s -c octobox:start:*",
        "octobox:start:router": "octobox-router add",
        "octobox:start:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
        "octobox:start:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
        "octobox:start:server": "concurrently \"npm run octobox:chokidar\" \"sass --watch src/styles/main.scss src/styles/main.css\" \"npm run start\"",
        "octobox:test": "npm-run-all -s -c octobox:test:*",
        "octobox:test:react": "npm run test",
        "octobox:build": "npm-run-all -s -c octobox:build:*",
        "octobox:build:router": "octobox-router add",
        "octobox:build:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
        "octobox:build:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
        "octobox:build:styles": "sass src/styles/main.scss src/styles/main.css",
        "octobox:build:react": "npm run build",
        "octobox:serve": "npm-run-all -s -c octobox:serve:*",
        "octobox:serve:serve": "npx --yes serve build",
        "octobox:deploy": "npm-run-all -s -c octobox:deploy:*",
        "octobox:deploy:build": "npm run octobox:build",
        "octobox:deploy:serve": "npm run octobox:serve:serve",
        "octobox:chokidar": "chokidar \"./src/pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}\" -c \"octobox-router {event}\""
      };
      delete pkg.octobox;
      fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
      const ejectReact = execSync("npm run eject", {cwd: "./"});
      console.log(ejectReact.toString());
      break;

    default:
      log("Command not found!");
      log("List of supported commands:");
      log("    - start");
      log("    - test");
      log("    - build");
      log("    - serve");
      log("    - deploy");
      log("    - eject");
  }
}

// command parser
const parse = () => {
  const args = process.argv.slice(2);
  let str = "";
  args.forEach(arg => str += `:${arg}`);
  return str;
}

// main fun
const run = async () => {
  const command = parse();
  await execute(command);
}

// main caller
run().catch(console.error);

#!/usr/bin/env node
'use strict';

//deps and commands
// TODO: look through all of the commands and determine how to run them with this script. remember, they can't just be run with "npm run commandname", they have to be run via the script itself
const { spawn } = require('child_process');
const scripts = {
  "start": "npm-run-all -s -c start:*",
  "build": "npm-run-all -s -c build:*",
  "test": "npm-run-all -s -c test:*",
  "eject": "npm-run-all -s -c eject:*",
  "start:router": "octobox-router add",
  "start:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
  "start:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
  "start:server": 'concurrently "npm run chokidar" "sass --watch src/styles/main.scss src/styles/main.css" "react-scripts start"',
  "test:react": "react-scripts test",
  "build:router": "octobox-router add",
  "build:eslint": "eslint --fix \"**/*.{js,ts,jsx,tsx}\"",
  "build:stylelint": "npx --yes stylelint --fix \"**/*.scss\"",
  "build:styles": "sass src/styles/main.scss src/styles/main.css",
  "build:react": "react-scripts build",
  "eject:react": "react-scripts eject",
  "serve": "npm-run-all -s -c serve:*",
  "serve:serve": "npx --yes serve build",
  "deploy": "npm-run-all -s -c deploy:*",
  "deploy:build": "npm run build",
  "deploy:serve": "npm run serve:serve",
  "chokidar": 'chokidar \"./src/pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}\" -c \"node octobox.js {event}\"'
}

//logger
const log = (msg) => {
  console.log(`\x1b[94m${msg}\x1b[0m`)
}

// command executor
// don't make this sync, this is async to make sure async methods can be called in the future if needed
const execute = async (command) => {
  if(command in scripts) {
    let child = spawn(scripts[command], {cwd: "./"});
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });

    child.on('close', function(code) {
      console.log("Exited with code " + code);
    });
  }else{
    log("Command not found!");
    log("List of supported commands:");
    Object.keys(scripts).forEach(log);
    log("Syntax:");
    log("Running \"octobox-scripts $command $subsystem $process $subprocesses...\" will execute $command:$subsystem:$process:$subprocesses...");
  }
}

// command parser
const parse = () => {
  const args = process.argv.slice(2);
  let str = "";
  args.forEach(arg => str += arg);
  return str;
}

// main fun
const run = async () => {
  const command = parse();
  await execute(command);
}

// main caller
run().catch(console.error);

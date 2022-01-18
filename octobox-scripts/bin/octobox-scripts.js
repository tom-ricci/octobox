#!/usr/bin/env node
'use strict';

//deps and commands
// TODO: look through all of the commands and determine how to run them with this script. remember, they can't just be run with "npm run commandname", they have to be run via the script itself
const { spawn, exec, execSync } = require('child_process');
const scripts = {
  "eject:react": "react-scripts eject",
}

//logger
const log = (msg) => {
  console.log(`\x1b[94m${msg}\x1b[0m`)
}

const execute = async (command) => {
  switch(command) {

    case "start":
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
      // TODO: this
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

// command executor
// don't make this sync, this is async to make sure async methods can be called in the future if needed
// const execute = async (command) => {
//   if(command in scripts) {
//     let child = spawn(scripts[command], {cwd: "./"});
//     child.stdout.setEncoding('utf8');
//     child.stdout.on('data', function(data) {
//       console.log('stdout: ' + data);
//     });
//
//     child.stderr.setEncoding('utf8');
//     child.stderr.on('data', function(data) {
//       console.log('stderr: ' + data);
//     });
//
//     child.on('close', function(code) {
//       console.log("Exited with code " + code);
//     });
//   }else{
    log("Command not found!");
    log("List of supported commands:");
    Object.keys(scripts).forEach(log);
//     log("Syntax:");
//     log("Running \"octobox-scripts $command $subsystem $process $subprocesses...\" will execute $command:$subsystem:$process:$subprocesses...");
//   }
// }

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

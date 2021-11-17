#!/usr/bin/env node
'use strict';

// import/configure libs
const { execSync } = require("child_process");
const fs = require("fs");
const { promisify } = require("util");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
readline.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    readline.question(question, resolve);
  });
};

// FIXME: i cant figure out how to get readlines working promisifi- (or maybe i do?? just had an idea they might work if i dont close readline)
const configure = async () => {

  // configure octobox variables
  console.log("\x1b[94mWelcome! This CLI will create an Octobox app for you.\nPress \x1b[37m^C\x1b[94m at any time to quit.")

  // readline for path
  readline.question("\x1b[94mDevelopment path: \x1b[37m(./my-octobox-app/) ", answer => {

    // path creation
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

    // readline for domain
    readline.question("\x1b[94mDomain name: \x1b[37m(https://my-octobox-app.test) ", answer => {

      // domain creation
      let domain;
      if(answer.length === 0) {
        domain = "https://my-octobox-app.test";
      }else{
        domain = answer;
      }
      if(domain.endsWith("/")) {
        domain = domain.substring(0, domain.length - 1);
      }

      // readline for host
      readline.question("\x1b[94mHosted path: \x1b[37m(/) ", answer => {

        // host creation
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

        // readline for linter
        readline.question("\x1b[94mUse default linter configs: \x1b[37m(Y) ", answer => {

          // octobox linter config toggle
          answer = answer.toUpperCase();
          let octoboxLint;
          octoboxLint = answer.length === 0 || answer === "Y" || answer === "TRUE" || answer === "YES";

          // generate app
          readline.close();
          generate(path, domain, root, octoboxLint);

        });

      });

    });

  });
};

const generate = (path, domain, root, octoboxLint) => {

  // gen cra template
  console.log("\x1b[94mCreating Octobox app. This will take a while...");
  execSync(`npx --yes create-react-app ${path} --template octobox`);

  // gen octobox items
  const packageJson = JSON.parse(fs.readFileSync(`./${path}/package.json`).toString());
  packageJson.homepage = `/${root}`;
  fs.writeFileSync(`./${path}/package.json`, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(`./${path}/public/sitemap.txt`, `${domain}/%PUBLIC_URL%/?/`);
  if(!octoboxLint) {
    const eslint = JSON.parse(fs.readFileSync(`./${path}/.eslintrc.js`).toString().substring(17));
    const stylelint = JSON.parse(fs.readFileSync(`./${path}/.stylelintrc.js`).toString().substring(17));
    eslint.extends.length = 2;
    stylelint.extends.length = 1;
    fs.writeFileSync(`./${path}/.eslintrc.js`, `module.exports = ${JSON.stringify(eslint, null, 2)};\n`);
    fs.writeFileSync(`./${path}/.stylelintrc.js`, `module.exports = ${JSON.stringify(stylelint, null, 2)};\n`);
  }else{
    fs.writeFileSync(`./${path}/.eslintrc.js`, `${fs.readFileSync(`./${path}/.eslintrc.js`).toString()};\n`);
    fs.writeFileSync(`./${path}/.stylelintrc.js`, `${fs.readFileSync(`./${path}/.stylelintrc.js`).toString()};\n`);
  }

  // log completion
  console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nScroll up for non-fatal error logs\n-----------------------------------------------\n\x1b[94mSuccess! Octobox app created at \x1b[37m./${path}\x1b[94m!`);
  console.log(`\x1b[94mWe suggest that you begin by typing:

  \x1b[94mcd \x1b[37m${path}
  \x1b[94mnpm start

\x1b[94mHappy hacking!\x1b[37m`);
  process.exit();
};

configure().catch(e => console.log(e));

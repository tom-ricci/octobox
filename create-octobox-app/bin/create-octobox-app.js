#!/usr/bin/env node
'use strict';

// import/configure libs
const {execSync} = require("child_process");
const fse = require("fs-extra");
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const configure = () => {
  // configure octobox variables
  console.log("This utility will create an Octobox app for you.\n\nPress ^C at any time to quit.")
  readline.question("development path: (./my-octobox-app/) ", answer => {
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
    readline.question("domain name: (https://my-octobox-app.test) ", answer => {
      let domain;
      if(answer.length === 0) {
        domain = "https://my-octobox-app.test";
      }else{
        domain = answer;
      }
      if(domain.endsWith("/")) {
        domain = domain.substring(0, domain.length - 1);
      }
      readline.question("hosted path: (/) ", answer => {
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
        readline.close();
        generate(path, domain, root);
      });
    });
  });
};

const generate = (path, domain, root) => {
  // gen cra template
  console.log("Creating Octobox app. This will take a while...");
  execSync(`npx --yes create-react-app ${path} --template @tom-ricci`);
  // gen octobox specific items
  const json = fse.readJsonSync(`./${path}/package.json`);
  json.homepage = `/${root}`;
  fse.writeJsonSync(`./${path}/package.json`, json);
  fs.writeFile(`./${path}/public/sitemap.txt`, `${domain}/%PUBLIC_URL%/?/`, e => console.error(e));
  // log completion
  console.log(`Success! Octobox app created at ./${path}!`);
  console.log("We suggest that you begin by typing:\n\n  \x1b[94mcd \x1b[37mtest\n  \x1b[94mnpm start\n\n\x1b[37mHappy hacking!");
  process.exit();
};

configure();

// TODO: tests will basically make a workspace folder, and make new apps with different variables (for example, right now the only thing you can mess with is the path, so it could do a normal path and an absolute path and a windows path, etc)
// TODO: tests should compare the apps they create against a checksum of what the app should be

// imports
const { execSync } = require("child_process");
const fs = require("fs");
const colors = require("ansi-colors");
const { v4: uuid } = require("uuid");
const path = require("path");
const { hashElement } = require("folder-hash");

// misc utilities
const utils = {
  log: {
    info: (msg) => {
      console.log(`${ colors.bold.yellow("➤") } ${ colors.bold(msg) }\u001b[0m`);
    },
    pass: (msg) => {
      console.log(`${ colors.bold.green("✓") } ${ colors.bold(msg) }\u001b[0m`);
    },
    fail: (msg) => {
      console.log(`${ colors.bold.red("✗") } ${ colors.bold(msg) }\u001b[0m`);
    }
  },
  path: "./055f3a15/tests/apps",
  hash: "", // TODO
  exec: (cmd) => {
    execSync(cmd, { cwd: "./055f3a15/tests/apps" });
  },
  check: (path) => {

  }
};

const main = async () => {
  // make a new directory to do our tests in
  utils.log.info("Preparing environment...");
  fs.mkdirSync("./055f3a15/tests/apps", { recursive: true });
  // run our tests
  // for these we create a bunch of projects in our /apps/ dir, and compare that dir against a checksum of what it should be if all the projects are correctly created
  utils.log.info("Running test 1...");
  utils.exec("npm create octobox-app -- argumented --path 'test1'");
  await new Promise(r => setTimeout(r, 20000));
  utils.exec("npm create octobox-app -- argumented --path '/test2'");
  utils.exec("npm create octobox-app -- argumented --path '/test3/'");
  utils.exec("npm create octobox-app -- argumented --path '/test4\\'");
  utils.exec("npm create octobox-app -- argumented --path 'C:\\test5\\'");
  utils.exec("npm create octobox-app -- argumented --path ':\\test5/'");
  const hashOptions = {
    folders: { exclude: [ ".*", "node_modules" ] },
    files: { exclude: [ "package.json", "package-lock.json" ] },
  };
  const hash = await hashElement(`${ utils.path }`, hashOptions);
  hash.toString();
  if(hash === utils.hash) {
    utils.log.pass("Test 1 passed!");
  }else{
    utils.log.fail("Test 1 Failed!");
  }
};

main().catch(console.error);

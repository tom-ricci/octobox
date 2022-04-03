const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");

// TODO: we're probably gonna do this by making some apps with eslint/stylelint problems and running both linters scripts to make sure they fail. we'll be taking care of vite integration in test 2 by comparing hashes, so we shouldnt need to connect to the vite server and somehow try to see if an error was rendered on the screen.

const test = async () => {
  // this test makes apps with linters and tests them to make sure they lint
  utils.log.info("In this test, an Octobox app will be made with ESLint and Stylelint. If the linters lint, the test will past.");
  await new Promise(r => setTimeout(r, 1000));
  await utils.finish(5);
};

module.exports = test;
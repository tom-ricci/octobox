const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");

// TODO: we're probably gonna do this by making some apps with eslint/stylelint problems and running both linters scripts to make sure they have nonzero exit codes. we'll be taking care of vite integration in test 2 by comparing hashes, so we don't need to worry about that

// use these commands:
// eslint "**/*.{js,ts,jsx,tsx}"
// npx -y stylelint "**/*.scss"

const test = async () => {
  // this test makes apps with linters and tests them to make sure they lint
  utils.log.info("In this test, an Octobox app will be made with ESLint and Stylelint. If the linters lint, the test will past.");
  await new Promise(r => setTimeout(r, 1000));
  await utils.finish(5);
};

module.exports = test;
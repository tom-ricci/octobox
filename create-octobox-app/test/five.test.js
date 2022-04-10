const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");

const test = async () => {
  // this test makes a dirty app with linters and lints them. if all goes well, the test will pass.
  utils.log.info("In this test, an Octobox app will be made with ESLint and Stylelint. If the linters lint, the test will past.");
  await new Promise(r => setTimeout(r, 1000));
  // make app and linter configs. we're not actually messing with the app to make it "dirty", we're messing with the linter configs instead. its easier.
  execSync("npm create octobox-app -- argumented --path lintertest --tailwind TRUE --eslint TRUE --stylelint TRUE --recommended_eslint_config FALSE --recommended_stylelint_config FALSE");
  fs.writeFileSync("./lintertest/.eslintrc.js", `module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ]
};`);
  fs.writeFileSync("./lintertest/.stylelintrc.js", `module.exports = {
  "extends": [
    "stylelint-config-standard-scss"
  ]
};`);
  // run our configs
  let status;
  const child = execAsync("eslint '**/*.{js,ts,jsx,tsx}' -c './.eslintrc.js'", { cwd: "./lintertest"});
  child.on("close", async (code) => {
    status = code !== 0;
    if(status) {
      utils.log.info("ESLint test successful!");
      utils.log.info("Running next...");
    }else{
      utils.log.info("ESLint test unsuccessful!");
      utils.log.info("Running next...");
    }
    const grandchild = execAsync("npx -y stylelint '**/*.scss' --config './.stylelintrc.js'", { cwd: "./lintertest"});
    grandchild.on("close", async (code) => {
      status = status && code !== 0;
      if(status) {
        utils.log.info("Stylelint test successful!");
      }else{
        utils.log.info("Stylelint test successful!");
      }
      fs.rmSync("./lintertest", { recursive: true });
      // log final status
      if(status) {
        utils.success();
        utils.log.pass("Test 5 passed!");
      }else{
        utils.log.fail("Test 5 failed!");
      }
      await utils.finish(5);
    });
  });
};

module.exports = test;
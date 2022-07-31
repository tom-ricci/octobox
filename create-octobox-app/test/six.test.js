const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const test = async () => {
  // this test should make sure routing works by checking to see if all cypress specs pass in our routing demo app
  utils.log.info("In this test, the Octobox app storted at ./test/routing will be tested. Its tests are ran by cypress and make sure Octobox's router functions properly. If all tests pass, this whole test will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // first, update deps
  execSync("npm i", { cwd: "./test/routing" });
  // then, run vite and give it time to start up
  const vite = execAsync("npm run dev", { cwd: "./test/routing"});
  await new Promise(resolve => setTimeout(resolve, 10000));
  // now that vite is running, run cypress
  const sout = execSync("npm run test", { cwd: "./test/routing" });
  const out = sout.toString();
  // cypress is done, kill vite
  vite.kill();
  // make sure all specs passed and pass test if they did
  if(out.includes("All specs passed!")) {
    utils.success();
    utils.log.pass("Test 6 passed!");
  }else{
    utils.log.fail("Test 6 failed!");
  }
  await utils.finish(6);
};

module.exports = test;
// TODO: we'll constantly want to update this test to include all possible flags -- we're going to *try* to not have a boatload of apps and have to build each of them for time's sake and just use one app. this should be fine because if it doesn't build we can go back later and diagnose the error

const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");

const test = async () => {
  // this test makes an app and builds it
  utils.log.info("In this test, an Octobox app will be created and built. If the build succeeds, the test will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make our app
  execSync("npm create octobox-app -- argumented --path appbuildtest --tailwind TRUE");
  // build our app
  let child = execAsync("npm build", { cwd: "./appbuildtest"});
  child.on("close", async (close) => {
    if(close === 0) {
      utils.log.pass("Test 5 passed!");
    }else{
      utils.log.fail("Test 5 failed!");
    }
    // wait time to know what happened
    await new Promise(r => setTimeout(r, 1000));
    // remove our app
    fs.rmSync("./appbuildtest", { recursive: true });
    // finish our tests
    await utils.finish(5);
  });
};

module.exports = test;

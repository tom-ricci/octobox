const utils = require("./testutils.js");
const { execSync } = require("child_process");
const fs = require("fs");
const { hashElement } = require("folder-hash");
const two = require("./two.test.js");

// the status of the test - true if nothing in the test fails
let status = true;

const test = async () => {
  // test 1
  // for this we create a bunch of projects in our CWD, and compare them to functional projects via a checksum. we can probably assume people will be in the root directory of the project running this, so as long as we dont decide to make a directory named one of these we should be fine.
  // alternatively, if this test is being run in creation mode, it will add/update the checksums to reflect the actual checksums of the projects and then skip all remaining tests
  if(!utils.creation) {
    utils.log.info("In this test, some Octobox apps will be created. This is to ensure they can be created properly without any errors. If they're bootstraped smoothly, they will be compared against a checksum of what they should be, and the test will pass if this is true.");
  }
  await new Promise(r => setTimeout(r, 1000));
  // run the tests -- they're stored in hashes.json
  const json = JSON.parse(fs.readFileSync("./test/hashes.json").toString());
  for(let i = 0; i < json.hashes.length; i++) {
    const index = i + 1;
    const hash = json.hashes[i];
    await run(hash[1], hash[2], hash[3], index);
  }
  // comparison time, or if we're just creating hashes exit time
  if(utils.creation) {
    utils.log.info("Hashes created.");
    await new Promise(r => setTimeout(r, 1000));
    process.exit(0);
  }
  if(status) {
    utils.success();
    utils.log.pass("Test 1 passed!");
  }else{
    utils.log.fail("Test 1 failed!");
  }
  // wait time to know what happened
  await new Promise(r => setTimeout(r, 1000));
  await utils.run(two, 2);
};

const run = async (cmd, path, hash, index) => {
  const hashOptions = {
    folders: { exclude: [ ".*", "node_modules" ] },
    files: { exclude: [ "package.json", "package-lock.json" ] },
  };
  // make app
  execSync(cmd);
  // hash app
  let ehash = await hashElement(path, hashOptions);
  ehash = ehash.toString();
  ehash = ehash.substring(ehash.indexOf("', hash: '") + 10);
  ehash = ehash.substring(0, ehash.indexOf("',"));
  // log
  if(!utils.creation) {
    utils.log.info(`Checksum ${ index }:`);
    utils.log.info(`Expected: ${ hash }`);
    utils.log.info(`Actual:   ${ ehash }`);
  }
  // cleanup
  fs.rmSync(path, { recursive: true });
  if(!utils.creation) {
    utils.log.info(ehash === hash ? `App ${ index } equals its checksum!` : `App ${ index } does not equal its checksum!`);
  }
  status = !status ? false : ehash === hash;
  // update hash (if creating new hashes)
  if(utils.creation) {
    const json = JSON.parse(fs.readFileSync("./test/hashes.json").toString());
    json.hashes[index - 1][3] = ehash;
    fs.writeFileSync("./test/hashes.json", JSON.stringify(json, null, 2));
  }
};

module.exports = test;
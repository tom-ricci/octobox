const utils = require("./testutils.js");
const { execSync } = require("child_process");
const fs = require("fs");
const { hashElement } = require("folder-hash");
const two = require("./two.test.js");

const test = async () => {
  // test 1
  // for this we create a bunch of projects in our CWD, and compare them to functional projects via a checksum. we can probably assume people will be in the root directory of the project running this, so as long as we dont decide to make a directory named one of these we should be fine.
  utils.log.info("In this test, some Octobox apps will be created. This is to ensure they can be created properly without any errors. If they're bootstraped smoothly, they will be compared against a checksum of what they should be, and the test will pass if this is true.");
  await new Promise(r => setTimeout(r, 1000));
  // one valid directory without tailwind
  execSync("npm create octobox-app -- argumented --path qwertyuiop0123456789");
  // one invalid directory (sanitization required) with tailwind
  execSync("npm create octobox-app -- argumented --path '/_+../][872345gdsef2__gerygh' --tailwind TRUE");
  const hashOptions = {
    folders: { exclude: [ ".*", "node_modules" ] },
    files: { exclude: [ "package.json", "package-lock.json" ] },
  };
  // make our checksums
  const eHash1 = "YiJUGoeWsxfpvy2G/Odvtjmtrfg=";
  const eHash2 = "PxqQga//WX2avoNwbkmSBwxD7Ro=";
  let hash1 = await hashElement("./qwertyuiop0123456789", hashOptions);
  hash1 = hash1.toString();
  hash1 = hash1.substring(hash1.indexOf("', hash: '") + 10);
  hash1 = hash1.substring(0, hash1.indexOf("',"));
  let hash2 = await hashElement("./872345gdsef2gerygh", hashOptions);
  hash2 = hash2.toString();
  hash2 = hash2.substring(hash2.indexOf("', hash: '") + 10);
  hash2 = hash2.substring(0, hash2.indexOf("',"));
  utils.log.info("Checksum 1:");
  utils.log.info(`Expected: ${ eHash1 }`);
  utils.log.info(`Actual: ${ hash1 }`);
  utils.log.info("Checksum 2:");
  utils.log.info(`Expected: ${ eHash2 }`);
  utils.log.info(`Actual: ${ hash2 }`);
  // comparison time
  if(hash1 === eHash1 && hash2 === eHash2) {
    utils.log.pass("Test 1 passed!");
  }else{
    utils.log.fail("Test 1 Failed!");
  }
  fs.rmSync("./qwertyuiop0123456789", { recursive: true });
  fs.rmSync("./872345gdsef2gerygh", { recursive: true });
  // wait time to know what happened
  await new Promise(r => setTimeout(r, 1000));
  await utils.run(two, 2);
};

module.exports = test;
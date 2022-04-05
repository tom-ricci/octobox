// TODO: always update this test

const utils = require("./testutils.js");
const { execSync } = require("child_process");
const fs = require("fs");
const { hashElement } = require("folder-hash");
const two = require("./two.test.js");

// the status of the test - true if nothing in the test fails
let status;

const test = async () => {
  // test 1
  // for this we create a bunch of projects in our CWD, and compare them to functional projects via a checksum. we can probably assume people will be in the root directory of the project running this, so as long as we dont decide to make a directory named one of these we should be fine.
  utils.log.info("In this test, some Octobox apps will be created. This is to ensure they can be created properly without any errors. If they're bootstraped smoothly, they will be compared against a checksum of what they should be, and the test will pass if this is true.");
  await new Promise(r => setTimeout(r, 1000));
  // path resolution tests:
  // one valid directory with defaults
  await run("npm create octobox-app -- argumented --path qwertyuiop0123456789 --tailwind FALSE --eslint FALSE --stylelint FALSE", "./qwertyuiop0123456789", "BQahZfj8wXJOC0LRfzD3JQLvdpg=", 1);
  // one invalid directory (sanitization required) with defaults
  await run("npm create octobox-app -- argumented --path '/_+../][872345gdsef2__gerygh' --tailwind FALSE --eslint FALSE --stylelint FALSE", "./872345gdsef2gerygh", "h4w/1AIs8JFO2o0UxrJq/HHvOSI=", 1);
  // plugin tests:
  // tailwind
  await run("npm create octobox-app -- argumented --path octoboxapptestone --tailwind TRUE --eslint FALSE --stylelint FALSE", "./octoboxapptestone", "ngPQ3H2Vo+jb8fz0Y00UZCQF8e8=", 2);
  // eslint
  await run("npm create octobox-app -- argumented --path octoboxapptestone --tailwind FALSE --eslint TRUE --stylelint FALSE", "./octoboxapptestone", "pr3tMoDGLSBvTyEMMD4r7bAbHNM=", 3);
  // stylelint
  await run("npm create octobox-app -- argumented --path octoboxapptestone --tailwind FALSE --eslint FALSE --stylelint TRUE", "./octoboxapptestone", "pZnDcnO9MSyUMawTBV4CAbjezdA=", 4);
  // eslint, stylelint
  await run("npm create octobox-app -- argumented --path octoboxapptestone --tailwind FALSE --eslint TRUE --stylelint TRUE", "./octoboxapptestone", "Og3olVmEo1tGHgjH+aJkT58V5GE=", 5);
  // comparison time
  if(status) {
    utils.success();
    utils.log.pass("Test 1 passed!");
  }else{
    utils.log.fail("Test 1 Failed!");
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
  utils.log.info(`Checksum ${ index }:`);
  utils.log.info(`Expected: ${ hash }`);
  utils.log.info(`Actual:   ${ ehash }`);
  // cleanup
  fs.rmSync(path, { recursive: true });
  utils.log.info(ehash === hash ? `App ${ index } equals its checksum!` : `App ${ index } does not equal its checksum!`);
  status = !status ? false : ehash === hash;
};

module.exports = test;
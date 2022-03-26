// imports
const { execSync, exec: execAsync } = require("child_process");
const fs = require("fs");
const colors = require("ansi-colors");
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
  }
};

const main = async () => {

  utils.log.info("Running tests...");
  // lil wait time so you can actually read whats going on
  await new Promise(r => setTimeout(r, 500));
  // run our tests below

  // test 1
  // for this we create a bunch of projects in our CWD, and compare them to functional projects via a checksum. we can probably assume people will be in the root directory of the project running this, so as long as we dont decide to make a directory named one of these we should be fine.
  utils.log.info("Running test 1...");
  utils.log.info("In this test, some Octobox apps will be created. This is to ensure they can be created properly without any errors. If they're bootstraped smoothly, they will be compared against a checksum of what they should be, and the test will pass if this is true.");
  await new Promise(r => setTimeout(r, 1000));
  // one valid directory
  execSync("npm create octobox-app -- argumented --path qwertyuiop0123456789");
  // one invalid directory, should be sanitized
  execSync("npm create octobox-app -- argumented --path '/_+../][872345gdsef2__gerygh'");
  const hashOptions = {
    folders: { exclude: [ ".*", "node_modules" ] },
    files: { exclude: [ "package.json", "package-lock.json" ] },
  };
  // make our checksums
  let hash1 = await hashElement("./qwertyuiop0123456789", hashOptions);
  hash1 = hash1.toString();
  hash1 = hash1.substring(hash1.indexOf("', hash: '") + 10);
  hash1 = hash1.substring(0, hash1.indexOf("',"));
  let hash2 = await hashElement("./872345gdsef2gerygh", hashOptions);
  hash2 = hash2.toString();
  hash2 = hash2.substring(hash2.indexOf("', hash: '") + 10);
  hash2 = hash2.substring(0, hash2.indexOf("',"));
  // comparison time
  if(hash1 === "qiGCjxIVDUiMZxZsS44C9QdLiMs=" && hash2 === "Iqh02MuZ1CVU3itUQ9/Wl21MrqA=") {
    utils.log.pass("Test 1 passed!");
  }else{
    utils.log.fail("Test 1 Failed!");
  }
  fs.rmSync("./qwertyuiop0123456789", { recursive: true });
  fs.rmSync("./872345gdsef2gerygh", { recursive: true });
  // wait time to know what happened
  await new Promise(r => setTimeout(r, 1000));

  // test 2
  // this test makes an app and checks if vite will load and run properly
  utils.log.info("Running test 2...");
  utils.log.info("In this test, an Octobox app will be created and its development server ran. If it does not encounter an error, it will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make and run our app
  let success = true;
  try {
    execSync("npm create octobox-app -- argumented --path octoboxtestapp");
    execAsync("npm run dev", { cwd: "./octoboxtestapp"});
  } catch(e) {
    console.log(e);
    success = false;
  }
  // log our success or failure
  if(success) {
    utils.log.pass("Test 2 passed!");
  }else{
    utils.log.fail("Test 2 failed!");
  }
  // wait time to know what happened
  await new Promise(r => setTimeout(r, 1000));
  // remove our app
  fs.rmSync("./octoboxtestapp", { recursive: true });

  // tests complete, log and exit
  await new Promise(r => setTimeout(r, 550));
  utils.log.info("All tests complete.");
  await new Promise(r => setTimeout(r, 250));
};

main().catch(console.error);

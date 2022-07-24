const utils = require("./testutils.js");
const one = require("./one.test.js");
const two = require("./two.test.js");

const main = async () => {
  const args = process.argv.slice(2);
  // start running our tests or creating our hashes
  if(args[0] === "create") {
    utils.creation = true;
    utils.log.info("Creating hashes. This will take a while...");
  }else if(args[0] === "skip") {
    utils.log.info("Running tests...");
    await new Promise(r => setTimeout(r, 500));
    utils.log.info("Skipping test 1...");
  }else{
    utils.log.info("Running tests...");
  }
  // lil wait time so you can actually read whats going on
  await new Promise(r => setTimeout(r, 500));
  // run our tests below
  if(args[0] === "skip") {
    utils.success();
    await utils.run(two, 2, true);
  }else{
    await utils.run(one, 1, true);
  }
};

main().catch(console.error);

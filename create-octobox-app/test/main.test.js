const utils = require("./testutils.js");
const one = require("./one.test.js");

const main = async () => {
  const args = process.argv.slice(2);
  if(args[0] === "create") {
    utils.creation = true;
    utils.log.info("Creating hashes. This will take a while...");
  }else{
    // start running our tests
    utils.log.info("Running tests...");
  }
  // lil wait time so you can actually read whats going on
  await new Promise(r => setTimeout(r, 500));
  // run our tests below
  await utils.run(one, 1, true);
};

main().catch(console.error);

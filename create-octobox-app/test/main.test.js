const utils = require("./testutils.js");
const one = require("./one.test.js");
const two = require("./two.test.js");
const three = require("./three.test.js");

const main = async () => {
  // start running our tests
  utils.log.info("Running tests...");
  // lil wait time so you can actually read whats going on
  await new Promise(r => setTimeout(r, 500));
  // run our tests below
  await utils.run(one, 1, true);
};

main().catch(console.error);

module.exports = utils;

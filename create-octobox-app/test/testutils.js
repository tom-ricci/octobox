const colors = require("ansi-colors");

let successful = 0;

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
  },
  run: async (test, index, first = false) => {
    // if we just ran a test, wait before and after completing it. this is to give the user a sense of more feedback, as people expect things to take some amount of inconsistent time, but not too much to be overbearing. my reasoning for implementing this is for my own happiness, as i'm probably going to be the one using this the most and itll feel better with better feedback. see https://youtu.be/iZnLZFRylbs for more.
    if(!first) {
      await new Promise(r => setTimeout(r, 500));
      utils.log.info(`Test ${ index - 1 } complete!`);
      await new Promise(r => setTimeout(r, 500));
    }
    utils.log.info(`Running test ${ index }...`);
    await test();
  },
  finish: async (index) => {
    // quick little log and short wait
    utils.log.info(`Test ${ index } complete!`);
    await new Promise(r => setTimeout(r, 340));
    utils.log.info("Wrapping up...");
    // tests complete, log and exit
    await new Promise(r => setTimeout(r, 550));
    utils.log.info(`${ this.successful }/${ index } (${ Math.round(this.successful / index * 100) }%) tests were successful.`);
    await new Promise(r => setTimeout(r, 59));
    utils.log.info("All tests complete.");
    await new Promise(r => setTimeout(r, 250));
    // we're done!
    process.exit();
  },
  success: () => {
    successful++;
  }
};

module.exports = utils;
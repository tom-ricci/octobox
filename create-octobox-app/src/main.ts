#!/usr/bin/node

// imports
const Enquirer = require("enquirer");
const colors = require("ansi-colors");
const styles = require("enquirer/lib/styles");
const { execSync } = require("child_process");
const replaceall = require("replaceall");

// utils
const utils = {
  logSpeak: (msg: string) => {
    utils.logSafely(`${ colors.bold.blue("➤") } ${ colors.bold(msg) }`);
  },
  logSafely: (msg: string) => {
    console.log(`${ msg }\u001b[0m`);
  },
  path: "./",
  execInPath: (cmd: string) => {
    execSync(cmd, { cwd: utils.path });
  },
  execInPathParent: (cmd: string) => {
    execSync(cmd, { cwd: `../${ utils.path }` });
  }
};

// set up enquirer instance
styles.primary = colors.blue;
styles.danger = colors.blue;
styles.success = colors.blue;
styles.warning = colors.blue;
const cli = new Enquirer({ styles });

const main = async () => {
  utils.logSpeak("Welcome to the Octobox installer!");
  // get install dir
  let sanitized = false;
  const loc = new Enquirer.Input({
    name: "loc",
    message: "Where should your app be bootstrapped?",
    initial: "my-octobox-app",
    result: (input: string) => {
      // sanatize install dir
      if(input.indexOf("/") != -1 || input.indexOf("\\") != -1 && input.indexOf(":") != -1) {
        input = replaceall("/", "_", input);
        input = replaceall(":", "_", input);
        input = replaceall("\\", "_", input);
        sanitized = true;
        return input;
      }
    }
  });
  utils.path = await loc.run();
  // ask the user for permission to use the sanitized install dir if sanitization was required - this is so the user knows the directory of their app wont be the same as what they entered
  if(sanitized) {
    const locConfirm = new Enquirer.Confirm({
      name: "loc_confirm",
      message: `Octobox does not support "/" "\\" or ":" in locations, as Vite only supports creating apps in the direct child of the CWD. Your app will be stored at ./${ utils.path }/ instead. Is this OK?`,
    });
    // if its not ok, terminate, if it is ok, continue install
    if(!await locConfirm.run()) {
      utils.logSpeak("Octobox will now exit. Bye!");
      process.exit();
    }
  }
  utils.logSpeak("Bootstrapping...");
  // install in dir (we can't use the execInPathParent utility here because the path doesn't exist yet)
  execSync(`npm create vite@latest ${ utils.path } -- --template react-ts`, { cwd: "./" });
  // now we can though, so we'll continue to do so
  utils.execInPath("npm i");
};

main().catch(console.error);

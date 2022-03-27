#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// imports
const Enquirer = require("enquirer");
const colors = require("ansi-colors");
const styles = require("enquirer/lib/styles");
const { execSync } = require("child_process");
const replaceall = require("replaceall");
const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
// utils
const utils = {
    logSpeak: (msg) => {
        utils.logSafely(`${colors.bold.blue("➤")} ${colors.bold(msg)}`);
    },
    logSafely: (msg) => {
        console.log(`${msg}\u001b[0m`);
    },
    path: "./",
    execInPath: (cmd) => {
        execSync(cmd, { cwd: utils.path });
    },
    execInPathParent: (cmd) => {
        execSync(cmd, { cwd: `../${utils.path}` });
    }
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // check if we're using argumented version of the command, in which case we skip the setup
    if (argv._.includes("argumented")) {
        const args = {};
        // sanitize input
        let input = argv["path"];
        input = input.replace(/[^a-zA-Z0-9]/gmi, "");
        utils.path = input;
        yield bootstrap(args);
    }
    else {
        // set up enquirer instance
        styles.primary = colors.blue;
        styles.danger = colors.blue;
        styles.success = colors.blue;
        styles.warning = colors.blue;
        // go through setup prompts if we didn't skip them earlier
        yield setup();
    }
});
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    utils.logSpeak("Welcome to the Octobox installer!");
    // get install dir
    let sanitized = false;
    const loc = new Enquirer.Input({
        name: "loc",
        message: "Where should your app be bootstrapped?",
        initial: "app",
        result: (input) => {
            // sanatize install dir
            if (/[^a-zA-Z0-9]/gmi.test(input)) {
                input = input.replace(/[^a-zA-Z0-9]/gmi, "");
                sanitized = true;
                return input;
            }
        }
    });
    utils.path = yield loc.run();
    // ask the user for permission to use the sanitized install dir if sanitization was required - this is so the user knows the directory of their app wont be the same as what they entered
    if (sanitized) {
        const locConfirm = new Enquirer.Confirm({
            name: "loc_confirm",
            message: `Octobox only supports 0-9 and A-Z for bootstrapping locations. Your app will be stored at ./${utils.path}/ instead. Is this OK?`,
        });
        // if its not ok, terminate, if it is ok, continue install
        if (!(yield locConfirm.run())) {
            utils.logSpeak("Octobox will now exit. Bye!");
            process.exit();
        }
    }
    // bootstrap because we have all the info we need now
    yield bootstrap({});
});
const bootstrap = (config) => __awaiter(void 0, void 0, void 0, function* () {
    utils.logSpeak("Bootstrapping...");
    // create vite app
    // install in dir (we can't use the execInPath or execInPathParent utility here because the path doesn't exist yet)
    execSync(`npm create vite@2.8.0 ${utils.path} -- --template react-ts`, { cwd: "./" });
    // now we can though, so we'll continue to do so
    utils.execInPath("npm i");
    // clean up the app
    fs.unlinkSync(`${utils.path}/src/App.css`);
    fs.unlinkSync(`${utils.path}/src/App.tsx`);
    fs.unlinkSync(`${utils.path}/src/index.css`);
    fs.unlinkSync(`${utils.path}/src/logo.svg`);
    fs.unlinkSync(`${utils.path}/src/main.tsx`);
    fs.unlinkSync(`${utils.path}/src/favicon.svg`);
    // add our own versions of some removed files
    fs.writeFileSync(`${utils.path}/src/main.tsx`, `import React from "react";
import ReactDOM from "react-dom";
import "./styles/main.scss";
import { App } from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById("root")
);
`);
    fs.writeFileSync(`${utils.path}/src/App.tsx`, `import React, { FC, ReactElement } from "react";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>Hello world!</h1>
    </React.Fragment>
  );
};
`);
    // install and set up sass
    utils.execInPath("npm i sass");
    fs.mkdirSync(`${utils.path}/src/styles/`);
    fs.writeFileSync(`${utils.path}/src/styles/main.scss`, "");
    // tell the user were done here
    utils.logSpeak("App created!");
});
main().catch(console.error);

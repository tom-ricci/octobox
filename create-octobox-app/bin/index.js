#!/usr/bin/node
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
// set up enquirer instance
styles.primary = colors.blue;
styles.danger = colors.blue;
styles.success = colors.blue;
styles.warning = colors.blue;
const cli = new Enquirer({ styles });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    utils.logSpeak("Welcome to the Octobox installer!");
    // get install dir
    let sanitized = false;
    const loc = new Enquirer.Input({
        name: "loc",
        message: "Where should your app be bootstrapped?",
        initial: "my-octobox-app",
        result: (input) => {
            // sanatize install dir
            if (input.indexOf("/") != -1 || input.indexOf("\\") != -1 && input.indexOf(":") != -1) {
                input = replaceall("/", "_", input);
                input = replaceall(":", "_", input);
                input = replaceall("\\", "_", input);
                sanitized = true;
                return input;
            }
        }
    });
    utils.path = yield loc.run();
    // ask the user for permission to use the sanitized install dir if sanitization was required so they dont randomly end up with a project in the wrong directory
    if (sanitized) {
        const locConfirm = new Enquirer.Confirm({
            name: "loc_confirm",
            message: `Octobox does not support "/" "\\" or ":" in locations, as Vite only supports creating apps in the direct child of the CWD. Your app will be stored at ./${utils.path}/ instead. Is this OK?`,
        });
        // if its not ok, terminate, if it is okay, continue install
        if (!(yield locConfirm.run())) {
            utils.logSpeak("Octobox will now exit. Bye!");
            process.exit();
        }
    }
    utils.logSpeak("Bootstrapping...");
    // install in dir (we can't use the execInPathParent utility here because the path doesn't exist yet)
    execSync(`npm create vite@latest ${utils.path} -- --template react-ts`, { cwd: "./" });
    // now we can though, so we'll continue to do so
    utils.execInPath("npm i");
});
main().catch(console.error);

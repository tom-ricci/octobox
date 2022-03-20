#!/usr/bin/node

const Enquirer = require("enquirer");

enum Color {
  RED = "\u001b[31m",
  GREEN = "\u001b[32m",
  BLUE = "\u001b[34m",
  RESET = "\u001b[0m"
}

const logSafely = (msg: string) => {
  console.log(`${ msg }${ Color.RESET }`);
};

const main = async () => {
  const str = "Welcome to the Octobox CLI!";
  logSafely(str);
  const prompt = new Enquirer.Input({
    name: "name",
    message: "Where should your app be bootstrapped?",
    initial: "my-octobox-app"
  });
  // TODO: change colors
  // TODO: make this actually work
  const response = await prompt.run();
  logSafely(response);
};

main().catch(console.error);

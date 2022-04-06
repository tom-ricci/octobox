#!/usr/bin/env node

// TODO: go through linter configs and make sure they look all good and you like them

// imports
const Enquirer = require("enquirer");
const colors = require("ansi-colors");
const styles = require("enquirer/lib/styles");
const { execSync } = require("child_process");
// FIXME: once octobox is complete if we don't need this remove it.
const replaceall = require("replaceall");
const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");

// config interface
interface Config {
  tailwind: boolean
  eslint: boolean
  stylelint: boolean
  eslintRecommended: boolean
  stylelintRecommended: boolean
}

// utils
const utils = {
  logSpeak: (msg: string): void => {
    utils.logSafely(`${ colors.bold.blue("➤") } ${ colors.bold(msg) }`);
  },
  logSafely: (msg: string): void => {
    console.log(`${ msg }\u001b[0m`);
  },
  path: "./",
  execInPath: (cmd: string): void => {
    execSync(cmd, { cwd: utils.path });
  },
  execInPathParent: (cmd: string): void => {
    execSync(cmd, { cwd: `../${ utils.path }` });
  }
};

const main = async (): Promise<void> => {
  // check if we're using argumented version of the command, in which case we skip the setup
  if(argv._.includes("argumented")) {
    const args: Config = {
      tailwind: false,
      eslint: false,
      stylelint: false,
      eslintRecommended: false,
      stylelintRecommended: false
    };
    // sanitize input
    let input = argv["path"];
    input = input.replace(/[^a-zA-Z0-9]/gmi, "");
    // setup our args
    args.tailwind = argv["tailwind"].toUpperCase() === "TRUE";
    args.eslint = argv["eslint"].toUpperCase() === "TRUE";
    args.stylelint = argv["stylelint"].toUpperCase() === "TRUE";
    if(args.eslint) {
      args.eslintRecommended = argv["recommended_eslint_config"].toUpperCase() === "TRUE";
    }
    if(args.stylelint) {
      args.stylelintRecommended = argv["recommended_stylelint_config"].toUpperCase() === "TRUE";
    }
    utils.path = input;
    await bootstrap(args);
  }else{
    // set up enquirer instance
    styles.primary = colors.blue;
    styles.danger = colors.blue;
    styles.success = colors.blue;
    styles.warning = colors.blue;
    // go through setup prompts if we didn't skip them earlier
    await setup();
  }
};

const setup = async (): Promise<void> => {
  const config: Config = {
    tailwind: false,
    eslint: false,
    stylelint: false,
    eslintRecommended: false,
    stylelintRecommended: false
  };
  utils.logSpeak("Welcome to the Octobox installer!");
  // get install dir
  let sanitized = false;
  const loc = new Enquirer.Input({
    name: "loc",
    message: "Where should your app be bootstrapped?",
    initial: "app",
    result: (input: string) => {
      // sanatize install dir
      if(/[^a-zA-Z0-9]/gmi.test(input)) {
        input = input.replace(/[^a-zA-Z0-9]/gmi, "");
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
      message: `Octobox only supports 0-9 and A-Z for bootstrapping locations. Your app will be stored at ./${ utils.path }/ instead. Is this OK?`,
    });
    // if its not ok, terminate, if it is ok, continue install
    if(!await locConfirm.run()) {
      utils.logSpeak("Octobox will now exit. Bye!");
      process.exit();
    }
  }
  // ask if user wants tailwind added to their project
  const tailwindQuery = new Enquirer.Confirm({
    name: "tw",
    message: "Do you want to use TailwindCSS in this app?",
  });
  config.tailwind = await tailwindQuery.run();
  // ask if user wants to use any linters and their recommended configs
  const eslintQuery = new Enquirer.Confirm({
    name: "esl",
    message: "Do you want to use ESLint in this app?",
  });
  config.eslint = await eslintQuery.run();
  if(config.eslint) {
    const eslintRecommendedQuery = new Enquirer.Confirm({
      name: "eslr",
      message: "Do you want to use Octobox's recommended ESLint configuration?",
    });
    config.eslintRecommended = await eslintRecommendedQuery.run();
  }
  const stylelintQuery = new Enquirer.Confirm({
    name: "stl",
    message: "Do you want to use Stylelint in this app?",
  });
  config.stylelint = await stylelintQuery.run();
  if(config.stylelint) {
    const stylelintRecommendedQuery = new Enquirer.Confirm({
      name: "stlr",
      message: "Do you want to use Octobox's recommended Stylelint configuration?",
    });
    config.stylelintRecommended = await stylelintRecommendedQuery.run();
  }

  // bootstrap because we have all the info we need now
  await bootstrap(config);
};

const bootstrap = async (config: Config): Promise<void> => {
  utils.logSpeak("Bootstrapping...");
  // create vite app
  // install in dir (we can't use the execInPath or execInPathParent utility here because the path doesn't exist yet)
  execSync(`npm create vite@2.8.0 ${ utils.path } -- --template react-ts`, { cwd: "./" });
  // now we can though, so we'll continue to do so
  utils.execInPath("npm i");
  // clean up the app
  fs.unlinkSync(`${ utils.path }/src/App.css`);
  fs.unlinkSync(`${ utils.path }/src/App.tsx`);
  fs.unlinkSync(`${ utils.path }/src/index.css`);
  fs.unlinkSync(`${ utils.path }/src/logo.svg`);
  fs.unlinkSync(`${ utils.path }/src/main.tsx`);
  fs.unlinkSync(`${ utils.path }/src/favicon.svg`);
  // add our own versions of some removed files
  fs.writeFileSync(`${ utils.path }/src/main.tsx`, `import React from "react";
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
  fs.writeFileSync(`${ utils.path }/src/App.tsx`, `import React, { FC, ReactElement } from "react";

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
  utils.execInPath("npm i -D sass");
  fs.mkdirSync(`${ utils.path }/src/styles/`);
  fs.writeFileSync(`${ utils.path }/src/styles/main.scss`, "");
  // add unit testing suite
  utils.execInPath("npm i -D puppeteer ts-node");
  fs.mkdirSync(`${ utils.path }/test/`);
  fs.writeFileSync(`${ utils.path }/test/main.test.ts`, `const { createServer } = require("vite");
const puppeteer = require("puppeteer");
const { Page } = require("puppeteer");

const tests = async (tester: typeof Page) => {
  // add your tests here
};

(async (port: number, test: (tester: typeof Page) => Promise<void>) => {
  const server = await createServer({
    configFile: false,
    root: "./",
    server: {
      port
    }
  });
  await server.listen();
  server.printUrls();
  const tester: typeof Page = await (await puppeteer.launch()).newPage();
  await tester.goto(\`http://localhost:\${port}\`);
  await test(tester);
  process.exit();
})(4000, tests);
`);
  const pkg = JSON.parse(fs.readFileSync(`${ utils.path }/package.json`));
  pkg.scripts.test = "ts-node --skipProject ./test/main.test.ts";
  fs.writeFileSync(`${ utils.path }/package.json`, JSON.stringify(pkg, null, 2));
  // add tailwind if requested
  if(config.tailwind) {
    // first, install deps and run init command
    utils.execInPath("npm i -D tailwindcss postcss autoprefixer");
    utils.execInPath("npx tailwindcss init -p");
    // next, add a semicolon to postcss config
    const postcss = fs.readFileSync(`${ utils.path }/postcss.config.js`).toString().trim();
    fs.writeFileSync(`${ utils.path }/postcss.config.js`, `${ postcss };`);
    // then, add our content array and a semicolon to tailwind config. it's easier to just overwrite the original config rather than add the content, so that's what we'll do.
    fs.writeFileSync(`${ utils.path }/tailwind.config.js`, `module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`);
    // finally, add our tailwind directives in our main.scss file
    fs.writeFileSync(`${ utils.path }/src/styles/main.scss`, `@tailwind base;
@tailwind components;
@tailwind utilities;
`);
  }
  // if the user wants any linters, install them
  if(config.eslint) {
    // install and add eslint to project
    utils.execInPath("npm i -D @modyqyw/vite-plugin-eslint eslint eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest");
    let viteConfig: string = fs.readFileSync(`${ utils.path }/vite.config.ts`).toString().trim();
    const lines: string[] = viteConfig.split("\n");
    lines.splice(2, 0, `import ESLintPlugin from "@modyqyw/vite-plugin-eslint";${ "" }`);
    lines[6] = "  plugins: [ react(), ESLintPlugin() ]";
    viteConfig = "";
    for(const line of lines) {
      viteConfig += `${ line }\n`;
    }
    fs.writeFileSync(`${ utils.path }/vite.config.ts`, viteConfig);
    // make .eslintrc
    let esldconf = "";
    if(config.eslintRecommended) {
      esldconf = ",\n    \"octobox\"";
    }
    fs.writeFileSync(`${ utils.path }/.eslintrc.js`, `module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"${ esldconf }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-empty-interface": [
      "off"
    ]
  }
};
`);
  }
  if(config.stylelint) {
    // install stylelint and add it to the vite config
    utils.execInPath("npm i -D stylelint stylelint-config-standard-scss vite-plugin-stylelint");
    let viteConfig: string = fs.readFileSync(`${ utils.path }/vite.config.ts`).toString().trim();
    const lines: string[] = viteConfig.split("\n");
    lines.splice(config.eslint ? 3 : 2, 0, `import StylelintPlugin from "vite-plugin-stylelint";${ "" }`);
    if(config.eslint) {
      lines[7] = "  plugins: [ react(), ESLintPlugin(), StylelintPlugin() ]";
    }else{
      lines[6] = "  plugins: [ react(), StylelintPlugin() ]";
    }
    viteConfig = "";
    for(const line of lines) {
      viteConfig += `${ line }\n`;
    }
    fs.writeFileSync(`${ utils.path }/vite.config.ts`, viteConfig);
    // make our stylelint config
    let stldconf = "";
    if(config.stylelintRecommended) {
      stldconf = ",\n    \"stylelint-config-octobox\"";
    }
    if(config.tailwind) {
      fs.writeFileSync(`${ utils.path }/.stylelintrc.js`, `module.exports = {
  "extends": [
    "stylelint-config-standard-scss"${ stldconf }
  ],
  "rules": {
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [ "tailwind" ]
      }
    ]
  }
};`);
    }else{
      fs.writeFileSync(`${ utils.path }/.stylelintrc.js`, `module.exports = {
  "extends": [
    "stylelint-config-standard-scss"${ stldconf }
  ],
  "rules": {}
};`);
    }
  }
  // quick npm i to make sure all deps are installed
  utils.execInPath("npm i");
  // tell the user we're done here
  utils.logSpeak("App created!");
};

main().catch(console.error);

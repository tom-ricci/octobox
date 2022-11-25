#!/usr/bin/env node

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
  internal: boolean
  routing: boolean
  recommendedWindows?: boolean
  customFallbacks?: boolean
  basename?: string
  unresponsiveMs?: number
  pendingMs?: number
  maxAge?: number
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
      stylelintRecommended: false,
      internal: false,
      routing: false
    };
    // sanitize input
    let input = argv["path"];
    input = input.replace(/[^a-zA-Z0-9]/gmi, "");
    // setup our args
    args.tailwind = argv["tailwind"].toUpperCase() === "TRUE";
    args.eslint = argv["eslint"].toUpperCase() === "TRUE";
    args.stylelint = argv["stylelint"].toUpperCase() === "TRUE";
    args.internal = argv._.includes("internal");
    if(args.eslint) {
      args.eslintRecommended = argv["recommended_eslint_config"].toUpperCase() === "TRUE";
    }
    if(args.stylelint) {
      args.stylelintRecommended = argv["recommended_stylelint_config"].toUpperCase() === "TRUE";
    }
    // in my not removing features but instead just patching them up so they work fashion, this is going to be set to true. im not removing the code for what to do when routing is false. thats just deprecated!
    args.routing = true;
    if(args.routing) {
      args.recommendedWindows = argv["recommended_windows"].toUpperCase() === "TRUE";
      args.customFallbacks = argv["custom_fallbacks"].toUpperCase() === "TRUE";
      if("basename" in argv) {
        args.basename = argv["basename"];
      }
      if("unresponsive_ms" in argv && !Number.isNaN(parseInt(argv["unresponsive_ms"]))) {
        args.unresponsiveMs = parseInt(argv["unresponsive_ms"]);
      }
      if("pending_ms" in argv && !Number.isNaN(parseInt(argv["pending_ms"]))) {
        args.pendingMs = parseInt(argv["pending_ms"]);
      }
      if("max_age_ms" in argv && !Number.isNaN(parseInt(argv["max_age_ms"]))) {
        args.maxAge = parseInt(argv["max_age_ms"]);
      }
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
    stylelintRecommended: false,
    internal: argv._.includes("internal"),
    routing: false
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
      utils.logSpeak("Okay, you can restart. Octobox will now exit. Bye!");
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
      message: "With Octobox's recommended ESLint configuration?",
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
      message: "With Octobox's recommended Stylelint configuration?",
    });
    config.stylelintRecommended = await stylelintRecommendedQuery.run();
  }
  // ask if user wants routing and set it up if so
  // no! we're going to do what we did earlier--this will always happen
  config.routing = true;
  if(config.routing) {
    config.recommendedWindows = await new Enquirer.Confirm({
      name: "recommendedWindows",
      message: "Do you want to automatically create top-level \"$default\" and \"$wildcard\" windows?"
    }).run();
    config.customFallbacks = await new Enquirer.Confirm({
      name: "customFallbacks",
      message: "Do you want to use custom pending and error elements?"
    }).run();
    if(await new Enquirer.Confirm({
      name: "routingBasename",
      message: "Is your app going to be hosted on a nested directory?"
    }).run()) {
      config.basename = await new Enquirer.Input({
        name: "basename",
        message: "What will this directory be?",
        initial: "",
      }).run();
    }
    if(await new Enquirer.Confirm({
      name: "routingUnresponsive",
      message: "Do you want to set a custom unresponsive time for the router?"
    }).run()) {
      let val = await new Enquirer.NumberPrompt({
        name: "unresponsive",
        message: "How long, in milliseconds, should this be?",
        result: (input: any) => {
          if(!Number.isNaN(parseInt(input))) {
            return input;
          }else{
            return undefined;
          }
        }
      }).run();
      if(val !== undefined) {
        val = parseInt(val);
        config.unresponsiveMs = val;
      }
    }
    if(await new Enquirer.Confirm({
      name: "routingPending",
      message: "Do you want to set a custom pending time for the router?"
    }).run()) {
      let val = await new Enquirer.NumberPrompt({
        name: "pending",
        message: "How long, in milliseconds, should this be?",
        result: (input: any) => {
          if(!Number.isNaN(parseInt(input))) {
            return input;
          }else{
            return undefined;
          }
        }
      }).run();
      if(val !== undefined) {
        val = parseInt(val);
        config.pendingMs = val;
      }
    }
    if(await new Enquirer.Confirm({
      name: "routingAge",
      message: "Do you want to set a custom maximum cache age for the router?"
    }).run()) {
      let val = await new Enquirer.NumberPrompt({
        name: "age",
        message: "How long, in milliseconds, should this be?",
        result: (input: any) => {
          if(!Number.isNaN(parseInt(input))) {
            return input;
          }else{
            return undefined;
          }
        }
      }).run();
      if(val !== undefined) {
        val = parseInt(val);
        config.maxAge = val;
      }
    }
  }

  // confirm with user and bootstrap
  let opts = "";
  for(const arg in config) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    opts += `\n  ${ arg }: ${ config[arg] }`;
  }
  utils.logSpeak(`Your app's settings are:${ opts }`);
  const final = await new Enquirer.Confirm({
    name: "final_confirm",
    message: "Is all of this information correct?",
  }).run();
  if(final) {
    await bootstrap(config);
  }else{
    utils.logSpeak("Okay, you can restart. Octobox will now exit. Bye!");
    process.exit();
  }
};

const bootstrap = async (config: Config): Promise<void> => {
  utils.logSpeak("Bootstrapping...");

  // create vite app
  // install in dir (we can't use the execInPath or execInPathParent utility here because the path doesn't exist yet)
  execSync(`npm create vite@2.9.2 ${ utils.path } -- --template react-ts`, { cwd: "./" });
  // now we can though, so we'll continue to do so
  utils.execInPath("npm i");
  // clean up the app
  fs.unlinkSync(`${ utils.path }/index.html`);
  fs.unlinkSync(`${ utils.path }/src/App.css`);
  fs.unlinkSync(`${ utils.path }/src/App.tsx`);
  fs.unlinkSync(`${ utils.path }/src/index.css`);
  fs.unlinkSync(`${ utils.path }/src/logo.svg`);
  fs.unlinkSync(`${ utils.path }/src/main.tsx`);
  fs.unlinkSync(`${ utils.path }/src/favicon.svg`);



  // add our own versions of some removed files
  if(!config.routing) {
    fs.writeFileSync(`${ utils.path }/index.html`, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Octobox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);
  }else{
    fs.writeFileSync(`${ utils.path }/index.html`, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div>
      <div>
        <script>
          document.body.children[0].style.display = "none"
        </script>
        <div id="root">
          <div></div>
        </div>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);
  }
  fs.writeFileSync(`${ utils.path }/src/main.tsx`, `import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import { App } from "./App";

for(const elem of document.head.querySelectorAll("[react=true]")) elem.setAttribute("prerender", "true");
(document.body.children[0] as HTMLElement).style.display = "block";
document.getElementById("root")?.children[0].remove();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(<div><React.StrictMode><App/></React.StrictMode></div>);
`);
  if(!config.routing) {
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
  }else{
    let filesystem = "<Filesystem";
    if(config.basename !== undefined) {
      filesystem += ` basename={"${ config.basename }"}`;
    }
    if(config.unresponsiveMs !== undefined) {
      filesystem += ` unresponsiveMs={${ config.unresponsiveMs }}`;
    }
    if(config.pendingMs !== undefined) {
      filesystem += ` pendingMs={${ config.pendingMs }}`;
    }
    if(config.maxAge !== undefined) {
      filesystem += ` maxAge={${ config.maxAge }}`;
    }
    filesystem += "/>";
    fs.writeFileSync(`${ utils.path }/src/App.tsx`, `import React, { FC, ReactElement } from "react";
import { Filesystem } from "octobox-utils";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      ${ filesystem }
    </React.Fragment>
  );
};
`);
  }

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
    utils.execInPath("npm i -D @modyqyw/vite-plugin-eslint@2.0.9 eslint eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest");
    let viteConfig: string = fs.readFileSync(`${ utils.path }/vite.config.ts`).toString().trim();
    const lines: string[] = viteConfig.split("\n");
    lines.splice(2, 0, `import ESLintPlugin from "@modyqyw/vite-plugin-eslint";${ "" }`);
    lines[6] = "  plugins: [ react(), ESLintPlugin() ],";
    viteConfig = "";
    for(const line of lines) {
      viteConfig += `${ line }\n`;
    }
    fs.writeFileSync(`${ utils.path }/vite.config.ts`, viteConfig);
    // make .eslintrc
    let esldconf = "";
    if(config.eslintRecommended) {
      esldconf = ",\n    \"octobox\"";
      if(config.internal) {
        // random bit of information: if we dont explicitly tell npm to save the linked package in the package.json, it wont even though the documentation for npm link says it will. totally didnt waste hours of my life dealing with that headache. yes, this is the same for stylelint and utils.
        utils.execInPath("npm link -D eslint-config-octobox");
      }else{
        utils.execInPath("npm i -D eslint-config-octobox");
      }
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
    utils.execInPath("npm i -D stylelint stylelint-config-standard-scss vite-plugin-stylelint@3.0.7");
    let viteConfig: string = fs.readFileSync(`${ utils.path }/vite.config.ts`).toString().trim();
    const lines: string[] = viteConfig.split("\n");
    lines.splice(config.eslint ? 3 : 2, 0, `import StylelintPlugin from "vite-plugin-stylelint";${ "" }`);
    if(config.eslint) {
      lines[7] = "  plugins: [ react(), ESLintPlugin(), StylelintPlugin() ],";
    }else{
      lines[6] = "  plugins: [ react(), StylelintPlugin() ],";
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
      if(config.internal) {
        utils.execInPath("npm link -D stylelint-config-octobox");
      }else{
        utils.execInPath("npm i -D stylelint-config-octobox");
      }
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

  // install octobox-utils
  if(config.internal) {
    utils.execInPath("npm link -D octobox-utils");
  }else{
    utils.execInPath("npm i -D octobox-utils");
  }

  // add routing
  // the only thing we need to do here is make the actual file structure (and edit the vite config to add our basename if we have one), the rest is dealt with earlier on in the required file creation
  if(config.routing) {
    // we need a window directory, so its added
    fs.mkdirSync(`${ utils.path }/src/windows/`);
    if(config.recommendedWindows) {
      // we need to have an outlet in this window so it can render the default
      fs.writeFileSync(`${ utils.path }/src/windows/Window.tsx`, `import React, { FC, ReactElement } from "react";
import { CompilierConfig, Outlet, WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Outlet/>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "Octobox App"
    }
  };
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;
`);
      // we also need to make the default and wildcard elements, so we do that here
      fs.mkdirSync(`${ utils.path }/src/windows/$default/`);
      fs.mkdirSync(`${ utils.path }/src/windows/$wildcard/`);
      fs.writeFileSync(`${ utils.path }/src/windows/$default/Window.tsx`, `import React, { FC, ReactElement } from "react";
import { CompilierConfig } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>Hello world!</h1>
    </React.Fragment>
  );
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;
`);
      fs.writeFileSync(`${ utils.path }/src/windows/$wildcard/Window.tsx`, `import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      
    </React.Fragment>
  );
};

export default Window;
`);
    }else{
      // make the initial window -- no outlet this time since we're not doing that for the user here
      fs.writeFileSync(`${ utils.path }/src/windows/Window.tsx`, `import React, { FC, ReactElement } from "react";
import { CompilierConfig, WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>Hello world!</h1>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "Octobox App"
    }
  };
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;
`);
    }
    if(config.customFallbacks) {
      // since the user wanted to customize their err/pend elements, let them do that here -- we'll provide blank elements for them to work with
      fs.mkdirSync(`${ utils.path }/src/windows/$error/`);
      fs.mkdirSync(`${ utils.path }/src/windows/$pending/`);
      fs.writeFileSync(`${ utils.path }/src/windows/$error/Window.tsx`, `import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>

    </React.Fragment>
  );
};

export default Window;
`);
      fs.writeFileSync(`${ utils.path }/src/windows/$pending/Window.tsx`, `import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>

    </React.Fragment>
  );
};

export default Window;
`);
    }
    if(config.basename !== undefined) {
      // add basename to the vite config so it compiles correctly
      let basename = config.basename;
      let viteConfig: string = fs.readFileSync(`${ utils.path }/vite.config.ts`).toString().trim();
      const lines: string[] = viteConfig.split("\n");

      // we need to check if the basename is a url because vite allows url basenames
      const checkUrl = (url: string): boolean => {
        try {
          const u = new URL(url);
        } catch(e) {
          return false;
        }
        return true;
      };

      // we need to check if the basename is legal vite config syntax as per https://v2.vitejs.dev/config/#base -- if its not legal, we need to make it legal. we're going to assume that if its illegal it should be converted into an absolute path (since this is what the basename is supposed to be anyway) and we'll prefix and suffix it with "/"
      if(basename.length > 0) {
        if(!basename.startsWith("/") || !basename.startsWith("./") || !checkUrl(basename)) {
          basename = `/${ basename }`;
        }
      }
      if(!basename.endsWith("/")) {
        basename += "/";
      }

      // find the last line of the config and insert the basename before it
      lines.splice(lines.length - 1, 0, `  base: "${ basename }",`);

      // finally, save the config
      viteConfig = "";
      for(const line of lines) {
        viteConfig += `${ line }\n`;
      }
      fs.writeFileSync(`${ utils.path }/vite.config.ts`, viteConfig);
    }
    // lets add our required package fields for prerendering
    const pkg = JSON.parse(fs.readFileSync(`${ utils.path }/package.json`));
    pkg.scripts.build = "npx octobox-utils prerender";
    pkg.compile = {
      "index": "all",
      "404": "all"
    };
    fs.writeFileSync(`${ utils.path }/package.json`, JSON.stringify(pkg, null, 2));
  }

  // quick npm i to make sure all deps are installed
  utils.execInPath("npm i");

  // tell the user we're done here
  utils.logSpeak("App created!");
};

main().catch(console.error);

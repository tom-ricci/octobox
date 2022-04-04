#!/usr/bin/env node
"use strict";var __awaiter=this&&this.__awaiter||function(t,e,n,s){return new(n||(n=Promise))((function(i,l){function r(t){try{o(s.next(t))}catch(t){l(t)}}function a(t){try{o(s.throw(t))}catch(t){l(t)}}function o(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,a)}o((s=s.apply(t,e||[])).next())}))};const Enquirer=require("enquirer"),colors=require("ansi-colors"),styles=require("enquirer/lib/styles"),{execSync:execSync}=require("child_process"),replaceall=require("replaceall"),argv=require("minimist")(process.argv.slice(2)),fs=require("fs"),utils={logSpeak:t=>{utils.logSafely(`${colors.bold.blue("➤")} ${colors.bold(t)}`)},logSafely:t=>{console.log(`${t}[0m`)},path:"./",execInPath:t=>{execSync(t,{cwd:utils.path})},execInPathParent:t=>{execSync(t,{cwd:`../${utils.path}`})}},main=()=>__awaiter(void 0,void 0,void 0,(function*(){if(argv._.includes("argumented")){const t={tailwind:!1,eslint:!1,stylelint:!1};let e=argv.path;e=e.replace(/[^a-zA-Z0-9]/gim,""),t.tailwind="TRUE"===argv.tailwind.toUpperCase(),t.eslint="TRUE"===argv.eslint.toUpperCase(),t.stylelint="TRUE"===argv.stylelint.toUpperCase(),utils.path=e,yield bootstrap(t)}else styles.primary=colors.blue,styles.danger=colors.blue,styles.success=colors.blue,styles.warning=colors.blue,yield setup()})),setup=()=>__awaiter(void 0,void 0,void 0,(function*(){const t={tailwind:!1,eslint:!1,stylelint:!1};utils.logSpeak("Welcome to the Octobox installer!");let e=!1;const n=new Enquirer.Input({name:"loc",message:"Where should your app be bootstrapped?",initial:"app",result:t=>{if(/[^a-zA-Z0-9]/gim.test(t))return t=t.replace(/[^a-zA-Z0-9]/gim,""),e=!0,t}});if(utils.path=yield n.run(),e){const t=new Enquirer.Confirm({name:"loc_confirm",message:`Octobox only supports 0-9 and A-Z for bootstrapping locations. Your app will be stored at ./${utils.path}/ instead. Is this OK?`});(yield t.run())||(utils.logSpeak("Octobox will now exit. Bye!"),process.exit())}const s=new Enquirer.Confirm({name:"tw",message:"Do you want to use TailwindCSS in this app?"});t.tailwind=yield s.run();const i=new Enquirer.Confirm({name:"esl",message:"Do you want to use ESLint in this app?"});t.eslint=yield i.run();const l=new Enquirer.Confirm({name:"stl",message:"Do you want to use Stylelint in this app?"});t.stylelint=yield l.run(),yield bootstrap(t)})),bootstrap=t=>__awaiter(void 0,void 0,void 0,(function*(){utils.logSpeak("Bootstrapping..."),execSync(`npm create vite@2.8.0 ${utils.path} -- --template react-ts`,{cwd:"./"}),utils.execInPath("npm i"),fs.unlinkSync(`${utils.path}/src/App.css`),fs.unlinkSync(`${utils.path}/src/App.tsx`),fs.unlinkSync(`${utils.path}/src/index.css`),fs.unlinkSync(`${utils.path}/src/logo.svg`),fs.unlinkSync(`${utils.path}/src/main.tsx`),fs.unlinkSync(`${utils.path}/src/favicon.svg`),fs.writeFileSync(`${utils.path}/src/main.tsx`,'import React from "react";\nimport ReactDOM from "react-dom";\nimport "./styles/main.scss";\nimport { App } from "./App";\n\nReactDOM.render(\n  <React.StrictMode>\n    <App/>\n  </React.StrictMode>,\n  document.getElementById("root")\n);\n'),fs.writeFileSync(`${utils.path}/src/App.tsx`,'import React, { FC, ReactElement } from "react";\n\ninterface Props {\n\n}\n\nexport const App: FC<Props> = (): ReactElement => {\n  return (\n    <React.Fragment>\n      <h1>Hello world!</h1>\n    </React.Fragment>\n  );\n};\n'),utils.execInPath("npm i -D sass"),fs.mkdirSync(`${utils.path}/src/styles/`),fs.writeFileSync(`${utils.path}/src/styles/main.scss`,""),utils.execInPath("npm i -D puppeteer ts-node"),fs.mkdirSync(`${utils.path}/test/`),fs.writeFileSync(`${utils.path}/test/main.test.ts`,'const { createServer } = require("vite");\nconst puppeteer = require("puppeteer");\nconst { Page } = require("puppeteer");\n\nconst tests = async (tester: typeof Page) => {\n  // add your tests here\n};\n\n(async (port: number, test: (tester: typeof Page) => Promise<void>) => {\n  const server = await createServer({\n    configFile: false,\n    root: "./",\n    server: {\n      port\n    }\n  });\n  await server.listen();\n  server.printUrls();\n  const tester: typeof Page = await (await puppeteer.launch()).newPage();\n  await tester.goto(`http://localhost:${port}`);\n  await test(tester);\n  process.exit();\n})(4000, tests);\n');const e=JSON.parse(fs.readFileSync(`${utils.path}/package.json`));if(e.scripts.test="ts-node --skipProject ./test/main.test.ts",fs.writeFileSync(`${utils.path}/package.json`,JSON.stringify(e,null,2)),t.tailwind){utils.execInPath("npm i -D tailwindcss postcss autoprefixer"),utils.execInPath("npx tailwindcss init -p");const t=fs.readFileSync(`${utils.path}/postcss.config.js`).toString().trim();fs.writeFileSync(`${utils.path}/postcss.config.js`,`${t};`),fs.writeFileSync(`${utils.path}/tailwind.config.js`,'module.exports = {\n  content: [\n    "./src/**/*.{js,jsx,ts,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n'),fs.writeFileSync(`${utils.path}/src/styles/main.scss`,"@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")}if(t.eslint){utils.execInPath("npm i -D @modyqyw/vite-plugin-eslint eslint eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest");let t=fs.readFileSync(`${utils.path}/vite.config.ts`).toString().trim();const e=t.split("\n");e.splice(2,0,'import ESLintPlugin from "@modyqyw/vite-plugin-eslint";'),e[6]="  plugins: [ react(), ESLintPlugin() ]",t="";for(const n of e)t+=`${n}\n`;fs.writeFileSync(`${utils.path}/vite.config.ts`,t),fs.writeFileSync(`${utils.path}/.eslintrc.js`,'module.exports = {\n  "env": {\n    "browser": true,\n    "es2021": true\n  },\n  "extends": [\n    "eslint:recommended",\n    "plugin:react/recommended",\n    "plugin:@typescript-eslint/recommended"\n  ],\n  "parser": "@typescript-eslint/parser",\n  "parserOptions": {\n    "ecmaFeatures": {\n      "jsx": true\n    },\n    "ecmaVersion": "latest",\n    "sourceType": "module"\n  },\n  "plugins": [\n    "react",\n    "@typescript-eslint"\n  ],\n  "rules": {\n    "@typescript-eslint/no-empty-interface": [\n      "off"\n    ]\n  }\n};\n')}if(t.stylelint){utils.execInPath("npm i -D stylelint stylelint-config-standard-scss vite-plugin-stylelint");let e=fs.readFileSync(`${utils.path}/vite.config.ts`).toString().trim();const n=e.split("\n");n.splice(t.eslint?3:2,0,'import StylelintPlugin from "vite-plugin-stylelint";'),t.eslint?n[7]="  plugins: [ react(), ESLintPlugin(), StylelintPlugin() ]":n[6]="  plugins: [ react(), StylelintPlugin() ]",e="";for(const t of n)e+=`${t}\n`;fs.writeFileSync(`${utils.path}/vite.config.ts`,e),t.tailwind?fs.writeFileSync(`${utils.path}/.stylelintrc.js`,'module.exports = {\n  "extends": [\n    "stylelint-config-standard-scss"\n  ],\n  "rules": {\n    "scss/at-rule-no-unknown": [\n      true,\n      {\n        "ignoreAtRules": [ "tailwind" ]\n      }\n    ]\n  }\n};'):fs.writeFileSync(`${utils.path}/.stylelintrc.js`,'module.exports = {\n  "extends": [\n    "stylelint-config-standard-scss"\n  ],\n  "rules": {}\n};')}utils.execInPath("npm i"),utils.logSpeak("App created!")}));__awaiter(void 0,void 0,void 0,(function*(){if(argv._.includes("argumented")){const t={tailwind:!1,eslint:!1,stylelint:!1};let e=argv.path;e=e.replace(/[^a-zA-Z0-9]/gim,""),t.tailwind="TRUE"===argv.tailwind.toUpperCase(),t.eslint="TRUE"===argv.eslint.toUpperCase(),t.stylelint="TRUE"===argv.stylelint.toUpperCase(),utils.path=e,yield bootstrap(t)}else styles.primary=colors.blue,styles.danger=colors.blue,styles.success=colors.blue,styles.warning=colors.blue,yield setup()})).catch(console.error);

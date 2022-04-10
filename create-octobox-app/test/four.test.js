const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");
const five = require("./five.test.js");

const test = async () => {
  // this test makes an app and checks if a tailwind style applied to the hello world element exists and the style is applied correctly
  utils.log.info("In this test, an Octobox app will be created with TailwindCSS and an element created with a TailwindCSS class. If the element is found in the DOM with its style as defined by the class and its content, the test will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make our app and our test since the test isnt a part of the framework itself
  execSync("npm create octobox-app -- argumented --path tailwindoctoboxapp --tailwind TRUE --eslint FALSE --stylelint FALSE --recommended_eslint_config FALSE --recommended_stylelint_config FALSE");
  fs.writeFileSync("./tailwindoctoboxapp/test/main.test.ts", `const { createServer } = require("vite");
const puppeteer = require("puppeteer");
const { ElementHandle, Page } = require("puppeteer");

const tests = async (tester: typeof Page) => {
  const element: typeof ElementHandle = await tester.$("div#root > h1");
  const pass: boolean = await tester.evaluate(async (e: typeof ElementHandle): Promise<boolean> => {
    return Promise.resolve(e.innerText === "Hello world!" && e.computedStyleMap().get("text-decoration-line").toString().toUpperCase() === "UNDERLINE");
  }, element);
  console.log(pass);
  await element.dispose();
  pass ? process.exit(0) : process.exit(1);
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
  // add our style to the element
  fs.writeFileSync("./tailwindoctoboxapp/src/App.tsx", `import React, { FC, ReactElement } from "react";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1 className="underline">Hello world!</h1>
    </React.Fragment>
  );
};
`);
  // run our app
  const child = execAsync("npm run test", { cwd: "./tailwindoctoboxapp"});
  child.on("close", async (close) => {
    // log our success or failure
    if(close === 0) {
      utils.success();
      utils.log.pass("Test 4 passed!");
    }else{
      utils.log.fail("Test 4 failed!");
    }
    // wait time to know what happened
    await new Promise(r => setTimeout(r, 1000));
    // remove our app
    fs.rmSync("./tailwindoctoboxapp", { recursive: true });
    // we're done
    await utils.run(five, 5);
  });
};

module.exports = test;

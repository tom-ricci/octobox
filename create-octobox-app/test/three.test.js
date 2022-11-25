const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");
const four = require("./four.test.js");

const test = async () => {
  // this test makes an app and checks if a style definition written in sass was applied to a specific element in the DOM. assuming test 2 didn't fail, this test will fail if and only if sass fails
  utils.log.info("In this test, an Octobox app will be created, a style will be written with Sass, and said style will be applied to an element in the DOM with some specified content. If the element is found in the DOM with its style and content, the test will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make our app and our test since the test isnt a part of the framework itself
  execSync("npm create octobox-app -- argumented internal --path sassyoctoboxtestapp --tailwind FALSE --eslint FALSE --stylelint FALSE --custom_fallbacks FALSE --recommended_windows FALSE");
  fs.writeFileSync("./sassyoctoboxtestapp/test/main.test.ts", `const { createServer } = require("vite");
const puppeteer = require("puppeteer");
const { ElementHandle, Page } = require("puppeteer");

const tests = async (tester: typeof Page) => {
  const element: typeof ElementHandle = await tester.$("div#root > h1");
  const pass: boolean = await tester.evaluate(async (e: typeof ElementHandle): Promise<boolean> => {
    return Promise.resolve(e.innerText === "Hello world!" && e.computedStyleMap().get("color").toString().toUpperCase() === "RGB(255, 0, 0)");
  }, element);
  console.log(pass);
  await element.dispose();
  pass ? process.exit(0) : process.exit(1);
};

(async (port: number, test: (tester: typeof Page) => Promise<void>) => {
  const server = await createServer({
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
  // add our style and apply it to our element
  fs.writeFileSync("./sassyoctoboxtestapp/src/styles/main.scss", `.custom-sassy-red {
  color: #FF0000;
}`);
  fs.writeFileSync("./sassyoctoboxtestapp/src/App.tsx", `import React, { FC, ReactElement } from "react";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1 className="custom-sassy-red">Hello world!</h1>
    </React.Fragment>
  );
};
`);
  // run our app
  const child = execAsync("npm run test", { cwd: "./sassyoctoboxtestapp"});
  child.on("close", async (close) => {
    // log our success or failure
    if(close === 0) {
      utils.success();
      utils.log.pass("Test 3 passed!");
    }else{
      utils.log.fail("Test 3 failed!");
    }
    // wait time to know what happened
    await new Promise(r => setTimeout(r, 1000));
    // remove our app
    fs.rmSync("./sassyoctoboxtestapp", { recursive: true });
    await utils.run(four, 4);
  });
};

module.exports = test;
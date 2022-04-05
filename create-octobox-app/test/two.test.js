// TODO: always update this test

const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");
const three = require("./three.test.js");

const test = async () => {
  // test 2
  // this test makes an app and checks if vite will load and run properly
  utils.log.info("In this test, some Octobox apps will be created and ran with different settings. If the test finds Octobox's default \"Hello world!\" in the correct spot in the DOM each time and does not encounter an error, it will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make our first app and test, this will be default
  execSync("npm create octobox-app -- argumented --path octoboxtestapp --tailwind FALSE --eslint FALSE --stylelint FALSE");
  fs.writeFileSync("./octoboxtestapp/test/main.test.ts", `const { createServer } = require("vite");
const puppeteer = require("puppeteer");
const { ElementHandle, Page } = require("puppeteer");

const tests = async (tester: typeof Page) => {
  const element: typeof ElementHandle = await tester.$("div#root > h1");
  const text: string = await tester.evaluate((e: typeof ElementHandle) => e.innerText, element);
  await element.dispose();
  text === "Hello world!" ? process.exit(0) : process.exit(1);
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
  // run our app
  const child = execAsync("npm run test", { cwd: "./octoboxtestapp"});
  child.on("close", async (close) => {
    // log our success or failure
    let status = close === 0;
    if(status) {
      utils.log.info("First app successful!");
      utils.log.info("Running next...");
    }else{
      utils.log.info("First app unsuccessful!");
      utils.log.info("Running next...");
    }
    // wait time to know what happened
    await new Promise(r => setTimeout(r, 1000));
    // remove our app
    fs.rmSync("./octoboxtestapp", { recursive: true });
    // make our second app and test, this will be as custom as possible
    execSync("npm create octobox-app -- argumented --path octoboxtestapptwo --tailwind TRUE --eslint TRUE --stylelint TRUE");
    fs.writeFileSync("./octoboxtestapptwo/test/main.test.ts", `const { createServer } = require("vite");
const puppeteer = require("puppeteer");
const { ElementHandle, Page } = require("puppeteer");

const tests = async (tester: typeof Page) => {
  const element: typeof ElementHandle = await tester.$("div#root > h1");
  const text: string = await tester.evaluate((e: typeof ElementHandle) => e.innerText, element);
  await element.dispose();
  text === "Hello world!" ? process.exit(0) : process.exit(1);
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
    // run our app
    const grandchild = execAsync("npm run test", { cwd: "./octoboxtestapptwo"});
    grandchild.on("close", async (close) => {
      // log our success or failure
      status = status && close === 0;
      if(close === 0) {
        utils.log.info("Second app successful!");
      }else{
        utils.log.info("Second app unsuccessful!");
      }
      // i like weird wait times
      await new Promise(r => setTimeout(r, 138));
      // log the whole test's success or failure
      if(status) {
        utils.success();
        utils.log.pass("Test 2 passed!");
      }else{
        utils.log.fail("Test 2 failed!");
      }
      // wait time to know what happened
      await new Promise(r => setTimeout(r, 1000));
      // remove our app
      fs.rmSync("./octoboxtestapptwo", { recursive: true });
      // we're done here, run the next test
      await utils.run(three, 3);
    });
  });
};

module.exports = test;
const utils = require("./testutils.js");
const {execSync, exec: execAsync} = require("child_process");
const fs = require("fs");
const three = require("./three.test.js");

const test = async () => {
  // test 2
  // this test makes an app and checks if vite will load and run properly
  utils.log.info("In this test, an Octobox app will be created and its development server ran. If the test finds Octobox's default \"Hello world!\" in the correct spot in the DOM and does not encounter an error, it will pass.");
  await new Promise(r => setTimeout(r, 1000));
  // make our app and our test since the test isnt a part of the framework itself
  execSync("npm create octobox-app -- argumented --path octoboxtestapp");
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
  let child = execAsync("npm run test", { cwd: "./octoboxtestapp"});
  await child.on("close", async (close) => {
    // log our success or failure
    if(close === 0) {
      utils.log.pass("Test 2 passed!");
    }else{
      utils.log.fail("Test 2 failed!");
    }
    // wait time to know what happened
    await new Promise(r => setTimeout(r, 1000));
    // remove our app
    fs.rmSync("./octoboxtestapp", { recursive: true });
    await utils.run(three, 3);
  });
};

module.exports = test;
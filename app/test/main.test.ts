const { createServer } = require("vite");
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
  await tester.goto(`http://localhost:${port}`);
  await test(tester);
  process.exit();
})(4000, tests);

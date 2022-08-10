#!/usr/bin/env node

const { createServer } = require("vite");
const puppeteer = require("puppeteer");

const script = async () => {

  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    server: {
      port: 4000,
    }
  });
  await server.listen();
  server.printUrls();
  const tester = await (await puppeteer.launch()).newPage();
  await tester.goto(`http://localhost:${4000}`);

};

const exit = () => {
  process.exit(0);
};

script().then(exit).catch(console.error);


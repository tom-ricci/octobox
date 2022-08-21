#!/usr/bin/env node

import puppeteer from "puppeteer";
import { createServer } from "vite";
import * as portfinder from "portfinder";

interface ResolvedCompilierConfig {
  path: string
  config: { [x: number | string | symbol]: unknown } | undefined
}

interface Store {
  [x: number]: ResolvedCompilierConfig
}

const exit = () => {
  process.exit(0);
};

// we need to get every compilier config from the windows, so we do that first
const init = async () => {
  const server = await createServer({
    configFile: `${process.cwd()}/vite.config.ts`,
    root: process.cwd(),
    mode: "COMPILE"
  });
  const port = await portfinder.getPortPromise();
  await server.listen(port);
  const page = await (await puppeteer.launch({ args: ["--no-sandbox"]})).newPage();
  await page.goto(`http://localhost:${port}`);
  const resolve = () => {
    setTimeout(async () => {
      const sstore = await page.evaluate(() => {
        return sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35");
      });
      if(sstore !== null && sstore !== undefined) {
        await page.close();
        await server.close();
        runner(JSON.parse(sstore?? "{}")).then(exit);
      }else{
        resolve();
      }
    }, 2000);
  };
  resolve();
};

// TODO: remember to combine default window configs and their parents, default keys override parent keys when the parent is being preloaded. default should not be preloaded, should be removed after combining configs
// TODO: basename support

// the runner goes through every window and compiles them (or not) according to the settings stored in their configs
const runner = async (store: Store) => {
  // TODO: rewrite this to build the vite app first, then prerender
  const server = await createServer({
    configFile: `${process.cwd()}/vite.config.ts`,
    root: process.cwd(),
    mode: "COMPILE"
  });
  const port = await portfinder.getPortPromise();
  await server.listen(port);
  const page = await (await puppeteer.launch({ args: ["--no-sandbox"]})).newPage();
  for(const val in store) {
    const item = store[val];
  }
  console.log(store);
};

init().catch(console.error);

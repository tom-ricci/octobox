#!/usr/bin/env node

const { createServer, build } = require("vite");
const puppeteer = require("puppeteer");
const portfinder = require("portfinder");
const { exec } = require("child_process");
const nodeFetch = require("node-fetch");
const merge = require("lodash.merge");
const util = require("util");

interface EnabledCompilierConfig {
  compile: true
}

type BaseCompilierConfig = EnabledCompilierConfig

interface DynamicCompilierConfig extends BaseCompilierConfig {
  type: "dynamic"
  params: [string, ...string[]]
}

interface WildcardCompilierConfig extends BaseCompilierConfig {
  type: "wildcard"
  paths: [string, ...string[]]
}

interface StaticCompilierConfig extends BaseCompilierConfig {
  type: "static"
}

interface DisabledCompilierConfig {
  compile: false
}

type CompilierConfig = DynamicCompilierConfig | WildcardCompilierConfig | StaticCompilierConfig | DisabledCompilierConfig;
// note that docs can be found for the above types in /src/routing/api/CompilierConfig.ts

interface ResolvedCompilierConfig {
  path: string
  config: CompilierConfig
}

interface Store {
  [x: number]: ResolvedCompilierConfig
}

interface ResolvedStore {
  [x: string]: CompilierConfig
}

interface ResolvedStoreTree {
  path?: string;
  config?: CompilierConfig;
  children?: ResolvedStoreTree[];
}

const exit = () => {
  process.exit(0);
};

// we need to get every compilier config from the windows, so we do that first
const init = async () => {
  // boot up resolution server, we need this to load & resolve all the configs
  // the mode of the server is set to COMPILE, which means it will resolve all configs on first page load. as long as the user never uses import.env.MODE or import.env.DEV/PROD to determine what mode they're in, their code will be running in production mode (the development mode hook returns false for compilation mode too)
  const server = await createServer({
    configFile: `${process.cwd()}/vite.config.ts`,
    root: process.cwd(),
    mode: "COMPILE"
  });
  const port = await portfinder.getPortPromise();
  await server.listen(port);
  // we also need to set up our pptr browser to get the resolved data
  const page = await (await puppeteer.launch({ args: ["--no-sandbox"]})).newPage();
  await page.goto(`http://localhost:${port}`);
  const resolve = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // every 2 seconds, we check to see if the resolution is there yet
    // inside LocationManager.tsx, we run some code to resolve everything when in compilation mode and store it in session storage. then, we can grab it here
    // there's probably better ways of doing this, but it works and optimizing it isn't particularly important anyway
    const sstore = await page.evaluate(() => {
      return sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35");
    });
    // as long as we get back a valid string, we know we have the data (or we at least know something happened if data resolution failed somehow), so we can move on
    if(sstore !== null && sstore !== undefined) {
      await page.close();
      await server.close();
      await runner(JSON.parse(sstore?? "{}"));
      exit();
    }else{
      await resolve();
    }
  };
  await resolve();
};

// TODO: remember to combine default window configs and their parents, default keys override parent keys when the parent is being preloaded. default should not be preloaded, should be removed after combining configs
// TODO: basename support

// the runner goes through every window and compiles them (or not) according to the settings stored in their configs
const runner = async (store: Store) => {
  // now we need to build the app itself, so lets do that here
  // now it will definetely be running in production mode. no compilation mode here
  await build({
    root: process.cwd(),
    configFile: `${process.cwd()}/vite.config.ts`
  });
  // annnd we use serve to host the bundle
  const port = await portfinder.getPortPromise();
  const server = exec(`npx --yes serve -s -p ${port} -n`, { cwd: `${process.cwd()}/dist/`});
  // we also need to wait for serve to spin up, so check every 2 seconds for it to be up (we can't use async/await or promises in the line above, so we need to do something like this
  const waitForServer = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const res = await nodeFetch(`http://localhost:${port}`);
    if(res.ok && res.status === 200) {
      // if the server is up, we create a new puppeteer instance and prepare our window configs for compilation
      const page = await (await puppeteer.launch({ args: ["--no-sandbox"]})).newPage();
      const rstore: ResolvedStore = {};
      for(const val in store) {
        const item = store[val];
        const config: CompilierConfig = (item.config !== undefined && "compile" in item.config) ? item.config : {
          compile: false
        };
        if(config.compile) {
          if(config.type === "dynamic") {
            for(let i = config.params.length; i > -1; i--) {
              if(config.params[i].includes("/")) {
                config.params.pop();
              }
            }
            if(config.params.length < 1) {
              continue;
            }
          }else if(config.type === "wildcard") {
            config.paths = config.paths.map(val => {
              if(val.startsWith("./")) {
                val = val.substring(1);
              }
              if(!val.startsWith("/")) {
                val = `/${val}`;
              }
              return val;
            }) as [string, ...string[]];
          }
        }
        rstore[item.path] = config;
        // TODO: here we need to remove windows, combine duplicate configs (from parents/defaults), fill in routes for pending and wildcards (as in, replace $var with the params and make paths for all the wildcard paths), fill in the parents of routes (i.e. if there's any variables in a parent path segment, need to fill those in ... it might be easier to just replace the whole path up to the child segment(s) with the params instead of filling them in), etc.
        // TODO: here we need to make sure everythings good to go
        // TODO: here we need to actually prerender things
        // TODO: If a config is specified in both a normal window (parent) and that window's default window (child), the parent config will be used when compiling windows nested below the parent, and the parent and child configs will be merged when compiling the parent window's path
      }
      const trees: ResolvedStoreTree[] = [];
      for(const x in rstore) {
        let val = `${x}`;
        const config = rstore[x];
        let def = false;
        if(val.endsWith("//")) {
          def = true;
          val = val.substring(0, val.length - 2);
        }
        if(val.endsWith("/")) {
          val = val.substring(0, val.length - 1);
        }
        const vals = val.split("/");
        if(def) {
          vals.push("/");
        }
        trees.push(makeTreeSegment(vals, config));
      }
      console.log(util.inspect(trees, false, null, true));
      const tree = trees.shift();
      for(const ntree of trees) {

      }
      console.log(tree);
    }else{
      await waitForServer();
    }
  };
  await waitForServer();
  server.kill("SIGKILL");
};

const makeTreeSegment = (path: string[], config: CompilierConfig): ResolvedStoreTree => {
  const tree: ResolvedStoreTree = { path: path[0]};
  tree.children = tree.children ?? [];
  if(path.length === 1) {
    tree.config = config;
  }else{
    path.shift();
    const sub = makeTreeSegment(path, config);
    tree.children.push(sub);
  }
  return tree;
};

const mergeTrees = (first: ResolvedStoreTree, second: ResolvedStoreTree): ResolvedStoreTree => {
  if(second.children !== undefined) {
    first.children = first.children ?? [];
    for(const child of second.children) {
      first.children.push(mergeTrees(first, child));
    }
  }
  if(first.children === undefined && second.children !== undefined) {
    first.children = [];
  }
  if(first.children !== undefined && second.children !== undefined) {
    if(first.path === second.path) {
      mergeTrees(first.children[0], second);
    }else{
      first.children.push(...second.children);
    }
  }

};

init().catch(console.error);

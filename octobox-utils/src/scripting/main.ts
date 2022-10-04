#!/usr/bin/env node

const { createServer, build, preview } = require("vite");
const puppeteer = require("puppeteer");
const portfinder = require("portfinder");
const replaceall = require("replaceall");
const terminator = require("http-terminator");
const fs = require("fs-extra");

interface EnabledCompilierConfig {
  compile: true
}

type BaseCompilierConfig = EnabledCompilierConfig

interface DynamicCompilierConfig extends BaseCompilierConfig {
  type: "dynamic"
  params: [string, ...string[]]
}

// README: Wildcard configs and all operations against them are now useless. They exist as a remnant of a previous 404 compilation feature meant to allow crawlers to index certain 404 routes deemed popular enough to warrant indexing (popularity was designed with heuristics and user tracking in mind, but the developer was expected to determine which routes would be compiled). This was ultimately scrapped but the code still exists incase we ever implement it again and because it's easier to maintain the code this way at the moment.
interface WildcardCompilierConfig extends BaseCompilierConfig {
  type: "wildcard"
  paths: string[]
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

type ResolvedStoreArray = { path: string, config: CompilierConfig | undefined }[]

const exit = () => {
  process.exit(0);
};

const globals = {
  port: 0,
  notfound: "jtbuksxfmarnecqwldhigvpyo",
  basename: ""
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
  globals.port = port;
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
    let sbase: string | null | undefined = await page.evaluate(() => {
      return sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35b");
    });
    // as long as we get back a valid string, we know we have the data (or we at least know something happened if data resolution failed somehow), so we can move on
    if(sstore !== null && sstore !== undefined && sbase !== null && sbase !== undefined) {
      await page.close();
      await server.close();
      if(sbase.length > 0) {
        if(sbase.startsWith("/")) {
          sbase.replace("/", "");
        }
        if(!sbase.endsWith("/")) {
          sbase += "/";
        }
      }
      globals.basename = sbase;
      await runner(JSON.parse(sstore?? "{}"));
      exit();
    }else{
      await resolve();
    }
  };
  await resolve();
};

// the runner goes through every window and compiles them (or not) according to the settings stored in their configs
const runner = async (store: Store) => {
  // now we need to build the app itself, so lets do that here
  // now it will definetely be running in production mode. no compilation mode here
  await build({
    root: process.cwd(),
    configFile: `${process.cwd()}/vite.config.ts`
  });
  // we need to start turning the store into routes we can actually use
  const rstore: ResolvedStore = {};
  for(const val in store) {
    const item = store[val];
    // take the compilier config and make sure all the properties are valid and sanitized
    // we do this by adding defaults and sanitizing current inputs
    const config: CompilierConfig = (item.config !== undefined && "compile" in item.config) ? item.config : {
      compile: false
    };
    if(config.compile) {
      // the dynamic paths cant contain slashes because they are single path segments, the wildcard paths have to start with /
      if(config.type === "dynamic") {
        for(let i = config.params.length - 1; i > -1; i--) {
          if(config.params[i].includes("/")) {
            config.params.pop();
          }
        }
        if(config.params.length < 1) {
          continue;
        }
      }else if(config.type === "wildcard") {
        // we need to do something like this so we have a path that a wildcard can use--
        config.paths = [`/${globals.notfound}`];
      }
    }
    // add the sanitized configs to a storage object
    rstore[item.path] = config;
  }
  // now we need to take all the paths in the storage object and split them up, then add them to another storage object and a rejoined version to yet another storage object
  // this is required so we can place configs in the right spots
  const stores: ResolvedStoreArray[] = [];
  const resolvedStoreIndex: ResolvedStore = {};
  for(const x in rstore) {
    let val = `${x}`;
    const config = rstore[x];
    // if the route ends in "//", its a default route and we need to keep track of that
    let def = false;
    if(val.endsWith("//")) {
      def = true;
      val = val.substring(0, val.length - 2);
    }
    if(val.endsWith("/")) {
      val = val.substring(0, val.length - 1);
    }
    const vals = val.split("/");
    // if its a default route we need to add another "/" to the end so we know its default
    if(def) {
      vals.push("/");
    }
    // then we can put the data in their storage objects
    resolvedStoreIndex[vals.join("/")] = config;
    const valsWithConfigs = vals.map((value, index) => {
      if(index === vals.length - 1) {
        return { path: value, config };
      }else{
        return { path: value, config: undefined };
      }
    });
    stores.push(valsWithConfigs);
  }
  // we need to do this shift here because of an off-by-one error that, when fixed, breaks the first element
  // we also don't need to do anything to the first element because its expected to "just work" according to octobox's formatting and window requirements
  const firstStore = stores.shift() as ResolvedStoreArray;
  // now for the rest of them, we need to fill in configs for each path segment
  // to do this, we build a string out of all path segments which don't include configs. this is then a valid path for another window, and thus has a config stored somewhere. we then match the string against the other paths to find the config which goes at the deepest path segment of that string. we rinse and repeat until all path segments have a config
  for(const store of stores) {
    while(store.find(value => value.config === undefined) !== undefined) {
      let str = "";
      let index = 0;
      for(const segment of store) {
        if(segment.config === undefined) {
          str += `${segment.path}/`;
          index++;
        }else{
          break;
        }
      }
      str = str.substring(0, str.length - 1);
      store[index - 1].config = resolvedStoreIndex[str];
    }
  }
  // we unshift this storage object and add the first element back in
  stores.unshift(firstStore);
  // now, we can clean up the data we have
  // this will go through all the windows and find dynamic and wildcard ones which don't have paths, and remove them from the list. it will also override parents with their default children (if they have a default window). it will also remove any windows which have compilation disabled. it will also remove similar paths and params from non-static windows.
  const finalStores = clean(stores);
  // now we build the paths we need to prerender
  const paths = buildPaths(finalStores);
  // and prerender
  const html = await prerender(paths);
  // lastly, store the files !! we're done after this :)
  storeFiles(html);
};

const clean = (arr: ResolvedStoreArray[]): ResolvedStoreArray[] => {
  // override parent configs with their default children. also remove all default children from the array. relies on side-effects
  arr = arr.filter(value => {
    const last = value[value.length - 1];
    if(last.path === "/") {
      let wpath = "";
      for(const { path } of value) {
        wpath += `${path}/`;
      }
      wpath = wpath.substring(0, wpath.length - 1);
      while(wpath.endsWith("/")) {
        wpath = wpath.substring(0, wpath.lastIndexOf("/"));
      }
      const parent = arr.find(value => {
        let str = "";
        for(const { path } of value) {
          str += `${path}/`;
        }
        str = str.substring(0, str.length - 1);
        while(str.endsWith("/")) {
          str = str.substring(0, str.lastIndexOf("/"));
        }
        return wpath === str;
      });
      if(parent !== undefined) {
        parent[parent.length - 1].config = last.config;
      }
      return false;
    }else{
      return true;
    }
  });
  // hehe funny one liner look at it go :)) what a good one liner!! so impossible to maintain :) whos a good one linerrrr. you are. you are! good one liner!! (read this in the voice you use to speak to a dog)
  arr = arr.filter(elem => !(elem[elem.length - 1].config?.compile === false || elem.filter(value => value.path.includes(":")).find(value => !(value.config?.compile && value.config.type === "dynamic" && value.config.params.length > 0)) !== undefined || elem.filter(value => value.path.includes("*")).find(value => !(value.config?.compile && value.config.type === "wildcard" && value.config.paths.length > 0)) !== undefined));
  // in all seriousness the line above removes any window which has compilation disabled, contains an invalid dynamic window in its path, or is an invalid wildcard window
  // invalid dynamic windows are dynamic windows with either compilation disabled or no params
  // invalid wildcard windows are wildcard windows with either compilation disabled or no path
  // ------------------------------
  // below, this removes any duplicate params in dynamic windows and paths in wildcard windows
  for(const value of arr) {
    for(const segment of value) {
      if(segment.config && segment.config.compile && segment.config.type === "dynamic") {
        const seen: string[] = [ "" ];
        segment.config.params = segment.config.params.filter(value => {
          if(!seen.includes(value)) {
            seen.push(value);
            return true;
          }else{
            return false;
          }
        }) as [string, ...string[]];
      }else if(segment.config && segment.config.compile && segment.config.type === "wildcard") {
        const seen: string[] = [ "" ];
        segment.config.paths = segment.config.paths.filter(value => {
          if(!seen.includes(value)) {
            seen.push(value);
            return true;
          }else{
            return false;
          }
        });
      }
    }
  }
  return arr;
};

const buildPaths = (stores: ResolvedStoreArray[]): string[] => {
  // now, we need to actually build the paths we're going to prerender
  // for this, we basically just turn a tree into a bunch of arrays of all the nodes down one specific path
  let paths: string[] = [];
  for(const store of stores) {
    if(store.length !== 0) {
      const topSegment = buildCascadingCompilierConfigSegment(store);
      for(const path of topSegment.paths) {
        if(topSegment.child !== undefined) {
          paths.push(...buildPathTree(path, topSegment.child));
        }else{
          paths.push(path);
        }
      }
    }
    // we now remove duplicates just in case we have any, unlikely but its not very expensive and im not gonna bet on this code being good enough to prevent duplicates
    const seen: string[] = [];
    paths = paths.filter(value => {
      if(!seen.includes(value)) {
        seen.push(value);
        return true;
      }else{
        return false;
      }
    });
    // finally we format the paths into urls that look pretty
    paths = paths.map(value => {
      value += "/";
      return replaceall("//", "/", value);
    });
  }
  paths = paths.map(value => {
    const nvalue = `http://${value}`;
    return nvalue.replace(`localhost:${globals.port}/`, `localhost:${globals.port}/${globals.basename}`);
  });
  // we're actually undoing something we did previously here instead of just removing that code--but given this is running in nodejs it should be fine. if performance was a concern this would be written in rust
  paths = paths.map(value => {
    return value.endsWith("/") ? value.substring(0, value.length - 1) : value;
  });
  paths = paths.filter(value => {
    return !value.includes(globals.notfound);
  });
  return paths;
};

interface CascadingCompilierConfig {
  paths: string[];
  child?: CascadingCompilierConfig,
}

interface PathSegment {
  paths: string;
  children?: PathSegment[],
}

// this converts the resolved store arrays into trees of their paths
const buildCascadingCompilierConfigSegment = (next: ResolvedStoreArray): CascadingCompilierConfig => {
  const { path, config } = next.shift() as {path: string, config: DynamicCompilierConfig | WildcardCompilierConfig | StaticCompilierConfig};
  const paths: string[] = [];
  if(config.type === "dynamic") {
    paths.push(...config.params);
  }else if(config.type === "wildcard") {
    paths.push(...config.paths);
  }else{
    if(path === "$") {
      paths.push(`localhost:${globals.port}/`);
    }else{
      paths.push(path);
    }
  }
  if(next.length === 0) {
    return { paths };
  }else{
    return { paths, child: buildCascadingCompilierConfigSegment(next) };
  }
};

// this converts the cascading compilier config into a tree of paths
const buildPathTree = (path: string, children: CascadingCompilierConfig): string[] => {
  const arr: string[] = [];
  const grandchildren = children.child;
  if(grandchildren !== undefined) {
    for(const child of children.paths) {
      let childrenPaths = buildPathTree(child, grandchildren);
      childrenPaths = childrenPaths.map(value => `${path}/${value}`);
      arr.push(...childrenPaths);
    }
  }else{
    for(const child of children.paths) {
      arr.push(`${path}/${child}`);
    }
  }
  return arr;
};

const prerender = async (paths: string[]): Promise<{ path: string, html: string }[]> => {
  // boot up vite preview server
  const server = await preview({
    configFile: `${process.cwd()}/vite.config.ts`,
    preview: {
      port: globals.port,
      host: "localhost",
      open: false,
    }
  });
  const stopper = terminator.createHttpTerminator({
    server: server.httpServer
  });
  const htmls: { path: string, html: string }[] = [];
  // create a pptr browser
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  // load html
  for(const path of paths) {
    // on every new page, we add the compilation storage item so the router knows to compile
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem("jtbuksxfmarnecqwldhigvpyo", "yes");
    });
    // then we get the path from the url we're prerendering so we can identify its selectors in the dom when its compiled
    let url = new URL(path).pathname;
    url = url.endsWith("/") ? url : `${url}/`;
    url = url.startsWith("./") ? url.replace("./", "/") : url;
    url = url.startsWith("/") ? url : `/${url}`;
    // and finally we begin loading the html, wait for it to be ready, and scrape it
    await page.goto(path, { waitUntil: "networkidle0" });
    await page.waitForSelector(`meta[data-jtbuksxfmarnecqwldhigvpyo-mn="${url}"][data-jtbuksxfmarnecqwldhigvpyo-ms="true"]`);
    await page.waitForSelector(`#root[data-jtbuksxfmarnecqwldhigvpyo-pn="${url}"]`);
    const html = await page.content();
    htmls.push({path: url, html});
  }
  // we don't need the server anymore, we have all the html
  await stopper.terminate();
  // and lastly we just need to remove the compilation indicators so they don't confuse robots
  for(const entry of htmls) {
    entry.html = replaceall(`<meta data-jtbuksxfmarnecqwldhigvpyo-mn="${entry.path}" data-jtbuksxfmarnecqwldhigvpyo-ms="true">`, "", entry.html);
    entry.html = replaceall(`data-jtbuksxfmarnecqwldhigvpyo-pn="${entry.path}"`, "", entry.html);
  }
  return htmls;
};

const storeFiles = (files: {path: string, html: string}[]) => {
  for(const file of files) {
    fs.mkdirSync(`./build${file.path}`);
    fs.writeFileSync(`./build${file.path}/index.html`, file.html);
  }
  let basename = `${globals.basename}`;
  basename = basename.startsWith("/") ? basename : `/${basename}`;
  basename = basename.endsWith("/") ? basename : basename += "/";
  fs.copySync("./dist", `./build${basename}`);
};

init().catch(console.error);

/*
TODO: notes
 dont use the string "jtbuksxfmarnecqwldhigvpyo" in meta tag attributes, static route path segments, dynamic compile params, nor session storage keys
 dont use #root[data-jtbuksxfmarnecqwldhigvpyo-pn]
 redirects aren't supported by compilier - expect wonky outputs
 */

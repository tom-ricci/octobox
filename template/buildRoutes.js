// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require("fast-glob");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const replaceAll = require("replaceall");
const build = async () => {
  try {
    let pages = await glob("src/pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}");
    const routes = pages.map(route => {
      let path = route.replace("src/pages/", "");
      if(path.endsWith(".tsx")) {
        route = path.substring(0, path.length - 4);
      }else{
        route = path;
      }
      if(path.endsWith("Index.tsx")) {
        path = path.substring(0, path.length - 10);
      }
      if(path.endsWith(".tsx")) {
        path = path.substring(0, path.length - 4);
      }
      path = replaceAll("[...", "*", path);
      path = replaceAll("[", ":", path);
      path = replaceAll("]", "", path);
      for(const char of path) {
        if(char === "*") {
          const sub = path.substring(path.indexOf(char));
          sub.substring(1, sub.indexOf("/"));
          path = path.replace(sub, "");
        }
      }
      if(!path.endsWith("/")) {
        path += "/";
      }
      if(!path.startsWith("/")) {
        path = `/${path}`;
      }
      path.toLowerCase();
      return { path, component: `./pages/${route}` };
    });
    let current = await fs.readFile(`${__dirname}/src/Routes.tsx`);
    current = current.toString();
    const oldGen = current.substring(current.indexOf("// routes-begin"), current.indexOf("// routes-end"));
    let newGen = "// routes-begin\n// AUTO-GENERATED SECTION - DO NOT EDIT";
    if(routes.length > 0) {
      for(const page of routes) {
        const index = routes.indexOf(page);
        newGen += `
import page${index} from "${page.component}";`;
      }
      newGen += `
const routes = [ `;
      for(const page of routes) {
        const index = routes.indexOf(page);
        newGen += `{ path: "${page.path}", component: page${index} }, `;
      }
      newGen = newGen.substring(0, newGen.length - 2);
      newGen += " ];";
      newGen += "\n";
    }else{
      newGen += "\nconst routes = null;\n";
    }
    const finalString = replaceAll(oldGen, newGen, current);
    await fs.writeFile(`${__dirname}/src/Routes.tsx`, finalString);
  }catch(e) {
    console.log(e);
  }
};
build().catch(e => console.log(e));

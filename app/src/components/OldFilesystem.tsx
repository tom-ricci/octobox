import React, { ComponentType, FC, ReactElement, useTransition } from "react";
import { RouteObject, useRoutes, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import * as History from "history";

interface Props {
  basename?: string;
}

interface SuspensefulRouterProps {
  history: History.BrowserHistory;
  children: React.ReactNode;
  basename: string;
}

interface TreeProps {
  tree: Tree;
}

interface Tree {
  root: any[];
}

let windows: [string, (() => Promise<{[p: string]: any}>)][] = [];
let config: RouteObject = {};
let _basename = "";

/**
 * Returns a list of the paths and dynamic imports of windows.
 */
export const useWindows = (): [string, (() => Promise<{[p: string]: any}>)][] => {
  return windows;
};

/**
 * Returns the route configuration supplied to RR.
 */
export const useRouteConfiguration = (): RouteObject => {
  return config;
};

/**
 * Returns the basename of this OldFilesystem.
 */
export const useBasename = (): string => {
  return _basename;
};

/**
 * A OldFilesystem is a filesystem-based router. Filesystems consider their root point to be /src/windows/ (relative to the project root). For example, /src/windows/about/Window.tsx will be routed as /about. Filesystems will route all legal page components. A OldFilesystem must contain a Window.tsx file inside /src/windows/ to function properly, as it's the root of the OldFilesystem.
 * @constructor
 */
export const OldFilesystem: FC<Props> = ({ basename }): ReactElement => {
  // sanitize basename
  if(basename?.startsWith("/")) {
    basename?.replace("/", "");
  }
  if(basename?.endsWith("/")) {
    basename?.replace("/", "");
  }
  const beginRouting = (): Tree => {
    _basename = basename ?? "";
    // put windows into a 2d array with the route and file
    const imports = import.meta.glob("/src/windows/**/Window.tsx");
    const routes: any[][] = [];
    windows = windows.slice(0, 0);
    for(const property in imports) {
      routes.push([ property, React.createElement(React.lazy(imports[property] as () => Promise<{ default: ComponentType<any>; }>)) ]);
      windows.push([property, imports[property]]);
    }
    // make nested arrays out of the files' paths
    const absolutes: any[] = [];
    for(const route of routes) {
      route[0] = route[0].startsWith("/src/windows/") ? route[0].replace("/src/windows/", "") : route[0];
      if(route[0].substring(0, route[0].lastIndexOf("/Window.tsx")).includes("wildcard/")) {
        continue;
      }
      const obj: object = objectify(route[0].startsWith("/") ? route[0].substring(1).split("/") : route[0].split("/"), route[1]);
      absolutes.push(obj);
    }
    // combine into a tree by shaking duplicate portions of routes
    return treeify(absolutes);
  };

  // the routes to pass to the routing tree, which will take this route tree and convert it into a route object RR can use
  const tree = beginRouting();

  basename = basename ?? "/";

  // return route table
  return (
    <React.Fragment>
      <SuspensefulRouter history={History.createBrowserHistory({ window })} basename={basename}>
        <RoutingTree tree={tree}/>
      </SuspensefulRouter>
    </React.Fragment>
  );

};

// convert our absolute routes into a tree
const treeify = (absolutes: any[]): Tree => {
  // merge the weird multiparadigm tree-array thingy into one, meaning now instead of half tree half array its more like 75% tree 25% array
  for(let i = 1; i < absolutes.length; i++) {
    merge(absolutes[0], absolutes[i]);
  }
  // get what we just did and elevate windows to their proper locations
  const obj: Tree = {
    root: [ absolutes[0][0] ]
  };
  absolutes = absolutes[0].slice(1);
  for(let i = 0; i < absolutes.length; i++) {
    absolutes[i] = elevateElement(absolutes[i]);
  }
  // remove non-existent children
  for(let i = 0; i < absolutes.length; i++) {
    absolutes[i] = removeEmptyArrays(absolutes[i]);
  }
  obj.root.push(...absolutes);
  return obj;
};

// convert a flat array of path segments into an object of nested path segments
const objectify = (arr: any[], obj: any): object => {
  let val: string = arr[0];
  // convert wildcards and variable paths to RR style
  if(val === "wildcard") {
    val = "*";
  }else if(val.startsWith("$")) {
    val = val.replace("$", ":");
  }
  // either return the window or recurse until one is found
  if(arr.length <= 1 && val === "Window.tsx") {
    return [{ value: val, element: obj }];
  }
  return [{ value: val, children: objectify(arr.slice(1), obj) }];
};

// combine nested object arrays from objectify into one. kinda like a mix between creating a tree, shaking a tree, and creating a multidimensional array.
const merge = (arr1: any[], arr2: any[]): void => {
  const hash = Object.create(null);
  arr1.forEach(o => {
    hash[o.value] = o;
  });
  // overwrite any duplicate values between both arrays, merging them into 1
  arr2.forEach(o => {
    if(hash[o.value]) {
      o.children && merge(hash[o.value].children = hash[o.value].children || [], o.children);
    }else{
      arr1.push(o);
    }
  });
};

// edits the route tree such that children with the value of Window.tsx have their elements moved to their parents
const elevateElement = (obj: any): object => {
  // if the current node has an immediate child window, raise the window to the node's element
  if(obj.children[0].value === "Window.tsx") {
    obj.element = obj.children[0].element;
    obj.children = obj.children.slice(1);
  }
  // continue for all children of the node
  for(let i = 0; i < obj.children.length; i++) {
    obj.children[i] = elevateElement(obj.children[i]);
  }
  return obj;
};

// removes empty arrays in objects after elevation
const removeEmptyArrays = (obj: any): object => {
  // if this is a parent of nothing, remove the children array
  if(obj.children.length < 1) {
    delete obj.children;
  }else{
    // otherwise, check the children nodes
    for(let i = 0; i < obj.children.length; i++) {
      obj.children[i] = removeEmptyArrays(obj.children[i]);
    }
  }
  return obj;
};

// build a tree of routes based on a merged route array
const RoutingTree: FC<TreeProps> = ({ tree }): ReactElement => {
  // if the app has no starting point, throw an error, otherwise build the route tree
  if(tree.root[0].value !== "Window.tsx") {
    throw new Error("No root Window.tsx (/src/windows/Window.tsx) file in the OldFilesystem!");
  }else{
    // first off we need to make the root, then we recurse through the app and make all the other routes
    const routeObj: RouteObject = {
      path: "",
      element: tree.root[0].element,
      children: tree.root.slice(1).map(value => {
        return buildSegment(value);
      })
    };
    // finally we render the correct route
    config = routeObj;
    const route = useRoutes([routeObj]);
    return (
      <React.Fragment>
        {route}
      </React.Fragment>
    );
  }
};

// build a segment of a route
const buildSegment = (obj: any): RouteObject => {
  if(obj.value === "default") {
    // return an index route if its the default route of its parent
    return {
      index: true,
      element: obj.element
    };
  }else if("children" in obj) {
    if("element" in obj) {
      // return the route and element if its a parental route with an element, and recurse until childless route is reached
      return {
        path: obj.value,
        element: obj.element,
        children: obj.children.map((value: any) => {
          return buildSegment(value);
        })
      };
    }else{
      // return the route if its a parental route without an element, and recurse until childless route is reached
      return {
        path: obj.value,
        children: obj.children.map((value: any) => {
          return buildSegment(value);
        })
      };
    }
  }else{
    // return the route if its a childless, non-index route
    return {
      path: obj.value,
      element: obj.element
    };
  }
};

// handles loading routes on demand, if they havent been preloaded already
// props to https://stackoverflow.com/questions/66039626/react-lazy-suspens-react-router-dont-change-route-until-component-is-fetched, its literally the only resource i could find on this
const SuspensefulRouter: FC<SuspensefulRouterProps> = ({ children, history, basename }): ReactElement => {
  // edit the history to use transitions, which will wait until the component is ready before trying to navigate to it
  // also, for the future/anyone reading this trying to do what i did: for whatever reason, suspense likes to fallback on the first render of any route (i.e. the first time you go to /about, it fallbacks for a few milliseconds, but it doesnt do it the second time). it does this regardless of whether the component was imported or not. if you're using transitions here though, itll be fine.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, startTransition ] = useTransition();
  const { push, replace, go } = history;
  history.push = (...args) => {
    startTransition(() => { push.apply(history, args); });
  };
  history.replace = (...args) => {
    startTransition(() => { replace.apply(history, args); });
  };
  history.go = (...args) => {
    startTransition(() => { go.apply(history, args); });
  };
  // return a router with our history and fallback (the fallback *should* never be loaded, but its there just in case)
  return (
    <React.Fragment>
      <HistoryRouter history={history} basename={basename}>
        <React.Suspense fallback={<React.Fragment>Loading...</React.Fragment>}>
          {children}
        </React.Suspense>
      </HistoryRouter>
    </React.Fragment>
  );
};

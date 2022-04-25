import React, { FC, ReactElement } from "react";
import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";

interface Props {

}

interface TreeProps {
  tree: Tree
}

interface Tree {
  root: any[]
}

/**
 * A Filesystem is a filesystem-based router. Filesystems consider their root point to be /src/windows/ (relative to the project root). For example, /src/windows/about/Window.tsx will be routed as /about. Filesystems will route all legal page components. A Filesystem must contain a Window.tsx file inside /src/windows/
 * @constructor
 */
export const Filesystem: FC<Props> = (): ReactElement => {
  // get our files and smack them into a 2d array with the route and file
  const imports = import.meta.globEager("/src/windows/**/Window.tsx");
  const routes: any[][] = [];
  for(const property in imports) {
    routes.push([ property, React.createElement(imports[property].default) ]);
  }
  // convert them into our weird mix between a multidimensional array and a tree
  const absolutes: any[] = [];
  for(const route of routes) {
    route[0] = route[0].startsWith("/src/windows/") ? route[0].replace("/src/windows/", "") : route[0];
    // if this route has segments following a wildcard, such as /about/*/products, the path will be discarded because parental wildcards arent supported in RR
    if(route[0].substring(0, route[0].lastIndexOf("/Window.tsx")).includes("wildcard/")) {
      continue;
    }
    const obj: object = objectify(route[0].startsWith("/") ? route[0].substring(1).split("/") : route[0].split("/"), route[1]);
    absolutes.push(obj);
  }
  const tree: Tree = treeify(absolutes);
  // return route table
  return (
    <React.Fragment>
      <BrowserRouter>
        <RoutingTree tree={tree}/>
      </BrowserRouter>
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
  // make an object
  const hash = Object.create(null);
  // add our first array's values into it
  arr1.forEach(o => {
    hash[o.value] = o;
  });
  // overwrite any duplicate values
  arr2.forEach(o => {
    if(hash[o.value]) {
      o.children && merge(hash[o.value].children = hash[o.value].children || [], o.children);
    }else{
      // overwrite original first array to include merged second array
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
    throw new Error("No root Window.tsx (/src/windows/Window.tsx) file in the Filesystem!");
  }else{
    // first off we need to make the root, then we recurse through the app and make all the other routes
    const routeObj: RouteObject = {
      path: "",
      element: tree.root[0].element,
      children: tree.root.slice(1).map(value => {
        return buildSegment(value);
      })
    };
    // finally we grab the route to render
    const routes = useRoutes([routeObj]);
    // and render it
    return (
      <React.Fragment>
        {routes}
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

import React, { ReactNode } from "react";
import { LoaderFn, UnloaderFn } from "@tanstack/react-location";
import { MetaTags } from "./MetaTags";

type Branch = [{ value: string, children?: Branch | Leaf }];

type Leaf = [{
  value: string,
  component: () => Promise<any>,
  tags?: Promise<MetaTags>,
  loader?: Promise<LoaderFn<any>>,
  unloader?: Promise<UnloaderFn<any>>,
  error?: ReactNode,
  pending?: ReactNode
}];

// Just exists so I know where a branch becomes a tree.
type Tree = Branch | Leaf | undefined;

export class WindowManager {

  private _basename;
  private _branch: Branch | undefined;
  private _tree: Tree | undefined;

  get tree() {
    return this._tree;
  }

  constructor(basename?: string) {
    this._basename = basename ?? "";
  }

  /**
   * Returns a router the user can render in the DOM.
   */
  public renderable() {
    return this.find();
  }

  /**
   * Finds and builds the route configuration. Note that this is not the router, just the data it needs.
   * @private
   */
  private find() {
    // first off, find all of our windows
    const imports = import.meta.glob("/src/windows/**/Window.tsx");
    const error = import.meta.globEager("/src/windows/**/$error/Window.tsx");
    const pending = import.meta.globEager("/src/windows/**/$pending/Window.tsx");
    for(const property in imports) {
      // load up all the pending and error windows before doing anything else to give the visitor some sort of feedback
      if(property.includes("$error/") || property.includes("$pending/")) {
        delete imports[property];
        continue;
      }
      let err: ReactNode | undefined;
      let pend: ReactNode | undefined;
      if(`${property.substring(0, property.lastIndexOf("/Window.tsx"))}/$error/Window.tsx` in error) {
        err = React.createElement(error[`${property.substring(0, property.lastIndexOf("/Window.tsx"))}/$error/Window.tsx`].default);
      }
      if(`${property.substring(0, property.lastIndexOf("/Window.tsx"))}/$pending/Window.tsx` in pending) {
        pend = React.createElement(pending[`${property.substring(0, property.lastIndexOf("/Window.tsx"))}/$pending/Window.tsx`].default);
      }
      // build our route branches
      const branch = this.routify([ property, imports[property], err, pend ]);
      if(branch === null) {
        continue;
      }
      // merge our branches into a tree
      this._branch = this._branch ?? branch;
      if(this._branch !== branch) {
        this.merge(this._branch, branch);
      }
    }
    // sort our tree by route importance. (first index, then static, then parameterized, then wild)
    this._tree = this._branch;
    this.sort(this._tree);
  }

  /**
   * Converts a globbed import into a valid route.
   * @private
   */
  private routify(route: [ string, () => Promise<{[p: string]: any}>, ReactNode | undefined, ReactNode | undefined ]): Branch | null {
    // remove unneeded information from the path, such as the location of all of the app's windows and the window itself
    let [ path ] = route;
    path = path.replace("/src/windows/", "");
    path = path.substring(0, path.lastIndexOf("Window.tsx"));
    if(path.includes("$/")) {
      return null;
    }
    // split the path into an array of paths to prepare to turn it into a branch
    let splitPath = path.split("/");
    if(splitPath[0] !== "") {
      splitPath = ["$", ...splitPath];
    }else{
      splitPath[0] = "$";
    }
    for(let i = 0; i < splitPath.length; i++) {
      if(splitPath[i] === "") {
        splitPath = splitPath.slice(0, i);
      }
    }
    // convert it into a branch
    const finalPath: Branch = this.branch(splitPath);
    if(finalPath[0].children) {
      // sanitize the branch and "fill" in the rest of the data the branch needs
      this.sanitize(finalPath[0].children);
      this.fill(finalPath[0].children, route[1], { error: route[2], pending: route[3] });
    }
    return finalPath;
  }

  /**
   * Recurses through an array of path segments to build one branch of a tree of a route.
   * @param rest
   * @private
   */
  private branch(rest: string[]): Branch {
    // just nest the elements of the branch's original array, nothing fancy here
    if(rest.length <= 1) {
      return [{ value: rest[0] }];
    }else{
      return [{ value: rest[0], children: this.branch(rest.slice(1)) }];
    }
  }

  /**
   * Sanitizes a branch into a usable route.
   * @param route
   * @private
   */
  private sanitize(route: Branch) {
    // convert indexes and wildcards to their respective identifiers
    switch(route[0].value) {
      case "$default":
        route[0].value = "/";
        break;
      case "$wildcard":
        route[0].value = "*";
        break;
    }
    // convert all $variable_names to :variable_names
    route[0].value = route[0].value.replaceAll("$", ":");
    // and recurse for any of the route's children
    if(route[0].children) {
      this.sanitize(route[0].children);
    }
  }

  /**
   * Fills a sanitized route with the correct data to load components with.
   * @param route
   * @param comp
   * @param extras
   * @private
   */
  private fill(route: Branch | Leaf | undefined, comp: () => Promise<{[p: string]: any}>, extras: { error?: ReactNode, pending?: ReactNode }) {
    if(route) {
      if("children" in route[0]) {
        this.fill(route[0].children, comp, extras);
      }else{
        // tell the branch what component it refers to, its pending and error components, its meta tags, and its data loaders
        route[0] = {
          value: route[0].value,
          component: () => comp().then((mod) => (mod?.default ? <mod.default/> : <React.Fragment/>)),
          pending: extras.pending,
          error: extras.error,
          tags: comp().then((mod) => {
            if("Tags" in mod) {
              return mod["Tags"];
            }else{
              return undefined;
            }
          }),
          loader: comp().then((mod) => {
            if("Loader" in mod) {
              return mod["Loader"];
            }else{
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              return async () => {};
            }
          }),
          unloader: comp().then((mod) => {
            if("Unloader" in mod) {
              return mod["Unloader"];
            }else{
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              return async () => {};
            }
          })
        };
      }
    }
  }

  /**
   * Merges the second filled route into the first one.
   * @private
   */
  private merge(first: Branch, second: Branch) {
    // make an object representing the first branch, and for all values which don't exist on this object add them. then replace the first branch with this new object, and its merged
    const hash = Object.create(null);
    first.forEach(o => {
      hash[o.value] = o;
    });
    second.forEach(o => {
      if(hash[o.value]) {
        o.children && this.merge(hash[o.value].children = hash[o.value].children || [], o.children);
      }else{
        first.push(o);
      }
    });
  }

  /**
   * Sorts a route tree in order of importance.
   * @private
   * @param tree
   */
  private sort(tree: Tree) {
    if(Array.isArray(tree)) {
      for(const node of tree) {
        if("children" in node) {
          this.sort(node.children);
        }
        // sort the routes by importance, since dynamic routes will always match even if a better route exists for them if they come first, unlike RR 6 ;-;
        tree.sort((a, b) => {
          if(a.value.startsWith(":") && !b.value.startsWith(":")) {
            return 1;
          }else if(b.value.startsWith(":") && !a.value.startsWith(":")) {
            return -1;
          }else{
            return 0;
          }
        });
        tree.sort((a, b) => {
          if(a.value === "*" && b.value !== "*") {
            return 1;
          }else if(b.value === "*" && a.value !== "*") {
            return -1;
          }else{
            return 0;
          }
        });
      }
    }
  }

}


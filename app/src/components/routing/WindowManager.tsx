import React, { ReactNode } from "react";
import { DefaultError } from "./defaults/DefaultError";
import { DefaultPending } from "./defaults/DefaultPending";
import { WindowLoader, WindowUnloader } from "./api/Loaders";
import { useRouter } from "@tanstack/react-location";

type Branch = [{ value: string, children?: Branch | Leaf }];

type Leaf = [{
  value: string,
  component: () => Promise<ReactNode>,
  loader?: () => Promise<Promise<WindowLoader> | undefined>
  unloader?: () => Promise<Promise<WindowUnloader> | undefined>
  error?: ReactNode,
  pending?: ReactNode
}];

// Just exists so I know where a branch becomes a tree.
type Tree = Branch | Leaf | undefined;

/**
 * The Config interface represents a route config Octobox provides. As Octobox uses React Location under the hood, this is not the <em>actual</em> config (see {@link useRouter} for that), but it contains all relevant data about routes.
 */
export interface Config {
  path: string;
  component?: () => Promise<ReactNode>;
  loader?: () => Promise<Promise<WindowLoader> | undefined>
  unloader?: () => Promise<Promise<WindowUnloader> | undefined>
  error?: ReactNode;
  pending?: ReactNode;
  children?: Config[];
}

/**
 * Manages the logic of defining this apps {@link Config}.
 */
export class WindowManager {

  private _basename;
  private _branch: Branch | undefined;
  private _tree: Tree | undefined;
  private _config: Config | null = null;

  get configuration() {
    return this._config;
  }

  constructor(basename?: string) {
    this._basename = basename ?? "";
  }

  /**
   * Creates a routing configuration.
   */
  public create() {
    this.find();
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
    // finally, make the error and pending components cascade (this means that all children without an error or pending element will inherit the ones of their parent or the default if they don't have a parent)
    // since we never resolved the root route (and will do it in the configure method), we also never resolved the root pending and error elements. we need to do that here.
    // we're also using glob for easier handling of nonexistent files
    const rerror = import.meta.globEager("/src/windows/$error/Window.tsx");
    const rpending = import.meta.globEager("/src/windows/$pending/Window.tsx");
    let rerrorElement = <DefaultError/>;
    let rpendingElement = <DefaultPending/>;
    // these loops only result in 0 or 1 runs, so its fine to use them
    for(const property in rerror) {
      const mod = rerror[property].default;
      rerrorElement = mod ? React.createElement(mod) : <DefaultError/>;
    }
    for(const property in rpending) {
      const mod = rpending[property].default;
      rpendingElement = mod ? React.createElement(mod) : <DefaultPending/>;
    }
    // now cascade
    this.cascade(this._tree, rerrorElement, rpendingElement);
    // convert it into a configuration. this imports the root component and converts it into a proper nb tree
    this._config = this.configure(this._tree);
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
        // tell the branch what component it refers to, its pending and error components, and its data loaders
        route[0] = {
          value: route[0].value,
          component: () => comp().then((mod) => (mod?.default ? <mod.default/> : <React.Fragment/>)),
          pending: extras.pending,
          error: extras.error,
          loader: async (): Promise<Promise<WindowLoader> | undefined> => {
            const mod = await comp();
            if("Loader" in mod) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return mod["Loader"];
            }else{
              return undefined;
            }
          },
          unloader: async (): Promise<Promise<WindowUnloader> | undefined> => {
            const mod = await comp();
            if("Unloader" in mod) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return mod["Unloader"];
            }else{
              return undefined;
            }
          }
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

  /*
  *
  * Quick note: Yeah, I know the increased use of disabling TS down here kinda defeats the purpose of using TS, but it makes it much easier to deal with. Once in a while types aren't that helpful.
  *
  * */

  /**
   * Makes error and pending elements cascade down a sorted tree.
   * @param tree
   * @param err
   * @param pend
   * @private
   */
  private cascade(tree: Tree, err: ReactNode, pend: ReactNode) {
    if(Array.isArray(tree)) {
      for(const child of tree) {
        // for every child, check if it has an error or pending element. if it doesnt, set it to the one passed by the method, which will always either be the default element or the element of the parent.
        if("error" in child && child.error !== undefined) {
          err = child.error;
        }else if(err !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          child.error = err;
        }
        if("pending" in child && child.pending !== undefined) {
          pend = child.pending;
        }else if(pend !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          child.pending = pend;
        }
        if("children" in child) {
          this.cascade(child.children, err, pend);
        }
      }
    }
  }

  /**
   * Builds an Octobox route configuration from the tree which can be used to render a RL route configuration.
   * @param tree
   * @private
   */
  private configure(tree: Tree): Config | null {
    // we dont actually have the root file yet because that's not really considered a route by my standards. since it always resolves, it doesn't logically make sense to deal with it earlier on imo. we need to do it here.
    // glob for one file here here because its easier to handle nonexistent files this way rather than using dynamic imports
    const glob = import.meta.glob("/src/windows/Window.tsx");
    let comp: undefined | (() => Promise<{[p: string]: any}>) = undefined;
    for(const property in glob) {
      comp = glob[property];
    }
    // assuming the file exists and the tree isnt undefined (which it *should* always be but its worth checking anyway) add the component and loaders (if they exist)
    if(comp !== undefined && tree !== undefined) {
      if(!("component" in tree[0])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tree[0].component = () => comp().then((mod) => (mod?.default ? <mod.default/> : <React.Fragment/>));
      }
      if(!("loader" in tree[0])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tree[0].loader = async (): Promise<Promise<WindowLoader> | undefined> => {
          if(comp !== undefined) {
            const mod = await comp();
            if("Loader" in mod) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return mod["Loader"];
            }else{
              return undefined;
            }
          }
          return undefined;
        };
      }
      if(!("unloader" in tree[0])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tree[0].unloader = async (): Promise<Promise<WindowUnloader> | undefined> => {
          if(comp !== undefined) {
            const mod = await comp();
            if("Unloader" in mod) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return mod["Unloader"];
            }else{
              return undefined;
            }
          }
          return undefined;
        };
      }
    }
    // convert the tree to a config if it exists
    if(tree !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const config: Config = tree[0];
      this.finalize(config);
      return config;
    }else{
      return null;
    }
  }

  /**
   * Finalizes the config, which in this context just means changing node.value to node.path.
   * @private
   */
  private finalize(config: Config) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const val = config.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete config.value;
    config.path = val;
    if(config.children !== undefined) {
      for(const child of config.children) {
        this.finalize(child);
      }
    }
  }

}

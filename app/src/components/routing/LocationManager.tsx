import { Config, WindowManager } from "./WindowManager";
import { DefaultGenerics, ReactLocation, Route, Router } from "@tanstack/react-location";
import React, { ReactNode } from "react";
import { DefaultError } from "./defaults/DefaultError";
import { DefaultPending } from "./defaults/DefaultPending";
import { PermissiveObject } from "./api/PermissiveObject";
import { LocationInstance } from "./LocationInstance";
import { MetadataManager } from "./meta/MetadataManager";

/**
 * Manages this app's instance of ReactLocation.
 */
export class LocationManager {

  private static age = Infinity;

  static set maxage(maxage: number) {
    this.age = maxage;
  }

  static get maxage() {
    return this.age;
  }

  private config: Config | null = null;
  private windowManager: WindowManager;
  private rl: ReactLocation;
  private maxAge: number;
  private minPending: number;
  private minPendingTimeout: number;
  private _router: ReactNode;
  private basename: string | undefined;

  /**
   * Constructs a Location Manager. You must call {@link update} to update the RL instance, and receive the router via {@link router}.
   * @param basename The basename of the app as it is hosted. For example, if your app was hosted at www.example.com, this would be <code>undefined</code>. If it was hosted at www.example.com/octobox, this would be <code>"octobox"</code>.
   * @param maxAgeMs The cache time of preloading. If a link preloaded but not clicked within this time, its component and loader data will be discarded.
   * @param minUnresponsiveMs The minimum time it takes from the click of a link for the pending route to be shown if the requested route isn't ready yet. This is useful where you may have a user click a link before it can preload and the route loads quickly, so the route transition happens before the pending menu loads so your user doesn't see a loading screen.
   * @param minLoadingMs The minimum time a loading screen can be shown from the click of a link. This helps prevent the pending route from flickering if the requested route loads quickly. The pending route will be forced to be shown for at least as long as this value, therefore letting the user see your pending UI long enough to understand what's happening before the route loads. Since this time is measured from the time a link is clicked, the pending UI will only actually be shown for <em>minUnresponsiveMs - minLoadingMs</em>, which is 500 milliseconds by default.
   */
  constructor(basename?: string, maxAgeMs = Infinity, minUnresponsiveMs = 500, minLoadingMs = 1000) {
    // set settings
    this.basename = basename;
    this.windowManager = new WindowManager(basename);
    this.maxAge = maxAgeMs;
    LocationManager.maxage = this.maxAge;
    this.minPending = minUnresponsiveMs;
    this.minPendingTimeout = minLoadingMs;
    // setup rl instance
    this.rl = new ReactLocation<DefaultGenerics>();
    LocationInstance.setLocation(this.rl);
  }

  /**
   * Recreates the RL router to be exposed by this.router.
   */
  public update() {
    // get route object
    this.windowManager.create();
    this.config = this.windowManager.configuration;
    // if the object exists, build a config
    if(this.config !== null) {
      // grab the default error and pending components
      const err = this.config.error ?? <DefaultError/>;
      const pend = this.config.error ?? <DefaultPending/>;
      const router = (<React.Fragment>
        <Router
          // this is the rl instance, not the basename
          location={this.rl}
          // this is the basename :)
          basepath={this.basename}
          defaultErrorElement={err}
          defaultPendingElement={pend}
          // we're only using one max age, unresponsive time, and pending time for everything for simplicity, so set that up here
          defaultLinkPreloadMaxAge={this.maxAge}
          defaultLoaderMaxAge={this.maxAge}
          // this is the unresponsive timeout -- yes the name is weird
          defaultPendingMs={this.minPending}
          // and this is the pending timeout
          defaultPendingMinMs={this.minPendingTimeout}
          useErrorBoundary={true}
          // build our routes
          routes={[this.build(this.config)]}>
          <MetadataManager.VHead/>
        </Router>
      </React.Fragment>);
      // finally make it accessable to the user
      this._router = router;
    }
  }

  /**
   * Builds the routes.
   * @private
   */
  private build(config: Config): Route {
    return this.buildChild(config);
  }

  /**
   * Builds our router recursively.
   * @param config
   * @private
   */
  private buildChild(config: Config): Route {
    const route: Route = {};
    // first of all we're gonna be starting with the root, so if it is the root dont add a path
    if(config.path !== "$") {
      route.path = config.path;
    }
    route.meta = { head: undefined };
    route.caseSensitive = false;
    // now the loaders. to prevent routes being imported by the window manager and thus not using the advantages of code splitting, we have a 2d promise. yes, a 2d promise. why does that sound so funny
    route.loader = async (match, opts): Promise<PermissiveObject> => {
      if(config.loader !== undefined) {
        // import it
        const loader = await config.loader();
        if(loader !== undefined) {
          // if its async, load it now
          if(loader.length === 0) {
            return await loader();
          }else{
            // otherwise, wait for its parent and load
            const loadedData = await loader(await opts.parentMatch?.loaderPromise);
            const meta = loadedData.meta;
            if(meta !== undefined) {
              route.meta!.head = MetadataManager.compile(meta);
            }
            delete loadedData.meta;
            return loadedData ?? {};
          }
        }else{
          return {};
        }
      }else{
        return {};
      }
    };
    // the unloader is also a 2d promise, so we just need to dig for it
    if(config.unloader !== undefined) {
      route.unloader = async () => {
        // here we're just checking to make sure the unloader exists, and if so import it (and if that import exists), run it
        if(config.unloader !== undefined) {
          await (await config.unloader())?.();
        }
      };
    }
    // now for the component, error, and pending, check if they exist and set them if so
    if(config.component !== undefined) {
      route.element = config.component;
    }
    if(config.error !== undefined) {
      route.errorElement = config.error;
    }
    if(config.pending !== undefined) {
      route.pendingElement = config.pending;
    }
    // recurse through the children and do the same thing
    if(config.children !== undefined) {
      route.children = [];
      for(const child of config.children) {
        route.children.push(this.buildChild(child));
      }
    }
    // we're done!
    return route;
  }

  /**
   * Gets the current RL router. Note that this does not update the router.
   */
  get router() {
    return this._router;
  }

}

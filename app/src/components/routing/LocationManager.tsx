import { Config, WindowManager } from "./WindowManager";
import { DefaultGenerics, Outlet, ReactLocation, Route, Router } from "@tanstack/react-location";
import React, { ReactNode } from "react";
import { DefaultError } from "./defaults/DefaultError";
import { DefaultPending } from "./defaults/DefaultPending";
import { PermissiveObject } from "./api/PermissiveObject";

/**
 * Manages this app's isntance of ReactLocation.
 */
export class LocationManager {

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
    this.basename = basename;
    this.windowManager = new WindowManager(basename);
    this.maxAge = maxAgeMs;
    this.minPending = minUnresponsiveMs;
    this.minPendingTimeout = minLoadingMs;
    this.rl = new ReactLocation<DefaultGenerics>();
  }

  /**
   * Recreates the RL router to be exposed by this.router.
   */
  public update() {
    this.windowManager.create();
    this.config = this.windowManager.configuration;
    if(this.config !== null) {
      const err = this.config.error ?? <DefaultError/>;
      const pend = this.config.error ?? <DefaultPending/>;
      const router = (<React.Fragment>
        <Router
          location={this.rl}
          basepath={this.basename}
          defaultLinkPreloadMaxAge={this.maxAge}
          defaultLoaderMaxAge={this.maxAge}
          defaultErrorElement={err}
          defaultPendingElement={pend}
          defaultPendingMs={this.minPending}
          defaultPendingMinMs={this.minPendingTimeout}
          useErrorBoundary={true}
          routes={[this.buildChild(this.config)]}/>
      </React.Fragment>);
      this._router = router;
    }
    // TODO: TESTING!!!
  }

  private buildChild(config: Config): Route {
    const route: Route = {};
    if(config.path !== "$") {
      route.path = config.path;
    }
    route.caseSensitive = false;
    if(config.loader !== undefined) {
      route.loader = async (match, opts): Promise<PermissiveObject> => {
        if(config.loader !== undefined) {
          const loader = await config.loader();
          if(loader !== undefined) {
            if(loader.constructor.name === "AsyncFunction") {
              return await loader();
            }else{
              const loadedData = await opts.parentMatch?.loaderPromise?.then(data => loader(data));
              return loadedData ?? {};
            }
          }else{
            return {};
          }
        }else{
          return {};
        }
      };
    }
    if(config.unloader !== undefined) {
      route.unloader = async () => {
        // i dont know if its just me, but i really like the absurdity of this one liner
        config.unloader !== undefined && await (await config.unloader())?.();
      };
    }
    if(config.component !== undefined) {
      route.element = config.component;
    }
    if(config.error !== undefined) {
      route.errorElement = config.error;
    }
    if(config.pending !== undefined) {
      route.pendingElement = config.pending;
    }
    if(config.children !== undefined) {
      route.children = [];
      for(const child of config.children) {
        route.children.push(this.buildChild(child));
      }
    }
    if(config.tags !== undefined) {
      route.meta = { tags: config.tags };
    }
    return route;
  }

  /**
   * Gets the most up-to-date RL router.
   */
  get router() {
    return this._router;
  }

}

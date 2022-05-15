import { Config, WindowManager } from "./WindowManager";
import { DefaultGenerics, ReactLocation } from "@tanstack/react-location";
import { ReactNode } from "react";

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

  /**
   * Constructs a Location Manager. You must call {@link update} to update the RL instance, and receive the router via {@link router}.
   * @param basename The basename of the app as it is hosted. For example, if your app was hosted at www.example.com, this would be <code>undefined</code>. If it was hosted at www.example.com/octobox, this would be <code>"octobox"</code>.
   * @param maxAgeMs The cache time of preloading. If a link preloaded but not clicked within this time, its component and loader data will be discarded.
   * @param minUnresponsiveMs The minimum time it takes from the click of a link for the pending route to be shown if the requested route isn't ready yet. This is useful where you may have a user click a link before it can preload and the route loads quickly, so the route transition happens before the pending menu loads so your user doesn't see a loading screen.
   * @param minLoadingMs The minimum time a loading screen can be shown from the click of a link. This helps prevent the pending route from flickering if the requested route loads quickly. The pending route will be forced to be shown for at least as long as this value, therefore letting the user see your pending UI long enough to understand what's happening before the route loads. Since this time is measured from the time a link is clicked, the pending UI will only actually be shown for <em>minUnresponsiveMs - minLoadingMs</em>, which is 500 milliseconds by default.
   */
  constructor(basename?: string, maxAgeMs = Infinity, minUnresponsiveMs = 500, minLoadingMs = 1000) {
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
    // TODO: make this._router;
  }

  /**
   * Gets the most up-to-date RL router.
   */
  get router() {
    return this._router;
  }

}

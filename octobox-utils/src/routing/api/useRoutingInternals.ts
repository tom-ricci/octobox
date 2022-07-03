import { useCheckUrl } from "../useCheckUrl";
import { LocationInstance } from "../LocationInstance";
import { DefaultPending } from "../defaults/DefaultPending";
import { DefaultError } from "../defaults/DefaultError";
import { LocationManager } from "../LocationManager";
import { WindowManager } from "../WindowManager";
import { MetadataManager } from "../MetadataManager";
import { FC } from "react";

/**
 * Exposes the router's internal APIs. You'll probably never need this, but it's nice to have.
 */
export const useRoutingInternals = (): Internals => {
  return {
    urlchecker: useCheckUrl,
    router: {
      client: LocationManager,
      finder: WindowManager,
      head: MetadataManager,
      rl: LocationInstance
    },
    defaults: {
      pending: DefaultPending,
      error: DefaultError
    }
  };
};

/**
 * Internals are the internal pieces of the Octobox router.
 */
export type Internals = {
  urlchecker: UrlChecker;
  router: Router;
  defaults: DefaultElements;
}

/**
 * A UrlChecker is a function which determines if a string is a valid URL such as <a href="https://www.example.com"<code>https://www.example.com/</code></a>.
 */
export type UrlChecker = (url: string) => boolean;

/**
 * A Router is the heart of the Octobox router itself.
 */
export type Router = {
  client: Client;
  finder: Finder;
  head: VirtualHead;
  rl: RL;
}

/**
 * Default elements are what the Router renders when there are no other elements to render.
 */
export type DefaultElements = {
  pending: PendingElement;
  error: ErrorElement;
}

/**
 * A Client is at the center of a Router. It manages the creation and upkeep of the Router.
 */
export type Client = typeof LocationManager;

/**
 * A Finder finds Windows and creates a configuration which the Client can use to define the possible routes of a Router.
 */
export type Finder = typeof WindowManager;

/**
 * A VirtualHead manages the document's head. It keeps track of the app's metadata and determines what to render into the document head and at what time to do so.
 */
export type VirtualHead = typeof MetadataManager;

/**
 * An RL instance is the instance of ReactLocation, which the Octobox router is built on top of. ReactLocation manages the flow of data through a Router and the rendering of the actual content to display. It contains a <a href="https://github.com/remix-run/history"><code>history</code></a> instance which manages the changing of routes and upkeep of the browser's history.
 */
export type RL = typeof LocationInstance;

/**
 * A PendingElement is the element displayed while an element managed by ReactLocation is waiting to be rendered for any reason.
 */
export type PendingElement = FC;

/**
 * An ErrorElement is the element displayed when an element managed by ReactLocation fails to render for any reason.
 */
export type ErrorElement = FC;

import React, { FC, ReactElement } from "react";
import { LocationManager } from "../LocationManager";

interface Props {
  basename?: string;
  maxAge?: number;
  unresponsiveMs?: number;
  pendingMs?: number;
}

/**
 * A Filesystem is Octobox's router. It's root is /src/windows/. Read the docs for more information.
 *
 * @param basename <ul>
 *   <li>
 *     basename - The basename of a Filesystem is the path of the root relative to the origin. For example, if you have an Octobox app at www.example.com, the basename can be undefined. If you have your app hosted at www.example.com/about, set the basename to "about". The default is undefined.
 *   </li>
 *   <li>
 *     unresponsiveMs - The time between when link is clicked and the pending UI of the link to render. This is useful if you don't want your pending UI to show up every time a Window takes some time to load, but still want it to show up if the Window takes a long time to load. Set to Infinity to disable. The default is 500ms.
 *   </li>
 *   <li>
 *      pendingMs - The amount of time pending UI must be shown before loading a new Window. This is useful to prevent "flashes", where a Window might load quickly and the pending UI is only on screen for a few milliseconds. This is measured from the click of a link, therefore the actual time will be <em>pendingMs - unresponsiveMs</em>. Set to 0 to disable. The default is 1000ms before subtracting the unresponsive time.
 *   </li>
 *   <li>
 *      maxAge - The maximum time a Window can be preloaded for. Rendered Anchors can preload Windows, loading their elements and meta and calling their loaders. This data will then be cached for however long the maximum age is, so if a user clicks that Anchor within the timeframe the Window will load instantly. The default is Infinity, which means Windows will be cached forever.
 *   </li>
 * </ul>
 * @constructor
 */
export const Filesystem: FC<Props> = ({ basename, unresponsiveMs, pendingMs, maxAge }): ReactElement => {
  const loc = new LocationManager(basename, maxAge, unresponsiveMs, pendingMs);
  loc.update();
  return (
    <React.Fragment>
      {loc.router}
    </React.Fragment>
  );
};

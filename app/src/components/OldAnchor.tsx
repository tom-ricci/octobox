import React, { FC, ReactElement, useEffect, useMemo } from "react";
import { Link, LinkProps, matchRoutes, renderMatches, useResolvedPath } from "react-router-dom";
import { useBasename, useRouteConfiguration, useWindows } from "./OldFilesystem";
import ReactDOM from "react-dom/client";

interface Props extends LinkProps {
  prefetch?: boolean
}

interface MemoryProps {
  children?: React.ReactNode;
}

/**
 * A wrapper for React Router's Link allowing Octobox to prefetch routes based on where a user may navigate next, increasing performance.
 * @constructor
 */
export const OldAnchor: FC<Props> = ({ children, to, prefetch, ...props }): ReactElement => {
  prefetch = prefetch ?? true;
  if(prefetch) {
    // first of all, get all the data we need
    const config = useRouteConfiguration();
    let path = useResolvedPath(to).pathname;
    const basename = useBasename();
    const windows = useWindows();
    // then, resolve the queue
    // the queue is an array of functions which, once called, dynamically import each component. this then prefetches each component.
    const queue = useMemo(() => {
      path = basename === "" ? path : `/${basename}${path}`;
      const resolution = matchRoutes([config], path, `/${basename}`);
      let dir = "";
      if(resolution !== null) {
        for(const obj of resolution) {
          if(obj.route.path !== undefined) {
            dir += `${obj.route.path}/`;
          }
        }
      }
      // TODO: we need to rethink how routes will be defined. this must encompass rendering, meta, preloading, data fetching, data mutation, and dx
      console.log(resolution);
      const elem = renderMatches(resolution);
      // if(!dir.startsWith("/")) {
      //   dir = `/${dir}`;
      // }
      // if(!dir.endsWith("/")) {
      //   dir = `${dir}/`;
      // }
      // dir = dir.replaceAll(":", "$");
      // dir = dir.replaceAll("*", "wildcard");
      // dir = `/src/windows${dir}`;
      const queue: (() => Promise<{[p: string]: any}>)[] = [];
      // for(let i = 0; i < windows.length; i++) {
      //   const window = windows[i];
      //   if(window[0].includes(`${dir}Window.tsx`)) {
      //     queue.push(windows[i][1]);
      //   }
      // }
      // for(let i = 0; i < windows.length; i++) {
      //   const window = windows[i];
      //   if(window[0].includes(`${dir}default/Window.tsx`)) {
      //     queue.push(windows[i][1]);
      //   }
      // }
      return queue;
    }, [ config, path, basename, windows ]);
    useEffect(() => {
      for(const window of queue) {
        console.log(window);
        window().catch(console.error);
      }
    }, [queue]);
  }
  return (
    <React.Fragment>
      <Link to={to} {...props}>
        {children}
      </Link>
    </React.Fragment>
  );
};

const MemoryComponent: FC<MemoryProps> = (): ReactElement => {
  return (
    <React.Fragment>

    </React.Fragment>
  );
};
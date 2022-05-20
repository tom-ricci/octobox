import React, { FC, ReactElement } from "react";
import { LinkProps, useLoadRoute, Link } from "@tanstack/react-location";
import { useCheckUrl } from "../useCheckUrl";
import { LocationManager } from "../LocationManager";
import { useReload } from "./useReload";

/**
 * The Preload enumerator determines when an Anchor will preload its
 */
export enum Preload {
  RENDER,
  HOVER,
  NEVER
}

export interface DynamicAnchorProps extends LinkProps {
  preload?: Preload;
}

export interface StaticAnchorProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  static?: boolean;
  to: string;
}

export type Props = DynamicAnchorProps | StaticAnchorProps;

/**
 * An Anchor is a link or anchor tag. It supports both client-side JavaScript routing and static routing if the "static" prop is passed. The "to" prop is the equavilent of the "href" attribute in HTML anchor tags; it's your link's destination. Preloading is set to happen at render by default, but this can be changed with the "preload" prop.
 * @param props
 * @constructor
 */
export const Anchor: FC<Props> = (props): ReactElement => {
  if("static" in props && props.static) {
    // just render a normal anchor tag and tell it to reload on click. this is required for static routing
    return (
      <React.Fragment>
        <a href={props.to} onClick={useReload}>
          {props.children}
        </a>
      </React.Fragment>
    );
  }else if(typeof props.to === "string" && useCheckUrl(props.to)) {
    // if someone puts a valid static url without it being static, we need to make sure it doesn't get sent to RL's link (because RL doesn't support it)
    throw new Error("Static link was found but no static prop provided (or the static prop was false)!");
  }else{
    // get a mutable version of our props
    const wprops = { ...props };
    // turn off preloading by default
    let preloadOnHover = false;
    if("preload" in wprops) {
      switch(wprops.preload) {
        // if the user wants to preload on render, do that. preloading on render basically just preloads the component when this link is added to the DOM. we also preload on hover here too just in case.
        case Preload.RENDER: {
          useLoadRoute()({ to: wprops.to, search: wprops.search, hash: wprops.hash }, { maxAge: LocationManager.maxage });
          preloadOnHover = true;
          break;
        }
        // if user wants hover, turn preloading on
        case Preload.HOVER: {
          preloadOnHover = true;
          break;
        }
        // just make sure we're setting it to false here, since the default is render
        case Preload.NEVER: {
          preloadOnHover = false;
          break;
        }
        // preload on render if nothing is specified
        default: {
          useLoadRoute()({ to: wprops.to, search: wprops.search, hash: wprops.hash }, { maxAge: LocationManager.maxage });
          preloadOnHover = true;
        }
      }
      // remove our preload prop so we can pass in one of our own. react should prioritize the final preload prop which is ours, but this is a good idea for safety
      delete wprops.preload;
    }else{
      // preload on render if nothing is specified--again
      // sadly we need to use ts-ignore here because typescript wants them to be sure they're not undefined. they can be undefined though, so disabling typescript here is okayish
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useLoadRoute()({ to: wprops.to, search: wprops.search, hash: wprops.hash }, { maxAge: LocationManager.maxage });
      preloadOnHover = true;
    }
    return (
      <React.Fragment>
        {/*render our link, either preloading on hover or not preloading at all*/}
        {preloadOnHover
          ?
          <Link {...wprops} preload={LocationManager.maxage}>
            {props.children}
          </Link>
          :
          <Link {...wprops} preload={0}>
            {props.children}
          </Link>
        }
      </React.Fragment>
    );
  }
};

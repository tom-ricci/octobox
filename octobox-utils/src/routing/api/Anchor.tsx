import React, { FC, ReactElement, ReactNode } from "react";
import { LinkProps, useLoadRoute, Link } from "@tanstack/react-location";
import { useCheckUrl } from "../useCheckUrl";
import { LocationManager } from "../LocationManager";
import { useReload } from "./useReload";
import { Preload } from "./Preload";
import { useDevelopmentModeStatus } from "../../mode/useDevelopmentModeStatus";

export interface DynamicAnchorProps extends Omit<LinkProps, "preload"> {
  preload?: Preload;
  children?: ReactNode;
}

export interface StaticAnchorProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  static?: boolean;
  to: string;
}

export type AnchorProps = DynamicAnchorProps | StaticAnchorProps;

/**
 * An Anchor is a link or anchor tag. It supports both client-side JavaScript routing and static routing if the "static" prop is passed. The "to" prop is the equavilent of the "href" attribute in HTML anchor tags; it's your anchor's destination. Preloading is set to happen at render by default, but this can be changed with the "preload" prop. For other props, see <a href="https://react-location.tanstack.com/docs/api#link">this</a>.
 * @param props
 * @constructor
 */
export const Anchor: FC<AnchorProps> = (props): ReactElement => {
  if("static" in props && props.static) {
    // just render a normal anchor tag and tell it to reload on click. this is required for static routing
    const wprops = { ...props };
    if("href" in wprops) {
      delete wprops.href;
    }
    if("onClick" in wprops) {
      delete wprops.onClick;
    }
    if("static" in wprops) {
      delete wprops.static;
    }
    // this is commented out because it seems like vite can't access static pages in development mode. if i find a way to do this ill uncomment it
    // if(useDevelopmentModeStatus()) {
    //   wprops.to = wprops.to.startsWith("/") ? `/static${wprops.to}` : `/static/${wprops.to}`;
    // }
    return (
      <React.Fragment>
        <AnchorContext.Provider value={false}>
          <a href={wprops.to} onClick={useReload} {...wprops}>
            {props.children}
          </a>
        </AnchorContext.Provider>
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
      case"render": {
        useLoadRoute()({ to: wprops.to, search: wprops.search, hash: wprops.hash }, { maxAge: LocationManager.maxage });
        preloadOnHover = true;
        break;
      }
      // if user wants hover, turn preloading on
      case"hover": {
        preloadOnHover = true;
        break;
      }
      // just make sure we're setting it to false here, since the default is render
      case"never": {
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
      // @ts-ignore
      useLoadRoute()({ to: wprops.to, search: wprops.search, hash: wprops.hash }, { maxAge: LocationManager.maxage });
      preloadOnHover = true;
    }
    return (
      <React.Fragment>
        {/*render our link, either preloading on hover or not preloading at all
           we also need to pass the state for the useAnchorState hook to work, so do that too*/}
        {preloadOnHover
          ?
          <Link {...wprops} preload={LocationManager.maxage}>
            { (state) => makeParentallyAwareLinkChild(state.isActive, props.children)}
          </Link>
          :
          <Link {...wprops} preload={0}>
            { (state) => makeParentallyAwareLinkChild(state.isActive, props.children)}
          </Link>
        }
      </React.Fragment>
    );
  }
};

/**
 * Makes a child of a RL Link element which has the current state of the parent Link (active or not) in context.
 * @param active The state of the Link's activity.
 * @param children The children of the Link.
 * @constructor
 */
const makeParentallyAwareLinkChild = (active: boolean, children: ReactNode): ReactNode => {
  return (
    <React.Fragment>
      <AnchorContext.Provider value={active}>
        {children}
      </AnchorContext.Provider>
    </React.Fragment>
  );
};

/**
 * The context of Link activity used by parentally aware children.
 */
export const AnchorContext = React.createContext(false);

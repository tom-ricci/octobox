import { MetaTags } from "./api/MetaTags";
import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { Outlet, TransitionState, useMatches, useNavigate, useRouter, useResolvePath } from "@tanstack/react-location";
import * as ReactDOM from "react-dom";
import { PermissiveObject, useDevelopmentModeStatus, useUUID } from "octobox-utils";
import { NavigationInstance } from "./NavigationInstance";

/**
 * Represents a compiled version of {@link MetaTags}.
 */
export interface CompiledMetaTags {
  title?: ReactNode;
  links?: CompiledTags;
  meta?: CompiledTags;
}

/**
 * Represents a set of compiled metadata, preferably consisting solely of one type of HTML tag.
 */
interface CompiledTags {
  [x: string]: ReactNode;
}

/**
 * Manages app metadata.
 */
export class MetadataManager {

  public static old: CompiledMetaTags;

  /**
   * Compiles meta tags.
   * @param meta
   * @private
   */
  public static compile(meta: MetaTags): CompiledMetaTags {
    const links: CompiledTags = {};
    const mm: CompiledTags = {};
    // required for prerendering--we need to identify and remove react-based metadata on page load, and we use this attr to do it
    // and it needs to be in an object to avoid an annoying linter error intellij likes to whine about
    const react = {
      react: "true"
    };
    for(const link in meta.links) {
      links[link] = <link {...meta.links[link]} key={useUUID()} {...react}/>;
    }
    for(const m in meta.meta) {
      mm[m] = <meta {...meta.meta[m]} key={useUUID()} {...react}/>;
    }
    const title = <title {...react}>{meta.title}</title>;
    return { title, links, meta: mm };
  }

  /**
   * Makes a document head.
   * @param title
   * @param links
   * @param meta
   */
  public static make(title: ReactNode, links: CompiledTags[], meta: CompiledTags[]): CompiledMetaTags {
    // "flatten" data
    const data: CompiledMetaTags = {};
    if(title !== null && title !== undefined) {
      data.title = title;
    }
    if(links.length > 0) {
      data.links = Object.assign({}, ...links);
    }
    if(meta.length > 0) {
      data.meta = Object.assign({}, ...meta);
    }
    return data;
  }

  /**
   * Manages the head of a document.
   * @constructor
   */
  public static readonly VHead: FC = (): ReactElement => {
    // this isnt related to metadata at all, but it needs to be called here for logical reasons.
    NavigationInstance.nav = useNavigate();
    return (
      <React.Fragment>
        <MetadataManager.RenderingStatusProvider/>
        <Outlet/>
      </React.Fragment>
    );
  };

  /**
   * Provides the rendering status (whether the router is pending or not) to the consumer.
   * @constructor
   */
  public static readonly RenderingStatusProvider: FC = (): ReactElement => {
    const { pending } = useRouter();
    return (
      <React.Fragment>
        <MetadataManager.RenderingStatusConsumer pending={pending}/>
      </React.Fragment>
    );
  };

  /**
   * Consumes the rendering status from the provider and uses it to determine if the head is in need of an update and runs it if so.
   * @param pending
   * @param location
   * @constructor
   */
  public static readonly RenderingStatusConsumer: FC<{pending: TransitionState<any> | undefined}> = ({ pending }): ReactElement => {
    const matches = useMatches();
    // do some match path & status resolution for the compilier
    const matchName = matches[matches.length - 1].pathname.trim().endsWith("/") ? matches[matches.length - 1].pathname.trim() : `${matches[matches.length - 1].pathname.trim()}/`;
    // we ONLY use resolved here because we want to skip over any failed pages--thats on the user, not us
    const matchStatus = matches[matches.length - 1].status === "resolved";
    const match = [matchName, matchStatus];
    let data = useMemo(() => {
      if(pending === undefined) {
        // get data
        let title: ReactNode;
        const links: CompiledTags[] = [];
        const metas: CompiledTags[] = [];
        for(const match of matches) {
          if(match.route !== undefined && match.route !== null) {
            const metam = match.route.meta;
            if(metam !== undefined) {
              const meta = metam.head as CompiledMetaTags;
              if(meta !== undefined) {
                if(meta.title !== undefined) {
                  title = meta.title;
                }
                if(meta.links !== undefined) {
                  links.push(meta.links);
                }
                if(meta.meta !== undefined) {
                  metas.push(meta.meta);
                }
              }
            }
          }
        }
        // flatten & return
        if(title !== undefined || links.length > 0 || metas.length > 0) {
          const m = MetadataManager.make(title, links, metas);
          MetadataManager.old = m;
          return m;
        }else{
          MetadataManager.old = {};
          return {};
        }
      }else{
        return MetadataManager.old;
      }
    }, [pending]);
    data = data ?? MetadataManager.old ?? { title: "Octobox App" };
    return <React.Fragment>
      <MetadataManager.HeadPortal data={data} match={match}/>
      <MetadataManager.HeadPortalCleanup/>
    </React.Fragment>;
  };

  public static readonly HeadPortal: FC<{data: CompiledMetaTags, match: (string | boolean)[]}> = ({ data, match }): ReactElement => {
    // compileMode is used for identifying when the page is fully loaded in the octobox compilier. more info at bottom of file
    const compileMode = checkCompilationStatus();
    return ReactDOM.createPortal((<React.Fragment>
      {data.title !== undefined && data.title}
      {data.links !== undefined && Object.values(data.links)}
      {data.meta !== undefined && Object.values(data.meta)}
      {compileMode && <meta data-jtbuksxfmarnecqwldhigvpyo-mn={match[0]} data-jtbuksxfmarnecqwldhigvpyo-ms={match[1]}/>}
    </React.Fragment>), document.head);
  };

  public static readonly HeadPortalCleanup: FC = (): ReactElement => {
    const elems = document.head.querySelectorAll("[react=true][prerender=true]");
    for(const elem of elems) {
      elem.remove();
    }
    return <React.Fragment/>;
  };

  public static readonly SecondaryHeadPortal: FC = (): ReactElement => {
    // this whole component is used soley for identifying when the page is fully loaded in the compiler. more info at bottom of file
    if(checkCompilationStatus()) {
      // grab the current path according to our location (this works because this is running in a component between the route's parent component and the window, actually)
      let path = useResolvePath()(".");
      path = path.endsWith("/") ? path : `${path}/`;
      const root = document.getElementById("root");
      if(root !== null) {
        // then add the path to the attribute to be scraped by pptr
        const attr = root.getAttribute("data-jtbuksxfmarnecqwldhigvpyo-pn");
        if(attr === null || attr === undefined || path.length > attr.length) {
          root.setAttribute("data-jtbuksxfmarnecqwldhigvpyo-pn", path);
        }
      }
    }
    return <React.Fragment/>;
  };

}

/**
 * Checks whether the app is running in the Octobox compilier or not.
 */
const checkCompilationStatus = (): boolean => {
  const pptr = sessionStorage.getItem("jtbuksxfmarnecqwldhigvpyo");
  return pptr !== null && pptr === "yes" && !import.meta.env.DEV;
};

/*
Compilier Information:
Every time metadata is updated, we include a tag with the path the metadata is being resolved from and the status of the window at that time (whether its loaded or not). This is then used in conjunction with the secondary head portal, which keeps track of the path of the deepest window loaded at the time. This will only run after a window has been fully loaded. Child windows do not count, and as such this may fire a few times before the depest window to be loaded is loaded.

The compilier waits until a meta tag appears with the correct path, the same tag appears with a status of "true", and the root's data attribute is the correct path. Once all three are true, the compilier knows the page's content and metadata has loaded, and will then snapshot the page. This data will then be removed in the final build to not influence scrapers.

This will only ever happen when a local storage value created by pptr exists to indicate the app is being compiled.
 */

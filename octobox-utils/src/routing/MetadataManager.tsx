import { MetaTags } from "./api/MetaTags";
import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { Outlet, TransitionState, useMatches, useRouter } from "@tanstack/react-location";
import * as ReactDOM from "react-dom";
import { useUUID } from "octobox-utils";

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
    for(const link in meta.links) {
      links[link] = <link {...meta.links[link]} key={useUUID()}/>;
    }
    for(const m in meta.meta) {
      mm[m] = <meta {...meta.meta[m]} key={useUUID()}/>;
    }
    const title = <title>{meta.title}</title>;
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
    const data = useMemo(() => {
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
    return <React.Fragment>
      <MetadataManager.HeadPortal data={data}/>
    </React.Fragment>;
  };

  public static readonly HeadPortal: FC<{data: CompiledMetaTags}> = ({ data }): ReactElement => {
    return ReactDOM.createPortal((<React.Fragment>
      {data.title !== undefined && data.title}
      {data.links !== undefined && Object.values(data.links)}
      {data.meta !== undefined && Object.values(data.meta)}
    </React.Fragment>), document.head);
  };

}

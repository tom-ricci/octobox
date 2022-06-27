import { Config } from "../WindowManager";
import { MetaTags } from "../api/MetaTags";
import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { Outlet, TransitionState, useMatches, useRouter } from "@tanstack/react-location";

/**
 * Represents a compiled version of {@link MetaTags}.
 */
export interface CompiledMetaTags {
  title: ReactNode;
  links: ReactNode[];
  meta: ReactNode[];
}

/**
 * Manages app metadata.
 */
export class MetadataManager {

  /**
   * Compiles meta tags.
   * @param meta
   * @private
   */
  public static compile(meta: MetaTags): CompiledMetaTags {
    const links: ReactNode[] = [];
    const mm: ReactNode[] = [];
    for(const link in meta.links) {
      links.push(<link {...meta.links[link]} key={link}/>);
    }
    for(const m in meta.meta) {
      mm.push(<meta {...meta.meta[m]} key={m}/>);
    }
    const title = <title>{meta.title}</title>;
    return { title, links, meta: mm };
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
    useMemo(() => {
      if(pending === undefined) {
        // get data
        const metas: CompiledMetaTags[] = [];
        for(const match of matches) {
          if(match.route !== null) {
            metas.push(match.route.meta!.head as CompiledMetaTags);
          }
        }
        // "flatten" data
        // TODO: meta
      }
    }, [pending]);
    return <React.Fragment/>;
  };

}

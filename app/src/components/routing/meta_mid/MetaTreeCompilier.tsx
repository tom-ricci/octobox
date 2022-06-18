import React, { useMemo } from "react";
import { MetaRoute } from "./MetaRoute";
import { ReactNode } from "react";
import { MetaTags } from "../api/MetaTags";
import { useUUID } from "octobox-utils";

/**
 * Compiles a Metadata tree in the form of a MetaRoute to JSX lazily.
 */
export class MetaTreeCompilier {

  private static _compiled: ReactNode = <React.Fragment/>;

  static get compiled() {
    return this._compiled;
  }

  /**
   * Compile the tree.
   * @param tree
   */
  public static compile(tree: MetaRoute) {
    this._compiled = this.compileSegment(tree);
  }

  /**
   * Compile each segment of the tree. All data, down to the individual tags themselves, are memoized. They will be recomputed if and only if they have changed to provide the fastest compilation possible.
   * @param tree
   */
  public static compileSegment(tree: MetaRoute): ReactNode {
    // memoize the tree
    return useMemo(() => {
      // memoize the current segment
      let segment: ReactNode = <React.Fragment/>;
      if(tree.meta !== undefined && tree.meta.tags !== undefined) {
        segment = this.transformSegment(tree);
      }
      // memoize all children
      let children: ReactNode = <React.Fragment/>;
      if(tree.children !== undefined) {
        children = useMemo(() => {
          return tree.children?.map(value => {
            return useMemo(() => {
              return this.compileSegment(value);
            }, [value]);
          });
        }, [tree.children]);
      }
      // return JSX, this will serve as a "tree" of sorts because there will only ever be a div wrapping child components. when we see a div, its home to a child. we then flatten this later for rendering
      return (
        <React.Fragment>
          { segment }
          { Array.isArray(children) ?? (children as []).map(value => <div key={useUUID()}>{value}</div>) }
        </React.Fragment>
      );
    }, [tree]);
  }

  /**
   * Simply does the actual job of compiling.
   * @param tree
   * @private
   */
  private static transformSegment(tree: MetaRoute): ReactNode {
    // memoize the current resolution
    return useMemo(() => {
      const tags: MetaTags = tree.meta?.tags as MetaTags;
      // memoize title
      const title = useMemo(() => {
        return <title>{tags.title as string ?? ""}</title>;
      }, [tree]);
      let links: ReactNode[] = [];
      if(tags.links !== undefined) {
        // memoize links
        links = useMemo(() => {
          return tags.links!.map(value => {
            // memoize each link
            return useMemo(() => {
              return <link {...value}/>;
            }, [value]);
          });
        }, [tags.links]);
      }
      let meta: ReactNode[] = [];
      if(tags.meta !== undefined) {
        // memoize meta
        meta = useMemo(() => {
          return tags.meta!.map(value => {
            // memoize each meta tag
            return useMemo(() => {
              return <meta {...value}/>;
            }, [value]);
          });
        }, [tags.meta]);
      }
      // return all the tags
      return (
        <React.Fragment>
          {title}
          {links}
          {meta}
        </React.Fragment>
      );
    }, [tree.meta?.tags]);
  }

}
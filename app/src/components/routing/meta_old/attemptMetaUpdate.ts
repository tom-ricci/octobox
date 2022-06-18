import { RouteMatch, useMatches, useRouter } from "@tanstack/react-location";
import { MetaTags } from "../api/MetaTags";
import { MetaQueueManager } from "./MetaQueueManager";


/**
 * When called, this will attempt to update the metadata of the page to the current metadata. If the metadata didn't change, it will still function properly.
 */
export const attemptMetaUpdate = (matches: RouteMatch[], id: string) => {
  // grab the tags from the matches
  const tags = matches.map((match) => {
    if(match.route.meta !== null && match.route.meta !== undefined) {
      return match.route.meta.tags as Promise<Promise<MetaTags>>;
    }else{
      return (async (): Promise<Promise<MetaTags>> => {
        return new Promise((resolve, reject): MetaTags => {
          return {};
        });
      })();
    }
  });
  // queue them to be updated
  MetaQueueManager.manager.resolve(tags, id);
};

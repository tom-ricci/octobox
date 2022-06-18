import React, { FC, ReactElement } from "react";
import { RouteMatch, RouterInstance } from "@tanstack/react-location";
import { attemptMetaUpdate } from "./attemptMetaUpdate";
import { useUUID } from "octobox-utils";
import { MetaQueueManager } from "./MetaQueueManager";

interface Props {
  matches: RouteMatch[];
}

/**
 * Prepares metadata APIs to process and potentially render new metadata.
 * @param matches
 * @constructor
 */
export const MetaUpdatePreparer: FC<Props> = ({ matches }): ReactElement => {
  if(matches.length > 0) {
    const id = useUUID();
    MetaQueueManager.manager.id = id;
    attemptMetaUpdate(matches, id);
  }
  return (
    <React.Fragment>

    </React.Fragment>
  );
};

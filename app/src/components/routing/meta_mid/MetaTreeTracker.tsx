import React, { FC, ReactElement } from "react";
import { MetaTreeTrackerConsumer } from "./MetaTreeTrackerConsumer";
import { MetaTree } from "./MetaTree";
import { Outlet } from "@tanstack/react-location";

interface Props {

}

/**
 * Tracks metadata for changes and provides it to the MetaTreeTrackerConsumer
 * @constructor
 */
export const MetaTreeTracker: FC<Props> = (): ReactElement => {
  const meta = MetaTree.tree;
  return (
    <React.Fragment>
      <MetaTreeTrackerConsumer meta={meta}/>
      <Outlet/>
    </React.Fragment>
  );
};

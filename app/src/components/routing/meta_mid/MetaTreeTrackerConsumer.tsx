import React, { FC, ReactElement } from "react";
import { MetaRoute } from "./MetaRoute";
import { MetaTreeCompilier } from "./MetaTreeCompilier";

interface Props {
  meta: MetaRoute;
}

/**
 * Consumes the data provided by the MetaTreeTracker and compiles it lazily.
 * @param meta
 * @constructor
 */
export const MetaTreeTrackerConsumer: FC<Props> = ({ meta }): ReactElement => {
  console.log(meta);
  // MetaTreeCompilier.compile(meta);
  return (
    <React.Fragment>

    </React.Fragment>
  );
};

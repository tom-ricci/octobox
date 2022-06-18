import React, { FC, ReactElement } from "react";
import { Outlet, useRouter } from "@tanstack/react-location";
import { MetaUpdatePreparer } from "./MetaUpdatePreparer";

interface Props {

}

/**
 * Keeps track of the metadata currently defined in the app.
 * @constructor
 */
export const MetaTracker: FC<Props> = (): ReactElement => {
  const router = useRouter();
  return (
    <React.Fragment>
      <MetaUpdatePreparer matches={router.state.matches}/>
      <Outlet/>
    </React.Fragment>
  );
};

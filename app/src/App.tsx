import React, { FC, ReactElement } from "react";
import { Filesystem } from "./components/routing/api/Filesystem";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Filesystem/>
    </React.Fragment>
  );
};
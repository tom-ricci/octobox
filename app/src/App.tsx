import React, { FC, ReactElement } from "react";
import { Filesystem } from "./components/Filesystem";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Filesystem/>
    </React.Fragment>
  );
};

import React, { FC, ReactElement } from "react";
import { Filesystem } from "octobox-utils";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Filesystem basename={"sussy"}/>
    </React.Fragment>
  );
};

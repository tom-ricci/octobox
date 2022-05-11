import React, { FC, ReactElement } from "react";
import { OldFilesystem } from "./components/OldFilesystem";
import { WindowManager } from "./components/routing/WindowManager";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  new WindowManager().renderable();
  return (
    <React.Fragment>
      {/*<OldFilesystem basename={""}/>*/}
    </React.Fragment>
  );
};

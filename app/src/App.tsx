import React, { FC, ReactElement } from "react";
import { OldFilesystem } from "./components/OldFilesystem";
import { WindowManager } from "./components/routing/WindowManager";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  const wm = new WindowManager();
  wm.renderable();
  console.log(wm.configuration);
  return (
    <React.Fragment>
      {/*<OldFilesystem basename={""}/>*/}
    </React.Fragment>
  );
};

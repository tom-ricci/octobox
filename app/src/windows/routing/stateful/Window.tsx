import React, { FC, ReactElement } from "react";
import { CompilierConfig } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/stateful</p>
      <p>This window's anchor changes styles based on whether it's active (whether the window it links to is rendered). You can use a component-based way to do this, or you can make your own component and use a hook to access the state of the anchor's activity.</p>
      <p className={"pt-3"}>Take a look at the sidebar to see this change take effect.</p>
    </React.Fragment>
  );
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;

import React, { FC, ReactElement } from "react";
import { CompilierConfig } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/awholenewworld</p>
      <p>If you noticed, you were just redirected. Octobox supports programmatic navigation, meaning you can render a component or call a hook and it'll take the user somewhere automatically. In this case, you clicked on <code className={"bg-gray-800 rounded text-white px-1.5 py-0.5"}>/redirect</code> which loaded a window. That window contained a redirect component that brought you to this window when it rendered.</p>
    </React.Fragment>
  );
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;

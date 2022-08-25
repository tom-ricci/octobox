import React, { FC, ReactElement } from "react";
import { CompilierConfig, Spacer, WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"p-5"}>
        <Spacer height={"2rem"}/>
        <h2 className={"text-5xl"}>QOL</h2>
        <Spacer height={"1rem"}/>
        <hr/>
        <Spacer height={"1rem"}/>
        <p>Octobox has a lot of Quality-Of-Life features besides routing.</p>
      </div>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "QOL",
    }
  };
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;

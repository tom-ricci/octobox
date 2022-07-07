import React, { FC, ReactElement } from "react";
import { Spacer, WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"p-5"}>
        <Spacer height={"2rem"}/>
        <h2 className={"text-5xl"}>About</h2>
        <Spacer height={"1rem"}/>
        <hr/>
        <Spacer height={"1rem"}/>
        <p>Octobox is a React meta framework.</p>
      </div>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "About",
    }
  };
};

export default Window;

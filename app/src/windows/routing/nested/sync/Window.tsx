import React, { FC, ReactElement } from "react";
import { WindowLoader } from "octobox-utils";
import { useLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { parent, child } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/sync</p>
      <p>This component has a data loader which was executed <em>in sync</em>. It waited for its parent loader to execute before executing so it could access its data. It has access to its parent <span className={"font-mono"}>/nested</span>'s data ({ parent as number }) and access to its own data ({ child as number }). In this demo, it's under <span className={"font-mono"}>/nested</span> because <span className={"font-mono"}>/routing</span> doesn't have a data loader.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async (data) => {
  return { parent: data?.sync, child: 2 };
};

export default Window;

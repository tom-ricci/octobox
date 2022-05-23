import React, { FC, ReactElement } from "react";
import { WindowLoader } from "../../../../components/routing/api/Loaders";
import { useLoader } from "../../../../components/routing/api/useLoader";
import { useMatch } from "@tanstack/react-location";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { parent, child } = useLoader("parent", "child");
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/child</p>
      <p>This component has a data loader which was executed <em>in sync</em>. It waited for its parent loader to execute before executing so it could access its data. It has access to <span className={"font-mono"}>/span</span>'s data ({ parent as number }) and access to its own data ({ child as number }).</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = (data) => {
  return { parent: data?.sync, child: Date.now() };
};

export default Window;

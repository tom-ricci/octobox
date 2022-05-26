import React, { FC, ReactElement } from "react";
import { WindowLoader } from "../../../../components/routing/api/Loaders";
import { useLoader } from "../../../../components/routing/api/useLoader";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { parent, child } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/sync</p>
      <p>This component has a data loader which was executed <em>in sync</em>. It waited for its parent loader to execute before executing so it could access its data. It has access to its parent <span className={"font-mono"}>/nested</span>'s data ({ parent as number }) and access to its own data ({ child as number }). It needs to be under <span className={"font-mono"}>/nested</span> because the <span className={"font-mono"}>/routing</span> doesn't have a data loader.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = (data) => {
  return { parent: data?.sync, child: Date.now() };
};

export default Window;

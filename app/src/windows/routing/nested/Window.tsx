import React, { FC, ReactElement } from "react";
import { Outlet } from "octobox-utils";
import { useLoader } from "octobox-utils";
import { WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { sync } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/nested</p>
      <p className={"pb-3"}>This component is the parent of the component below. It has a data loader returning the value { sync as number }.</p>
      <hr className={"pb-3"}/>
      <Outlet/>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return { sync: 1 };
};

export default Window;

import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";
import { useLoader } from "../../../components/routing/api/useLoader";
import { WindowLoader } from "../../../components/routing/api/Loaders";

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
  return { sync: Date.now() };
};

export default Window;

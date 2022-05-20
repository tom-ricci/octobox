import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";
import { Anchor, Preload } from "../components/routing/api/Anchor";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>bunger!</h1>
      <Anchor to={"bucket"}>LINK!!</Anchor>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

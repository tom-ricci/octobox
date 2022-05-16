import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {

  return (
    <React.Fragment>
      <h1>about</h1>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

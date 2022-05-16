import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div>bucket of parent</div>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

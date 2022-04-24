import React, { FC, ReactElement } from "react";
import { Outlet } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>bucket</h1>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

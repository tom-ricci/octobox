import React, { FC, ReactElement } from "react";
import { Link, Outlet } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>bunger!</h1>
      <Link to={"/"}>HOMEEEEe</Link>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

import React, { FC, ReactElement, useEffect, useMemo } from "react";
import { Link, matchRoutes, Outlet, useResolvedPath } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {

  return (
    <React.Fragment>
      <h1>about</h1>
      <Link to={"sussy"}>SUSSY</Link>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

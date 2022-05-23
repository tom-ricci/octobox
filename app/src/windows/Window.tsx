import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";
import { Anchor } from "../components/routing/api/Anchor";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"p-5 bg-fuchsia-500"}>
        <Anchor to={"/"} className={"flex items-center justify-start"}>
          <h1 className={"text-white text-lg font-bold align-middle"}>Octotest</h1>
        </Anchor>
      </div>
      <div>
        <Outlet/>
      </div>
    </React.Fragment>
  );
};

export default Window;

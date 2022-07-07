import React, { FC, ReactElement } from "react";
import { Outlet } from "octobox-utils";
import { Anchor } from "octobox-utils";
import { WindowLoader } from "octobox-utils";

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

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "Octotest",
      meta: {
        description: {
          name: "description",
          content: "Octotest is Octobox's test application."
        },
        author: {
          name: "author",
          content: "Thomas Ricci"
        }
      }
    }
  };
};

export default Window;

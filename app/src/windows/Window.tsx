import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";
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
      title: "title1",
      links: {
        foo: {
          href: "https://google.com"
        },
        bar: {
          href: "https://bing.com"
        },
        baz: {
          href: "https://duck.com"
        }
      },
      meta: {
        foo: {
          name: "description",
          content: "a really cool description"
        },
        bar: {
          name: "author",
          content: "me"
        },
        baz: {
          name: "keywords",
          content: "yes i am a man not a cow want to go skateboards"
        }
      }
    }
  };
};

export default Window;

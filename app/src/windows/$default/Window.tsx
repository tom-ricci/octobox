import React, { FC, ReactElement } from "react";
import { Spacer } from "octobox-utils";
import { Anchor } from "../../components/routing/api/Anchor";
import { Preload } from "../../components/routing/api/Preload";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"p-5"}>
        <Spacer height={"2rem"}/>
        <h2 className={"text-5xl text-center"}>Hi, I'm Octotest!</h2>
        <Spacer height={"2rem"}/>
        <p className={"text-center"}>Click one of my links to see what I can do. Features are categorized into Quality-Of-Life or Routing.</p>
        <Spacer height={"2rem"}/>
        <div className={"flex justify-center items-center w-full gap-4"}>
          <Anchor to={"qol"} className={"flex-grow bg-fuchsia-500 w-full aspect-square rounded-xl flex flex-col justify-center items-center text-4xl text-white text-center font-mono"}>
            /qol
          </Anchor>
          <Anchor to={"routing"} className={"flex-grow bg-fuchsia-500 w-full aspect-square rounded-xl flex flex-col justify-center items-center text-4xl text-white text-center font-mono"}>
            /routing
          </Anchor>
          <Anchor to={"about"} className={"flex-grow bg-fuchsia-500 w-full aspect-square rounded-xl flex flex-col justify-center items-center text-4xl text-white text-center font-mono"}>
            /about
          </Anchor>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Window;

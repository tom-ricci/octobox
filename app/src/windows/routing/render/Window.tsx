import React, { FC, ReactElement } from "react";
import { CompilierConfig, WindowLoader } from "octobox-utils";
import { useLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { time } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/render</p>
      <p>This window was prefetched <em>on render</em>. That means Octobox loaded up this window the moment its anchor tag loaded, and cached the results. Assuming you clicked this link a few milliseconds after the anchor loaded, you shouldn't see a loading screen. Prefetching happens asynchronously, so it never blocked any content from rendering either.</p>
      <p className={"pt-3"}>Another great feature of Octobox is its data loaders&mdash;the epoch at the time of execution, { time as number }, was loaded using a loader function which Octobox prefetched and cached too. Octobox executes and caches loaders in parallel and synchronously, allowing you to avoid render+fetch chains unless you need them.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  const time = Date.now();
  const element = document.getElementById("render-change");
  if(element !== undefined && element !== null) {
    element.innerText = "fe56d0ba1ab759a2d0fbb9d8365a4ed3";
  }
  return { time };
};

export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};

export default Window;

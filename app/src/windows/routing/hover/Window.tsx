import React, { FC, ReactElement } from "react";
import { WindowLoader, WindowUnloader } from "../../../components/routing/api/Loaders";
import { useLoader } from "../../../components/routing/api/useLoader";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { time } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/hover</p>
      <p>This window was prefetched <em>on hover</em>. Octobox waited for you to hover over the anchor that brought you here before prefetching. The data loader (which is the same as render's loader) waited too. Its value is { time as number }.</p>
      <p className={"pt-3"}>This window has an unloader function too, which executes asynchronously when the loader cache is cleared. This function usually cleans up side effects, but since there are none in this example we're just telling you about it. You can make it run however if you edit this demo.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  const time = Date.now();
  return { time };
};

export const Unloader: WindowUnloader = async () => {
  console.log("Unloaded!");
};

export default Window;

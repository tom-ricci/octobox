import React, { FC, ReactElement } from "react";
import { WindowLoader } from "octobox-utils";
import { useLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { time } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/never</p>
      <p>This window was never prefetched, and Octobox waited for you to click the link to fetch and load it, although Octobox did cache it. Its loader returned { time as number }.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  const time = Date.now();
  return { time };
};

export default Window;

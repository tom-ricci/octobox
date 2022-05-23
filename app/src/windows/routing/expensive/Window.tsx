import React, { FC, ReactElement } from "react";
import { WindowLoader } from "../../../components/routing/api/Loaders";
import { useSleep } from "octobox-utils";
import { useLoader } from "../../../components/routing/api/useLoader";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { data } = useLoader("data");
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/expensive</p>
      <p>This window is expensive, has no prefetching, and showed a spinner before loading (unless it was cached). Pending UI only show up once a window has passed the minimum unresponsive timeout (500 ms by default). Since this is so expensive, it passes the unresponsive timeout and loads some pending UI until it's ready.</p>
      <p className={"pt-3"}>Its so expensive because it has a data loader that takes 5000 milliseconds to finish, returning "{ data as string}". </p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  await useSleep(5000);
  return { data: "I'm expensive!" };
};

export default Window;

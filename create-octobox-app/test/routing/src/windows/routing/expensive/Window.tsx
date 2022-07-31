import React, { FC, ReactElement } from "react";
import { WindowLoader } from "octobox-utils";
import { useSleep } from "octobox-utils";
import { useLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { data } = useLoader();
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/expensive</p>
      <p>This window is expensive, has no prefetching, and showed a spinner before loading (unless it was cached). Pending UI only show up once a window has passed the minimum unresponsive timeout (500 ms by default). Since this is so expensive, it passes the unresponsive timeout and loads some pending UI until it's ready.</p>
      <p className={"pt-3"}>Its so expensive because it has a data loader that takes 5000 milliseconds to finish, returning "{ data as string}". </p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  const element = document.getElementById("render-change");
  if(element !== undefined && element !== null) {
    element.innerText = "8c2c041692b7f2dd4e665084b55cc1c9";
  }
  await useSleep(5000);
  if(element !== undefined && element !== null) {
    element.innerText = "5144ed130176a9c9bdca9b1fb1e283fc";
  }
  return { data: "I'm expensive!" };
};

export default Window;

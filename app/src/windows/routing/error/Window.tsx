import React, { FC, ReactElement } from "react";
import { WindowLoader } from "../../../components/routing/api/Loaders";
import { Anchor } from "../../../components/routing/api/Anchor";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/error</p>
      <p>This window wasn't supposed to load, and was designed to throw an error and force the error component to load. This <em>does</em> work sometimes, but it's not possible without breaking the whole demo. There's an issue about this <Anchor className={"text-fuchsia-600"} to={"https://github.com/TanStack/react-location/issues/255"} static={true}>here</Anchor>, but until that gets fixed we can't show this feature off (unless you manage to break the demo yourself 😉).</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  throw new Error("Error component error, nothing to see here.");
};

export default Window;

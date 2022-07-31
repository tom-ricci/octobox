import React, { FC, ReactElement } from "react";
import { WindowLoader } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/meta</p>
      <p className={"pb-3"}>Octobox supports updating the document head and metadata. Check the devtools to see the head update in real time as you traverse between this route and others.</p>
      <p>Metadata is returned by data loaders, so it follows the same rules as loaders. Metadata will always wait until all loaders have resolved before updating. It will also cascade, so if a loader and its child return a similar meta tag the child will override that specific tag.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "Routing - Metadata Demo",
      meta: {
        description: {
          name: "description",
          content: "The Metadata Demo shows how the document head can be managed by Octobox."
        }
      }
    }
  };
};

export default Window;

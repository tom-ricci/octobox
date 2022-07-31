import React, { FC, ReactElement } from "react";
import { RedirectComponent } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p>Redirecting...</p>
      <RedirectComponent to={"../awholenewworld"}/>
    </React.Fragment>
  );
};

export default Window;

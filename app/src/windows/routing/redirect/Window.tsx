import React, { FC, ReactElement } from "react";
import { Redirect } from "../../../components/routing/api/Redirect";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p>Redirecting...</p>
      <Redirect to={"../awholenewworld"}/>
    </React.Fragment>
  );
};

export default Window;
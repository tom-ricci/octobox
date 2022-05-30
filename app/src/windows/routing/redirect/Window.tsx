import React, { FC, ReactElement } from "react";
import { Navigation } from "../../../components/routing/api/Navigation";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Navigation to={"../awholenewworld"}/>
    </React.Fragment>
  );
};

export default Window;

import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Router, appBasename } from "./Router";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <BrowserRouter basename={appBasename}>
        {/* Add components which aren't routed here */}
        <Router/>
        {/* Add components which aren't routed here */}
      </BrowserRouter>
    </React.Fragment>
  );
};

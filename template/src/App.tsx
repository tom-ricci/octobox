import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";

interface Props {

}

// TODO: npm build, give this a name, move all scripts into name.config.js

export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <BrowserRouter>
        {/* Add components which aren't routed here */}
        <Routes/>
        {/* Add components which aren't routed here */}
      </BrowserRouter>
    </React.Fragment>
  );
};

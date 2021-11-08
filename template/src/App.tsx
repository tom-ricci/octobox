import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";

interface Props {

}

// TODO: make static 404 page and replace static.html with it, use this for routing https://github.com/rafgraph/spa-github-pages
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

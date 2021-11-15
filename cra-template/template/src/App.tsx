import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Router, appBasename } from "./Router";

interface Props {

}

// TODO: simplify docs
// TODO: add create-octobox-app to this repo
// TODO: readme for create-octobox-app
// TODO: windows bug about file association with js files
// TODO: minify octobox.js
// TODO: replace react branding with octobox
// TODO: supply intellij tsx template in docs
// TODO: update docs with cli and stuff
// TODO: finish docs
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

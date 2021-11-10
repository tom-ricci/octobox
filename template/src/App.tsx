import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";

interface Props {

}

// TODO: scroll restoration component
// TODO: put all framework components inside util dir and hooks in there too
// TODO: make a cli to set package homepage url and seo url
// TODO: update docs with cli and stuff
// TODO: scroll restoration hook in docs
// TODO: if static links dont work with <a> or <Link>, make a static link element
// TODO: simplify docs
// TODO: minify octobox.js
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

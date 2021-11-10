import React, { FC, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

interface Props {

}

// TODO: scroll restoration will work like this - we use effect in router to reset scrolling when the path changes based on a value in a wrapper class of a page component named <Page>. The <Page> component will have two props taking a number or callback returning a number which defines the x and y coordinates the window should scroll to. The props aren't required, and the default values will be 0. The scroll restorer will probably read this value stored in the page by using its state, a ref, or a context in which the scroll position is stored
// TODO: scroll restoration in docs
// TODO: if static links dont work with <a> or <Link>, make a static link element
// TODO: simplify docs
// TODO: minify octobox.js
// TODO: replace react branding with octobox
// TODO: supply intellij tsx template in docs
// TODO: make a cli to set package homepage url and seo url
// TODO: update docs with cli and stuff
// TODO: finish docs
export const App: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <BrowserRouter>
        {/* Add components which aren't routed here */}
        <Router/>
        {/* Add components which aren't routed here */}
      </BrowserRouter>
    </React.Fragment>
  );
};

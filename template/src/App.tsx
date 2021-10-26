import React, { FC, ReactElement } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NotFound } from "./NotFound";
import files from "routes.json";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {

  const location = useLocation();

  const pages = files.routes;

  const routes = Object.keys(pages).map((route) => {
    const path = route.replace(/\/src\/pages|index|\.tsx$/g, "").replace(/\[\.{3}.+\]/, "*").replace(/\[(.+)\]/, ":$1").toLowerCase();
    return { path, component: pages[route].default };
  });

  return (
    <React.Fragment>
      <BrowserRouter>
        <AnimatePresence exitBeforeEnter={true}>
          <Switch location={location} key={location.pathname}>
            {routes.map(({ path, component }) => (
              <Route key={path} path={path} component={component} exact={true}/>
            ))}
            <Route path="*" component={NotFound}/>
          </Switch>
        </AnimatePresence>
      </BrowserRouter>
    </React.Fragment>
  );
};

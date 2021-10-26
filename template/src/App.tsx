import React, { FC, ReactElement } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pages from "pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}";
import { AnimatePresence, motion } from "framer-motion";
import { NotFound } from "./NotFound";

interface Props {

}

export const App: FC<Props> = (): ReactElement => {

  const location = useLocation();

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

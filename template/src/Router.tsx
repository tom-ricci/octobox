import React, { FC, ReactElement, useEffect } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotFound } from "./NotFound";

// routes-begin
// AUTO-GENERATED SECTION - DO NOT EDIT
const routes = null;
const appBasename = "/example";
export { appBasename };
// routes-end

interface Props {

}

export const Router: FC<Props> = (): ReactElement => {

  const renderRoutes = routes !== null;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <React.Fragment>
      <AnimatePresence exitBeforeEnter={true}>
        <Switch>
          {renderRoutes &&
          routes.map(({ path, component }) => (
            <Route key={path} path={`${path}`} component={component} exact={true}/>
          ))}
          <Route key={"notFound"} path="/*" component={NotFound}/>
        </Switch>
      </AnimatePresence>
    </React.Fragment>
  );
};

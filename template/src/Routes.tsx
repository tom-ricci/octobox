import React, { FC, ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotFound } from "./NotFound";

// routes-begin
// AUTO-GENERATED SECTION - DO NOT EDIT
const routes = null;
// routes-end

interface Props {

}

export const Routes: FC<Props> = (): ReactElement => {
  const renderRoutes = routes !== null;
  return (
    <React.Fragment>
      <BrowserRouter>
        <AnimatePresence exitBeforeEnter={true}>
          <Switch>
            {renderRoutes &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            routes.map(({ path, component }) => (
              <Route key={path} path={`${path}`} component={component} exact={true}/>
            ))}
            <Route key={"notFound"} path="/*" component={NotFound}/>
          </Switch>
        </AnimatePresence>
      </BrowserRouter>
    </React.Fragment>
  );
};

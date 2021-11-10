import React, { FC, ReactElement, createContext, Context, useContext, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotFound } from "./NotFound";

// routes-begin
// AUTO-GENERATED SECTION - DO NOT EDIT
const router = null;
const appBasename = "/example"
// routes-end

const scrollRestorationCoordinates = createContext(useState({ x: 0, y: 0 }));

interface RouterProps {

}

interface PageProps {
  children?: ReactElement,
  x?: number,
  y?: number
}

export const Router: FC<RouterProps> = (): ReactElement => {

  const renderRoutes = router !== null;
  const { pathname } = useLocation();

  useEffect(() => {
    const [ coordinates, setCoordinates ] = useContext(scrollRestorationCoordinates);
    window.scrollTo(coordinates.x, coordinates.y);
  }, [pathname]);

  return (
    <React.Fragment>
      <Context.Provider value={scrollRestorationCoordinates}>
        <BrowserRouter basename={appBasename}>
          <AnimatePresence exitBeforeEnter={true}>
            <Switch>
              {renderRoutes &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              router.map(({ path, component }) => (
                <Route key={path} path={`${path}`} component={component} exact={true}/>
              ))}
              <Route key={"notFound"} path="/*" component={NotFound}/>
            </Switch>
          </AnimatePresence>
        </BrowserRouter>
      </Context.Provider>
    </React.Fragment>
  );
};

export const Page: FC<PageProps> = ({ children, x, y }): ReactElement => {
  const finalx = x ?? 0;
  const finaly = y ?? 0;
  const [ coordinates, setCoordinates ] = useContext(scrollRestorationCoordinates);
  setCoordinates({ x: finalx, y: finaly })
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

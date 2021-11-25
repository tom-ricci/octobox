import React, { FC, ReactElement, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
        <Routes>
          {renderRoutes &&
          routes.map(({ path, component }) => (
            <Route key={path} path={`${path}`} element={component}/>
          ))}
          <Route key={"notFound"} path="/*" element={<NotFound/>}/>
        </Routes>
      </AnimatePresence>
    </React.Fragment>
  );
};

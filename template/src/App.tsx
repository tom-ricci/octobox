import React, { FC, ReactElement } from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NotFound } from "./NotFound";
import { Routes } from "./Routes";

interface Props {

}

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

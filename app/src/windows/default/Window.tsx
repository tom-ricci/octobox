import React, { FC, ReactElement } from "react";
import { Link } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>Sussy index</h1>
      <Link to={"about"}>About!</Link>
    </React.Fragment>
  );
};

export default Window;

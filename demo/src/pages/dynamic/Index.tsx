import React, { FC, ReactElement } from "react";
import { Link } from "react-router-dom";

interface Props {

}

const Index: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>This is a dynamic route!</h1>
      <Link to={"../"}>Go home</Link>
    </React.Fragment>
  );
};

export default Index;

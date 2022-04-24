import React, { FC, ReactElement } from "react";
import { useParams } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const params = useParams();
  return (
    <React.Fragment>
      <h1>about some </h1>
      <p>{params.product}</p>
    </React.Fragment>
  );
};

export default Window;

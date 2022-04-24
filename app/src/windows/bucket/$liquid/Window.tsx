import React, { FC, ReactElement } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { liquid } = useParams();
  console.log(liquid);
  // console.log(useSearchParams());
  return (
    <React.Fragment>
      <h1>A liquid! Im very cool and my name is: </h1>
      <p>some {liquid}</p>
    </React.Fragment>
  );
};

export default Window;

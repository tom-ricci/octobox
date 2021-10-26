import React, { FC, ReactElement } from "react";

interface Props {

}

export const NotFound: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>404 Not Found!</h1>
    </React.Fragment>
  );
};

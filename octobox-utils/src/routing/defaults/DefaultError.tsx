import React, { FC, ReactElement } from "react";

export const DefaultError: FC = (): ReactElement => {
  return (
    <React.Fragment>
      <p>An unknown error occoured!</p>
    </React.Fragment>
  );
};

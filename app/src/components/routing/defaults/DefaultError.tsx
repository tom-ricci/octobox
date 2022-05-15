import React, { FC, ReactElement } from "react";

interface Props {

}

export const DefaultError: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p>An unknown error occoured!</p>
    </React.Fragment>
  );
};

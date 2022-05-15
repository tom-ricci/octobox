import React, { FC, ReactElement } from "react";

interface Props {

}

export const DefaultPending: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p>Loading...</p>
    </React.Fragment>
  );
};

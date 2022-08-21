import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/</p>
      <p>Welcome to Octobox's routing demo! Click on one of the links to the side and see what happens.</p>
    </React.Fragment>
  );
};

export default Window;

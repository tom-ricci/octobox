import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"loader-container"}>
        <div className={"loader m-auto"}/>
      </div>
    </React.Fragment>
  );
};

export default Window;

import React, { FC, ReactElement } from "react";
import "./style.css";

export const DefaultError: FC = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"err-c"}>
        <div className={"err"}>
          <p>An unknown error occoured!</p>
        </div>
      </div>
    </React.Fragment>
  );
};

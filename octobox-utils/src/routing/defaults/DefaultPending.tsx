import React, { FC, ReactElement } from "react";
import "./style.css";

export const DefaultPending: FC = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"pend-ccc"}>
        <div className={"pend-cc"}>
          <svg className="pend-c" viewBox="0 0 50 50">
            <circle className="pend" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </div>
      </div>
    </React.Fragment>
  );
};

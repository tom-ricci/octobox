import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/error</p>
      <p>This window isn't any actual route, but rather an error page. This happens when a window fails to load and/or throws an exception while loading.</p>
    </React.Fragment>
  );
};

export default Window;

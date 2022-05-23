import React, { FC, ReactElement } from "react";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/&#42;</p>
      <p>This window isn't any actual route, but rather the 404 page. If no routes match, it'll be loaded instead.</p>
    </React.Fragment>
  );
};

export default Window;

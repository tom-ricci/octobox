import React, { FC, ReactElement } from "react";
import { LocationManager } from "../LocationManager";

interface Props {
  basename?: string
}

export const Filesystem: FC<Props> = ({ basename }): ReactElement => {
  const loc = new LocationManager(basename);
  loc.update();
  console.log(loc.router);
  return (
    <React.Fragment>
      {loc.router}
    </React.Fragment>
  );
};

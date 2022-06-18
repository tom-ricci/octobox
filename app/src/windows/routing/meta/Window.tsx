import React, { FC, ReactElement } from "react";
import { useRouter } from "@tanstack/react-location";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  console.log(useRouter().state.matches);
  return (
    <React.Fragment>
      <p>hjsrrg</p>
    </React.Fragment>
  );
};

export default Window;

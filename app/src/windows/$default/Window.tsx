import React, { FC, ReactElement } from "react";
import { OldAnchor } from "../../components/OldAnchor";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <h1>Sussy index</h1>
      <OldAnchor to={"bucket/liquids"}>About!</OldAnchor>
    </React.Fragment>
  );
};

export default Window;

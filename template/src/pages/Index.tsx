import React, { FC, ReactElement } from "react";
import { Page } from "../Router";

interface Props {

}

const Index: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Page>
        <h1>Hello world!</h1>
      </Page>
    </React.Fragment>
  );
};

export default Index ;
import React, { FC, ReactElement } from "react";
import { useSearch } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { username, password } = useSearch();
  return (
    <React.Fragment>
      <hr className={"pb-3"}/>
      <p className={"font-mono pb-3"}>/results</p>
      <p className={"pb-3"}>Your username is <code>"{username}"</code> and your password is <code>"{password}"</code>.</p>
    </React.Fragment>
  );
};

export default Window;

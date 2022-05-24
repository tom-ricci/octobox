import React, { FC, ReactElement } from "react";
import { useParams } from "../../../../components/routing/api/useParams";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  const { variable } = useParams("variable");
  console.log(variable);
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/:variable</p>
      <p className={"pb-3"}>This is a variable (parameter) window, which can take any value at its position in the path. For example, this window is located at <span className={"font-mono"}>/routing/nested/:variable</span>. Your path is currently <span className={"font-mono"}>/routing/nested/{ variable as string}</span>, so <span className={"font-mono"}>:variable</span> was replaced with <span className={"font-mono"}>{ variable as string}</span>!</p>
      <p className={"pb-3"}>This isn't like a wildcard/404 window however, which will resolve to any unknown route within its scope. Variable windows only resolve to the part of the path they're located in&mdash;a path like <span className={"font-mono"}>/:variableone/:variabletwo</span> resolves one window for <span className={"font-mono"}>:variableone</span> and another window for <span className={"font-mono"}>:variabletwo</span>.</p>
      <p className={"pb-3"}>If you haven't noticed yet, another feature of variable windows is that they can access the values of each path variable. Change the last part of the URL and see what changes in the first paragraph.</p>
    </React.Fragment>
  );
};

export default Window;

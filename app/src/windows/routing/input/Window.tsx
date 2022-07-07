import React, { FC, ReactElement } from "react";
import { Form, Outlet, redirect } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <p className={"font-mono pb-3"}>/input</p>
      <p className={"pb-3"}>Octobox has a custom <code>&lt;Form/&gt;</code> component which sends its results to a callback for processing.</p>
      <hr className={"pb-3"}/>
      <p className={"pb-3"}>After submitting this form, you'll be sent to <code>/routing/input/results</code>.</p>
      <Form handler={async (results) => {
        redirect({ to: "/routing/input/results", search: { username: results.username, password: results.password } });
      }}>
        <label className={"block mb-5 text-gray-800"}>
          Username:
          <input name={"username"} type={"text"} className={"mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:bg-gray-300 focus:border-transparent focus:ring-0"}/>
        </label>
        <label className={"block mb-5 text-gray-800"}>
          Password:
          <input name={"password"} type={"password"} className={"mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:bg-gray-300 focus:border-transparent focus:ring-0"}/>
        </label>
        <button type={"submit"} className={"block mb-5 p-2 block w-36 rounded-md bg-gray-200 border-transparent focus:bg-gray-300 focus:border-transparent focus:ring-0 text-gray-800"}>Submit</button>
      </Form>
      <Outlet/>
    </React.Fragment>
  );
};

export default Window;

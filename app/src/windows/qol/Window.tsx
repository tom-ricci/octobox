import React, { FC, ReactElement } from "react";
import { Form, FormHandler, redirect, Spacer } from "octobox-utils";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {

  const handler: FormHandler = async (results) => {
    console.log(results);
    redirect({ to: "../" });
  };

  return (
    <React.Fragment>
      <div className={"p-5"}>
        <Spacer height={"2rem"}/>
        <h2 className={"text-5xl"}>QOL</h2>
        <Spacer height={"1rem"}/>
        <hr/>
        <Spacer height={"1rem"}/>
        <p>Octobox has a lot of Quality-Of-Life features besides routing.</p>
      </div>
      <Form handler={handler}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="username"
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </Form>
    </React.Fragment>
  );
};

export default Window;

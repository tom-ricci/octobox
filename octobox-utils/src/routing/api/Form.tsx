import React, { FC, FormEventHandler, ReactElement, ReactNode } from "react";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Results are a {@link PermissiveObject} containing {@link Form} input. The keys are the names of the form elements.
 */
export type Results = PermissiveObject

/**
 * FormProps are the props of a {@link Form}. The <code>handler</code> prop is the callback, or {@link FormHandler}, to send the form input to.
 */
export interface FormProps {
  handler: FormHandler;
  children?: ReactNode;
}

/**
 * A FormHandler handles the input, or result, of a form.
 */
export type FormHandler = (results: Results) => Promise<void>;

/**
 * A <code>&#60;Form/></code> is an HTML form which sends its data to a callback when submitted. Do not render a <code>&#60;form/></code> inside a <code>&#60;Form/></code>.
 * @param handler
 * @param children
 * @constructor
 */
export const Form: FC<FormProps> = ({ handler, children }): ReactElement => {

  const ehandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const values: Results = {};
    // for all the elements inside the form, check to see if they contain a name to identify by and if so add them
    // @ts-ignore
    const elements = e.target.elements as Element[];
    for(const element of elements) {
      const name = element.attributes.getNamedItem("name");
      if(name !== null) {
        // @ts-ignore
        values[name.value] = elements[name.value].value;
      }
    }
    // pass the values to the handler, making sure to catch any errors.
    handler(values).catch(console.error);
  };

  return (
    <React.Fragment>
      <form onSubmit={ehandler}>
        {children}
      </form>
    </React.Fragment>
  );
};

import React, { FC, FormEventHandler, ReactElement, ReactNode } from "react";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Results are a {@link PermissiveObject} containing {@link Form} input. The keys are the values of the names of the form elements. Form elements must contain values for their names to show up in this object.
 */
export type Results = PermissiveObject

/**
 * FormProps are the props of a {@link Form}. The <code>handler</code> prop is the callback to send the form input to.
 */
export interface FormProps {
  handler: (results: Results) => Promise<void>;
  children?: ReactNode;
}

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
    // for all the elements inside the form, check to see if they contain a name to identify by and a value
    // @ts-ignore
    const elements = e.target.elements as Element[];
    for(const element of elements) {
      if(element.attributes.getNamedItem("name") !== null && element.attributes.getNamedItem("value") !== null) {
        const name = element.attributes.getNamedItem("name");
        const value = element.attributes.getNamedItem("value");
        if(name !== null && value !== null) {
          // add them to the values to pass to the handler if they do
          values[name.value] = value.value;
        }
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

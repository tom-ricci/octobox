import React, { FC, ReactElement } from "react";

type Unit =  "cm" | "mm" | "in" | "px" | "pt" | "pc" | "em" | "ex" | "ch" | "rem" | "vw" | "vh" | "vmin" | "vmax" | "%";

interface Props extends React.HTMLProps<HTMLDivElement> {
  height?: `${ number }${ Unit }`,
  width?: `${ number }${ Unit }`,
  inline?: boolean
}

/**
 * A Spacer is a component which can have a height and width written in CSS, designed to act as a blank space separating other components. The default height and width is 100%.
 * @constructor
 */
export const Spacer: FC<Props> = ({ height, width, inline, ...props}): ReactElement => {
  const y = height ?? "100%";
  const x = width ?? "100%";
  const i = inline ?? false;
  props.style = props.style ?? {};
  props.style.height = y;
  props.style.width = x;
  if(i) {
    props.style.display = "inline-block";
  }
  return (
    <React.Fragment>
      <div {...props}/>
    </React.Fragment>
  );
};

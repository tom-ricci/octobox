import React, { FC, ReactElement, ReactNode, useContext } from "react";
import { AnchorContext } from "./Anchor";

interface Props {
  children: (state: boolean) => ReactNode
}

/**
 * Returns whether the parent Anchor is active or not. Activity is defined by whether the Window the parent Anchor links to is loaded or not. For example, if you had an Anchor to <code>/about</code> and the user was at <code>/about</code>, this hook would return true when called in one of the Anchor's children. If there is no parent Anchor or it's static, this will always return false.
 */
export const useAnchorState = (): boolean => {
  return useContext(AnchorContext);
};

/**
 * A component-based version of {@link useAnchorState}, requiring a child function with a state argument to pass the state to. It works pretty much like a context consumer.
 * @param children
 * @constructor
 */
export const AnchorState: FC<Props> = ({ children }): ReactElement => {
  return (
    <AnchorContext.Consumer>
      {(s) => {
        return children(s);
      }}
    </AnchorContext.Consumer>
  );
};

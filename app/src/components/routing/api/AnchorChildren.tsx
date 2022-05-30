import React, { FC, ReactElement, ReactNode } from "react";
import { useAnchorState } from "./useAnchorState";

/**
 * An ActiveChild is a child component of an Anchor which will render when the parent Anchor is active. If there's no parent Anchor, it will not render. It uses context, so it does not need to be a direct child of an Anchor.
 * @see InactiveChild
 * @see useAnchorState
 * @param children
 * @constructor
 */
export const ActiveChild: FC<{children?: ReactNode}> = ({ children }): ReactElement => {
  const state = useAnchorState();
  return (
    <React.Fragment>
      {state && children}
    </React.Fragment>
  );
};

/**
 * An InactiveChild is a child component of an Anchor which will render when the parent Anchor is not active. If there's no parent Anchor, it will render. It uses context, so it does not need to be a direct child of an Anchor.
 * @see ActiveChild
 * @see useAnchorState
 * @param children
 * @constructor
 */
export const InactiveChild: FC<{children?: ReactNode}> = ({ children }): ReactElement => {
  const state = useAnchorState();
  return (
    <React.Fragment>
      {!state && children}
    </React.Fragment>
  );
};

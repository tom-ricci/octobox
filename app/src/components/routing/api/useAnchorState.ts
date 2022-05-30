import { useContext } from "react";
import { AnchorContext } from "./Anchor";

/**
 * Returns whether the parent Anchor is active or not. Activity is defined by whether the Window the parent Anchor links to is loaded or not. For example, if you had an Anchor to <code>/about</code> and the user was at <code>/about</code>, this hook would return true when called in one of the Anchor's children. If there is no parent Anchor or it's static, this will always return false.
 * @see ActiveChild
 * @see InactiveChild
 */
export const useAnchorState = (): boolean => {
  return useContext(AnchorContext);
};

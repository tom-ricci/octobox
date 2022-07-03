import { useMatch } from "@tanstack/react-location";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Returns a {@link PermissiveObject} of every param. This is a wrapper around {@link useMatch}; if you wanted to, you could just call <code>{ ...params } = useMatch().params;</code>.
 */
export const useParams = (): PermissiveObject => {
  return useMatch().params;
};

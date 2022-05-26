import { useMatch } from "@tanstack/react-location";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Returns a {@link PermissiveObject} of all keys returned by loaders. This is a wrapper around {@link useMatch}; if you wanted to, you could just call <code>{ ...data } = useMatch().data;</code>.
 */
export const useLoader = (): PermissiveObject => {
  return useMatch().data;
};

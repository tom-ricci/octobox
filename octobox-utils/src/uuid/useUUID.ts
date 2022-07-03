import { v4 } from "uuid";

/**
 * Generates a <a href="https://www.ietf.org/rfc/rfc4122.txt">v4</a> compliant UUID.
 */
export const useUUID = (): string => {
  return v4();
};

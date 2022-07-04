import { BuildNextOptions, DefaultGenerics, useNavigate } from "@tanstack/react-location";

/**
 * This hook allows you to programatically navigate through your application. When called, it will act as if the user clicked an Anchor and will take the user where they want to go as defined by <code>opts</code>'s members.
 * @see RedirectComponent
 */
export const useRedirect = (opts: (BuildNextOptions<DefaultGenerics> & {replace?: boolean | undefined, fromCurrent?: boolean | undefined} & {replace?: boolean | undefined})) => {
  useNavigate()(opts);
};

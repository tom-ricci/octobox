import { BuildNextOptions, DefaultGenerics } from "@tanstack/react-location";
import { NavigationInstance } from "../NavigationInstance";

/**
 * This function allows you to programatically navigate through your application. When called, it will act as if the user clicked an Anchor and will take the user where they want to go as defined by <code>opts</code>'s members. It's different from {@link useRedirect} as it isn't a hook, allowing it to be called anywhere.
 * @see RedirectComponent
 * @see useRedirect
 */
export const redirect = (opts: (BuildNextOptions<DefaultGenerics> & {replace?: boolean | undefined, fromCurrent?: boolean | undefined} & {replace?: boolean | undefined})) => {
  NavigationInstance.nav(opts);
};

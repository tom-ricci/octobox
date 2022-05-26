import { PermissiveObject } from "./PermissiveObject";
import { LoaderData } from "@tanstack/react-location";

/**
 * A Loader defines a Window's asynchronous loader function. Before rendering a Window, this function is called if it exists. Once the Window renders, you can use {@link useLoader} to retrieve the data.
 *
 * Loaders, by default, will execute instantly.
 *
 * To force one to wait until its parent loader (the loader of its Window's parent) has executed, add a data argument to the function. This will tell Octobox to wait for the parent to load and then pass the data returned by the parent to the argument.
 */
export type WindowLoader = (data?: Partial<LoaderData<unknown>>) => Promise<PermissiveObject>;

/**
 * An Unloader defines a Window's unloader function. When a user transitions to another Window, the previous Window's unloader function will be called asynchronously. This is useful if you need to clean up anything after leaving a Window.
 */
export type WindowUnloader = () => Promise<void>;

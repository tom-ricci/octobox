import { PermissiveObject } from "./PermissiveObject";
import { LoaderData } from "@tanstack/react-location";

/**
 * A Loader defines a Window's loader function. Before rendering a Window, this function is called if it exists. Once the Window renders, you can use {@link useLoader} to retrieve the data.
 *
 * Loaders, by default, will wait until its parent loader (the loader of its Window's parent) has executed and pass the data returned by the parent to the optional <code>data</code> argument.
 *
 * If the loader is an async function, the loader won't wait for its parent loader and execute immediately. The data argument will be undefined.
 */
export type WindowLoader = (data?: Partial<LoaderData<unknown>>) => PermissiveObject | Promise<PermissiveObject>;

/**
 * An Unloader defines a Window's unloader function. When a user transitions to another Window, the previous Window's unloader function will be called asynchronously. This is useful if you need to clean up anything after leaving a Window.
 */
export type WindowUnloader = () => Promise<void>;

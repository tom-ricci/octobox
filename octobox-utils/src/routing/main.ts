import * as RL from "@tanstack/react-location";
import { FunctionComponent } from "react";

/**
 * The bundled ReactLocation library.
 */
const ReactLocation = RL;

/**
 * An outlet is a React component which will render a child route. For example, if your URL was <a href="https://example.com/cart/checkout">https://example.com/cart/checkout</a>, and you rendered an <code>&#60;Outlet/&#62;</code> in your cart component, your checkout component would be rendered inside that <code>&#60;Outlet/&#62;</code>.
 */
const Outlet: FunctionComponent = RL.Outlet;

export * from "./api/Anchor";
export * from "./api/AnchorChildren";
export * from "./api/Filesystem";
export * from "./api/Form";
export * from "./api/Loaders";
export * from "./api/MetaTags";
export * from "./api/PermissiveObject";
export * from "./api/PermissiveObjectWithMetadata";
export * from "./api/Preload";
export * from "./api/Redirect";
export * from "./api/RedirectComponent";
export * from "./api/useAnchorState";
export * from "./api/useLoader";
export * from "./api/useParams";
export * from "./api/useRedirect";
export * from "./api/useReload";
export * from "./api/useRoutingInternals";
export * from "./api/useSearch";
export { ReactLocation, Outlet };
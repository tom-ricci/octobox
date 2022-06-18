import { RouteMeta } from "@tanstack/react-location";

export type MetaRoute = {
  path: string;
  meta: RouteMeta<unknown> | undefined;
  children?: MetaRoute[];
}

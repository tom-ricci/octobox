import { useSearch as useRlSearch,  } from "@tanstack/react-location";

/**
 * A PermissiveObjectOfStrings only contains strings, but they can be keyed by strings, numbers, or symbols like a regular {@link PermissiveObject}.
 */
interface PermissiveObjectOfStrings {
  [x: string | number | symbol]: string;
}

/**
 * Exposes the current search params/query. You can access them via <code>useSearch().$\{param\}</code>, where <code>$\{param\}</code> is the param you're looking for. For example, given the query <code>"?cart=empty"</code>, you can access <code>"empty"</code> using <code>useSearch().empty</code>. This hook only exposes the top-level search params; if you're using React Location's JSON params you should use {@link ReactLocation.useSearch()}.
 */
export const useSearch = (): PermissiveObjectOfStrings => {
  return useRlSearch() as PermissiveObjectOfStrings;
};

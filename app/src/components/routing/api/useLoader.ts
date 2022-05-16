import { useMatch } from "@tanstack/react-location";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Returns a {@link PermissiveObject} of all data requested. This is a wrapper around {@link useMatch}; if you wanted to, you could just call <code>{ ...params } = useMatch().data;</code>.
 * @param objects The names of objects returned by loaders functions to get. For example, if you had a loader which returned <code>teams</code> and another loader which returned <code>stats</code>, you'd call <code>useLoader("teams", "stats")</code>, which would return <code>{ teams, stats }</code>.
 */
export const useLoader = (...objects: string[]): PermissiveObject => {
  const loaded: PermissiveObject = {};
  const match = useMatch();
  for(const arg of objects) {
    loaded[arg] = match.data[arg];
  }
  return loaded;
};

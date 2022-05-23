import { useMatch } from "@tanstack/react-location";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Returns a {@link PermissiveObject} of all data requested. This is a wrapper around {@link useMatch}; if you wanted to, you could just call <code>{ ...params } = useMatch().data;</code>.
 * @param keys The keys you want to access. For example, if you had a loader which returned <code>{ teams, players }</code> and another loader which returned <code>{ stats }</code>, you'd call <code>useLoader("teams", "players, "stats")</code>, which would return <code>{ teams, players, stats }</code>.
 */
export const useLoader = (...keys: string[]): PermissiveObject => {
  const loaded: PermissiveObject = {};
  const match = useMatch();
  for(const arg of keys) {
    loaded[arg] = match.data[arg];
  }
  return loaded;
};

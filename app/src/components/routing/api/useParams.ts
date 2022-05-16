import { useMatch } from "@tanstack/react-location";
import { PermissiveObject } from "./PermissiveObject";

/**
 * Returns a {@link PermissiveObject} of all data requested. This is a wrapper around {@link useMatch}; if you wanted to, you could just call <code>{ ...params } = useMatch().params;</code>.
 * @param params The names of params to get. For example, if you had a route which loaded two dynamic windows, <code>:teams/Window.tsx</code> and <code>:stats/Window.tsx</code>, you'd call <code>useParams("teams", "stats")</code>, which would return <code>{ params.teams, params.stats }</code> (AKA. the values of :teams and :stats).
 */
export const useParams = (...params: string[]): PermissiveObject => {
  const loaded: PermissiveObject = {};
  const match = useMatch();
  for(const arg of params) {
    loaded[arg] = match.data[arg];
  }
  return loaded;
};

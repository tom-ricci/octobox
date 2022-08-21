/**
 * Returns true if the application is in development mode and false if it's in production mode. When running the Octobox compilier to prerender windows, this will return false.
 */
export const useDevelopmentModeStatus = (): boolean => {
  return import.meta.env.DEV;
};

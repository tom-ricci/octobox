/**
 * Returns true if the application is in development mode and false if it's in production mode.
 */
export const useDevelopmentModeStatus = (): boolean => {
  return import.meta.env.DEV;
};

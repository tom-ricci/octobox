/**
 * Checks to see if a string is a valid URL.
 * @param url
 */
export const useCheckUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
  } catch(e) {
    return false;
  }
  return true;
};

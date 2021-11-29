/**
 * Waits until a certain number of milliseconds has passed. This is no different than resolving a promise after a timeout, and actually uses that method under the hood. This hook only exists for semantic consistency.
 * @param ms
 */
export const useSleep = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Waits until a certain number of milliseconds has passed. This is no different than resolving a promise of a timeout, and actually uses that method under the hood.
 * @param ms
 */
export declare const useSleep: (ms: number) => Promise<void>;

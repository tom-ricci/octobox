/**
 * Waits until a certain number of milliseconds has passed. This is no different than resolving a promise of a timeout, and actually uses that method under the hood.
 * @param ms
 */
declare const useSleep: (ms: number) => Promise<void>;

/**
 * Scrolls window to specified coordinates or (0,0) if blank
 * @param x
 * @param y
 */
declare const useScrollRestoration: (x?: number | undefined, y?: number | undefined) => void;

export { useScrollRestoration, useSleep };

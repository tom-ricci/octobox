/**
 * Scrolls window to specified coordinates or (0,0) if blank
 * @param x
 * @param y
 */
export const useScrollRestoration = (x?: number, y?: number): void => {
  x = x ?? 0;
  y = y ?? 0;
  window.scrollTo(x, y);
};

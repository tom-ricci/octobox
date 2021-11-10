import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls window to specified coordinates or (0,0) if blank when the current route changes
 * @param x
 * @param y
 */
export const useScrollRestorationOnRouteChange = (x?: number, y?: number): void => {
  x = x ?? 0;
  y = y ?? 0;
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(x, y);
  }, [pathname]);
};

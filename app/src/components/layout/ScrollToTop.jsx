import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 *
 * Place this once inside <Router> in App.jsx.
 * Every time the route changes it instantly scrolls the window back to (0, 0)
 * so the new page always starts from the top.
 *
 * No UI is rendered — this is a behaviour-only component.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface RouteLoadingContextValue {
  isRouteLoading: boolean;
  startRouteLoading: (href?: string) => void;
  stopRouteLoading: () => void;
}

const RouteLoadingContext = createContext<RouteLoadingContextValue | null>(null);

function shouldIgnoreClick(event: MouseEvent) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

export function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const fallbackTimer = useRef<number | null>(null);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimer.current !== null) {
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  const stopRouteLoading = useCallback(() => {
    clearFallbackTimer();
    setIsRouteLoading(false);
  }, [clearFallbackTimer]);

  const startRouteLoading = useCallback(
    (href?: string) => {
      if (typeof window === "undefined") return;

      if (href) {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.origin !== currentUrl.origin ||
          (targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search &&
            targetUrl.hash === currentUrl.hash)
        ) {
          return;
        }
      }

      setIsRouteLoading(true);
      clearFallbackTimer();
      fallbackTimer.current = window.setTimeout(() => {
        setIsRouteLoading(false);
        fallbackTimer.current = null;
      }, 8000);
    },
    [clearFallbackTimer],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(stopRouteLoading);
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, stopRouteLoading]);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      if (shouldIgnoreClick(event) || !(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      startRouteLoading(anchor.href);
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [startRouteLoading]);

  const value = useMemo(
    () => ({ isRouteLoading, startRouteLoading, stopRouteLoading }),
    [isRouteLoading, startRouteLoading, stopRouteLoading],
  );

  return (
    <RouteLoadingContext.Provider value={value}>
      {children}

      {isRouteLoading && (
        <div
          aria-busy="true"
          aria-live="polite"
          className="fixed inset-0 z-[9999] cursor-progress bg-[#3B2414]/10 backdrop-blur-[1px]"
          role="status"
        >
          <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-[#D8C9B4]">
            <div className="route-loading-bar h-full w-1/2 bg-[#7A4A24]" />
          </div>
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-[#3B2414] px-4 py-2 text-sm font-semibold text-[#F6E3C4] shadow-lg">
            Loading...
          </div>
        </div>
      )}
    </RouteLoadingContext.Provider>
  );
}

export function useRouteLoading() {
  const context = useContext(RouteLoadingContext);

  if (!context) {
    throw new Error("useRouteLoading must be used inside RouteLoadingProvider");
  }

  return context;
}

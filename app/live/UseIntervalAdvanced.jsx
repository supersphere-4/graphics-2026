// code from https://react.wiki/hooks/custom-use-interval/
import { useRef, useEffect } from "react";
export function useIntervalAdvanced(callback, options) {
  const {
    delay = 1000,
    enabled = true,
    fireOnMount = false,
    onPause,
    onResume,
  } = options;

  const savedCallbackRef = useRef(callback);
  const previousEnabledRef = useRef(enabled);

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (enabled && fireOnMount) {
      savedCallbackRef.current();
    }
  }, [enabled, fireOnMount]);

  useEffect(() => {
    if (previousEnabledRef.current !== enabled) {
      if (!enabled) {
        onPause?.();
      } else {
        onResume?.();
      }
      previousEnabledRef.current = enabled;
    }
  }, [enabled, onPause, onResume]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      savedCallbackRef.current();
    }, delay);

    return () => clearInterval(intervalId);
  }, [delay, enabled]);
}
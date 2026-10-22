import { useSyncExternalStore } from "react";

/** Acompanha uma media query, ex.: useMidia("(min-width: 900px)") */
export function useMidia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

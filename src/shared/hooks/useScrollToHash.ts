import { useLayoutEffect } from "react";

export const useScrollToHash = () => {
  useLayoutEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const id = hash.slice(1);       

    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block:    "start",
      });
    });
  }, []);
};

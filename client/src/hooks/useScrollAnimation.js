import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollAnimation() {
  const location = useLocation();

  useEffect(() => {
    // Ultra-lightweight IntersectionObserver for zero scroll lag and 60fps performance
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -20px 0px",
    });

    const targets = document.querySelectorAll(
      ".scroll-animate, .scroll-fade-left, .scroll-fade-right, .scroll-scale, .scroll-blur"
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { inView, animate } from "framer-motion";
import gsap from "gsap";

export default function useScrollAnimation() {
  const location = useLocation();

  useEffect(() => {
    const cleanups = [];

    /* ── 1. Base .scroll-animate (fade up) ──────────────── */
    const destroyBase = inView(".scroll-animate", (el) => {
      el.classList.add("visible");
      animate(
        el,
        { opacity: [0, 1], y: [50, 0], scale: [0.96, 1], filter: ["blur(8px)", "blur(0px)"] },
        { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      );
    }, { margin: "0px 0px -40px 0px" });
    cleanups.push(destroyBase);

    /* ── 2. Directional variants ─────────────────────────── */
    const destroyLeft = inView(".scroll-fade-left", (el) => {
      el.classList.add("visible");
      animate(el, { opacity: [0, 1], x: [-60, 0] }, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    }, { margin: "0px 0px -40px 0px" });
    cleanups.push(destroyLeft);

    const destroyRight = inView(".scroll-fade-right", (el) => {
      el.classList.add("visible");
      animate(el, { opacity: [0, 1], x: [60, 0] }, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    }, { margin: "0px 0px -40px 0px" });
    cleanups.push(destroyRight);

    const destroyScale = inView(".scroll-scale", (el) => {
      el.classList.add("visible");
      animate(el, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 1.0, ease: [0.16, 1, 0.3, 1] });
    }, { margin: "0px 0px -40px 0px" });
    cleanups.push(destroyScale);

    const destroyBlur = inView(".scroll-blur", (el) => {
      el.classList.add("visible");
      animate(el, { opacity: [0, 1], filter: ["blur(12px)", "blur(0px)"] }, { duration: 1.0, ease: [0.16, 1, 0.3, 1] });
    }, { margin: "0px 0px -40px 0px" });
    cleanups.push(destroyBlur);

    /* ── 3. Inject once: global anti-gravity init styles ─── */
    const styleId = "global-scroll-reveal-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id    = styleId;
      style.innerHTML = `
        .scroll-reveal-init {
          opacity: 0 !important;
          transform: translateY(60px) scale(0.96) !important;
          filter: blur(8px) !important;
        }
      `;
      document.head.appendChild(style);
    }

    /* ── 4. GSAP luxury cinematic reveal for sections ────── */
    const sectionSelectors = [
      "main > section",
      "main > div > section",
      ".glass-card",
      "article",
    ].join(", ");

    const sections = document.querySelectorAll(sectionSelectors);
    sections.forEach((el) => {
      if (
        el.classList.contains("scroll-animate") ||
        el.closest(".scroll-animate") ||
        el.dataset.animated === "true"
      ) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.85) {
        el.classList.add("scroll-reveal-init");
      }
    });

    const destroyGsap = inView(sectionSelectors, (el) => {
      if (
        el.classList.contains("scroll-animate") ||
        el.closest(".scroll-animate") ||
        el.dataset.animated === "true"
      ) return;
      el.dataset.animated = "true";
      el.classList.remove("scroll-reveal-init");
      gsap.fromTo(
        el,
        { opacity: 0, y: 70, scale: 0.96, filter: "blur(10px)" },
        {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 1.6,
          ease: "power4.out",
          clearProps: "filter",
        }
      );
    }, { margin: "0px 0px -120px 0px" });
    cleanups.push(destroyGsap);

    /* ── 5. Stagger child elements with .scroll-delay-N ──── */
    document.querySelectorAll("[class*='scroll-delay-']").forEach((el) => {
      const match = el.className.match(/scroll-delay-(\d)/);
      if (match) el.style.transitionDelay = `${parseInt(match[1], 10) * 0.1}s`;
    });

    return () => {
      cleanups.forEach((fn) => { if (typeof fn === "function") fn(); });
      document.querySelectorAll("[data-animated='true']").forEach((el) => {
        el.dataset.animated = "false";
        el.classList.remove("scroll-reveal-init");
      });
    };
  }, [location.pathname]);
}

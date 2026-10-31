"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kayamrut_splash_v1";
const HOLD_MS = 2400;
const FADE_MS = 700;

/**
 * First-paint brand ritual: soft cream atmosphere + animated mark GIF.
 * Shows once per browser tab session; respects prefers-reduced-motion.
 */
export function BrandSplash() {
  const [phase, setPhase] = useState<"boot" | "show" | "hide" | "gone">("boot");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("gone");
      return;
    }

    setPhase("show");
    const hold = window.setTimeout(() => {
      setPhase("hide");
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, HOLD_MS);
    const gone = window.setTimeout(() => setPhase("gone"), HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(gone);
    };
  }, []);

  if (phase === "boot" || phase === "gone") return null;

  return (
    <div
      className={`brand-splash ${phase === "hide" ? "brand-splash--out" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="brand-splash__glow" />
      <div className="brand-splash__veil" />
      <div className="brand-splash__stage">
        {/* GIF is the motion identity; static logo is CSS fallback via poster-like stacking */}
        <img
          src="/brand/mark.gif"
          alt=""
          className="brand-splash__mark"
          width={280}
          height={292}
          decoding="async"
        />
        <p className="brand-splash__whisper">Organic · Herbal · Pure</p>
      </div>
    </div>
  );
}

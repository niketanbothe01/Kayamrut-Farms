"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kayamrut_admin_splash_v1";

export function BrandSplash() {
  const [visible, setVisible] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      return;
    }
    setVisible(true);
    const t1 = window.setTimeout(() => {
      setOut(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 1800);
    const t2 = window.setTimeout(() => setVisible(false), 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center transition-opacity duration-500 ${
        out ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 42%, #2a5240 0%, transparent 58%), linear-gradient(165deg, #102418 0%, #1a3a2a 42%, #143026 100%)",
      }}
      aria-hidden
    >
      <img
        src="/brand/mark.gif"
        alt=""
        width={200}
        height={208}
        className="w-44"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

const Turnstile = forwardRef(function Turnstile({ onVerify, onExpire }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const renderWidget = useCallback(() => {
    if (window.turnstile && containerRef.current && widgetIdRef.current === null) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire && onExpire(),
        "error-callback": () => onExpire && onExpire(),
        theme: "light",
      });
    }
  }, [onVerify, onExpire]);

  useEffect(() => {
    if (window.turnstile) {
      renderWidget();
      return;
    }
    const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existing) {
      existing.addEventListener("load", renderWidget);
      return () => existing.removeEventListener("load", renderWidget);
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.body.appendChild(script);
  }, [renderWidget]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  return <div ref={containerRef} style={{ display: "flex", justifyContent: "center", margin: "4px 0 18px" }} />;
});

export default Turnstile;
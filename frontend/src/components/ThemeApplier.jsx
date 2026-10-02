import { useEffect } from "react";

export default function ThemeApplier({ theme }) {
  useEffect(() => {
    const root = document.documentElement;
    if (!theme) return;

    const colors = theme.colors || {};
    const typo = theme.typography || {};

    const set = (name, val) => {
      if (val != null && val !== "") root.style.setProperty(name, val);
    };

    set("--blue", colors.primary);
    set("--blue-soft", colors.primarySoft);
    set("--red", colors.accent);
    set("--red-soft", colors.accentSoft);
    set("--bg", colors.background);
    set("--surface", colors.surface);
    set("--text", colors.text);
    set("--text-muted", colors.textMuted);

    if (typo.baseFontSize) {
      const px = String(typo.baseFontSize).includes("px") ? typo.baseFontSize : `${typo.baseFontSize}px`;
      set("--cms-base-font", px);
      document.body.style.fontSize = px;
    } else {
      document.body.style.fontSize = "";
    }

    if (typo.fontFamily) document.body.style.fontFamily = typo.fontFamily;
    else document.body.style.fontFamily = "";

    if (typo.headingWeight) root.style.setProperty("--heading-weight", typo.headingWeight);
    if (typo.headingScale) root.style.setProperty("--heading-scale", typo.headingScale);

    return () => {
      [
        "--blue",
        "--blue-soft",
        "--red",
        "--red-soft",
        "--bg",
        "--surface",
        "--text",
        "--text-muted",
        "--cms-base-font",
        "--heading-weight",
        "--heading-scale",
      ].forEach((v) => root.style.removeProperty(v));
      document.body.style.fontSize = "";
      document.body.style.fontFamily = "";
    };
  }, [theme]);

  return null;
}

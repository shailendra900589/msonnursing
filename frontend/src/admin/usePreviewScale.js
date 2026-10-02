import { useEffect, useState } from "react";

/** Desktop preview canvas — scaled to fill rail width */
const BASE_W = 1280;
const BASE_H = 2000;

export function usePreviewScale(containerRef) {
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = Math.max(el.clientWidth - 12, 200);
      setScale(Math.min(w / BASE_W, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const scaledW = BASE_W * scale;
  const scaledH = BASE_H * scale;

  return { scale, width: BASE_W, height: BASE_H, scaledWidth: scaledW, scaledHeight: scaledH };
}

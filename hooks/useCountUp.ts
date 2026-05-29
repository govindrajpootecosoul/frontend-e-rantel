'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

interface UseCountUpOptions {
  duration?: number;
  enabled?: boolean;
}

export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { duration = 1200, enabled = true } = options;
  const [value, setValue] = useState(enabled ? 0 : target);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    const from = valueRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = from + (target - from) * easeOutCubic(progress);
      setValue(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}

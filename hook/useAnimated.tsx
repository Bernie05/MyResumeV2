import { useCallback, useEffect, useRef, useState } from "react";

type AnimatedStats<T extends object> = {
  [K in keyof T]: number;
};

function getInitialAnimatedStats<T extends object>(
  stats?: T,
): AnimatedStats<T> {
  if (!stats) {
    return {} as AnimatedStats<T>;
  }

  return Object.keys(stats).reduce((accumulator, key) => {
    accumulator[key as keyof T] = 0;
    return accumulator;
  }, {} as AnimatedStats<T>);
}

export function useAnimatedStats<T extends object>(
  stats?: T,
  duration: number = 2000,
) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [statsNode, setStatsNode] = useState<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const [animatedStats, setAnimatedStats] = useState<AnimatedStats<T>>(() =>
    getInitialAnimatedStats(stats),
  );

  const statsRef = useCallback((node: HTMLDivElement | null) => {
    setStatsNode(node);
  }, []);

  useEffect(() => {
    setHasAnimated(false);
    hasStartedRef.current = false;
    setAnimatedStats(getInitialAnimatedStats(stats));
  }, [stats]);

  useEffect(() => {
    if (!statsNode || !stats || hasStartedRef.current) {
      return;
    }

    const frameIds: number[] = [];

    const startAnimation = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;
      setHasAnimated(true);

      Object.entries(stats).forEach(([key, value]) => {
        const target = typeof value === "number" ? value : 0;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = Math.round(target * progress);

          setAnimatedStats((prev) => ({
            ...prev,
            [key]: currentValue,
          }));

          if (progress < 1) {
            const frameId = requestAnimationFrame(animate);
            frameIds.push(frameId);
            return;
          }

          setAnimatedStats((prev) => ({
            ...prev,
            [key]: target,
          }));
        };

        const frameId = requestAnimationFrame(animate);
        frameIds.push(frameId);
      });
    };

    const checkVisibility = () => {
      if (hasStartedRef.current) {
        return;
      }

      const rect = statsNode.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top <= viewportHeight * 0.9 && rect.bottom >= 0;

      if (isVisible) {
        startAnimation();
      }
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    return () => {
      frameIds.forEach(cancelAnimationFrame);
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [duration, stats, statsNode]);

  return { animatedStats, statsRef, hasAnimated };
}

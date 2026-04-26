import { useCallback, useEffect, useRef, useState } from "react";

type AnimatedStats<T extends object> = {
  [K in keyof T]: number;
};

const getInitialAnimatedStats = <T extends object>(
  stats?: T,
): AnimatedStats<T> => {
  if (!stats) {
    return {} as AnimatedStats<T>;
  }

  return Object.keys(stats).reduce((accumulator, key) => {
    accumulator[key as keyof T] = 0;
    return accumulator;
  }, {} as AnimatedStats<T>);
};

export const useAnimatedStats = <T extends object>(
  stats?: T,
  duration: number = 2000,
) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [statsNode, setStatsNode] = useState<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);

  // Initialize animated stats when stats change
  const [animatedStats, setAnimatedStats] = useState<AnimatedStats<T>>(() =>
    getInitialAnimatedStats(stats),
  );

  const statsRef = useCallback((node: HTMLDivElement | null) => {
    setStatsNode(node);
  }, []);

  // The animation is based first on the stats prop, so we reset the animation state whenever stats changes
  useEffect(() => {
    setHasAnimated(false);
    hasStartedRef.current = false;
    setAnimatedStats(getInitialAnimatedStats(stats));
  }, [stats]);

  useEffect(() => {
    // If there's no stats or the animation has already started, we don't need to set up the animation
    if (!statsNode || !stats || hasStartedRef.current) {
      return;
    }

    const frameIds: number[] = [];

    const startAnimation = () => {
      // Prevent multiple animations from starting if the user scrolls quickly
      if (hasStartedRef.current) {
        return;
      }

      // Mark the animation as started to prevent it from being triggered again
      hasStartedRef.current = true;
      setHasAnimated(true);

      // Animate each stat from 0 to its target value
      Object.entries(stats).forEach(([key, value]) => {
        const target = typeof value === "number" ? value : 0;
        const startTime = performance.now();

        // The animate function calculates the current value based on the elapsed time and updates the state. It continues to request animation frames until the animation is complete.
        const animate = (currentTime: number) => {
          // Calculate the elapsed time and progress of the animation
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = Math.round(target * progress);

          // Update the animated stat value in the state
          setAnimatedStats((prev) => ({
            ...prev,
            [key]: currentValue,
          }));

          // If the animation is not yet complete, request the next animation frame
          if (progress < 1) {
            const frameId = requestAnimationFrame(animate);
            frameIds.push(frameId);
            return;
          }

          // Ensure the final value is set at the end of the animation
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
    // Use passive event listeners for scroll to improve performance
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    // Clean up event listeners and cancel any pending animation frames when the component unmounts or when stats/duration changes
    return () => {
      frameIds.forEach(cancelAnimationFrame);
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [duration, stats, statsNode]);

  return { animatedStats, statsRef, hasAnimated };
};

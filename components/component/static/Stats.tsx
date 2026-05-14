import { StatsItems } from "@/components/resume/HeroSection";

interface StatsProps {
  defaultStats: StatsItems[];
  newStats?: StatsItems[];
}
// Not yet done
const mergeStats = (defaultStats: StatsItems[], newStats?: StatsItems[]) => {
  if (!newStats) return defaultStats;

  const merged = [...defaultStats];
  newStats.forEach((stat) => {
    const idCombination = `${stat.label.toLowerCase()}.${stat.label.toLowerCase()}`; // Create a unique identifier based on label
    const existingIndex = merged.findIndex((s) => s.key === stat.key);
    if (existingIndex !== -1) {
      merged[existingIndex] = { ...merged[existingIndex], ...stat };
    } else {
      merged.push(stat);
    }
  });

  return merged;
};

const Stats = ({ defaultStats, newStats }: StatsProps) => {};

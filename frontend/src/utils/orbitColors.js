// Shared per-satellite accent colors so the same satellite reads as the same
// color everywhere it appears — globe orbit rings, comparison panel, etc.
export const ORBIT_COLORS = ["#4ade80", "#38bdf8", "#f472b6", "#facc15", "#a78bfa"];

export function getSatelliteColor(index) {
  return ORBIT_COLORS[index % ORBIT_COLORS.length];
}
// Turns a launch-date string like "24 Apr 1990" into "how long has this
// satellite been flying" — used by the detail panel's Orbit/Identity block.
export function getYearsSinceLaunch(launchDateString) {
  if (!launchDateString) return null;
  const launchDate = new Date(launchDateString);
  if (Number.isNaN(launchDate.getTime())) return null;

  const diffMs = Date.now() - launchDate.getTime();
  if (diffMs < 0) return null;

  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}

export function formatMissionDuration(launchDateString) {
  const years = getYearsSinceLaunch(launchDateString);
  if (years === null) return null;

  if (years < 1) {
    const days = Math.floor(years * 365.25);
    return `${days} day${days === 1 ? "" : "s"}`;
  }

  const wholeYears = Math.floor(years);
  const months = Math.floor((years - wholeYears) * 12);
  return `${wholeYears}y ${months}m`;
}
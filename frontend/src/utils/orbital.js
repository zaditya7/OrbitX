const EARTH_RADIUS_KM = 6371;
const EARTH_MU = 398600; // km^3/s^2, standard gravitational parameter

// Rough circular-orbit speed estimate from altitude (vis-viva, e ~ 0)
export function orbitalSpeed(altitudeKm) {
  const r = EARTH_RADIUS_KM + Math.max(altitudeKm, 1);
  return Math.sqrt(EARTH_MU / r); // km/s
}

// Kepler's third law for a circular orbit: T = 2π√(a³/μ), converted to minutes
export function orbitalPeriodMinutes(altitudeKm) {
  const semiMajorAxis = EARTH_RADIUS_KM + Math.max(altitudeKm, 1);
  const periodSeconds = 2 * Math.PI * Math.sqrt(semiMajorAxis ** 3 / EARTH_MU);
  return periodSeconds / 60;
}
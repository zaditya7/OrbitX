// Known real satellites get their actual published orbital parameters.
// Anything else is treated as a fictional spacecraft and given a stable,
// plausible LEO profile derived deterministically from its name — so a
// given satellite always gets the same "fake but believable" orbit instead
// of a new random one on every reload.
const KNOWN_SATELLITES = {
  Hubble: { altitudeKm: 535, inclinationDeg: 28.5, noradId: 20580, isReal: true },
  ISS: { altitudeKm: 420, inclinationDeg: 51.6, noradId: 25544, isReal: true }
};

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getOrbitalProfile(name) {
  const known = KNOWN_SATELLITES[name];
  if (known) return known;

  const hash = hashName(name || "unknown");
  return {
    altitudeKm: 400 + (hash % 200), // 400–600 km, a typical LEO band
    inclinationDeg: 30 + (hash % 68), // 30°–98°, covers common LEO inclinations
    noradId: null,
    isReal: false
  };
}
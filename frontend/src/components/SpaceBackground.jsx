import { useMemo } from "react";
import "./SpaceBackground.css";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateStarShadows(count, opacityRange) {
  const shadows = [];
  for (let i = 0; i < count; i += 1) {
    const x = randomBetween(0, 100).toFixed(2);
    const y = randomBetween(0, 100).toFixed(2);
    const opacity = randomBetween(opacityRange[0], opacityRange[1]).toFixed(2);
    shadows.push(`${x}vw ${y}vh 0 rgba(255,255,255,${opacity})`);
  }
  return shadows.join(", ");
}

function SpaceBackground() {
  // Generated once per mount, not per render — this is just CSS after that.
  const farStars = useMemo(() => generateStarShadows(140, [0.25, 0.55]), []);
  const nearStars = useMemo(() => generateStarShadows(70, [0.45, 0.9]), []);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        top: randomBetween(0, 100).toFixed(1),
        left: randomBetween(0, 100).toFixed(1),
        size: randomBetween(2, 4).toFixed(1),
        duration: randomBetween(45, 90).toFixed(0),
        delay: randomBetween(0, 40).toFixed(0),
        driftX: randomBetween(-60, 60).toFixed(0),
        driftY: randomBetween(-60, 60).toFixed(0)
      })),
    []
  );

  return (
    <div className="space-background" aria-hidden="true">
      <div className="space-nebula nebula-one" />
      <div className="space-nebula nebula-two" />
      <div className="space-nebula nebula-three" />

      <div className="space-grid" />

      <div className="space-stars far" style={{ boxShadow: farStars }} />
      <div className="space-stars near" style={{ boxShadow: nearStars }} />

      <div className="space-particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="space-particle"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift-x": `${p.driftX}px`,
              "--drift-y": `${p.driftY}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SpaceBackground;
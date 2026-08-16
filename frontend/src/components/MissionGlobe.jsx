import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { orbitalSpeed } from "../utils/orbital";
import "./MissionGlobe.css";

// ---------- Earth base texture: ocean glow + faint grid, no baked continents ----------
const createEarthTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#04101d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const oceanGlow = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.5, 50,
    canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.65
  );
  oceanGlow.addColorStop(0, "rgba(0, 140, 255, 0.22)");
  oceanGlow.addColorStop(0.6, "rgba(4, 16, 29, 0.6)");
  oceanGlow.addColorStop(1, "rgba(2, 8, 23, 1)");
  ctx.fillStyle = oceanGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 800; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = `rgba(0, 170, 255, ${0.06 + Math.random() * 0.1})`;
    ctx.fillRect(x, y, 2, 2);
  }

  for (let lon = 0; lon <= 360; lon += 30) {
    const x = (lon / 360) * canvas.width;
    ctx.strokeStyle = "rgba(0, 170, 255, 0.1)";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = 0; lat <= 180; lat += 20) {
    const y = (lat / 180) * canvas.height;
    ctx.strokeStyle = "rgba(0, 170, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// ---------- Simplified continent outlines (lon, lat) so the dot cloud reads as Earth ----------
const CONTINENTS = [
  { polygon: [[-165, 68], [-140, 70], [-95, 75], [-75, 68], [-60, 50], [-52, 47], [-65, 25], [-80, 25], [-97, 18], [-90, 14], [-83, 9], [-79, 8], [-105, 20], [-115, 30], [-124, 40], [-124, 49], [-130, 55], [-150, 60]] },
  { polygon: [[-77, 10], [-60, 10], [-50, 0], [-35, -5], [-38, -13], [-42, -23], [-48, -25], [-58, -34], [-68, -45], [-73, -53], [-70, -40], [-71, -18], [-75, -5], [-80, 2]] },
  { polygon: [[-17, 15], [-16, 27], [10, 37], [25, 32], [33, 31], [35, 27], [43, 12], [51, 12], [51, 2], [42, -15], [35, -25], [20, -35], [12, -18], [9, -5], [-1, 5], [-10, 7]] },
  { polygon: [[-10, 36], [-9, 44], [-5, 48], [2, 51], [5, 53], [10, 54], [13, 55], [20, 55], [25, 60], [30, 60], [38, 66], [45, 68], [30, 45], [28, 41], [20, 40], [15, 38], [10, 44], [0, 43], [-5, 36]] },
  { polygon: [[25, 35], [30, 45], [38, 50], [60, 55], [90, 60], [130, 65], [160, 65], [180, 68], [180, 50], [140, 45], [122, 40], [120, 32], [122, 25], [110, 20], [105, 10], [95, 5], [80, 8], [77, 8], [70, 20], [60, 25], [50, 30], [35, 30]] },
  { polygon: [[113, -22], [120, -34], [135, -35], [145, -38], [150, -33], [153, -27], [145, -15], [135, -12], [122, -14]] }
];

function isPointInPolygon(lon, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const createDigitalContinents = (scene) => {
  const points = [];
  const radius = 1.49;

  for (let lat = -85; lat <= 85; lat += 2.2) {
    for (let lon = -180; lon <= 180; lon += 2.2) {
      const onLand = CONTINENTS.some((c) => isPointInPolygon(lon, lat, c.polygon));
      if (!onLand) continue;

      const latitude = THREE.MathUtils.degToRad(lat);
      const longitude = THREE.MathUtils.degToRad(lon);
      points.push(new THREE.Vector3(
        radius * Math.cos(latitude) * Math.cos(longitude),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.sin(longitude)
      ));
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({
    color: "#00c8ff",
    size: 0.022,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const continents = new THREE.Points(geometry, material);
  continents.name = "Digital Continents";
  scene.add(continents);
  scene.userData.continents = continents;
};

const ORBIT_COLORS = ["#4ade80", "#38bdf8", "#f472b6", "#facc15", "#a78bfa"];

function buildOrbitParams(satellites) {
  return satellites.map((sat, index) => ({
    name: sat.name,
    radius: 1.7 + index * 0.22,
    inclination: THREE.MathUtils.degToRad(20 + ((index * 45) % 150)),
    phase: (index * 97) % 360,
    color: ORBIT_COLORS[index % ORBIT_COLORS.length],
    speedFactor: 0.15 + (index % 3) * 0.05
  }));
}

function MissionGlobe({ satellites = [], selectedName, onSelect }) {
  const mountRef = useRef(null);
  const labelRefs = useRef({});
  const rotationEnabledRef = useRef(true);
  const zoomRef = useRef(3.9);
  const satellitesRef = useRef(satellites);
  const onSelectRef = useRef(onSelect);

  const [viewMode, setViewMode] = useState("3d");
  const [zoomLevel, setZoomLevel] = useState(3.9);

  useEffect(() => { zoomRef.current = zoomLevel; }, [zoomLevel]);
  useEffect(() => { rotationEnabledRef.current = viewMode === "3d"; }, [viewMode]);
  useEffect(() => { satellitesRef.current = satellites; }, [satellites]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  // Only rebuild the 3D scene when satellites are added/removed — not when
  // telemetry values on existing satellites tick every couple seconds.
  const satelliteKey = satellites.map((s) => s.name).join("|");

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020817");

    const camera = new THREE.PerspectiveCamera(
      45,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoomRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(1.45, 72, 72);
    const earthTexture = createEarthTexture();
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: "#1c4a73",
      emissive: "#03101d",
      emissiveIntensity: 0.5,
      roughness: 0.85,
      metalness: 0.15
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    createDigitalContinents(scene);

    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({ color: "#008cff", transparent: true, opacity: 0.3 });
    const gridRadius = 1.47;

    for (let lat = -75; lat <= 75; lat += 30) {
      const points = [];
      const latitude = THREE.MathUtils.degToRad(lat);
      for (let lon = 0; lon <= 360; lon += 12) {
        const longitude = THREE.MathUtils.degToRad(lon);
        points.push(new THREE.Vector3(
          gridRadius * Math.cos(latitude) * Math.cos(longitude),
          gridRadius * Math.sin(latitude),
          gridRadius * Math.cos(latitude) * Math.sin(longitude)
        ));
      }
      gridGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), gridMaterial));
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const points = [];
      const longitude = THREE.MathUtils.degToRad(lon);
      for (let lat = -90; lat <= 90; lat += 12) {
        const latitude = THREE.MathUtils.degToRad(lat);
        points.push(new THREE.Vector3(
          gridRadius * Math.cos(latitude) * Math.cos(longitude),
          gridRadius * Math.sin(latitude),
          gridRadius * Math.cos(latitude) * Math.sin(longitude)
        ));
      }
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMaterial));
    }
    scene.add(gridGroup);

    const glowMaterial = new THREE.MeshBasicMaterial({ color: "#008cff", transparent: true, opacity: 0.14, side: THREE.BackSide });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.6, 64, 64), glowMaterial);
    scene.add(glow);

    const light = new THREE.PointLight("#008cff", 2.4, 10);
    light.position.set(3.5, 2.2, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight("#1e3a5f", 1.3));

    // satellites: orbit rings + moving markers, built from the current list
    const currentSatellites = satellitesRef.current;
    const orbitParams = buildOrbitParams(currentSatellites);
    const markerMeshes = [];
    const orbitsGroup = new THREE.Group();

    orbitParams.forEach(({ name, radius, inclination, color }) => {
      const ringPoints = [];
      for (let deg = 0; deg <= 360; deg += 2) {
        const rad = THREE.MathUtils.degToRad(deg);
        const vec = new THREE.Vector3(radius * Math.cos(rad), 0, radius * Math.sin(rad));
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);
        ringPoints.push(vec);
      }
      const ringLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(ringPoints),
        new THREE.LineDashedMaterial({ color, dashSize: 0.05, gapSize: 0.05, transparent: true, opacity: 0.75 })
      );
      ringLine.computeLineDistances();
      orbitsGroup.add(ringLine);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      marker.userData = { name, radius, inclination };
      orbitsGroup.add(marker);
      markerMeshes.push(marker);
    });

    scene.add(orbitsGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(markerMeshes);
      if (hits.length > 0 && onSelectRef.current) {
        const hitName = hits[0].object.userData.name;
        const sat = satellitesRef.current.find((s) => s.name === hitName);
        if (sat) onSelectRef.current(sat);
      }
    };
    renderer.domElement.addEventListener("click", handleClick);

    let animationId;
    let elapsed = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      elapsed += 0.01;

      if (rotationEnabledRef.current) {
        earth.rotation.y += 0.0015;
        gridGroup.rotation.y += 0.0015;
        glow.rotation.y += 0.001;
        if (scene.userData.continents) {
          scene.userData.continents.rotation.y += 0.0015;
        }
      }

      markerMeshes.forEach((marker, i) => {
        const { radius, inclination } = marker.userData;
        const { speedFactor, phase } = orbitParams[i];
        const angle = elapsed * speedFactor + THREE.MathUtils.degToRad(phase);
        const vec = new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);
        marker.position.copy(vec);
      });

      camera.position.z = zoomRef.current;
      renderer.render(scene, camera);

      markerMeshes.forEach((marker) => {
        const sat = satellitesRef.current.find((s) => s.name === marker.userData.name);
        const label = labelRefs.current[marker.userData.name];
        if (!label || !sat) return;

        const worldPos = marker.position.clone();
        const camDir = camera.position.clone().normalize();
        const facingCamera = worldPos.clone().normalize().dot(camDir) > -0.55;

        const projected = worldPos.project(camera);
        const labelWidth = 150;
        const labelHeight = 60;
        const rawX = (projected.x * 0.5 + 0.5) * mountNode.clientWidth;
        const rawY = (-projected.y * 0.5 + 0.5) * mountNode.clientHeight;
        const x = Math.min(Math.max(rawX, 10), mountNode.clientWidth - labelWidth);
        const y = Math.min(Math.max(rawY, 10), mountNode.clientHeight - labelHeight);

        label.style.opacity = facingCamera ? "1" : "0.35";
        label.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    animate();

    const handleResize = () => {
      const width = mountNode.clientWidth;
      const height = mountNode.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [satelliteKey]);

  const zoomIn = () => setZoomLevel((z) => Math.max(2.6, z - 0.4));
  const zoomOut = () => setZoomLevel((z) => Math.min(6.5, z + 0.4));
  const resetView = () => {
    setZoomLevel(3.9);
    setViewMode("3d");
  };

  return (
    <div className="mission-globe-wrapper">
      <div ref={mountRef} className="mission-globe-canvas" />

      {satellites.map((sat) => (
        <div
          key={sat.name}
          ref={(el) => (labelRefs.current[sat.name] = el)}
          className={`globe-label ${selectedName === sat.name ? "selected" : ""}`}
          onClick={() => onSelect && onSelect(sat)}
        >
          <strong>{sat.name}</strong>
          <span>Altitude: {sat.altitude?.toFixed(0)} km</span>
          <span>Speed: {orbitalSpeed(sat.altitude || 0).toFixed(2)} km/s</span>
        </div>
      ))}

      <div className="globe-controls bottom-left">
        <button className={viewMode === "3d" ? "active" : ""} onClick={() => setViewMode("3d")}>3D</button>
        <button className={viewMode === "2d" ? "active" : ""} onClick={() => setViewMode("2d")}>2D</button>
        <button onClick={resetView} title="Reset view">↻</button>
      </div>

      <div className="globe-controls bottom-right">
        <button onClick={zoomOut}>−</button>
        <button onClick={zoomIn}>+</button>
      </div>
    </div>
  );
}

export default MissionGlobe;
import { useEffect, useRef } from "react";
import * as THREE from "three";

const createEarthTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#041827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const oceanGlow = ctx.createRadialGradient(
    canvas.width * 0.55,
    canvas.height * 0.45,
    50,
    canvas.width * 0.55,
    canvas.height * 0.45,
    canvas.width * 0.6
  );
  oceanGlow.addColorStop(0, "rgba(0, 170, 255, 0.3)");
  oceanGlow.addColorStop(0.6, "rgba(6, 20, 38, 0.7)");
  oceanGlow.addColorStop(1, "rgba(2, 8, 23, 1)");
  ctx.fillStyle = oceanGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const continents = [
    { points: [[0.18, 0.24], [0.12, 0.30], [0.14, 0.38], [0.22, 0.46], [0.30, 0.40], [0.33, 0.32], [0.28, 0.20]], color: "rgba(0,200,255,0.95)" },
    { points: [[0.32, 0.56], [0.29, 0.65], [0.36, 0.77], [0.48, 0.73], [0.52, 0.62], [0.46, 0.52]], color: "rgba(0,200,255,0.9)" },
    { points: [[0.49, 0.24], [0.52, 0.27], [0.58, 0.30], [0.61, 0.38], [0.66, 0.42], [0.70, 0.36], [0.69, 0.26], [0.63, 0.19], [0.56, 0.17]], color: "rgba(0,200,255,0.85)" },
    { points: [[0.57, 0.38], [0.60, 0.45], [0.64, 0.52], [0.70, 0.58], [0.78, 0.62], [0.78, 0.55], [0.72, 0.46], [0.67, 0.37]], color: "rgba(0,200,255,0.88)" },
    { points: [[0.69, 0.68], [0.73, 0.78], [0.82, 0.82], [0.87, 0.74], [0.83, 0.66], [0.76, 0.63]], color: "rgba(0,200,255,0.86)" }
  ];

  continents.forEach((region) => {
    ctx.beginPath();
    region.points.forEach(([x, y], index) => {
      const px = x * canvas.width;
      const py = y * canvas.height;
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(
      canvas.width * region.points[0][0],
      canvas.height * region.points[0][1],
      20,
      canvas.width * region.points[0][0],
      canvas.height * region.points[0][1],
      canvas.width * 0.2
    );
    grad.addColorStop(0, region.color);
    grad.addColorStop(1, "rgba(0, 200, 255, 0.08)");
    ctx.fillStyle = grad;
    ctx.fill();
  });

  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const glow = Math.random() > 0.7 ? 0.8 : 0.5;
    ctx.fillStyle = `rgba(0, 200, 255, ${0.14 + glow * 0.42})`;
    ctx.fillRect(x, y, 2, 2);
  }

  for (let lon = 0; lon <= 360; lon += 30) {
    const x = (lon / 360) * canvas.width;
    ctx.strokeStyle = "rgba(0, 200, 255, 0.14)";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let lat = 0; lat <= 180; lat += 20) {
    const y = (lat / 180) * canvas.height;
    ctx.strokeStyle = "rgba(0, 200, 255, 0.12)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createDigitalContinents = (scene) => {
  const points = [];
  const radius = 1.49;

  const isLand = (lat, lon) => {
    const northAmerica =
      lat >= 8 && lat <= 72 && lon >= -168 && lon <= -52;
    const southAmerica = lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34;
    const europe = lat >= 35 && lat <= 72 && lon >= -25 && lon <= 45;
    const africa = lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52;
    const asia = lat >= -10 && lat <= 80 && lon >= 25 && lon <= 180;
    const australia = lat >= -47 && lat <= -10 && lon >= 110 && lon <= 155;

    return northAmerica || southAmerica || europe || africa || asia || australia;
  };

  for (let lat = -90; lat <= 90; lat += 3) {
    for (let lon = -180; lon <= 180; lon += 3) {
      if (!isLand(lat, lon)) continue;

      const latitude = THREE.MathUtils.degToRad(lat);
      const longitude = THREE.MathUtils.degToRad(lon);
      const x = radius * Math.cos(latitude) * Math.cos(longitude);
      const y = radius * Math.sin(latitude);
      const z = radius * Math.cos(latitude) * Math.sin(longitude);

      points.push(new THREE.Vector3(x, y, z));
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({
    color: "#00c8ff",
    size: 0.023,
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

function MissionGlobe() {
  const mountRef = useRef(null);

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
    camera.position.z = 3.7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(1.45, 72, 72);
    const earthTexture = createEarthTexture();
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: "#0a2540",
      emissive: "#08233d",
      emissiveIntensity: 0.7,
      roughness: 0.85,
      metalness: 0.15
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    createDigitalContinents(scene);

    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: "#008cff",
      transparent: true,
      opacity: 0.35
    });
    const gridRadius = 1.47;

    for (let lat = -75; lat <= 75; lat += 30) {
      const points = [];
      const latitude = THREE.MathUtils.degToRad(lat);
      for (let lon = 0; lon <= 360; lon += 12) {
        const longitude = THREE.MathUtils.degToRad(lon);
        const x = gridRadius * Math.cos(latitude) * Math.cos(longitude);
        const y = gridRadius * Math.sin(latitude);
        const z = gridRadius * Math.cos(latitude) * Math.sin(longitude);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geometry, gridMaterial);
      gridGroup.add(line);
    }

    for (let lon = 0; lon < 360; lon += 30) {
      const points = [];
      const longitude = THREE.MathUtils.degToRad(lon);
      for (let lat = -90; lat <= 90; lat += 12) {
        const latitude = THREE.MathUtils.degToRad(lat);
        const x = gridRadius * Math.cos(latitude) * Math.cos(longitude);
        const y = gridRadius * Math.sin(latitude);
        const z = gridRadius * Math.cos(latitude) * Math.sin(longitude);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, gridMaterial);
      gridGroup.add(line);
    }

    scene.add(gridGroup);

    const glowGeometry = new THREE.SphereGeometry(1.62, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#008cff",
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const light = new THREE.PointLight("#008cff", 2.4, 10);
    light.position.set(3.5, 2.2, 4);
    scene.add(light);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      earth.rotation.y += 0.0015;
      gridGroup.rotation.y += 0.0015;
      glow.rotation.y += 0.001;
      if (scene.userData.continents) {
        scene.userData.continents.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
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
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "600px",
        background: "#020817",
        borderRadius: "12px",
        overflow: "hidden"
      }}
    />
  );
}

export default MissionGlobe;
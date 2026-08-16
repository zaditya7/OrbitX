import { useEffect, useRef } from "react";
import * as THREE from "three";

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
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(1.45, 64, 64);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: "#061426",
      transparent: true,
      opacity: 0.9
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // 🌐 Digital latitude / longitude grid
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: "#008cff",
      transparent: true,
      opacity: 0.35
    });
    const gridRadius = 1.47;

    for (let lat = -75; lat <= 75; lat += 15) {
      const points = [];
      const latitude = THREE.MathUtils.degToRad(lat);
      for (let lon = 0; lon <= 360; lon += 4) {
        const longitude = THREE.MathUtils.degToRad(lon);
        const x =
          gridRadius * Math.cos(latitude) * Math.cos(longitude);
        const y = gridRadius * Math.sin(latitude);
        const z =
          gridRadius * Math.cos(latitude) * Math.sin(longitude);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geometry, gridMaterial);
      gridGroup.add(line);
    }

    for (let lon = 0; lon < 360; lon += 15) {
      const points = [];
      const longitude = THREE.MathUtils.degToRad(lon);
      for (let lat = -90; lat <= 90; lat += 4) {
        const latitude = THREE.MathUtils.degToRad(lat);
        const x =
          gridRadius * Math.cos(latitude) * Math.cos(longitude);
        const y = gridRadius * Math.sin(latitude);
        const z =
          gridRadius * Math.cos(latitude) * Math.sin(longitude);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, gridMaterial);
      gridGroup.add(line);
    }

    scene.add(gridGroup);

    const glowGeometry = new THREE.SphereGeometry(1.52, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#008cff",
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const light = new THREE.PointLight("#008cff", 2, 10);
    light.position.set(3, 2, 4);
    scene.add(light);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      earth.rotation.y += 0.0015;
      gridGroup.rotation.y += 0.0015;
      glow.rotation.y += 0.001;
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
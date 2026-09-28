import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const CyberBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 28;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mountRef.current.appendChild(renderer.domElement);

      // Group holding the globe and particle lattice
      const cyberGroup = new THREE.Group();
      scene.add(cyberGroup);

      // 1. Wireframe Quantum Sphere (Latitude/Longitude lattice)
      const sphereGeometry = new THREE.IcosahedronGeometry(14, 2);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0891b2, // Dark cyan
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const wireframeMesh = new THREE.Mesh(sphereGeometry, wireframeMaterial);
      cyberGroup.add(wireframeMesh);

      // 2. Inner Ring
      const ringGeo = new THREE.RingGeometry(14.5, 14.7, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x14b8a6, // Teal
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      cyberGroup.add(ringMesh);

      // 3. Node particles on sphere vertices
      const posAttribute = sphereGeometry.attributes.position;
      const particleCount = posAttribute.count;
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', posAttribute);

      const particleMat = new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.25,
        transparent: true,
        opacity: 0.45,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      cyberGroup.add(particles);

      // 4. Subtle background particle matrix
      const bgCount = 120;
      const bgPositions = new Float32Array(bgCount * 3);
      for (let i = 0; i < bgCount * 3; i += 3) {
        bgPositions[i] = (Math.random() - 0.5) * 80;
        bgPositions[i + 1] = (Math.random() - 0.5) * 60;
        bgPositions[i + 2] = (Math.random() - 0.5) * 40 - 10;
      }
      const bgGeo = new THREE.BufferGeometry();
      bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
      const bgMat = new THREE.PointsMaterial({
        color: 0x334155,
        size: 0.15,
        transparent: true,
        opacity: 0.35,
      });
      const bgPoints = new THREE.Points(bgGeo, bgMat);
      scene.add(bgPoints);

      // Resize handler
      const handleResize = () => {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Render Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        cyberGroup.rotation.y += delta * 0.04;
        cyberGroup.rotation.x += delta * 0.015;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        sphereGeometry.dispose();
        wireframeMaterial.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        bgGeo.dispose();
        bgMat.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed, using CSS fallback", e);
      setWebGLFailed(true);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: webGLFailed
          ? 'radial-gradient(circle at 50% 30%, rgba(14, 28, 48, 0.4) 0%, rgba(7, 10, 18, 0.95) 70%)'
          : 'transparent',
      }}
    />
  );
};

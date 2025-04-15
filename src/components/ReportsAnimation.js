'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function ReportsAnimation() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 25;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Make background fully transparent
    
    // Create grid lines
    const gridSize = 30;
    const gridDivisions = 20;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00b894, 0x00cec9);
    gridHelper.position.y = -10;
    gridHelper.rotation.x = Math.PI / 8;
    scene.add(gridHelper);
    
    // Create floating bar charts
    const bars = new THREE.Group();
    const barCount = 15;
    const barMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x6c5ce7, 
      transparent: true, 
      opacity: 0.7 
    });
    
    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * 4 + 1;
      const barGeometry = new THREE.BoxGeometry(0.8, height, 0.8);
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      
      // Position bars in a circular pattern
      const angle = (i / barCount) * Math.PI * 2;
      const radius = Math.random() * 10 + 5;
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.position.y = -5 + height / 2;
      
      // Animate each bar with GSAP
      gsap.to(bar.position, {
        y: -5 + height / 2 + Math.random() * 2,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
      
      bars.add(bar);
    }
    scene.add(bars);
    
    // Create floating dots (data points)
    const pointsGroup = new THREE.Group();
    const pointCount = 100;
    const pointGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x74b9ff, 
      transparent: true, 
      opacity: 0.8 
    });
    
    for (let i = 0; i < pointCount; i++) {
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      
      // Random position within a sphere
      const radius = Math.random() * 15 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      point.position.x = radius * Math.sin(phi) * Math.cos(theta);
      point.position.y = radius * Math.cos(phi) - 5;
      point.position.z = radius * Math.sin(phi) * Math.sin(theta);
      
      pointsGroup.add(point);
    }
    scene.add(pointsGroup);
    
    // Animation
    const animate = () => {
      bars.rotation.y += 0.003;
      pointsGroup.rotation.y -= 0.001;
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      scene.remove(gridHelper, bars, pointsGroup);
      renderer.dispose();
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'transparent' }}
    />
  );
} 
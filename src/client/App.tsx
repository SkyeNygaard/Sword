import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Audio Context
    audioContextRef.current = new AudioContext();

    const generateSwordSound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    };

    const generateBabyCrySound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    };

    const generateHorrorSound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(100, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(20, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 2);
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 2);
    };

    const startAmbientSound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const lfoOsc = ctx.createOscillator();
      const mainOsc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      lfoOsc.frequency.value = 0.5;
      mainOsc.type = 'sine';
      mainOsc.frequency.value = 50;
      
      gainNode.gain.value = 0.1;
      
      lfoOsc.connect(gainNode.gain);
      mainOsc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      lfoOsc.start();
      mainOsc.start();
      
      return { lfoOsc, mainOsc, gainNode };
    };

    const playSoundEffect = (effect: string) => {
      switch (effect) {
        case 'sword-slice':
          generateSwordSound();
          break;
        case 'baby-cry':
          generateBabyCrySound();
          break;
        case 'horror-sound':
          generateHorrorSound();
          break;
      }
    };

    const createBloodParticles = () => {
      const particleCount = 1000;
      const particles = new THREE.Group();
      const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        particle.userData.gravity = -0.005;
        particle.visible = false;
        particles.add(particle);
      }
      
      return particles;
    };

    const updateBloodParticles = (particles: THREE.Group) => {
      particles.children.forEach((particle: THREE.Mesh) => {
        if (!particle.visible) return;

        // Apply velocity
        particle.position.add(particle.userData.velocity);
        
        // Apply gravity
        particle.userData.velocity.y += particle.userData.gravity;
        
        // Fade out
        const material = particle.material as THREE.MeshBasicMaterial;
        material.opacity *= 0.98;
        
        // Reset particle if it's too faded or falls too low
        if (material.opacity < 0.01 || particle.position.y < -3) {
          particle.visible = false;
          material.opacity = 1;
        }
      });
    };

    const emitBlood = (particles: THREE.Group, position: THREE.Vector3) => {
      const particlesToEmit = 50;
      let emitted = 0;
      
      particles.children.forEach((particle: THREE.Mesh) => {
        if (emitted >= particlesToEmit || particle.visible) return;
        
        particle.position.copy(position);
        particle.visible = true;
        (particle.material as THREE.MeshBasicMaterial).opacity = 1;
        
        // Randomize velocity
        particle.userData.velocity.set(
          (Math.random() - 0.5) * 0.2,
          Math.random() * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        
        emitted++;
      });
    };

    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create stick figure
    const createStickFigure = () => {
      const group = new THREE.Group();
      
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      head.position.y = 1.7;
      
      // Body
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      body.position.y = 1;
      
      // Arms
      const arms = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      arms.rotation.z = Math.PI / 2;
      arms.position.y = 1.3;
      
      // Legs
      const legs = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      legs.position.y = 0.5;
      legs.rotation.z = Math.PI / 4;

      group.add(head, body, arms, legs);
      return group;
    };

    // Create sword
    const createSword = () => {
      const group = new THREE.Group();
      
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      
      const hilt = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
      );
      hilt.position.y = -0.8;
      
      group.add(blade, hilt);
      return group;
    };

    // Create baby
    const createBaby = () => {
      const group = new THREE.Group();
      
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffcccc, wireframe: true })
      );
      
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8),
        new THREE.MeshBasicMaterial({ color: 0xffcccc, wireframe: true })
      );
      body.position.y = -0.2;
      
      group.add(head, body);
      group.scale.set(0.5, 0.5, 0.5);
      return group;
    };

    const stickFigure = createStickFigure();
    const sword = createSword();
    const baby = createBaby();
    const bloodParticles = createBloodParticles();

    scene.add(stickFigure);
    scene.add(sword);
    scene.add(baby);
    scene.add(bloodParticles);

    // Position elements
    camera.position.z = 5;
    sword.position.set(-2, 1, 0);
    baby.position.set(0, -5, 0);

    // Animation variables
    let phase = 0;
    const SWORD_ATTACK_SPEED = 0.05;
    const BABY_RISE_SPEED = 0.03;

    // Start ambient sound
    const ambientSoundNodes = startAmbientSound();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      stickFigure.rotation.y += Math.sin(Date.now() * 0.001) * 0.02;
      
      if (phase < 1) {
        // Move sword towards stick figure
        sword.position.x += SWORD_ATTACK_SPEED;
        sword.rotation.z += 0.02;
        if (sword.position.x >= 0) {
          phase = 1;
          playSoundEffect('sword-slice');
        }
      } else if (phase === 1) {
        // Sword clipping through body
        sword.rotation.z += 0.1;
        sword.position.y -= 0.02;
        
        // Emit blood from the intersection point
        const intersectionPoint = new THREE.Vector3(
          sword.position.x,
          sword.position.y + 0.5,
          sword.position.z
        );
        emitBlood(bloodParticles, intersectionPoint);
        
        if (sword.position.y <= 0) {
          phase = 2;
          playSoundEffect('horror-sound');
        }
      } else if (phase === 2) {
        // Continue blood spray
        const intersectionPoint = new THREE.Vector3(
          stickFigure.position.x,
          stickFigure.position.y + 1,
          stickFigure.position.z
        );
        emitBlood(bloodParticles, intersectionPoint);
        
        // Baby rising
        if (baby.position.y < 1) {
          baby.position.y += BABY_RISE_SPEED;
          baby.rotation.z += 0.1;
          playSoundEffect('baby-cry');
        } else {
          // Reset animation
          sword.position.set(-2, 1, 0);
          sword.rotation.z = 0;
          baby.position.set(0, -5, 0);
          baby.rotation.z = 0;
          phase = 0;
          playSoundEffect('horror-sound');
          
          // Hide all blood particles
          bloodParticles.children.forEach((particle: THREE.Mesh) => {
            particle.visible = false;
            (particle.material as THREE.MeshBasicMaterial).opacity = 1;
          });
        }
      }
  
      // Update blood particles
      updateBloodParticles(bloodParticles);
      
      // Add constant disturbing movements
      stickFigure.position.y = Math.sin(Date.now() * 0.002) * 0.1;
      sword.position.z = Math.sin(Date.now() * 0.003) * 0.2;
      baby.rotation.x += 0.05;
      
      renderer.render(scene, camera);
    };
  

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      // Clean up audio nodes
      if (ambientSoundNodes) {
        ambientSoundNodes.lfoOsc.stop();
        ambientSoundNodes.mainOsc.stop();
        ambientSoundNodes.gainNode.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={mountRef} />
  );
};

export default App;

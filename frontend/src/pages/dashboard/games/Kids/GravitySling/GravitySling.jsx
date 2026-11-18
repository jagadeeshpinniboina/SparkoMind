import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Zap, Trophy, Star, 
  Volume2, VolumeX, ArrowRight, Sparkles, Activity, Compass, Pause
} from 'lucide-react';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import gravityAudio from './GravitySlingAudio';
import styles from './GravitySling.module.css';

// ============================================================================
// 5 PROGRESSIVE LEVELS CONFIGURATION (Immutable & Exported)
// Dimensions: 800 x 500 Canvas Space
// ============================================================================
export const GRAVITY_LEVELS = [
  {
    level: 1,
    title: 'First Launch',
    mission: 'Drag backward from the Space Probe to aim. Feel how planetary gravity curves your trajectory into the space station!',
    launchPad: { x: 90, y: 250 },
    portal: { x: 710, y: 250, radius: 28 },
    planets: [
      { x: 400, y: 390, radius: 46, mass: 2200, color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.35)', name: 'Neptune Prime' }
    ],
    asteroids: [],
    stars: [
      { id: 's1', x: 400, y: 210, radius: 14 }
    ],
    requiredStars: 0,
    parLaunches: 3
  },
  {
    level: 2,
    title: 'Gravity Assist',
    mission: 'A massive Jovian gas giant blocks the direct line! Curve your launch around its upper orbit to slingshot into the station.',
    launchPad: { x: 90, y: 150 },
    portal: { x: 710, y: 360, radius: 28 },
    planets: [
      { x: 400, y: 255, radius: 56, mass: 3400, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', name: 'Jovian Titan' }
    ],
    asteroids: [],
    stars: [
      { id: 's1', x: 400, y: 110, radius: 14 }
    ],
    requiredStars: 0,
    parLaunches: 4
  },
  {
    level: 3,
    title: 'Star Collector',
    mission: 'Gather both orbital Star Orbs along a curved gravity path before docking into the space station!',
    launchPad: { x: 90, y: 250 },
    portal: { x: 720, y: 250, radius: 28 },
    planets: [
      { x: 400, y: 385, radius: 48, mass: 2600, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.35)', name: 'Amethyst World' }
    ],
    asteroids: [],
    stars: [
      { id: 's1', x: 290, y: 185, radius: 14 },
      { id: 's2', x: 510, y: 185, radius: 14 }
    ],
    requiredStars: 2,
    parLaunches: 5
  },
  {
    level: 4,
    title: 'Twin Worlds',
    mission: 'Thread an S-curve corridor between two opposing planetary gravity wells to reach the orbital base!',
    launchPad: { x: 90, y: 130 },
    portal: { x: 710, y: 370, radius: 28 },
    planets: [
      { x: 300, y: 110, radius: 38, mass: 2000, color: '#10B981', glow: 'rgba(16, 185, 129, 0.35)', name: 'Emerald Echo' },
      { x: 500, y: 390, radius: 38, mass: 2000, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.35)', name: 'Rose Nebula' }
    ],
    asteroids: [
      { x: 380, y: 110, radius: 18 },
      { x: 420, y: 390, radius: 18 }
    ],
    stars: [
      { id: 's1', x: 400, y: 250, radius: 14 }
    ],
    requiredStars: 0,
    parLaunches: 5
  },
  {
    level: 5,
    title: 'Cosmic Gauntlet',
    mission: 'Navigate past a hyper-gravity pulsar and asteroid guards to execute precision docking into the portal!',
    launchPad: { x: 80, y: 250 },
    portal: { x: 720, y: 160, radius: 28 },
    planets: [
      { x: 380, y: 315, radius: 52, mass: 3800, color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.45)', name: 'Pulsar Core' }
    ],
    asteroids: [
      { x: 380, y: 125, radius: 22 },
      { x: 570, y: 260, radius: 20 }
    ],
    stars: [
      { id: 's1', x: 260, y: 360, radius: 14 },
      { id: 's2', x: 490, y: 380, radius: 14 }
    ],
    requiredStars: 0,
    parLaunches: 6
  }
];

export const GravitySling = ({ initialLevel = 1 }) => {
  const navigate = useNavigate();

  // Safe level parsing (1 to 5) & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('gravity-sling');
  const parsedInitial = parseInt(initialLevel, 10);
  const safeInitialLevel = !isNaN(parsedInitial) && parsedInitial >= 1 && parsedInitial <= 5 ? parsedInitial : 1;
  const initialAllowed = Math.min(safeInitialLevel, unlockedLevel);
  const [level, setLevel] = useState(initialAllowed);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (level > unlockedLevel) {
      setLevel(unlockedLevel);
    }
  }, [unlockedLevel, level]);

  const currentLevelConfig = GRAVITY_LEVELS.find((l) => l.level === level) || GRAVITY_LEVELS[0];

  // Game UI State
  const [isMuted, setIsMuted] = useState(false);
  const [launchCount, setLaunchCount] = useState(0);
  const [collectedStars, setCollectedStars] = useState(new Set());
  const [isWon, setIsWon] = useState(false);
  const [starsEarned, setStarsEarned] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (!isWon) {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWon]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [aimAngle, setAimAngle] = useState(0);

  // Canvas Refs & Simulation State
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const shakeTimerRef = useRef(null);

  // Probe Physics State: 'aiming' | 'flying' | 'crashed' | 'docked'
  const probeRef = useRef({
    x: currentLevelConfig.launchPad.x,
    y: currentLevelConfig.launchPad.y,
    vx: 0,
    vy: 0,
    radius: 12,
    state: 'aiming',
    angle: 0
  });

  // Drag interaction state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    lastTickDistance: 0
  });

  // Particle systems
  const particlesRef = useRef([]);
  const backgroundStarsRef = useRef([]);
  const screenShakeRef = useRef({ intensity: 0, x: 0, y: 0 });

  // Generate background starfield once
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
    backgroundStarsRef.current = stars;
  }, []);

  // Audio mute toggle
  const toggleMute = () => {
    gravityAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Reset Probe to Launch Pad
  const resetProbe = useCallback(() => {
    probeRef.current = {
      x: currentLevelConfig.launchPad.x,
      y: currentLevelConfig.launchPad.y,
      vx: 0,
      vy: 0,
      radius: 12,
      state: 'aiming',
      angle: 0
    };
    dragRef.current.isDragging = false;
    setCurrentSpeed(0);
  }, [currentLevelConfig]);

  // Reset Entire Level
  const resetLevel = useCallback((lvlNum = level) => {
    const cfg = GRAVITY_LEVELS.find((l) => l.level === lvlNum) || GRAVITY_LEVELS[0];
    setCollectedStars(new Set());
    setLaunchCount(0);
    setIsWon(false);
    particlesRef.current = [];
    screenShakeRef.current = { intensity: 0, x: 0, y: 0 };
    probeRef.current = {
      x: cfg.launchPad.x,
      y: cfg.launchPad.y,
      vx: 0,
      vy: 0,
      radius: 12,
      state: 'aiming',
      angle: 0
    };
    dragRef.current.isDragging = false;
    setCurrentSpeed(0);
  }, [level]);

  // Level switch
  const handleLevelChange = (lvlNum) => {
    if (lvlNum === level) return;
    if (!isLevelUnlocked('gravity-sling', lvlNum)) return;
    setLevel(lvlNum);
    resetLevel(lvlNum);
  };

  useEffect(() => {
    resetLevel(level);
  }, [level, resetLevel]);

  // Trigger screen shake on crash
  const triggerCrash = (crashX, crashY) => {
    gravityAudio.playCrash();
    screenShakeRef.current.intensity = 8;

    // Spawn crash spark particles
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x: crashX,
        y: crashY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: i % 2 === 0 ? '#EF4444' : '#F59E0B',
        life: 1.0,
        decay: 0.04
      });
    }

    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => {
      screenShakeRef.current.intensity = 0;
      resetProbe();
    }, 450);
  };

  // ============================================================================
  // PREDICTIVE TRAJECTORY SIMULATION (28 Steps)
  // ============================================================================
  const computePredictivePath = (launchVx, launchVy) => {
    const points = [];
    const sim = {
      x: currentLevelConfig.launchPad.x,
      y: currentLevelConfig.launchPad.y,
      vx: launchVx,
      vy: launchVy
    };

    const G = 0.55;
    const subSteps = 28;
    const dt = 0.9;

    for (let step = 0; step < subSteps; step++) {
      let ax = 0;
      let ay = 0;

      // Gravity from all planets
      currentLevelConfig.planets.forEach((p) => {
        const dx = p.x - sim.x;
        const dy = p.y - sim.y;
        const distSq = dx * dx + dy * dy + 300; // softening
        const dist = Math.sqrt(distSq);
        const F = (G * p.mass) / distSq;
        ax += F * (dx / dist);
        ay += F * (dy / dist);
      });

      sim.vx += ax * dt;
      sim.vy += ay * dt;
      sim.x += sim.vx * dt;
      sim.y += sim.vy * dt;

      points.push({ x: sim.x, y: sim.y });

      // Stop prediction on solid collision
      let hit = false;
      currentLevelConfig.planets.forEach((p) => {
        const d = Math.hypot(p.x - sim.x, p.y - sim.y);
        if (d < p.radius) hit = true;
      });
      currentLevelConfig.asteroids.forEach((a) => {
        const d = Math.hypot(a.x - sim.x, a.y - sim.y);
        if (d < a.radius) hit = true;
      });

      if (hit) break;
    }

    return points;
  };

  // ============================================================================
  // MOUSE & TOUCH EVENT HANDLERS (Slingshot Drag & Pull-Back)
  // ============================================================================
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e) => {
    if (probeRef.current.state !== 'aiming' || isWon || isPaused) return;
    const coords = getCanvasCoords(e);
    const pad = currentLevelConfig.launchPad;

    // Radius around launch pad to start drag
    const distToPad = Math.hypot(coords.x - pad.x, coords.y - pad.y);
    if (distToPad < 65) {
      dragRef.current = {
        isDragging: true,
        startX: pad.x,
        startY: pad.y,
        currX: coords.x,
        currY: coords.y,
        lastTickDistance: 0
      };
    }
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging || probeRef.current.state !== 'aiming') return;
    const coords = getCanvasCoords(e);
    dragRef.current.currX = coords.x;
    dragRef.current.currY = coords.y;

    const pad = currentLevelConfig.launchPad;
    const dragDistance = Math.hypot(pad.x - coords.x, pad.y - coords.y);

    // Audio radar tick as tension increases
    if (Math.abs(dragDistance - dragRef.current.lastTickDistance) > 18) {
      dragRef.current.lastTickDistance = dragDistance;
      const pitch = Math.min(2.0, 0.8 + dragDistance / 100);
      gravityAudio.playAimTick(pitch);
    }

    // Update telemetry values
    const power = Math.min(14, dragDistance * 0.11).toFixed(1);
    const angleDeg = Math.round((Math.atan2(pad.y - coords.y, pad.x - coords.x) * 180) / Math.PI);
    setCurrentSpeed(power);
    setAimAngle(angleDeg);
  };

  const handlePointerUp = () => {
    if (!dragRef.current.isDragging || probeRef.current.state !== 'aiming') return;
    dragRef.current.isDragging = false;

    const pad = currentLevelConfig.launchPad;
    const dx = pad.x - dragRef.current.currX;
    const dy = pad.y - dragRef.current.currY;
    const dist = Math.hypot(dx, dy);

    // Minimum drag threshold to launch
    if (dist < 15) return;

    // Slingshot velocity vector (pull back to shoot forward)
    const powerScale = 0.11;
    const rawVx = dx * powerScale;
    const rawVy = dy * powerScale;
    const speed = Math.hypot(rawVx, rawVy);
    const maxSpeed = 14;

    const finalVx = speed > maxSpeed ? (rawVx / speed) * maxSpeed : rawVx;
    const finalVy = speed > maxSpeed ? (rawVy / speed) * maxSpeed : rawVy;

    probeRef.current.vx = finalVx;
    probeRef.current.vy = finalVy;
    probeRef.current.state = 'flying';
    probeRef.current.angle = Math.atan2(finalVy, finalVx);

    // Burst Rocket Exhaust Particles on launch
    for (let i = 0; i < 14; i++) {
      particlesRef.current.push({
        x: pad.x,
        y: pad.y,
        vx: -finalVx * 0.35 + (Math.random() - 0.5) * 4,
        vy: -finalVy * 0.35 + (Math.random() - 0.5) * 4,
        size: Math.random() * 4 + 2,
        color: Math.random() < 0.6 ? '#F59E0B' : '#38BDF8',
        life: 1.0,
        decay: 0.045
      });
    }

    setLaunchCount((prev) => prev + 1);
    gravityAudio.playLaunchThruster();
  };

  // ============================================================================
  // MAIN PHYSICS LOOP & CANVAS RENDERER (`requestAnimationFrame`)
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const G = 0.55;
    const pad = currentLevelConfig.launchPad;

    const render = () => {
      if (isPausedRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // 1. Handle Screen Shake
      ctx.save();
      if (screenShakeRef.current.intensity > 0) {
        const shake = screenShakeRef.current.intensity;
        const ox = (Math.random() * 2 - 1) * shake;
        const oy = (Math.random() * 2 - 1) * shake;
        ctx.translate(ox, oy);
      }

      // Clear Frame
      ctx.fillStyle = '#070A11';
      ctx.fillRect(0, 0, 800, 500);

      // 2. Draw Twinkling Background Stars
      backgroundStarsRef.current.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 0.95 || s.alpha < 0.25) s.twinkleSpeed = -s.twinkleSpeed;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Planets & Pulsing Gravitational Wave Rings
      currentLevelConfig.planets.forEach((p) => {
        // Gravitational Pulse Wave Rings (Expanding concentric ripples)
        const pulseOffset = (performance.now() * 0.032) % 35;
        for (let r = 1; r <= 3; r++) {
          const currentRadius = p.radius + r * 35 - pulseOffset;
          if (currentRadius > p.radius) {
            const waveAlpha = Math.max(0.08, 0.45 * (1 - (currentRadius - p.radius) / 105));
            ctx.strokeStyle = p.glow.replace(/[\d.]+\)$/, `${waveAlpha.toFixed(2)})`);
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);

        // Planet Outer Atmospheric Aura
        const glowGrad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.8, p.x, p.y, p.radius * 1.35);
        glowGrad.addColorStop(0, p.color);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body with 3D Sphere Shading
        const bodyGrad = ctx.createRadialGradient(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.1, p.x, p.y, p.radius);
        bodyGrad.addColorStop(0, '#FFFFFF');
        bodyGrad.addColorStop(0.35, p.color);
        bodyGrad.addColorStop(1, '#0B0F19');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x, p.y + p.radius + 15);
      });

      // 4. Draw Solid Asteroid Hazards
      currentLevelConfig.asteroids.forEach((a) => {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(a.x - 4, a.y - 3, 5, 0, Math.PI * 2);
        ctx.arc(a.x + 5, a.y + 4, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Collectible Star Orbs
      currentLevelConfig.stars.forEach((star) => {
        if (collectedStars.has(star.id)) return;

        // Glowing Star Aura
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        // Star Body
        ctx.fillStyle = '#F59E0B';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', star.x, star.y);
      });

      // 6. Draw Destination Space Station Portal
      const portal = currentLevelConfig.portal;
      const time = performance.now() * 0.002;

      // Rotating Docking Station Rings
      ctx.save();
      ctx.translate(portal.x, portal.y);
      ctx.rotate(time);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Station perimeter docking nodes
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * portal.radius, Math.sin(ang) * portal.radius, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Central Portal Core
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(portal.x, portal.y, portal.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛸', portal.x, portal.y);

      // 7. Draw Launch Pad
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 8. Slingshot Drag Tether & Predictive Arc
      if (dragRef.current.isDragging && probeRef.current.state === 'aiming') {
        const dx = pad.x - dragRef.current.currX;
        const dy = pad.y - dragRef.current.currY;
        const powerScale = 0.11;
        const rawVx = dx * powerScale;
        const rawVy = dy * powerScale;
        const speed = Math.hypot(rawVx, rawVy);
        const maxSpeed = 14;

        const vx = speed > maxSpeed ? (rawVx / speed) * maxSpeed : rawVx;
        const vy = speed > maxSpeed ? (rawVy / speed) * maxSpeed : rawVy;

        // Draw Elastic Pull-back Line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pad.x, pad.y);
        ctx.lineTo(dragRef.current.currX, dragRef.current.currY);
        ctx.stroke();

        // Draw Predictive Arc
        const trajectory = computePredictivePath(vx, vy);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        trajectory.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Small glowing dots along the arc
        trajectory.forEach((pt, idx) => {
          if (idx % 3 === 0) {
            ctx.fillStyle = idx % 6 === 0 ? '#38BDF8' : '#F59E0B';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 9. Update & Render Flying Particles
      particlesRef.current.forEach((part, i) => {
        part.x += part.vx;
        part.y += part.vy;
        part.life -= part.decay;

        ctx.fillStyle = part.color;
        ctx.globalAlpha = Math.max(0, part.life);
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // 10. Physics Integration when Probe is Flying
      const probe = probeRef.current;
      if (probe.state === 'flying') {
        const subSteps = 2;
        const dt = 0.5;

        for (let s = 0; s < subSteps; s++) {
          let ax = 0;
          let ay = 0;

          // Planetary Gravity
          currentLevelConfig.planets.forEach((p) => {
            const dx = p.x - probe.x;
            const dy = p.y - probe.y;
            const distSq = dx * dx + dy * dy + 250;
            const dist = Math.sqrt(distSq);
            const F = (G * p.mass) / distSq;
            ax += F * (dx / dist);
            ay += F * (dy / dist);
          });

          probe.vx += ax * dt;
          probe.vy += ay * dt;
          probe.x += probe.vx * dt;
          probe.y += probe.vy * dt;

          // Thruster Exhaust Particle
          if (Math.random() < 0.7) {
            particlesRef.current.push({
              x: probe.x - probe.vx * 0.8,
              y: probe.y - probe.vy * 0.8,
              vx: -probe.vx * 0.2 + (Math.random() - 0.5),
              vy: -probe.vy * 0.2 + (Math.random() - 0.5),
              size: Math.random() * 3.5 + 2,
              color: Math.random() < 0.5 ? '#38BDF8' : '#F59E0B',
              life: 1.0,
              decay: 0.05
            });
          }

          // Check Planet Collision
          currentLevelConfig.planets.forEach((p) => {
            const dist = Math.hypot(p.x - probe.x, p.y - probe.y);
            if (dist < p.radius + 6) {
              probe.state = 'crashed';
              triggerCrash(probe.x, probe.y);
            }
          });

          // Check Asteroid Collision
          currentLevelConfig.asteroids.forEach((a) => {
            const dist = Math.hypot(a.x - probe.x, a.y - probe.y);
            if (dist < a.radius + 6) {
              probe.state = 'crashed';
              triggerCrash(probe.x, probe.y);
            }
          });

          // Check Star Orb Pickup
          currentLevelConfig.stars.forEach((star) => {
            if (!collectedStars.has(star.id)) {
              const dist = Math.hypot(star.x - probe.x, star.y - probe.y);
              if (dist < star.radius + probe.radius + 6) {
                setCollectedStars((prev) => new Set([...prev, star.id]));
                gravityAudio.playStarPickup();
              }
            }
          });

          // Check Portal Docking Victory
          const distToPortal = Math.hypot(portal.x - probe.x, portal.y - probe.y);
          if (distToPortal < portal.radius + 8 && probe.state === 'flying') {
            const hasRequiredStars = collectedStars.size >= currentLevelConfig.requiredStars;
            if (hasRequiredStars) {
              probe.state = 'docked';
              gravityAudio.playVictory();
              setIsWon(true);
              setStarsEarned(launchCount <= currentLevelConfig.parLaunches ? 3 : 2);
              triggerUnlockNext(level);
            }
          }

          // Out-of-bounds check
          if (probe.x < -40 || probe.x > 840 || probe.y < -40 || probe.y > 540) {
            probe.state = 'crashed';
            triggerCrash(probe.x, probe.y);
          }
        }

        probe.angle = Math.atan2(probe.vy, probe.vx);
        setCurrentSpeed(Math.hypot(probe.vx, probe.vy).toFixed(1));
      }

      // 11. Render Probe Sprite
      ctx.save();
      const probeDrawX = dragRef.current.isDragging ? dragRef.current.currX : probe.x;
      const probeDrawY = dragRef.current.isDragging ? dragRef.current.currY : probe.y;
      const probeAngle = dragRef.current.isDragging
        ? Math.atan2(pad.y - dragRef.current.currY, pad.x - dragRef.current.currX)
        : probe.angle;

      ctx.translate(probeDrawX, probeDrawY);
      ctx.rotate(probeAngle);

      // Rocket Fuselage
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose Cone
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(12, -4);
      ctx.lineTo(20, 0);
      ctx.lineTo(12, 4);
      ctx.closePath();
      ctx.fill();

      // Delta Wings
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(-14, -12);
      ctx.lineTo(-4, -6);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-6, 6);
      ctx.lineTo(-14, 12);
      ctx.lineTo(-4, 6);
      ctx.fill();

      // Cockpit Window
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(4, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, [currentLevelConfig, collectedStars, launchCount]);

  // Progression to Next Level
  const handleNextLevel = () => {
    if (level < GRAVITY_LEVELS.length) {
      const nextLvl = level + 1;
      triggerUnlockNext(level);
      handleLevelChange(nextLvl);
      navigate(`/dashboard/kids/play/gravity-sling?level=${nextLvl}`);
    } else {
      navigate('/dashboard/kids');
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. TOP HUD BAR */}
      <header className={styles.hudHeader}>
        {/* Left Section: Back to Arena + Sequential Level Selector */}
        <div className={styles.hudLeft}>
          <Link to="/dashboard/kids" className={styles.kidsArenaExitBtn}>
            ← 🚀 Kids Arena
          </Link>

          <div className={styles.levelTabs}>
            {GRAVITY_LEVELS.map((lvl) => {
              const isLocked = lvl.level > unlockedLevel;
              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => handleLevelChange(lvl.level)}
                  className={`${styles.levelTabBtn} ${level === lvl.level ? styles.levelTabActive : ''} ${isLocked ? styles.levelTabLocked : ''}`}
                  disabled={probeRef.current.state === 'flying' || isLocked}
                  title={isLocked ? `Complete Level ${lvl.level - 1} to unlock` : `Level ${lvl.level}: ${lvl.title}`}
                >
                  <span>L{lvl.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Section: Game Name + Active Level Title Badge */}
        <div className={styles.hudCenter}>
          <div className={styles.gameBrand}>
            <span className={styles.brandIcon}>🪐</span>
            <span className={styles.brandTitle}>Gravity Sling</span>
          </div>
          <span className={styles.levelBadge}>Sector {level}: {currentLevelConfig.title}</span>
        </div>

        {/* Right Section: Stars, Audio, Reset */}
        <div className={styles.hudRight}>
          <div className={styles.starsPill}>
            <Star size={14} fill="currentColor" />
            <span>{collectedStars.size} / {currentLevelConfig.stars.length || 1} Stars</span>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className={styles.utilityBtn}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onClick={() => resetProbe()}
            className={styles.utilityBtn}
            title="Reset Probe"
          >
            <RotateCcw size={15} />
            <span>Reset Probe</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className={styles.utilityBtn}
            title="Pause Game (Esc or P)"
          >
            <Pause size={15} />
            <span>Pause</span>
          </button>
        </div>
      </header>

      {/* 2. MISSION BRIEF BANNER */}
      <div className={styles.missionBanner}>
        <div className={styles.missionDetails}>
          <h3>
            <Compass size={18} color="#F59E0B" />
            <span>Sector {level} — {currentLevelConfig.title}</span>
          </h3>
          <p>{currentLevelConfig.mission}</p>
        </div>

        <div className={`
          ${styles.statusBadge}
          ${isWon ? styles.statusDocked : (probeRef.current.state === 'flying' ? styles.statusFlying : styles.statusReady)}
        `}>
          {isWon ? (
            <><Sparkles size={15} /> Docking Completed!</>
          ) : probeRef.current.state === 'flying' ? (
            <><Activity size={15} /> Orbital Trajectory Active</>
          ) : (
            <><Zap size={15} /> Slingshot Ready (Drag to Aim)</>
          )}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE CANVAS ARENA */}
      <main className={styles.arenaLayout}>
        <div className={styles.canvasFrame}>
          <div className={styles.cornerTL} />
          <div className={styles.cornerTR} />
          <div className={styles.cornerBL} />
          <div className={styles.cornerBR} />

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className={styles.gameCanvas}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
        </div>

        {/* Telemetry & Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.telemetryGroup}>
            <div className={styles.telemetryItem}>
              <span>Launch Velocity:</span>
              <span className={styles.telemetryVal}>{currentSpeed} km/s</span>
            </div>

            <div className={styles.telemetryItem}>
              <span>Trajectory Angle:</span>
              <span className={styles.telemetryVal}>{aimAngle}°</span>
            </div>

            <div className={styles.telemetryItem}>
              <span>Launches:</span>
              <span className={styles.telemetryVal}>{launchCount}</span>
            </div>
          </div>

          <div className={styles.aimHintText}>
            <Sparkles size={14} />
            <span>Click & pull backward from the Space Probe to aim. Predictive dots reveal gravity curves!</span>
          </div>
        </div>
      </main>

      {/* ====================================================================
         4. VICTORY MODAL OVERLAY
         ==================================================================== */}
      {isWon && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal}>
            <div className={styles.trophyCircle}>
              🚀
            </div>

            <h3 className={styles.victoryTitle}>Station Docking Confirmed!</h3>
            <p className={styles.victorySubtitle}>
              Astounding orbital navigation! You successfully plotted the gravitational slingshot through Sector {level}!
            </p>

            <div className={styles.starsRow}>
              {Array.from({ length: starsEarned }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <div className={styles.rewardBox}>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>+100 XP</span>
                <span className={styles.rewardLbl}>Wonder Stars</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>{launchCount}</span>
                <span className={styles.rewardLbl}>Launches Used</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal} style={{ color: '#10B981' }}>100%</span>
                <span className={styles.rewardLbl}>Orbital Precision</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => resetLevel()}
                className={styles.replayBtn}
              >
                Replay Sector
              </button>

              <button
                type="button"
                onClick={handleNextLevel}
                className={styles.nextLevelBtn}
              >
                <span>{level < GRAVITY_LEVELS.length ? 'Next Sector' : 'Return to Universe'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Universal Pause Modal Overlay */}
      <GamePauseOverlay
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={() => {
          setIsPaused(false);
          resetLevel();
        }}
        onExit={() => navigate('/dashboard/kids')}
        gameTitle="Gravity Sling: Orbital Rescue"
        level={level}
        zonePath="/dashboard/kids"
      />
    </div>
  );
};

export default GravitySling;

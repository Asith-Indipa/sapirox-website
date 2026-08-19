'use client';

import React, { useEffect, useRef, useState } from 'react';

class Stardust {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  baseOpacity: number;

  constructor(width: number, height: number, isDark: boolean) {
    // Distributed randomly across canvas width/height
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    // Continuous zero-gravity floating velocity
    this.baseVx = (Math.random() - 0.5) * 0.35;
    this.baseVy = (Math.random() - 0.5) * 0.35;
    this.vx = this.baseVx;
    this.vy = this.baseVy;
    
    // Very small, delicate particle sizes for a premium look
    this.size = Math.random() * 1.5 + 0.8; // 0.8px to 2.3px
    
    // Sapirox brand corporate colors
    const colors = isDark 
      ? [
          { r: 6, g: 182, b: 212 },   // cyan
          { r: 59, g: 130, b: 246 },  // blue
          { r: 99, g: 102, b: 241 },  // indigo
          { r: 148, g: 163, b: 184 }  // slate/gray
        ]
      : [
          { r: 6, g: 182, b: 212 },   // cyan
          { r: 59, g: 130, b: 246 },  // blue
          { r: 99, g: 102, b: 241 },  // indigo
          { r: 100, g: 116, b: 139 }  // slate/gray
        ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    
    // Extremely subtle opacity to keep layout readable and clean
    this.baseOpacity = isDark 
      ? (Math.random() * 0.30 + 0.15) 
      : (Math.random() * 0.18 + 0.08);
  }

  update(mouse: { x: number | null; y: number | null }, width: number, height: number) {
    // Drifts continuously
    this.x += this.vx;
    this.y += this.vy;

    // Wrap boundaries smoothly
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;

    // Repulsion mechanics (Force Field)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const forceRadius = 140; // repulsion distance

      if (dist < forceRadius) {
        const force = (forceRadius - dist) / forceRadius; // 0 to 1
        const angle = Math.atan2(dy, dx);
        
        // Push velocity away from mouse coordinate
        const pushX = Math.cos(angle) * force * 1.8;
        const pushY = Math.sin(angle) * force * 1.8;
        
        this.vx += pushX;
        this.vy += pushY;
        
        // Limit push speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 3.8;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
      } else {
        // Return to normal slow floating drift
        this.vx += (this.baseVx - this.vx) * 0.04;
        this.vy += (this.baseVy - this.vy) * 0.04;
      }
    } else {
      // Natural damping to base velocity
      this.vx += (this.baseVx - this.vx) * 0.04;
      this.vy += (this.baseVy - this.vy) * 0.04;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.baseOpacity})`;
    ctx.fill();
    ctx.restore();
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    // Detect dark mode initially
    setIsDark(document.documentElement.classList.contains('dark'));

    // Observe dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Stardust[] = [];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      // Higher density of particles for a richer visual constellation
      const count = Math.min(Math.floor((width * height) / 5500), 180);
      for (let i = 0; i < count; i++) {
        particles.push(new Stardust(width, height, isDark));
      }
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentMouse = mouseRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // 1. Draw web connection lines between nearby particles for constellation mesh
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 115; // increased line connecting distance

          if (dist < maxDist) {
            const alpha = (maxDist - dist) / maxDist * 0.07; // extremely faint lines
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark 
              ? `rgba(99, 102, 241, ${alpha})`
              : `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw particles
      particles.forEach(p => {
        p.update(currentMouse, width, height);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

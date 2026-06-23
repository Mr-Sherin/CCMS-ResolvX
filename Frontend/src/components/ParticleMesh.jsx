import { useEffect, useRef } from 'react';

/**
 * ParticleMesh – a full-screen animated canvas that draws an interactive
 * 3D-style geometric mesh of connected nodes, similar to particles.js
 * but hand-rolled for zero dependencies.
 */
const ParticleMesh = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let mouse = { x: -9999, y: -9999 };
    let particles = [];

    const PARTICLE_COUNT = 120;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 200;
    const BASE_SPEED = 0.3;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.z = Math.random() * 1.5 + 0.5; // depth factor (0.5 – 2)
        this.vx = (Math.random() - 0.5) * BASE_SPEED;
        this.vy = (Math.random() - 0.5) * BASE_SPEED;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }

        // Damping
        this.vx *= 0.999;
        this.vy *= 0.999;

        this.x += this.vx * this.z;
        this.y += this.vy * this.z;

        // Wrap around edges
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + this.z * 0.2})`;
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = CONNECTION_DISTANCE * ((particles[i].z + particles[j].z) / 2);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      drawConnections();
      animId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleResize = () => {
      cancelAnimationFrame(animId);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      init();
      animate();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};

export default ParticleMesh;

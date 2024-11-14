"use client";

import { useEffect, useRef } from 'react';

export function LuckyWheel({
  prizes,
  spinning,
}: {
  prizes: string[];
  spinning: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const drawWheel = (rotation: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw segments
      prizes.forEach((prize, index) => {
        const angle = (2 * Math.PI) / prizes.length;
        const startAngle = rotation + index * angle;
        const endAngle = rotation + (index + 1) * angle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Alternate colors
        ctx.fillStyle = index % 2 === 0 ? '#4f46e5' : '#6366f1';
        ctx.fill();
        ctx.stroke();

        // Add text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText(prize, radius - 20, 5);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.stroke();

      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(centerX + 30, centerY);
      ctx.lineTo(centerX - 10, centerY - 10);
      ctx.lineTo(centerX - 10, centerY + 10);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    };

    let rotation = 0;
    let speed = 0;
    let animationFrameId: number;

    const animate = () => {
      if (spinning) {
        speed = Math.min(speed + 0.2, 0.3);
      } else {
        speed = Math.max(speed - 0.01, 0);
      }

      rotation += speed;
      drawWheel(rotation);

      if (speed > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    drawWheel(rotation);
    if (spinning) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [prizes, spinning]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full max-w-[400px] mx-auto"
    />
  );
}
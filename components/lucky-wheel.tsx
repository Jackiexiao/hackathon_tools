"use client";

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function LuckyWheel({
  prizes,
  spinning,
}: {
  prizes: string[];
  spinning: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    const drawWheel = (currentRotation: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      prizes.forEach((prize, index) => {
        const angle = (2 * Math.PI) / prizes.length;
        const startAngle = currentRotation + index * angle;
        const endAngle = currentRotation + (index + 1) * angle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = index % 2 === 0 ? '#f3f4f6' : '#e5e7eb';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 16px sans-serif';
        
        ctx.rotate(Math.PI / 2);
        ctx.fillText(prize, radius - 30, 0);
        ctx.restore();
      });

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + 40, centerY);
      ctx.lineTo(centerX - 10, centerY - 15);
      ctx.lineTo(centerX - 10, centerY + 15);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    };

    let animationFrameId: number;

    const animate = () => {
      if (spinning) {
        setSpeed(prev => Math.min(prev + 0.2, 0.3));
      } else if (speed > 0) {
        setSpeed(prev => {
          const newSpeed = prev - 0.005;
          if (newSpeed <= 0) {
            const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const segmentAngle = (2 * Math.PI) / prizes.length;
            const winningIndex = Math.floor(prizes.length - (normalizedRotation / segmentAngle));
            const actualIndex = winningIndex % prizes.length;
            const prize = prizes[actualIndex];
            
            if (prize && prize !== winner) {
              setWinner(prize);
              toast.success(`🎉 恭喜抽中了 ${prize}！`, {
                duration: 3000,
              });
            }
          }
          return Math.max(newSpeed, 0);
        });
      }

      setRotation(prev => prev + speed);
      drawWheel(rotation);

      if (speed > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    drawWheel(rotation);
    if (spinning || speed > 0) {
      animate();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [prizes, spinning, rotation, speed, winner]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full max-w-[400px] mx-auto"
    />
  );
}
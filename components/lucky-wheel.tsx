"use client";

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PrizeBoxProps {
  prize: string;
  isActive: boolean;
  isWinner: boolean;
}

const PrizeBox = ({ prize, isActive, isWinner }: PrizeBoxProps) => (
  <motion.div
    className={`
      p-4 rounded-lg text-center min-w-[120px] font-bold
      ${isActive ? 'bg-primary text-white' : 'bg-muted'}
      ${isWinner ? 'ring-2 ring-primary ring-offset-2' : ''}
    `}
    animate={{
      scale: isActive ? 1.1 : 1,
      y: isActive ? -5 : 0,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
  >
    {prize}
  </motion.div>
);

export function LuckyWheel({
  prizes,
  spinning,
}: {
  prizes: string[];
  spinning: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [speed, setSpeed] = useState(100); // 数字越小速度越快
  const spinningRef = useRef(spinning);
  const speedRef = useRef(speed);

  useEffect(() => {
    spinningRef.current = spinning;
    if (spinning) {
      setSpeed(100);
      setWinner(null);
    }
  }, [spinning]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      if (spinningRef.current || speedRef.current < 400) {
        setActiveIndex(prev => (prev + 1) % prizes.length);
        
        if (!spinningRef.current) {
          setSpeed(prev => prev + 10);
        }
        
        timeoutId = setTimeout(animate, speedRef.current);
      } else {
        // 停止时
        const winningPrize = prizes[activeIndex];
        setWinner(winningPrize);
        
        // 播放烟花效果
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast.success(`🎉 恭喜抽中了 ${winningPrize}！`, {
          duration: 3000,
        });
      }
    };

    timeoutId = setTimeout(animate, speed);

    return () => clearTimeout(timeoutId);
  }, [activeIndex, prizes, speed]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-4 gap-4">
        {prizes.slice(0, 3).map((prize, index) => (
          <PrizeBox
            key={prize}
            prize={prize}
            isActive={activeIndex === index}
            isWinner={winner === prize}
          />
        ))}
        <PrizeBox
          prize={prizes[prizes.length - 1]}
          isActive={activeIndex === prizes.length - 1}
          isWinner={winner === prizes[prizes.length - 1]}
        />
        <div className="col-span-2 row-span-2 flex items-center justify-center">
          <motion.button
            className={`
              px-8 py-4 rounded-full text-xl font-bold
              ${spinning ? 'bg-red-500' : 'bg-primary'}
              text-white shadow-lg
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !spinning && setWinner(null)}
          >
            {spinning ? '抽奖中...' : '开始抽奖'}
          </motion.button>
        </div>
        <PrizeBox
          prize={prizes[prizes.length - 2]}
          isActive={activeIndex === prizes.length - 2}
          isWinner={winner === prizes[prizes.length - 2]}
        />
        {prizes.slice(3, 6).map((prize, index) => (
          <PrizeBox
            key={prize}
            prize={prize}
            isActive={activeIndex === index + 3}
            isWinner={winner === prize}
          />
        ))}
      </div>
    </div>
  );
}
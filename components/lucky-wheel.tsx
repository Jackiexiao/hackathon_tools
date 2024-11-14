"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface PrizeBoxProps {
  prize: string;
  isActive: boolean;
  isWinner: boolean;
}

const PrizeBox = ({ prize, isActive, isWinner }: PrizeBoxProps) => (
  <motion.div
    className={`
      p-4 rounded-lg text-center font-bold min-h-[80px] flex items-center justify-center
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

interface WinnerModalProps {
  prize: string;
  onClose: () => void;
}

function WinnerModal({ prize, onClose }: WinnerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-md p-6 relative"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-8 top-8 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <Card className="p-8 bg-white/95 backdrop-blur text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 恭喜 🎉</h2>
          <p className="text-2xl font-semibold mb-6">抽中了</p>
          <div className="text-4xl font-bold text-primary mb-8">{prize}</div>
          <Button onClick={onClose}>确定</Button>
        </Card>
      </motion.div>
    </div>
  );
}

export function LuckyWheel({
  prizes,
  onStart,
}: {
  prizes: string[];
  onStart?: () => void;
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 创建顺序动画序列
  const createAnimationSequence = (finalIndex: number) => {
    const sequence: number[] = [];
    const rounds = 2; // 完整圈数
    const boxCount = prizes.length;
    
    // 先转几圈（顺序转动）
    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < boxCount; i++) {
        sequence.push(i);
      }
    }
    
    // 计算最后一圈到目标位置的路径
    let currentPos = sequence[sequence.length - 1];
    while (currentPos !== finalIndex) {
      currentPos = (currentPos + 1) % boxCount;
      sequence.push(currentPos);
    }
    
    return sequence;
  };

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    onStart?.();

    // 预先决定最终位置
    const finalIndex = Math.floor(Math.random() * prizes.length);
    const sequence = createAnimationSequence(finalIndex);
    let step = 0;
    
    // 清除之前的定时器
    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);

    // 动态调整速度
    const animate = () => {
      if (step < sequence.length) {
        setActiveIndex(sequence[step]);
        step++;
        
        // 计算动画速度（逐渐变慢）
        const progress = step / sequence.length;
        const speed = 50 + Math.floor(progress * 150); // 从50ms逐渐变慢到200ms
        
        spinTimeoutRef.current = setTimeout(animate, speed);
      } else {
        // 动画结束
        setWinner(prizes[finalIndex]);
        setShowWinnerModal(true);
        setIsSpinning(false);

        // 播放烟花效果
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: 0.2, y: 0.5 }
        });
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: 0.8, y: 0.5 }
        });
      }
    };

    animate();
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
  };

  // 计算网格列数
  const getGridCols = (count: number) => {
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    return 5;
  };

  return (
    <div className="relative">
      <div className={`grid gap-4 max-w-4xl mx-auto`} 
        style={{ 
          gridTemplateColumns: `repeat(${getGridCols(prizes.length)}, 1fr)` 
        }}
      >
        {prizes.map((prize, index) => (
          <PrizeBox
            key={index}
            prize={prize}
            isActive={activeIndex === index}
            isWinner={winner === prize}
          />
        ))}
      </div>

      <Button
        className="w-full mt-6"
        size="lg"
        onClick={startSpin}
        disabled={isSpinning}
      >
        {isSpinning ? '抽奖中...' : '开始抽奖'}
      </Button>

      <AnimatePresence>
        {showWinnerModal && winner && (
          <WinnerModal
            prize={winner}
            onClose={handleCloseWinnerModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
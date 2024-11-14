"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';
import { Team } from '@/types/vote';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VoteResult extends Team {
  votes: number;
  rank: number;
}

interface VoteResultsProps {
  teams: Team[];
  votes: Record<string, number>;
  show: boolean;
  onClose?: () => void;
}

export function VoteResults({ teams, votes, show, onClose }: VoteResultsProps) {
  const [results, setResults] = useState<VoteResult[]>([]);

  useEffect(() => {
    if (show) {
      // 计算结果并排序
      const sortedResults = teams
        .map(team => ({
          ...team,
          votes: votes[team.id] || 0,
          rank: 0,
        }))
        .sort((a, b) => b.votes - a.votes)
        .map((team, index) => ({
          ...team,
          rank: index + 1,
        }))
        .slice(0, 3); // 只取前三名

      setResults(sortedResults);

      // 播放烟花效果
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [show, teams, votes]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-2xl p-6 relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-8 top-8 z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <Card className="p-8 bg-white/95 backdrop-blur">
            <h2 className="text-3xl font-bold text-center mb-8">🎉 投票结果 🎉</h2>
            <div className="flex justify-center items-end gap-8 h-[300px]">
              {/* 第二名 */}
              {results[1] && (
                <div className="relative flex flex-col items-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 160 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="w-24 bg-gray-400 rounded-t-lg"
                  />
                  <div className="absolute -bottom-8 text-center">
                    <div className="font-bold">{results[1].name}</div>
                    <div className="text-lg">{results[1].votes}票</div>
                  </div>
                </div>
              )}

              {/* 第一名 */}
              {results[0] && (
                <div className="relative flex flex-col items-center">
                  <div className="text-4xl mb-2">🥇</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 200 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="w-24 bg-yellow-500 rounded-t-lg"
                  />
                  <div className="absolute -bottom-8 text-center">
                    <div className="font-bold">{results[0].name}</div>
                    <div className="text-lg">{results[0].votes}票</div>
                  </div>
                </div>
              )}

              {/* 第三名 */}
              {results[2] && (
                <div className="relative flex flex-col items-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 120 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="w-24 bg-amber-600 rounded-t-lg"
                  />
                  <div className="absolute -bottom-8 text-center">
                    <div className="font-bold">{results[2].name}</div>
                    <div className="text-lg">{results[2].votes}票</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 
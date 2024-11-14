"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types/vote';
import { Card } from '@/components/ui/card';

interface MessageStreamProps {
  messages: Message[];
}

export function MessageStream({ messages }: MessageStreamProps) {
  return (
    <Card className="p-4">
      <div className="h-[300px] overflow-y-auto space-y-2">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-2 rounded-lg bg-muted"
            >
              {message.type === 'vote' ? (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    有人投票了：{message.teamNames?.join('、')}
                  </span>
                  {message.content && (
                    <span className="ml-2 text-foreground">
                      &ldquo;{message.content}&rdquo;
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="ml-2">{message.content}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
} 
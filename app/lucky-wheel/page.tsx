"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { LuckyWheel } from '@/components/lucky-wheel';

const defaultPrizes = {
  fun: [
    '模仿一位评委的表情和动作',
    '即兴说唱你的项目',
    '用方言介绍你的项目',
    '和旁边的人换座位',
    '做三个俯卧撑',
    '给大家讲一个笑话',
    '原地转圈10秒',
  ],
  normal: [
    '纪念T恤',
    '定制马克杯',
    '限量版贴纸包',
    '精美徽章',
    '电子奖状',
    '优秀项目证书',
    '神秘小礼物',
  ],
  challenge: [
    '用rap方式展示项目',
    '即兴表演一段舞蹈',
    '模仿超级英雄介绍项目',
    '用默剧方式展示项目',
    '倒立10秒',
    '和陌生人自拍',
    '现场创作一首诗',
  ],
};

export default function LuckyWheelPage() {
  const [selectedTab, setSelectedTab] = useState('normal');
  const [spinning, setSpinning] = useState(false);
  const [prizes, setPrizes] = useState(defaultPrizes);
  const [newPrize, setNewPrize] = useState('');

  const handleAddPrize = () => {
    if (!newPrize.trim()) {
      toast.error('请输入奖项内容');
      return;
    }

    setPrizes((prev) => ({
      ...prev,
      [selectedTab]: [...prev[selectedTab as keyof typeof prizes], newPrize],
    }));
    setNewPrize('');
    toast.success('添加成功！');
  };

  const handleRemovePrize = (index: number) => {
    setPrizes((prev) => ({
      ...prev,
      [selectedTab]: prev[selectedTab as keyof typeof prizes].filter((_, i) => i !== index),
    }));
    toast.success('删除成功！');
  };

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 5000);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">幸运大转盘</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="normal" onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="normal">正常奖品</TabsTrigger>
                <TabsTrigger value="fun">搞怪奖品</TabsTrigger>
                <TabsTrigger value="challenge">大冒险</TabsTrigger>
              </TabsList>

              <TabsContent value="normal" className="space-y-4">
                <PrizeList
                  prizes={prizes.normal}
                  onRemove={handleRemovePrize}
                />
              </TabsContent>
              <TabsContent value="fun" className="space-y-4">
                <PrizeList
                  prizes={prizes.fun}
                  onRemove={handleRemovePrize}
                />
              </TabsContent>
              <TabsContent value="challenge" className="space-y-4">
                <PrizeList
                  prizes={prizes.challenge}
                  onRemove={handleRemovePrize}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPrize}
                  onChange={(e) => setNewPrize(e.target.value)}
                  placeholder="输入新奖项..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPrize()}
                />
                <Button onClick={handleAddPrize}>添加</Button>
              </div>
            </div>
          </div>

          <div>
            <Card className="p-6">
              <LuckyWheel
                prizes={prizes[selectedTab as keyof typeof prizes]}
                spinning={spinning}
              />
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleSpin}
                disabled={spinning}
              >
                {spinning ? '抽奖中...' : '开始抽奖'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrizeList({
  prizes,
  onRemove,
}: {
  prizes: string[];
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {prizes.map((prize, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded-lg bg-muted"
        >
          <span>{prize}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            删除
          </Button>
        </div>
      ))}
    </div>
  );
}
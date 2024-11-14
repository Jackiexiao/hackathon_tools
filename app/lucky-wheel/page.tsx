"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LuckyWheel } from '@/components/lucky-wheel';
import { PrizeCategory } from '@/components/lucky-wheel/prize-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultPrizes = {
  normal: [
    '纪念T恤',
    '定制马克杯',
    '限量版贴纸包',
    '精美徽章',
    '电子奖状',
    '优秀项目证书',
    '神秘小礼物',
  ],
  fun: [
    '模仿一位评委的表情和动作',
    '即兴说唱你的项目',
    '用方言介绍你的项目',
    '和旁边的人换座位',
    '做三个俯卧撑',
    '给大家讲一个笑话',
    '原地转圈10秒',
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
  const [selectedTab, setSelectedTab] = useState<keyof typeof defaultPrizes>('normal');
  const [prizes, setPrizes] = useState(defaultPrizes);

  const handleAddPrize = (prize: string) => {
    setPrizes(prev => ({
      ...prev,
      [selectedTab]: [...prev[selectedTab], prize],
    }));
  };

  const handleRemovePrize = (index: number) => {
    setPrizes(prev => ({
      ...prev,
      [selectedTab]: prev[selectedTab].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">幸运大转盘</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <Tabs defaultValue="normal" onValueChange={(v) => setSelectedTab(v as keyof typeof prizes)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="normal">普通奖项</TabsTrigger>
                  <TabsTrigger value="fun">趣味奖项</TabsTrigger>
                  <TabsTrigger value="challenge">挑战奖项</TabsTrigger>
                </TabsList>
                <TabsContent value={selectedTab}>
                  <PrizeCategory
                    prizes={prizes[selectedTab]}
                    onAddPrize={handleAddPrize}
                    onRemovePrize={handleRemovePrize}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <LuckyWheel prizes={prizes[selectedTab]} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
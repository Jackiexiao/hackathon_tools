import React, { useState } from 'react';
import WheelComponent from 'react-wheel-of-fortune';
import { toast } from 'react-hot-toast';

export function Wheel() {
  const [items, setItems] = useState(['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖']);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSpinComplete = (prizeIndex: number) => {
    const prize = items[prizeIndex];
    
    toast.success(`恭喜你抽中了 ${prize}！`, {
      duration: 3000,
      position: 'top-center',
    });
  };

  return (
    <div>
      <WheelComponent
        segments={items}
        textOrientation="horizontal"
        segColors={['#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF']}
        winningSegment={selectedItem}
        onFinished={handleSpinComplete}
        primaryColor="#333333"
        contrastColor="#FFFFFF"
        buttonText="开始抽奖"
        isOnlyOnce={false}
        size={290}
        fontFamily="Arial"
      />
    </div>
  );
} 
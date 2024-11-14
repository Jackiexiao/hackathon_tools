import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface PrizeCategoryProps {
  prizes: string[];
  onAddPrize: (prize: string) => void;
  onRemovePrize: (index: number) => void;
}

export function PrizeCategory({
  prizes,
  onAddPrize,
  onRemovePrize,
}: PrizeCategoryProps) {
  const [newPrize, setNewPrize] = useState("");

  const handleAddPrize = () => {
    if (!newPrize.trim()) {
      toast.error("请输入奖项内容");
      return;
    }
    onAddPrize(newPrize.trim());
    setNewPrize("");
  };

  return (
    <div className="space-y-4">
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
              onClick={() => onRemovePrize(index)}
            >
              删除
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newPrize}
          onChange={(e) => setNewPrize(e.target.value)}
          placeholder="输入新奖项..."
          onKeyDown={(e) => e.key === "Enter" && handleAddPrize()}
        />
        <Button onClick={handleAddPrize}>添加</Button>
      </div>
    </div>
  );
}
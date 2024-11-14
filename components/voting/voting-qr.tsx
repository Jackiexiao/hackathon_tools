import { Card } from "@/components/ui/card";
import Image from "next/image";

interface VotingQRProps {
  qrCode: string;
  timeLeft: number;
}

export function VotingQR({ qrCode, timeLeft }: VotingQRProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <Card className="p-6 text-center">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">投票进行中</h2>
        <p className="text-muted-foreground">
          剩余时间: {minutes}:{seconds}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <Image
            src={qrCode}
            alt="投票二维码"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </Card>
  );
}
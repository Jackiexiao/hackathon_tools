import { Card } from "@/components/ui/card";

interface VotingQRProps {
  qrCode: string;
  timeLeft: number | null;
}

export function VotingQR({ qrCode, timeLeft }: VotingQRProps) {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="shrink-0">
          <img
            src={qrCode}
            alt="Vote QR Code"
            className="w-32 h-32"
          />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-2">
            扫码参与投票
          </h3>
          <p className="text-muted-foreground mb-4">
            或复制下方链接分享给他人
          </p>
          <div className="text-2xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </Card>
  );
} 
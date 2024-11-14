"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Vote } from '@/types/vote';
import { VotingQR } from '@/components/voting/voting-qr';
import { TeamList } from '@/components/voting/team-list';
import QRCode from 'qrcode';
import { Input } from '@/components/ui/input';

export default function VotingStatsPage({ params }: { params: { id: string } }) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const loadVote = async () => {
      try {
        const response = await fetch(`/api/votes/${params.id}`);
        if (!response.ok) {
          throw new Error('投票不存在或已结束');
        }
        const data = await response.json();
        setVote(data);
        
        // 生成投票页面的二维码
        const voteUrl = `${window.location.origin}/vote/${params.id}`;
        const qr = await QRCode.toDataURL(voteUrl);
        setQrCode(qr);
      } catch (error) {
        setError(error instanceof Error ? error.message : '加载投票失败');
      } finally {
        setLoading(false);
      }
    };

    loadVote();
    
    // 定期更新投票数据
    const updateInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/votes/${params.id}`);
        const data = await response.json();
        setVote(data);
      } catch (error) {
        console.error('Failed to update votes:', error);
      }
    }, 3000);

    // 倒计时
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(countdownInterval);
    };
  }, [params.id]);

  const handleCopyVoteUrl = () => {
    const voteUrl = `${window.location.origin}/vote/${params.id}`;
    navigator.clipboard.writeText(voteUrl).then(() => {
      toast.success('投票链接已复制！');
    });
  };

  if (loading) {
    return (
      <div className="container py-10">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center">加载中...</div>
        </Card>
      </div>
    );
  }

  if (error || !vote) {
    return (
      <div className="container py-10">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center text-red-500">{error}</div>
        </Card>
      </div>
    );
  }

  const voteUrl = `${window.location.origin}/vote/${params.id}`;

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">{vote.metadata.title}</h1>
        
        <VotingQR qrCode={qrCode} timeLeft={timeLeft} />
        
        <Card className="p-6">
          <div className="flex gap-2 mb-4">
            <Input
              value={voteUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button 
              variant="outline"
              onClick={handleCopyVoteUrl}
            >
              复制链接
            </Button>
          </div>
          
          <TeamList
            teams={vote.metadata.teams.map(team => ({
              ...team,
              votes: vote.votes[team.id] || 0,
            }))}
            showVotes={true}
          />
        </Card>
      </div>
    </div>
  );
} 
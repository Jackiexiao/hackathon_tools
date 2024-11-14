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
import { VoteResults } from '@/components/voting/vote-results';
import { MessageStream } from '@/components/voting/message-stream';

export default function VotingStatsPage({ params }: { params: { id: string } }) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);

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
          setShowResults(true);
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

  const handleEndVoting = async () => {
    try {
      const response = await fetch(`/api/votes/${params.id}/end`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('结束投票失败');
      }

      setShowResults(true);
      toast.success('投票已结束！');
    } catch (error) {
      toast.error('结束投票失败，请重试');
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
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
    <div className="container py-6 lg:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 头部区域 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold truncate">
            {vote?.metadata.title}
          </h1>
          {!vote?.metadata.ended && !showResults && (
            <Button 
              variant="destructive"
              onClick={handleEndVoting}
              className="shrink-0 ml-4"
            >
              结束投票
            </Button>
          )}
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 投票信息和结果区域 */}
          <div className="xl:col-span-2 space-y-6">
            {!vote?.metadata.ended && (
              <>
                <VotingQR qrCode={qrCode} timeLeft={timeLeft} />
                <Card className="p-4 lg:p-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={voteUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline"
                      onClick={handleCopyVoteUrl}
                      className="shrink-0"
                    >
                      复制链接
                    </Button>
                  </div>
                  
                  <TeamList
                    teams={vote?.metadata.teams.map(team => ({
                      ...team,
                      votes: vote?.votes[team.id] || 0,
                    }))}
                    showVotes={true}
                  />
                </Card>
              </>
            )}
          </div>

          {/* 消息流区域 */}
          <div className="h-full">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-3">实时动态</h2>
              <MessageStream 
                messages={vote?.messages || []}
              />
            </div>
          </div>
        </div>

        {/* 结果弹窗 */}
        {(showResults || vote?.metadata.ended) && (
          <VoteResults 
            teams={vote?.metadata.teams || []}
            votes={vote?.votes || {}}
            show={true}
            onClose={handleCloseResults}
          />
        )}
      </div>
    </div>
  );
} 
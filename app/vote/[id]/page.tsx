"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Vote } from '@/types/vote';

export default function VotePage({ params }: { params: { id: string } }) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/votes/${params.id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: '获取投票信息失败' }));
          throw new Error(errorData.error || '获取投票信息失败');
        }
        return res.json();
      })
      .then(data => {
        setVote(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const handleVote = async () => {
    if (!vote || selectedTeams.length === 0) return;

    if (selectedTeams.length > vote.metadata.maxVotesPerUser) {
      toast.error(`每人最多只能投${vote.metadata.maxVotesPerUser}个队伍`);
      return;
    }

    try {
      const response = await fetch(`/api/votes/${params.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams: selectedTeams }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '投票失败');
      }
      
      toast.success('投票成功！');
      
      // 重新加载投票数据
      const voteResponse = await fetch(`/api/votes/${params.id}`);
      if (!voteResponse.ok) {
        throw new Error('更新投票数据失败');
      }
      const updatedVote = await voteResponse.json();
      setVote(updatedVote);
      setSelectedTeams([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '投票失败，请重试');
    }
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
          <div className="text-center">
            {error || '投票不存在或已结束'}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{vote.metadata.title}</h1>
        <p className="text-muted-foreground mb-6">
          请选择要投票的队伍（最多可选 {vote.metadata.maxVotesPerUser} 个）
        </p>
        
        <div className="space-y-4">
          {vote.metadata.teams.map(team => (
            <Button
              key={team.id}
              variant={selectedTeams.includes(team.id) ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => {
                setSelectedTeams(prev => 
                  prev.includes(team.id)
                    ? prev.filter(id => id !== team.id)
                    : prev.length < vote.metadata.maxVotesPerUser
                    ? [...prev, team.id]
                    : prev
                );
              }}
            >
              <span>{team.name}</span>
              <span className="text-sm text-muted-foreground">
                {vote.votes[team.id] || 0} 票
              </span>
            </Button>
          ))}
        </div>

        <Button
          className="w-full mt-6"
          onClick={handleVote}
          disabled={selectedTeams.length === 0}
        >
          提交投票
        </Button>
      </Card>
    </div>
  );
} 
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Progress } from '@/components/ui/progress';
import { TeamList } from '@/components/voting/team-list';
import { VotingQR } from '@/components/voting/voting-qr';
import { useRouter } from 'next/navigation';

export default function VotingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [maxVotesPerUser, setMaxVotesPerUser] = useState(1);
  const [voteDuration, setVoteDuration] = useState(3);
  const [teams, setTeams] = useState<{ id: string; name: string; votes: number }[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTeam = () => {
    if (!newTeam.trim()) {
      toast.error('请输入队伍名称');
      return;
    }

    setTeams(prev => [
      ...prev,
      { id: Date.now().toString(), name: newTeam.trim(), votes: 0 },
    ]);
    setNewTeam('');
    toast.success('队伍添加成功！');
  };

  const handleRemoveTeam = (id: string) => {
    setTeams(prev => prev.filter(team => team.id !== id));
    toast.success('队伍删除成功！');
  };

  const handleStartVoting = async () => {
    if (teams.length < 2) {
      toast.error('至少需要两个队伍才能开始投票');
      return;
    }

    if (!title.trim()) {
      toast.error('请输入投票主题');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          maxVotesPerUser,
          voteDuration,
          teams: teams.map(t => ({ id: t.id, name: t.name })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create vote');
      }

      const data = await response.json();
      router.push(`/voting/${data.id}`);
      toast.success('投票已创建！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建投票失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">现场投票系统</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">投票主题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入投票主题..."
                />
              </div>
              
              <div>
                <Label htmlFor="maxVotes">每人最多可投队伍数</Label>
                <Input
                  id="maxVotes"
                  type="number"
                  min={1}
                  value={maxVotesPerUser}
                  onChange={(e) => setMaxVotesPerUser(parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="voteDuration">投票时长（分钟）</Label>
                <Input
                  id="voteDuration"
                  type="number"
                  min={1}
                  value={voteDuration}
                  onChange={(e) => setVoteDuration(parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="newTeam">添加参赛队伍</Label>
                <div className="flex gap-2">
                  <Input
                    id="newTeam"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    placeholder="输入队伍名称..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                  />
                  <Button onClick={handleAddTeam}>添加</Button>
                </div>
              </div>
            </div>
          </Card>

          <TeamList
            teams={teams}
            onRemoveTeam={handleRemoveTeam}
          />

          {teams.length > 0 && (
            <Button
              className="w-full"
              size="lg"
              onClick={handleStartVoting}
              disabled={loading}
            >
              {loading ? '创建中...' : '开始投票'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
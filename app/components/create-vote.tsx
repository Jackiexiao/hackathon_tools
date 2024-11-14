"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export function CreateVoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [maxVotes, setMaxVotes] = useState(1);
  const [voteDuration, setVoteDuration] = useState(3);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('请输入投票标题');
      return;
    }
    if (teams.length < 2) {
      toast.error('至少需要两个队伍');
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
          maxVotesPerUser: maxVotes,
          voteDuration,
          teams: teams.map(team => ({ id: team.id, name: team.name })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '创建投票失败');
      }

      toast.success('投票创建成功！');
      // 直接跳转到投票管理页面
      router.push(`/voting/${data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建投票失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            投票标题
          </label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="输入投票标题"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              每人最多可投队伍数
            </label>
            <Input
              type="number"
              min={1}
              value={maxVotes}
              onChange={e => setMaxVotes(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              投票时长（分钟）
            </label>
            <Input
              type="number"
              min={1}
              value={voteDuration}
              onChange={e => setVoteDuration(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTeam}
                onChange={e => setNewTeam(e.target.value)}
                placeholder="输入队伍名称"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTeam.trim()) {
                      setTeams(prev => [...prev, { 
                        id: crypto.randomUUID(),
                        name: newTeam.trim() 
                      }]);
                      setNewTeam('');
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (newTeam.trim()) {
                    setTeams(prev => [...prev, { 
                      id: crypto.randomUUID(),
                      name: newTeam.trim() 
                    }]);
                    setNewTeam('');
                  }
                }}
              >
                添加
              </Button>
            </div>

            <div className="space-y-2">
              {teams.map((team, index) => (
                <div key={team.id} className="flex items-center gap-2">
                  <div className="flex-1 p-2 bg-muted rounded-md">
                    {team.name}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTeams(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    删除
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={loading}
      >
        {loading ? '创建中...' : '创建投票'}
      </Button>
    </form>
  );
} 
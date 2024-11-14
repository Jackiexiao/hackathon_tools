"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Progress } from '@/components/ui/progress';

export default function VotingPage() {
  const [teams, setTeams] = useState<{ id: string; name: string; votes: number }[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [votingStarted, setVotingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [qrCode, setQrCode] = useState('');

  const handleAddTeam = () => {
    if (!newTeam.trim()) {
      toast.error('请输入队伍名称');
      return;
    }

    setTeams((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newTeam.trim(), votes: 0 },
    ]);
    setNewTeam('');
    toast.success('队伍添加成功！');
  };

  const handleRemoveTeam = (id: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
    toast.success('队伍删除成功！');
  };

  const handleStartVoting = async () => {
    if (teams.length < 2) {
      toast.error('至少需要两个队伍才能开始投票');
      return;
    }

    // Generate voting URL and QR code
    const votingUrl = `${window.location.origin}/voting/${Date.now()}`;
    try {
      const qr = await QRCode.toDataURL(votingUrl);
      setQrCode(qr);
    } catch (err) {
      console.error(err);
    }

    setVotingStarted(true);
    toast.success('投票已开始！');

    // Start countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVotingStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const simulateVote = () => {
    if (!votingStarted) return;
    
    setTeams((prev) => {
      const randomIndex = Math.floor(Math.random() * prev.length);
      return prev.map((team, index) => 
        index === randomIndex 
          ? { ...team, votes: team.votes + 1 }
          : team
      );
    });
  };

  // Simulate real-time voting
  useState(() => {
    if (votingStarted) {
      const interval = setInterval(simulateVote, 2000);
      return () => clearInterval(interval);
    }
  });

  const totalVotes = teams.reduce((sum, team) => sum + team.votes, 0);

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">现场投票系统</h1>

        {!votingStarted ? (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">添加参赛队伍</h2>
              <div className="flex gap-2">
                <Input
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  placeholder="输入队伍名称..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                />
                <Button onClick={handleAddTeam}>添加</Button>
              </div>
            </Card>

            <div className="grid gap-4">
              {teams.map((team) => (
                <Card key={team.id} className="p-4 flex justify-between items-center">
                  <span className="font-medium">{team.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveTeam(team.id)}
                  >
                    删除
                  </Button>
                </Card>
              ))}
            </div>

            {teams.length > 0 && (
              <Button
                className="w-full"
                size="lg"
                onClick={handleStartVoting}
              >
                开始投票
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">投票进行中</h2>
                <p className="text-muted-foreground">
                  剩余时间: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center mb-6">
                  <img src={qrCode} alt="Voting QR Code" className="w-48 h-48" />
                </div>
              )}

              <div className="space-y-4">
                {teams
                  .sort((a, b) => b.votes - a.votes)
                  .map((team) => (
                    <div key={team.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-muted-foreground">
                          {team.votes} 票 ({totalVotes > 0 ? Math.round((team.votes / totalVotes) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress
                        value={totalVotes > 0 ? (team.votes / totalVotes) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
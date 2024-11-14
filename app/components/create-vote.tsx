import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export function CreateVoteForm() {
  const [title, setTitle] = useState('');
  const [maxVotes, setMaxVotes] = useState(1);
  const [teams, setTeams] = useState<string[]>([]);
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          maxVotesPerUser: maxVotes,
          teams,
        }),
      });

      const data = await response.json();
      const voteUrl = `${window.location.origin}/vote/${data.id}`;
      
      // 生成二维码
      const qrCodeDataUrl = await QRCode.toDataURL(voteUrl);
      setQrCode(qrCodeDataUrl);
      
      toast.success('投票创建成功！');
    } catch (error) {
      toast.error('创建投票失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
} 
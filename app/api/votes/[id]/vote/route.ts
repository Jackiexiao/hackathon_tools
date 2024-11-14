import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import type { Vote, Message, UserVoteRecord } from '@/types/vote';

const VOTES_DIR = path.join(process.cwd(), 'data', 'votes');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface VoteRequestBody {
  teams: string[];
  comment?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as VoteRequestBody;
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    const filePath = path.join(VOTES_DIR, `${params.id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as Vote;

    // 检查投票是否已结束
    if (data.metadata.ended) {
      return NextResponse.json(
        { error: '投票已结束' },
        { status: 400 }
      );
    }

    // 获取用户的投票记录
    const userVotes: UserVoteRecord = data.voters[ip] || { votedTeams: [], voteCount: 0 };

    // 检查投票次数是否超过限制
    if (userVotes.voteCount >= data.metadata.maxVotesPerUser) {
      return NextResponse.json(
        { error: '已达到最大投票次数' },
        { status: 400 }
      );
    }

    // 检查是否重复投票给同一个队伍
    const duplicateVotes = body.teams.filter(teamId => 
      userVotes.votedTeams.includes(teamId)
    );
    if (duplicateVotes.length > 0) {
      return NextResponse.json(
        { error: '不能重复投票给同一个队伍' },
        { status: 400 }
      );
    }

    // 更新投票计数
    body.teams.forEach(teamId => {
      data.votes[teamId] = (data.votes[teamId] || 0) + 1;
    });

    // 更新用户投票记录
    data.voters[ip] = {
      votedTeams: [...userVotes.votedTeams, ...body.teams],
      voteCount: userVotes.voteCount + 1
    };

    // 获取队伍名称
    const teamNames = body.teams
      .map(teamId => data.metadata.teams.find(t => t.id === teamId)?.name)
      .filter((name): name is string => name !== undefined);

    // 添加消息
    const message: Message = {
      id: uuidv4(),
      type: 'vote',
      content: body.comment || '',
      timestamp: new Date().toISOString(),
      teamNames
    };

    data.messages = [...(data.messages || []), message];
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      success: true,
      remainingVotes: data.metadata.maxVotesPerUser - (userVotes.voteCount + 1)
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: '投票失败' },
      { status: 500 }
    );
  }
} 
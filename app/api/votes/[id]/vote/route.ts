import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { headers, cookies } from 'next/headers';
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
    const cookieStore = cookies();
    const userToken = cookieStore.get('voter_token')?.value || uuidv4();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    const userId = `${ip}_${userToken}`;
    
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
    const userVotes = data.voters[userId] || { votedTeams: [], hasVoted: false };

    // 检查用户是否已经投过票
    if (userVotes.hasVoted) {
      return NextResponse.json(
        { error: '您已经参与过投票' },
        { status: 400 }
      );
    }

    // 检查选择的队伍数量是否符合限制
    if (body.teams.length > data.metadata.maxVotesPerUser) {
      return NextResponse.json(
        { error: `每人最多只能选择 ${data.metadata.maxVotesPerUser} 个队伍` },
        { status: 400 }
      );
    }

    // 更新投票计数
    body.teams.forEach(teamId => {
      data.votes[teamId] = (data.votes[teamId] || 0) + 1;
    });

    // 更新用户投票记录
    data.voters[userId] = {
      votedTeams: body.teams,
      hasVoted: true
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
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('voter_token', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 天
    });
    
    return response;
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: '投票失败' },
      { status: 500 }
    );
  }
} 
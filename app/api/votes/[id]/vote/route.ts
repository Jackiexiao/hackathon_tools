import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import type { Vote, Message } from '../../../../types/vote';

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

    if (data.metadata.ended) {
      return NextResponse.json(
        { error: '投票已结束' },
        { status: 400 }
      );
    }

    // 更新投票计数
    for (const teamId of body.teams) {
      data.votes[teamId] = (data.votes[teamId] || 0) + 1;
    }

    // 记录投票者
    data.voters[ip] = [...(data.voters[ip] || []), ...body.teams];

    // 获取队伍名称并过滤掉 undefined
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: '投票失败' },
      { status: 500 }
    );
  }
} 
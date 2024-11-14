import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';

const VOTES_DIR = path.join(process.cwd(), 'data', 'votes');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    const filePath = path.join(VOTES_DIR, `${params.id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // 检查是否已经投过票
    if (data.voters[ip]?.length >= data.metadata.maxVotesPerUser) {
      return NextResponse.json(
        { error: '您已达到最大投票次数' },
        { status: 400 }
      );
    }
    
    // 检查选择的队伍数量是否超过限制
    if (body.teams.length > data.metadata.maxVotesPerUser) {
      return NextResponse.json(
        { error: `每人最多只能投${data.metadata.maxVotesPerUser}个队伍` },
        { status: 400 }
      );
    }
    
    // 更新投票数据
    body.teams.forEach((teamId: string) => {
      data.votes[teamId] = (data.votes[teamId] || 0) + 1;
    });
    
    // 记录投票者
    data.voters[ip] = [...(data.voters[ip] || []), ...body.teams];
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: '投票处理失败' },
      { status: 500 }
    );
  }
} 
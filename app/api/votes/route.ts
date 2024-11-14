import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const VOTES_DIR = path.join(process.cwd(), 'data', 'votes');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = uuidv4();
    
    const voteData = {
      metadata: {
        id,
        title: body.title,
        createdAt: new Date().toISOString(),
        maxVotesPerUser: body.maxVotesPerUser,
        teams: body.teams.map((team: any) => ({
          id: team.id,
          name: team.name
        })),
      },
      votes: Object.fromEntries(body.teams.map((team: any) => [team.id, 0])),
      voters: {},
    };

    await fs.mkdir(VOTES_DIR, { recursive: true });
    await fs.writeFile(
      path.join(VOTES_DIR, `${id}.json`),
      JSON.stringify(voteData, null, 2)
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Create vote error:', error);
    return NextResponse.json(
      { error: '创建投票失败' },
      { status: 500 }
    );
  }
} 
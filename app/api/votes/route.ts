import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const VOTES_DIR = path.join(process.cwd(), 'data', 'votes');

export async function POST(request: Request) {
  const body = await request.json();
  const id = uuidv4();
  
  const voteData = {
    metadata: {
      id,
      title: body.title,
      createdAt: new Date(),
      maxVotesPerUser: body.maxVotesPerUser,
      teams: body.teams,
    },
    votes: {},
    voters: {},
  };

  await fs.mkdir(VOTES_DIR, { recursive: true });
  await fs.writeFile(
    path.join(VOTES_DIR, `${id}.json`),
    JSON.stringify(voteData, null, 2)
  );

  return NextResponse.json({ id });
} 
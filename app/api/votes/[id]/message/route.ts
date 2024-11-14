import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const VOTES_DIR = path.join(process.cwd(), 'data', 'votes');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const filePath = path.join(VOTES_DIR, `${params.id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const message = {
      id: uuidv4(),
      content: body.content,
      timestamp: new Date().toISOString(),
      type: body.type,
      teamNames: body.teamNames,
    };

    data.messages = [...(data.messages || []), message];
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json(
      { error: '发送失败' },
      { status: 500 }
    );
  }
} 
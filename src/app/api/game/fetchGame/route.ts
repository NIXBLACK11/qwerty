import { getQWERTYGameById } from '@/app/utils/dbFunctions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameID = searchParams.get('gameID');
    
    if (!gameID) {
      return NextResponse.json({ error: 'Missing gameID parameter' }, { status: 400 });
    }

    const gameData = await getQWERTYGameById(gameID);

    if (!gameData) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ game: gameData });
  } catch (error) {
    console.error('Error in GET /qwerty-game:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

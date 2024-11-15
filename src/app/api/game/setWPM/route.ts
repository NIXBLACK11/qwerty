import { NextRequest, NextResponse } from 'next/server';
import { updatePlayerWPM } from '@/app/utils/dbFunctions';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameID = searchParams.get('gameID');
    const playerNumber = parseInt(searchParams.get('playerNumber') || '0', 10);
    const wpm = parseFloat(searchParams.get('wpm') || '0');

    if (!gameID || !playerNumber || isNaN(wpm)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const updatedGame = await updatePlayerWPM(gameID, playerNumber, wpm);

    return NextResponse.json({ success: true, game: updatedGame });
  } catch {
    return NextResponse.json({ error: 'Internal server error'}, { status: 500 });
  }
}

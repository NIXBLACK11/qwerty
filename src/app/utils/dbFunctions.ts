import dbConnect from "./dbConnect";
import logger from "./logger";
import { FullQWERTYGame, IQWERTYGame, JQWERTYGame } from "./types";
import QWERTYGame from "@/models/QWERTY";

  export async function createQWERTYGameBackend(
    QWERTYGameData: IQWERTYGame,
  ): Promise<String | null> {
    try {
      await dbConnect();
      logger.info(`Creating a new QWERTY game in the database:`);
      console.log(QWERTYGameData);
  
      const newGame = new QWERTYGame({
        name: QWERTYGameData.name,
        wager: QWERTYGameData.wager,
        player1Account: QWERTYGameData.player1Account,
      });
  
      const savedGame = await newGame.save();
  
      logger.info(`QWERTY game created successfully with ID: ${savedGame._id}`);
  
      return savedGame._id;
    } catch (error) {
      logger.error(`Error creating roulette game in MongoDB: ${error}`);
      return null;
    }
}

export async function getQWERTYGameById(gameID: string): Promise<FullQWERTYGame | null> {
	try {
	  await dbConnect();
	  logger.info(`Fetching QWERTY game with ID: ${gameID}`);
	  
	  const game = await QWERTYGame.findById(gameID).exec();
	  
	  if (!game) {
		logger.error(`Game with ID ${gameID} not found`);
		return null;
	  }
  
	  const fullGame: FullQWERTYGame = {
		id: game._id.toString(),
		name: game.name,
		wager: game.wager,
		player1Account: game.player1Account,
		player2Account: game.player2Account,
		player1WPM: game.player1WPM,
		player2WPM: game.player2WPM,
		player1Joined: game.player1Joined,
		player2Joined: game.player2Joined,
		winner: game.winner,
	  };
  
	  logger.info(`Game found: ${JSON.stringify(fullGame)}`);
	  return fullGame;
	} catch (error) {
	  logger.error(`Error fetching QWERTY game: ${error}`);
	  return null;
	}
}

export async function completeQWERTYGameBackend(
	QWERTYGameData: JQWERTYGame
  ): Promise<boolean> {
	try {
	  await dbConnect();
	  logger.info(`Completing the game: ${QWERTYGameData.id}`);
  
	  const result = await QWERTYGame.findByIdAndUpdate(
		QWERTYGameData.id,
		{ player2Account: QWERTYGameData.player2Account },
		{ new: true } // returns the updated document
	  );
  
	  if (!result) {
		throw new Error("Game not found or update failed");
	  }
  
	  logger.info(`Game updated successfully with player2Account: ${QWERTYGameData.player2Account}`);
	  return true;
	} catch (error) {
	  logger.error(`Error completing the game in MongoDB: ${error}`);
	  return false;
	}
  }
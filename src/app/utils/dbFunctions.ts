import dbConnect from "./dbConnect";
import logger from "./logger";
import { FullQWERTYGame, IQWERTYGame } from "./types";
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

    logger.info(`Game found: ${JSON.stringify(game)}`);
    return game;
  } catch (error) {
    logger.error(`Error fetching QWERTY game: ${error}`);
    return null;
  }
}

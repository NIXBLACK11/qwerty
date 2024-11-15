import { FullQWERTYGame } from "../utils/types"

interface CompleteGameProps {
    game: FullQWERTYGame;
  }
  
export const CompleteGame: React.FC<CompleteGameProps> = ({game}) => {
    const winnerWPM = (game.winner==="1") ? game.player1WPM : game.player2WPM;
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="text-5xl text-accent py-10">This game has been completed!</h1>
            <p className="text-white py-10">Player {game.winner} has won the game with a WPM of {winnerWPM}</p>
        </div>
    )
}
import { FiArrowRight } from "react-icons/fi"

import { FullQWERTYGame } from "../utils/types"

interface CompleteGameProps {
    game: FullQWERTYGame;
  }

export const PlayerOneCompletedGame: React.FC<CompleteGameProps> = ({game}) => {
    const link = `https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fqwerty.nixblack.site%2Fapi%2Factions%2Fjoin-game%3FgameID%3D${game.id}%26name%3D${game.name}&cluster=devnet`
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="text-5xl text-accent py-10">Player 1 has played his chance share this to player 2</h1>
            <a
                href={link}
                className="text-white py-10 flex items-center gap-2 hover:underline"
            >
                Share this link to player2
                <FiArrowRight />
            </a>
        </div>
    )
}
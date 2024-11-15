"use client"

import { Game } from "../../components/Game";
import { useEffect, useState } from "react";
import { FullQWERTYGame } from "@/app/utils/types";
import { useParams, useRouter } from "next/navigation";
import { CompleteGame } from "@/app/components/CompleteGame";
import { NoSuchGame } from "@/app/components/NoSuchGame";
import { PlayerOneCompletedGame } from "@/app/components/PlayerOneCompletedGame";

export default function Page() {
	const { gameID } = useParams<{ gameID: string }>();
	const router = useRouter();
	const [player, setPlayer] = useState<number>(0);
	const [gameState, setGameState] = useState<string>("NoSuchGame");
	const [game, setGame] = useState<FullQWERTYGame>();

	useEffect(() => {
		if (!gameID) {
			router.push('../../');
		}
	
		const fetchGameData = async () => {
		  try {
			const response = await fetch(`/api/game/fetchGame?gameID=${gameID}`);
			
			if (!response.ok) {
			  throw new Error(`Error: ${response.statusText}`);
			}
	
			const data = await response.json();
			const gameData: FullQWERTYGame = data.game;
			setGame(gameData);
			if(!data.game) {
				console.error("No game found!!");
				setGameState("NoSuchGame");
				return;
			}
			if(gameData.player1Joined==true && gameData.player1WPM!=0 && gameData.player2Joined==true && gameData.player2WPM!=0) {
				setGameState("CompleteGame");
			} else if(gameData.player1Joined==false && gameData.player1WPM==0 && gameData.player1Account!="") {
				setGameState("Game");
				setPlayer(1);
			} else if(gameData.player2Joined==false && gameData.player2WPM==0 && gameData.player2Account!="") {
				setGameState("Game");
				setPlayer(2);
			} else if(gameData.player1Account!="" && gameData.player1Joined==true && gameData.player1WPM!=0 && gameData.player2Account=="") {
				setGameState("PlayerOneCompletedGame");
			}
		  } catch (err) {
			console.error('Failed to fetch game data:', err);
		  }
		};
	
		fetchGameData();
	  }, [gameID]);

	  const renderComponent = () => {
		switch (gameState) {
			case 'Game':
				return <Game player={player} gameID={gameID}/>;
			case 'CompleteGame':
				return <CompleteGame game={game as FullQWERTYGame}/>;
			case 'NoSuchGame':
				return <NoSuchGame/>;
			case 'PlayerOneCompletedGame':
				return <PlayerOneCompletedGame  game={game as FullQWERTYGame}/>
			default:
				return null;
		}
	}
	return (
		<div className="w-screen h-screen flex flex-col items-center bg-background">
			<h1 className="text-6xl text-accent pt-10 font-bold">QWERTY</h1>
			{renderComponent()}
		</div>
	);
}

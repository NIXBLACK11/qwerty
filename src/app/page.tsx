"use client"
import { useEffect, useState } from "react";

export default function Page() {
	const [displayText, setDisplayText] = useState('Q');
	const [index, setIndex] = useState(0);
	const text = "QWERTY";
  
	useEffect(() => {
		const typingInterval = setInterval(() => {
			if (index < text.length) {
				setDisplayText(text.slice(0, index + 1));
				setIndex(index + 1);
			} else {
				clearInterval(typingInterval);
				setDisplayText('Q');
				setIndex(0);
			}
		}, 500);
	
		return () => clearInterval(typingInterval);
	}, [text, index]);

	return (
		<div className="w-screen h-screen flex flex-col items-center bg-background">
			<div className="w-full h-3/5 flex flex-col justify-center items-center">
				<img src="black-bg.png" className="w-2/5"/>
				<h1 className="text-9xl text-accent">{displayText}</h1>
			</div>
			<div className="w-full h-2/5 flex justify-center items-center">
				<button
					className="bg- text-white text-3xl border-4 border-[#17B8BD] p-5 rounded-lg hover:bg-gray-800"	
					onClick={()=>{
						window.location.href = "https://dial.to/?action=solana-action%3Ahttp%3A%2F%2Flocalhost%3A3000%2Fapi%2Factions%2Fcreate-game&cluster=devnet"
					}}
				>
					Create a challenge
				</button>
			</div>
		</div>
	);
}

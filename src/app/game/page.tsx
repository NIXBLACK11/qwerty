import { Game } from "../components/Game";

export default function Page() {
	return (
		<div className="w-screen h-screen flex flex-col items-center bg-background rainbow-border">
			<h1 className="text-6xl text-accent p-10 font-bold content">QWERTY</h1>
			<Game/>
		</div>
	)
}
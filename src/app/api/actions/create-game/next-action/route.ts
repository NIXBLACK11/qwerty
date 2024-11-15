import { createQWERTYGameBackend } from "@/app/utils/dbFunctions";
import logger from "@/app/utils/logger";
import { jsonResponse } from "@/app/utils/response";
import { IQWERTYGame } from "@/app/utils/types";
import {
    createActionHeaders,
    NextActionPostRequest,
    ActionError,
    CompletedAction,
  } from "@solana/actions";
  import { PublicKey } from "@solana/web3.js";
import { StatusCodes } from "http-status-codes";
  
  const headers = createActionHeaders();
  
  export const GET = async () => {
    return Response.json({ message: "Method not supported" } as ActionError, {
      status: 403,
      headers,
    });
  };
  
  export const OPTIONS = async () => Response.json(null, { headers });
  
  export const POST = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const queryParams = new URLSearchParams(requestUrl.search);
    
        const name = queryParams.get('name');
        const wager = parseFloat(queryParams.get('wager') || "0.0");
  
        if (!name || !wager) {
          return jsonResponse({ error: "Error in extracting parameters" }, StatusCodes.INTERNAL_SERVER_ERROR, headers);
        }


		const body: NextActionPostRequest = await req.json();
		let account: PublicKey;
		try {
			account = new PublicKey(body.account);
		} catch {
			throw new Error("Invalid account provided");
		}
  
		let signature: string;
		try {
			signature = body.signature!;
			if (!signature) throw "Invalid signature";
		} catch {
			throw new Error('Invalid "signature" provided');
		}
  

		console.log(`Create game: ${name}, ${wager}`);
		const QWERTYGameData: IQWERTYGame = {
			name,
			wager,
			player1Account: account.toString()
		};
		const gameID = await createQWERTYGameBackend(QWERTYGameData);

		if(gameID==null) {
			throw new Error("Error in creating game!!");
		}
  
		const message = `Now it's time for you to complete the typing challenge to set the initial score. Once you've finished, others can join the game and try to beat your score.\n
Play now: https://qwerty.nixblack.site/game/${gameID}\n
Note: Others will only be able to join after you complete your turn.\n
Then you can Share your link so others can join: [https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fqwerty.nixblack.site%2Fapi%2Factions%2Fjoin-game%3FgameID%3D${gameID}%26name%3D${name}%26cluster%3Ddevnet]`
		logger.info(`[Create QWERTY next action] final response: ${message}`);
		
		const payload: CompletedAction = {
			type: "completed",
			icon: new URL("/black.jpg", requestUrl.origin).toString(),
			title: "Your game has been created successfully!",
			description: message,
			label: "Play your turn now!!",
		};
		console.log(payload)
		return jsonResponse(payload, StatusCodes.OK, headers);
	} catch (err) {
		logger.error(err);
		const actionError: ActionError = { message: "An unknown error occurred" };
		if (typeof err == "string") actionError.message = err;
		return jsonResponse(actionError, StatusCodes.BAD_REQUEST, headers);
	}
};
  
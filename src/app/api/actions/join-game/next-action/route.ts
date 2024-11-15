import { completeQWERTYGameBackend } from "@/app/utils/dbFunctions";
import logger from "@/app/utils/logger";
import { jsonResponse } from "@/app/utils/response";
import { JQWERTYGame } from "@/app/utils/types";
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
        logger.info("POST request received for join QWERTY");
  
        const requestUrl = new URL(req.url);
        const queryParams = new URLSearchParams(requestUrl.search);
        const name = queryParams.get('name');
        const gameID = queryParams.get('gameID');
  
        if (!name || !gameID) {
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
  
		const QWERTYGameData: JQWERTYGame = {
			id: gameID,
			player2Account: account.toString()
		};
		const success = await completeQWERTYGameBackend(QWERTYGameData);

		if(success==false) {
			throw new Error("Error in joining game!!");
		}
  
		const message = `You’ve been challenged! Now it's your turn to test your typing skills and beat the score.\n
Click here to play: https://qwerty.nixblack.site/${gameID}`
		logger.info(`[Create QWERTY next action] final response: ${message}`);
		
		const payload: CompletedAction = {
			type: "completed",
			icon: new URL("/black.jpg", requestUrl.origin).toString(),
			title: "You have joined the game successfully!",
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
  
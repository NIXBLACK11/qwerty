import logger from "@/app/utils/logger";
import { jsonResponse } from "@/app/utils/response";
import { cluster } from "@/app/utils/cluster";
import {
    ActionPostResponse,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
    ActionError,
    LinkedAction,
    ActionParameterSelectable,
  } from "@solana/actions";
  import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
  import { StatusCodes } from "http-status-codes";
import { createTransaction } from "@/app/utils/transaction";
import { getQWERTYGameById } from "@/app/utils/dbFunctions";
import { FullQWERTYGame } from "@/app/utils/types";

  const headers = createActionHeaders();
  const gameWalletPublicKey = process.env.GAME_WALLET_PUBLIC_KEY;

  const connection = new Connection(cluster.devnet, 'confirmed');
  
  export const GET = async (req: Request) => {
    try {
      logger.info("GET request received for join QWERTY");
  
      const requestUrl = new URL(req.url);
      const queryParams = new URLSearchParams(requestUrl.search);
  
      const name = queryParams.get('name');
      const gameID = queryParams.get('gameID');

      if (!name || !gameID) {
        return jsonResponse({ error: "Error in extracting parameters" }, StatusCodes.INTERNAL_SERVER_ERROR, headers);
      }
  
      const fullGame: FullQWERTYGame | null = await getQWERTYGameById(gameID);

      if(fullGame==null) {
        throw new Error("Error in fetching game, no such game!");
      }

      if(fullGame.name!=name) {
        throw new Error("Invalid details provided!");
      }

      if(fullGame.player1Joined==false) {
        throw new Error("Player 1 has not played yet!");
      }

      const href = `/api/actions/join-game?name=${name}&gameID=${gameID}`;
  
      const actions: LinkedAction[] = [
        {
          type: "transaction",
          label: `Join the challenge for ${fullGame.wager}SOL!`,
          href,
          parameters: [],
        },
      ];
  
      const payload: ActionGetResponse = {
        title: "Someone wants to test your typing speed😈!",
        icon: new URL("/black.jpg", requestUrl.origin).toString(),
        type: "action",
        description: `Player 1 has set a wager of ${fullGame.wager}SOL and completed the typing challenge! Now it’s your turn to beat their score and claim the win. Can you type faster?`,
        label: "Join the typing challenge!!",
        links: { actions },
      };
  
      logger.info("Payload constructed successfully: %o", payload);
      return jsonResponse(payload, StatusCodes.OK, headers);
    } catch (err) {
      logger.error(`An error occurred in GET handler: ${err}`);
      const actionError: ActionError = { message: "An unknown error occurred" };
      return jsonResponse(actionError, StatusCodes.BAD_REQUEST, headers);
    }
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
    
        const fullGame: FullQWERTYGame | null = await getQWERTYGameById(gameID);
  
        if(fullGame==null) {
          throw new Error("Error in fetching game, no such game!");
        }
  
        if(fullGame.name!=name) {
          throw new Error("Invalid details provided!");
        }

      const body: ActionPostRequest = await req.json();
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
        logger.info(`Account PublicKey validated: ${account.toString()}`);
      } catch (err) {
        logger.error(`Invalid account public key: ${body.account}`);
        return jsonResponse({ error: "Invalid public key probided!" }, StatusCodes.INTERNAL_SERVER_ERROR, headers);
      }
  
	  if(!gameWalletPublicKey) {
		throw new Error("Internal error!");
	  }
	  const gameWallet = new PublicKey(gameWalletPublicKey); 

	  const createTx = {
		accountPublicKey: account,
		gameWallet,
		currency: "SOL",
		amount: fullGame.wager,
		connection,
		cluster: cluster.devnet,
	  };
  
	  const tx = await createTransaction(createTx);
  
	  const { blockhash } = await connection.getLatestBlockhash();
  
	  const transaction = new Transaction({
		recentBlockhash: blockhash,
		feePayer: account,
	  }).add(...tx);
  
      const href = `/api/actions/join-game/next-action?name=${name}&gameID=${gameID}`;
      logger.info(`Redirecting to next action at: ${href}`);
  
      let payload: ActionPostResponse;
      try {
        payload = await createPostResponse({
          fields: {
            type: "transaction",
            transaction,
            message: "Join Challenge",
            links: { 
              next: { 
                type: "post", 
                href
              } 
            },
          },
        });
      } catch (err) {
        logger.error("Error in createPostResponse:", err);
        return jsonResponse({ error: "Failed to create post response" }, StatusCodes.INTERNAL_SERVER_ERROR, headers);
      }
  
      logger.info("Response payload created successfully");
      return jsonResponse(payload, StatusCodes.OK, headers);
    } catch (err) {
      logger.error("An error occurred in POST handler:", err);
      const actionError: ActionError = { message: "An unknown error occurred" };
      return jsonResponse(actionError, StatusCodes.BAD_REQUEST, headers);
    }
  };

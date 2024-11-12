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

  const headers = createActionHeaders();
  const gameWalletPublicKey = process.env.GAME_WALLET_PUBLIC_KEY;

  const connection = new Connection(cluster.devnet, 'confirmed');
  
  export const GET = async (req: Request) => {
    try {
      logger.info("GET request received for QWERTY");
  
      const requestUrl = new URL(req.url);
  
      const href = `/api/actions/create-game?name={name}&wager={wager}`;
  
      const actions: LinkedAction[] = [
        {
          type: "transaction",
          label: "Create the challenge 💸",
          href,
          parameters: [
            {
              name: "name",
              label: "Name your Challenge!",
              required: true,
            },
            {
              name: "wager",
              label: "Set wager amount",
              required: true,
            },
          ],
        },
      ];
  
      const payload: ActionGetResponse = {
        title: "Test Your Typing Speed ⌨️",
        icon: new URL("/black.jpg", requestUrl.origin).toString(),
        type: "action",
        description: `Player 1 sets the wager, completes the typing challenge, and gets a WPM score. Share the game link with Player 2 to see if they can beat it. May the best typer win!`,
        label: "Challenge your friends to a typing challenge!!",
        links: { actions },
      };
  
      logger.info("Payload constructed successfully: %o", payload);
      return jsonResponse(payload, StatusCodes.OK, headers);
    } catch (err) {
      logger.error("An error occurred in GET handler: %s", err);
      const actionError: ActionError = { message: "An unknown error occurred" };
      return jsonResponse(actionError, StatusCodes.BAD_REQUEST, headers);
    }
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
		amount: wager,
		connection,
		cluster: cluster.devnet,
	  };
  
	  const tx = await createTransaction(createTx);
  
	  const { blockhash } = await connection.getLatestBlockhash();
  
	  const transaction = new Transaction({
		recentBlockhash: blockhash,
		feePayer: account,
	  }).add(...tx);
  
      const href = `/api/actions/create-game/next-action?name=${name}&wager=${wager}`;
      logger.info(`Redirecting to next action at: ${href}`);
  
      let payload: ActionPostResponse;
      try {
        payload = await createPostResponse({
          fields: {
            type: "transaction",
            transaction,
            message: "Initiate QWERTY",
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
  
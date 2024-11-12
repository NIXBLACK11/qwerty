import { PublicKey, SystemProgram, TransactionInstruction, Connection } from "@solana/web3.js";
import logger from "@/app/utils/logger";

interface ICreateTransaction {
  accountPublicKey: PublicKey;
  gameWallet: PublicKey;
  currency: string;
  amount: number;
  connection: Connection;
  cluster: string;
}

export async function createTransaction(data: ICreateTransaction): Promise<TransactionInstruction[]> {
  logger.info(`[createTransaction] Sending SOL tx with body: 
    [accountPublicKey: ${data.accountPublicKey.toString()}, 
    gameWalletPublicKey: ${data.gameWallet.toString()},
    currency: ${data.currency},
    amount: ${data.amount},
    cluster: ${data.cluster},
    ]`);

  if (!data.gameWallet) {
    throw new Error("Internal error: Game wallet public key is required!");
  }

  const ixs: TransactionInstruction[] = [];

  const lamports = data.amount * 1e9;

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: data.accountPublicKey,
    toPubkey: data.gameWallet,
    lamports: parseInt(lamports.toString()),
  });

  ixs.push(transferInstruction);

  return ixs;
}

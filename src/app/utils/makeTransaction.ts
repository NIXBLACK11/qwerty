import { Connection, Keypair, Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { cluster } from './cluster';
const bs58 = require('bs58');

export const makeTransaction = async (amount: number, playerWalletPublicKey: string) => {
    try {
        const connection = new Connection(cluster.devnet, 'confirmed');

        const privateKeyString = process.env.GAME_WALLET_PRIVATE_KEY;
        if (!privateKeyString) {
            throw new Error("Private key is not set in the environment variables");
        }
        const gameWallet = Keypair.fromSecretKey(bs58.decode(privateKeyString));

        const playerWallet = new PublicKey(playerWalletPublicKey);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: gameWallet.publicKey,
                toPubkey: playerWallet,
                lamports: amount,
            })
        );

        sendAndConfirmTransaction(
            connection,
            transaction,
            [gameWallet]
        );

        console.log('Transaction successful, signature');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};
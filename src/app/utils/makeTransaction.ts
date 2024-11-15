import { Connection, Keypair, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

export const makeTransaction = async (amount: number, playerWalletPublicKey: string) => {
    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

        const privateKeyString = process.env.GAME_WALLET_PRIVATE_KEY;
        if (!privateKeyString) {
            throw new Error("Private key is not set in the environment variables");
        }

        const privateKey = Uint8Array.from(JSON.parse(privateKeyString));
        const gameWallet = Keypair.fromSecretKey(privateKey);

        const playerWallet = new PublicKey(playerWalletPublicKey);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: gameWallet.publicKey,
                toPubkey: playerWallet,
                lamports: amount,
            })
        );

        const signature = await connection.sendTransaction(transaction, [gameWallet]);

        await connection.confirmTransaction(signature);

        console.log('Transaction successful, signature:', signature);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};
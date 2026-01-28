import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "/Users/harshsingh/.config/solana/id.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("HoX9aJ8ZHLeKUJi6rLAj4B7rDUJAn32qWvjRxq8K2Mt2");

// Recipient address
const to = new PublicKey("C81XCoS1VToRzYYQ35N5Afow5iTRsZmZLrpXdYV61eeZ");

// Amount
const amount = 10_000n * 1_000_000n; // 10,000 tokens

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const senderAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )

        console.log("ATA of sender: ", senderAccount.address.toBase58())

        // Get the token account of the toWallet address, and if it does not exist, create it
        const recipientAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )

        console.log("ATA of recipient: ", recipientAccount.address.toBase58())

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            senderAccount.address,
            recipientAccount.address,
            keypair.publicKey,
            amount
        )

        console.log("Transfer tx:", tx);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
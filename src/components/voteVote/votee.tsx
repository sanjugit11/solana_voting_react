

//////////---------------------------------------------------------------------////////

import { FC, useState } from "react";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "../../../anchor/target/idl/votingdapp.json";

const programID = new PublicKey("8wH5622G77uLMqUxgdMHtxTVojRRsBcsgYWLGaRUHdsK");
const network = "https://api.devnet.solana.com";

const opts = {
    preflightCommitment: "processed" as web3.Commitment,
};

const Votee: FC = () => {
    const { publicKey, signTransaction, signAllTransactions } = useWallet(); // Access wallet functions
    const [message, setMessage] = useState<string>("");
    console.log("publicKey==>", publicKey?.toBase58());

    const getProvider = (): AnchorProvider => {
        const connection = new Connection(network, opts.preflightCommitment);

        if (!publicKey || !signTransaction || !signAllTransactions) {
            throw new Error("Wallet is not connected or incomplete.");
        }

        // Use the wallet from `useWallet`
        const wallet = {
            publicKey,
            signTransaction,
            signAllTransactions,
        };
        return new AnchorProvider(connection, wallet, opts.preflightCommitment);
    };

    const sayHello = async () => {
        try {
            const provider = getProvider();
            const program = new Program(idl as any, programID, provider);
        //     console.log("SystemProgramprogrammmmmmmmmmm==>", (SystemProgram.programId).toBase58())
            const newAccountKeypair = Keypair.generate();
        //     console.log("newAccountKeypair==>", newAccountKeypair.publicKey.toBase58());
        //     let finalTx;
        //     const tx = await program.methods
        //         .initialize()
        //         .accounts({
        //             payer: publicKey, // The signer of the transaction
        //             votingdapp: newAccountKeypair.publicKey, // Use the new account's public key
        //             systemProgram: SystemProgram.programId, // Solana's system program
        //         })
        //         .signers([newAccountKeypair]) // Add the generated keypair as a signer
        //         .rpc();

        //     console.log("Transaction signature:", tx);
        //     if(tx){
        //          finalTx =await program.methods
        //         .increment()
        //         .accounts({
        //             votingdapp: newAccountKeypair.publicKey, // Use the new account's public key
        //         })
        //         // .signers([newAccountKeypair]) // Add the generated keypair as a signer
        //         .rpc();
        //     }
        //     setMessage("increment sent successfully!");

        //     if(finalTx){

        // }
        
        const final = await program.account
            .votingdapp
            .fetch("AxDEy2URhh4WE28hTB8oGSJ3mUvGdNjZidLpELwruNY5")  //particular account
            console.log("finalfinal==>",final);
        } catch (err) {
            console.error("Transaction error:", err);
            setMessage("Transaction failed!");
        }
    };

    return (
        <div>
            <button style={{
                border: "2px solid black", // Black outline with a defined width
                borderRadius: "5px",       // Rounded corners for a modern look
                padding: "10px 20px",      // Comfortable padding
                backgroundColor: "#f9f9f9",// Light background color
                color: "#000",             // Black text for contrast
                fontSize: "16px",          // Readable font size
                cursor: "pointer",         // Pointer cursor for interactivity
                transition: "all 0.3s ease", // Smooth transition for hover effect
                fontWeight: "bold",        // Slightly bolder text
            }} onClick={sayHello}>vote</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Votee;


//////////---------------------------------------------------------------------////////

// import { FC, useState } from "react";
// import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
// import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
// import { useWallet } from "@solana/wallet-adapter-react";
// import idl from "../../../anchor/target/idl/test2init.json";

// const programID = new PublicKey("HHbEc69NuD2fiUdGtLAwrUHUFzLZAouNHUMauTrPoVpu");
// const network = "https://api.devnet.solana.com";

// const opts = {
//     preflightCommitment: "processed" as web3.Commitment,
// };

// const Votee: FC = () => {
//     const { publicKey, signTransaction, signAllTransactions } = useWallet(); // Access wallet functions
//     const [message, setMessage] = useState<string>("");
//     console.log("publicKey==>", publicKey?.toBase58());

//     const getProvider = (): AnchorProvider => {
//         const connection = new Connection(network, opts.preflightCommitment);

//         if (!publicKey || !signTransaction || !signAllTransactions) {
//             throw new Error("Wallet is not connected or incomplete.");
//         }

//         // Use the wallet from `useWallet`
//         const wallet = {
//             publicKey,
//             signTransaction,
//             signAllTransactions,
//         };
//         console.log("wallet==>", wallet);
//         return new AnchorProvider(connection, wallet, opts.preflightCommitment);
//     };

//     const sayHello = async () => {
//         try {
//             const provider = getProvider();
//             const program = new Program(idl as any, programID, provider);
//             console.log("SystemProgramprogrammmmmmmmmmm==>", (SystemProgram.programId).toBase58())
//             const newAccountKeypair = Keypair.generate();
//             console.log("newAccountKeypair==>", newAccountKeypair.publicKey.toBase58());

//             const tx = await program.methods
//                 .initialize(new BN(1234))
//                 .accounts({
//                     newAccount: newAccountKeypair.publicKey, // Use the new account's public key
//                     signer: publicKey, // The signer of the transaction
//                     systemProgram: SystemProgram.programId, // Solana's system program
//                 })
//                 .signers([newAccountKeypair]) // Add the generated keypair as a signer
//                 .rpc();

//             console.log("Transaction signature:", tx);
//             setMessage("Message sent successfully!");
//         } catch (err) {
//             console.error("Transaction error:", err);
//             setMessage("Transaction failed!");
//         }
//     };

//     return (
//         <div>
//             <button onClick={sayHello}>Say Hello</button>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default Votee;

////////////----------------------------------------///////////////////
// import { FC, useState } from "react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
// import { useWallet } from "@solana/wallet-adapter-react";
// import idl from "../../../anchor/target/idl/test.json";

// const programID = new PublicKey("qHywshUXJh2tDcMBmCQM65nqqL2kbpxHjDhZjgiBG2E");
// const network = "https://api.devnet.solana.com";

// const opts = {
//     preflightCommitment: "processed" as web3.Commitment,
// };

// const Votee: FC = () => {
//     const { publicKey, signTransaction, signAllTransactions } = useWallet(); // Access wallet functions
//     const [message, setMessage] = useState<string>("");
//     console.log("publicKey==>",publicKey?.toBase58()  );

//     const getProvider = (): AnchorProvider => {
//         const connection = new Connection(network, opts.preflightCommitment);

//         if (!publicKey || !signTransaction || !signAllTransactions) {
//             throw new Error("Wallet is not connected or incomplete.");
//         }

//         // Use the wallet from `useWallet`
//         const wallet = {
//             publicKey,
//             signTransaction,
//             signAllTransactions,
//         };
//         console.log("wallet==>",wallet);
//         return new AnchorProvider(connection, wallet, opts.preflightCommitment);
//     };

//     const sayHello = async () => {
//         try {
//             const provider = getProvider();
//             const program = new Program(idl as any, programID, provider);
//             console.log("programmmmmmmmmmm==>",program)
//             const tx = await program.methods
//                 .sayHello("Hello from React!")
//                 .accounts({
//                     user: publicKey, // Use the wallet's public key
//                 })
//                 .rpc();

//             console.log("Transaction signature:", tx);
//             setMessage("Message sent successfully!");
//         } catch (err) {
//             console.error("Transaction error:", err);
//             setMessage("Transaction failed!");
//         }
//     };

//     return (
//         <div>
//             <button onClick={sayHello}>Say Hello</button>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default Votee;


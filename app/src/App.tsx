
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { COUNTER_SEEDS, DEMO_PROGRAM_ID, DemoProgramIDL,} from "@voting-dapp/protocol"

import * as anchor from "@coral-xyz/anchor"
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryFunctionContext,
} from "@tanstack/react-query"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Button, buttonVariants } from "./components/ui/button"
import { toast } from "sonner"
import { cn } from "./lib/utils"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card"

export default function App() {
	return (
		<main className="flex flex-col min-h-screen items-center justify-center space-y-16">
			<h1 className="text-3xl font-bold">Create Anchor dApp - Vanilla React</h1>
			<Counter />
			<WalletMultiButton />
			<div className="flex items-center justify-center space-x-2">
				<p className="">Counter app. Courtesy of </p>
				<a
					target="_blank"
					href="https://twitter.com/_thewuh"
					className="hover:underline text-muted-foreground"
				>
					@_thewuh
				</a>
			</div>
		</main>
	)
}

function Counter() {
	const { counter } = useCounter()
	return (
		<Card className="text-center w-[320px]">
			<CardHeader>
				<CardTitle className="text-xl">Counter</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-6xl">
					{counter ? counter.count.toNumber() : "-"}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<CounterButton />
			</CardFooter>
		</Card>
	)
}

function CounterButton() {
	const { counter, createCounter, incrementCount } = useCounter()
	const { publicKey } = useWallet()

	function action() {
		if (counter === undefined) return
		return counter ? incrementCount() : createCounter()
	}

	const buttonText = publicKey
		? counter
			? "+ 1"
			: "create counter"
		: "wallet not connected"

	return (
		<Button
			className="w-full"
			disabled={counter === undefined || !publicKey}
			onClick={action}
		>
			{buttonText}
		</Button>
	)
}

function useCounter() {
	const program = useProgram()
	const { publicKey } = useWallet()
	const queryClient = useQueryClient()

	const { data, error, isLoading } = useQuery({
		queryKey: ["counter", { publicKey: publicKey?.toBase58() ?? null }],
		queryFn: ({
			queryKey,
		}: QueryFunctionContext<[string, { publicKey: string | null }]>) => {
			const [_, { publicKey }] = queryKey
			return publicKey
				? program.account.counter.fetchNullable(
						counterPda(new anchor.web3.PublicKey(publicKey))
					)
				: null
		},
	})

	async function createCounter() {
		if (!publicKey)
			throw new Error("Cannot create counter. Wallet not connected.")
		return await program.methods
			.createCounter()
			.accountsStrict({
				authority: publicKey,
				counter: counterPda(publicKey),
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.rpc()
	}

	async function incrementCount() {
		if (!publicKey)
			throw new Error("Cannot increment count. Wallet not connected.")
		return await program.methods
			.incrementCount()
			.accountsStrict({
				authority: publicKey,
				counter: counterPda(publicKey),
			})
			.rpc()
	}

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: ["counter", { publicKey: publicKey?.toBase58() ?? null }],
		})

	const createCounterMutation = useMutation({
		mutationFn: createCounter,
		onSuccess: (tx) => {
			invalidate()
			toast.success("Counter created successfully!", {
				action: <GoToExplorer tx={tx} cluster="custom" />,
				className: "w-max",
			})
		},
		onError: (e) => {
			console.error("error:", e)
			toast.error(`Error creating counter. ${e.message}`)
		},
	})

	const incrementCountMutation = useMutation({
		mutationFn: incrementCount,
		onSuccess: (tx) => {
			invalidate()
			toast.success("Count incremented!", {
				action: <GoToExplorer tx={tx} cluster="custom" />,
				className: "w-max",
			})
		},
		onError: () => {
			toast.error("Error incrementing count.")
		},
	})

	return {
		counter: data,
		error,
		isLoading,
		invalidate,
		createCounter: createCounterMutation.mutate,
		incrementCount: incrementCountMutation.mutate,
	}
}

function GoToExplorer({
	tx,
	cluster,
}: {
	tx: string
	cluster: anchor.web3.Cluster | "custom"
}) {
	const explorer = `https://explorer.solana.com/tx/${tx}?cluster=${cluster}`
	return (
		<a href={explorer} className={cn(buttonVariants({ size: "sm" }))}>
			See Explorer
		</a>
	)
}

function useProgram() {
	const { connection } = useConnection()
	const { publicKey, signTransaction, signAllTransactions } = useWallet()

	const wallet = (): anchor.Wallet => {
		if (!publicKey || !signTransaction || !signAllTransactions) {
			return {} as anchor.Wallet
		}
		return {
			publicKey,
			signTransaction,
			signAllTransactions,
		} as anchor.Wallet
	}

	const provider = new anchor.AnchorProvider(connection, wallet(), {})

	return new anchor.Program(DemoProgramIDL, DEMO_PROGRAM_ID, provider)
}

function counterPda(authority: anchor.web3.PublicKey): anchor.web3.PublicKey {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from(COUNTER_SEEDS), authority.toBuffer()],
		new anchor.web3.PublicKey(DEMO_PROGRAM_ID)
	)[0]
}

  
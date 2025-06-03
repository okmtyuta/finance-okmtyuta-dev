import { db } from "@/db"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteFinancialTransactionForm } from "@/components/form/delete-bank-transaction-form"
import { bankTransactionTable } from "@/db/schemas/transaction/schema"

interface PageProps {
	params: Promise<{ id: string }>
}
const Page = async ({ params }: PageProps) => {
	const { id } = await params
	const bankTransaction = await db.query.bankTransactionTable.findFirst({
		where: eq(bankTransactionTable.id, Number(id)),
		with: {
			accountTitle: true,
			bankAccount: true,
		},
	})

	if (bankTransaction == null) {
		return notFound()
	}

	return (
		<div className="grid grid-cols-8 gap-4">
			<aside className="hidden md:block lg:block xl:block 2xl:block col-span-0 md:col-span-3 lg:col-span-2 xl:col-span2 2xl:col-span-2">
				AAA
			</aside>
			<main className="col-span-8 md:col-span-5 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
				<Card>
					<CardHeader>
						<CardTitle>{bankTransaction.bankAccount.name}</CardTitle>
						<CardAction>
							<DeleteFinancialTransactionForm financialTransactionId={bankTransaction.id} />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-center gap-2">
							<Badge variant="default">{bankTransaction.accountTitle?.value}</Badge>
							<span>{bankTransaction.amount.toLocaleString()}</span>
							<span>円</span>
						</div>
					</CardContent>
					<CardFooter>{bankTransaction.description}</CardFooter>
				</Card>
			</main>
		</div>
	)
}

export default Page

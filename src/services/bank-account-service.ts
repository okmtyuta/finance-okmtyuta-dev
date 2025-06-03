import { db } from "@/db"
import { bankAccountTable } from "@/db/schemas/bank-account/schema"
import { bankTransactionTable } from "@/db/schemas/transaction/schema"
import { eq } from "drizzle-orm"

interface updateBankAccountBalanceByBankTransactionParams {
	bankTransactionId: number
}
interface updateBankAccountBalanceByBankTransactionOptions {
	reverse: boolean
}
export const updateBankAccountBalanceByBankTransaction = async (
	params: updateBankAccountBalanceByBankTransactionParams,
	options: updateBankAccountBalanceByBankTransactionOptions = { reverse: false },
) => {
	const financialTransaction = await db.query.bankTransactionTable.findFirst({
		where: eq(bankTransactionTable.id, params.bankTransactionId),
		with: {
			bankAccount: true,
		},
	})

	if (financialTransaction == null) {
		throw new Error("Bank transaction not found")
	}

	const amount = options.reverse ? -financialTransaction.amount : financialTransaction.amount

	await db
		.update(bankAccountTable)
		.set({
			balance: financialTransaction.bankAccount.balance + amount,
		})
		.where(eq(bankAccountTable.id, financialTransaction.bankAccount.id))
}

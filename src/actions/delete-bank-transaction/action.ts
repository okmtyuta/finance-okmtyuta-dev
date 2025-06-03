"use server"

import { db } from "@/db"
import { parseWithZod } from "@conform-to/zod"
import type { SubmissionResult } from "@conform-to/react"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { DeleteBankTransactionActionSchema } from "@/actions/delete-bank-transaction/schema"
import { updateBankAccountBalanceByBankTransaction } from "@/services/bank-account-service"
import { bankTransactionTable } from "@/db/schemas/transaction/schema"

export interface DeleteBankTransactionActionState {
	lastResult?: SubmissionResult<string[]>
}

export const deleteBankTransactionAction = async (
	state: DeleteBankTransactionActionState,
	formData: FormData,
): Promise<DeleteBankTransactionActionState> => {
	const submission = parseWithZod(formData, {
		schema: DeleteBankTransactionActionSchema,
	})

	if (submission.status !== "success") {
		return {
			...state,
			lastResult: submission.reply(),
		}
	}

	const data = submission.value
	await updateBankAccountBalanceByBankTransaction({ bankTransactionId: data.id }, { reverse: true })
	await db.delete(bankTransactionTable).where(eq(bankTransactionTable.id, data.id))

	redirect("/dashboard")
}

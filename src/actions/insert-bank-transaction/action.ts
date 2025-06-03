"use server"

import { db } from "@/db"
import { parseWithZod } from "@conform-to/zod"
import { InsertBankTransactionActionSchema } from "@/actions/insert-bank-transaction/schema"
import type { SubmissionResult } from "@conform-to/react"
import { redirect } from "next/navigation"
import { bankTransactionTable } from "@/db/schemas/transaction/schema"
import { updateBankAccountBalanceByBankTransaction } from "@/services/bank-account-service"

export interface InsertBankTransactionActionState {
	lastResult?: SubmissionResult<string[]>
}
export const insertBankTransactionAction = async (
	state: InsertBankTransactionActionState,
	formData: FormData,
): Promise<InsertBankTransactionActionState> => {
	const submission = parseWithZod(formData, {
		schema: InsertBankTransactionActionSchema,
	})

	if (submission.status !== "success") {
		return {
			...state,
			lastResult: submission.reply(),
		}
	}

	const data = submission.value
	const [result] = await db.insert(bankTransactionTable).values(data).returning()
	await updateBankAccountBalanceByBankTransaction({ bankTransactionId: result.id })

	redirect("/dashboard")
}

"use server"

import { db } from "@/db"
import { parseWithZod } from "@conform-to/zod"

import type { SubmissionResult } from "@conform-to/react"
import { redirect } from "next/navigation"
import { UpdateSecBankAccountBalanceSchema } from "@/actions/update-sec-bank-account-balance/schema"
import { eq } from "drizzle-orm"
import { secBankAccountTable } from "@/db/schemas/sec-bank-account/schema"
import { calculateTotalStockPrice, fetchStockPrice } from "@/services/asset-service"
import { updateSecBankAccountBalance } from "@/services/sec-bank-account-service"

export interface UpdateSecBankAccountBalanceActionState {
	lastResult?: SubmissionResult<string[]>
}
export const updateSecBankAccountBalanceAction = async (
	state: UpdateSecBankAccountBalanceActionState,
	formData: FormData,
): Promise<UpdateSecBankAccountBalanceActionState> => {
	const submission = parseWithZod(formData, {
		schema: UpdateSecBankAccountBalanceSchema,
	})

	if (submission.status !== "success") {
		return {
			...state,
			lastResult: submission.reply(),
		}
	}

	const data = submission.value
	await updateSecBankAccountBalance({ secBankAccountId: data.id })

	redirect("/dashboard")
}

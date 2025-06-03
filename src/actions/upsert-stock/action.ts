"use server"

import { db } from "@/db"
import { parseWithZod } from "@conform-to/zod"

import type { SubmissionResult } from "@conform-to/react"
import { redirect } from "next/navigation"
import { bankTransactionTable } from "@/db/schemas/transaction/schema"
import { UpsertStockActionSchema } from "@/actions/upsert-stock/schema"
import { stockTable } from "@/db/schemas/stock/schema"
import {
	addStock,
	createStock,
	fetchStockPrice,
	findStockInSecBankByTicker,
	getStockNameByTicker,
} from "@/services/asset-service"
import { updateSecBankAccountBalance } from "@/services/sec-bank-account-service"

export interface UpsertStockActionState {
	lastResult?: SubmissionResult<string[]>
}
export const upsertStockAction = async (
	state: UpsertStockActionState,
	formData: FormData,
): Promise<UpsertStockActionState> => {
	const submission = parseWithZod(formData, {
		schema: UpsertStockActionSchema,
	})

	if (submission.status !== "success") {
		return {
			...state,
			lastResult: submission.reply(),
		}
	}

	const data = submission.value
	const stock = await findStockInSecBankByTicker({ ticker: data.ticker, secBankAccountId: data.secBankAccountId })

	if (stock == null) {
		await createStock(data)
	} else {
		await addStock(data)
	}
	await updateSecBankAccountBalance({ secBankAccountId: data.secBankAccountId })

	redirect("/dashboard")
}

"use server"

import { parseWithZod } from "@conform-to/zod"

import type { SubmissionResult } from "@conform-to/react"
import { redirect } from "next/navigation"
import { UpsertFundActionSchema } from "@/actions/upsert-fund/schema"
import { updateSecBankAccountBalance } from "@/services/sec-bank-account-service"
import { addFund, createFund, findFundInSecBankByAssocCode } from "@/services/asset-service"

export interface UpsertFundActionState {
	lastResult?: SubmissionResult<string[]>
}
export const upsertFundAction = async (
	state: UpsertFundActionState,
	formData: FormData,
): Promise<UpsertFundActionState> => {
	const submission = parseWithZod(formData, {
		schema: UpsertFundActionSchema,
	})

	if (submission.status !== "success") {
		return {
			...state,
			lastResult: submission.reply(),
		}
	}

	const data = submission.value
	const fund = await findFundInSecBankByAssocCode({
		assocCode: data.assocCode,
		secBankAccountId: data.secBankAccountId,
	})

	if (fund == null) {
		await createFund(data)
	} else {
		await addFund(data)
	}
	await updateSecBankAccountBalance({ secBankAccountId: data.secBankAccountId })

	redirect("/dashboard")
}

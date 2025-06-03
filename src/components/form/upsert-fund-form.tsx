"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { z } from "zod"
import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useActionState } from "react"
import { upsertFundAction, type UpsertFundActionState } from "@/actions/upsert-fund/action"
import { UpsertFundActionSchema } from "@/actions/upsert-fund/schema"
import type { SecBankAccountSchema } from "@/db/schemas/sec-bank-account/schema"

interface FundFormProps {
	secBankAccounts: z.infer<typeof SecBankAccountSchema>[]
}
export const UpsertFundForm = ({ secBankAccounts }: FundFormProps) => {
	const initialState: UpsertFundActionState = {}
	const [state, formAction, isPending] = useActionState(upsertFundAction, initialState)
	const [form, fields] = useForm({
		constraint: getZodConstraint(UpsertFundActionSchema),
		lastResult: state.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpsertFundActionSchema })
		},
	})

	return (
		<form className="flex flex-col gap-1" {...getFormProps(form)} action={formAction}>
			<div className="flex gap-1">
				<div className="">
					<Select name="secBankAccountId">
						<SelectTrigger disabled={isPending}>
							<SelectValue placeholder="証券口座" />
						</SelectTrigger>

						<SelectContent>
							{secBankAccounts.map((account) => (
								<SelectItem key={account.id} value={String(account.id)}>
									{account.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{fields.secBankAccountId.errors?.map((error) => (
						<div key={error} className="text-red-500">
							{error}
						</div>
					))}
				</div>
			</div>

			<div className="">
				<Input type="text" placeholder="投資信託協会コード" name="assocCode" disabled={isPending} />

				{fields.assocCode.errors?.map((error) => (
					<div key={error} className="text-red-500">
						{error}
					</div>
				))}
			</div>
			<div className="">
				<Input type="number" placeholder="口数" name="amount" disabled={isPending} />

				{fields.amount.errors?.map((error) => (
					<div key={error} className="text-red-500">
						{error}
					</div>
				))}
			</div>

			<div className="">
				<div className="flex justify-center">
					<Button type="submit" variant="outline" className="w-[160px]" disabled={isPending}>
						保存
					</Button>
				</div>
			</div>
		</form>
	)
}

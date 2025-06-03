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
import { getToday } from "@/services/date-service"
import { converter } from "@/lib/converter"
import type { BankAccountSchema } from "@/db/schemas/bank-account/schema"
import type { AccountTitleSchema } from "@/db/schemas/account-title/schema"
import {
	insertBankTransactionAction,
	type InsertBankTransactionActionState,
} from "@/actions/insert-bank-transaction/action"
import { InsertBankTransactionActionSchema } from "@/actions/insert-bank-transaction/schema"

interface BankTransactionFormProps {
	accountTitles: z.infer<typeof AccountTitleSchema>[]
	bankAccounts: z.infer<typeof BankAccountSchema>[]
}
export const InsertBankTransactionForm = ({
	accountTitles,
	bankAccounts,
}: BankTransactionFormProps) => {
	const initialState: InsertBankTransactionActionState = {}
	const [state, formAction, isPending] = useActionState(insertBankTransactionAction, initialState)
	const [form, fields] = useForm({
		constraint: getZodConstraint(InsertBankTransactionActionSchema),
		lastResult: state.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: InsertBankTransactionActionSchema })
		},
	})

	return (
		<form className="flex flex-col gap-1" {...getFormProps(form)} action={formAction}>
			<div className="flex gap-1">
				<div className="">
					<Select name="accountTitleId">
						<SelectTrigger disabled={isPending}>
							<SelectValue placeholder="勘定項目" />
						</SelectTrigger>

						<SelectContent>
							{accountTitles.map((item) => (
								<SelectItem key={item.id} value={String(item.id)}>
									{item.value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{fields.accountTitleId.errors?.map((error) => (
						<div key={error} className="text-red-500">
							{error}
						</div>
					))}
				</div>
			</div>

			<div className="">
				<Select name="bankAccountId">
					<SelectTrigger disabled={isPending}>
						<SelectValue placeholder="対象の金融口座" />
					</SelectTrigger>

					<SelectContent>
						{bankAccounts.map((item) => (
							<SelectItem key={item.id} value={String(item.id)}>
								{item.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{fields.bankAccountId.errors?.map((error) => (
					<div key={error} className="text-red-500">
						{error}
					</div>
				))}
			</div>

			<div className="">
				<Input
					type="text"
					name="date"
					placeholder="取引日"
					disabled={isPending}
					defaultValue={getToday()}
				/>
				{fields.date.errors?.map((error) => (
					<div key={error} className="text-red-500">
						{error}
					</div>
				))}
			</div>

			<div className="">
				<Input
					type="number"
					name="amount"
					placeholder="取引金額"
					disabled={isPending}
					className="flex-grow"
				/>

				{fields.amount.errors?.map((error) => (
					<div key={error} className="text-red-500">
						{error}
					</div>
				))}
			</div>

			<div className="">
				<Input type="text" placeholder="取引の概要" name="description" disabled={isPending} />
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

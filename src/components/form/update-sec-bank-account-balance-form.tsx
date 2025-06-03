"use client"

import { Button } from "@/components/ui/button"
import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useActionState } from "react"

import {
	updateSecBankAccountBalanceAction,
	type UpdateSecBankAccountBalanceActionState,
} from "@/actions/update-sec-bank-account-balance/action"
import { UpdateSecBankAccountBalanceSchema } from "@/actions/update-sec-bank-account-balance/schema"
import { RefreshCw } from "lucide-react"

interface UpdateSecBankAccountBalanceFormProps {
	secBankAccountId: number
}
export const UpdateSecBankAccountBalanceForm = ({
	secBankAccountId,
}: UpdateSecBankAccountBalanceFormProps) => {
	const initialState: UpdateSecBankAccountBalanceActionState = {}
	const [state, formAction, isPending] = useActionState(
		updateSecBankAccountBalanceAction,
		initialState,
	)
	const [form, fields] = useForm({
		constraint: getZodConstraint(UpdateSecBankAccountBalanceSchema),
		lastResult: state.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpdateSecBankAccountBalanceSchema })
		},
	})

	return (
		<form {...getFormProps(form)} action={formAction}>
			<input type="hidden" name="id" value={secBankAccountId} />
			<Button variant="ghost" size="icon" className="p-1">
				<RefreshCw size={20} strokeWidth={1} />
			</Button>
		</form>
	)
}

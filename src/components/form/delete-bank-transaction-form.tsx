"use client"

import {
	deleteBankTransactionAction,
	type DeleteBankTransactionActionState,
} from "@/actions/delete-bank-transaction/action"
import { Button } from "@/components/ui/button"
import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useActionState } from "react"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteBankTransactionActionSchema } from "@/actions/delete-bank-transaction/schema"

interface BankTransactionFormProps {
	financialTransactionId: number
}
export const DeleteBankTransactionForm = ({
	financialTransactionId,
}: BankTransactionFormProps) => {
	const initialState: DeleteBankTransactionActionState = {}
	const [state, formAction, isPending] = useActionState(
		deleteBankTransactionAction,
		initialState,
	)
	const [form, fields] = useForm({
		constraint: getZodConstraint(DeleteBankTransactionActionSchema),
		lastResult: state.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: DeleteBankTransactionActionSchema })
		},
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">削除</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							キャンセル
						</Button>
					</DialogClose>

					<form {...getFormProps(form)} action={formAction}>
						<input type="hidden" name="id" value={financialTransactionId} />
						<Button type="submit" variant="destructive" disabled={isPending}>
							削除
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		// <AlertDialog>
		// 	<AlertDialogTrigger asChild>
		// 		<Button variant="destructive">削除</Button>
		// 	</AlertDialogTrigger>

		// 	<AlertDialogContent>
		// 		<AlertDialogHeader>
		// 			<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
		// 			<AlertDialogDescription>
		// 				This action cannot be undone. This will permanently delete your account and remove your
		// 				data from our servers.
		// 			</AlertDialogDescription>
		// 		</AlertDialogHeader>
		// 		<AlertDialogFooter>
		// 			<form {...getFormProps(form)} action={formAction}>
		// 				<AlertDialogCancel>Cancel</AlertDialogCancel>
		// 				<input type="hidden" name="id" value={financialTransactionId} />
		// 				<AlertDialogAction type="submit">Continue</AlertDialogAction>
		// 			</form>
		// 		</AlertDialogFooter>
		// 	</AlertDialogContent>
		// </AlertDialog>
	)
}

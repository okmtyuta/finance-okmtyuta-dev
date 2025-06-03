import { BankTransactionSchema } from "@/db/schemas/transaction/schema"

export const InsertBankTransactionActionSchema = BankTransactionSchema.omit({
	id: true,
})

import { BankTransactionSchema } from "@/db/schemas/transaction/schema";


export const DeleteBankTransactionActionSchema = BankTransactionSchema.pick({
	id: true,
}).required()

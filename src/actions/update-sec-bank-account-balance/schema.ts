import { SecBankAccountSchema } from "@/db/schemas/sec-bank-account/schema";


export const UpdateSecBankAccountBalanceSchema = SecBankAccountSchema.pick({
  id: true,
}).required()

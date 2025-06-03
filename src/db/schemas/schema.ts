import { user, account, session, verification } from "@/db/schemas/user/schema"
import { bankAccountTable } from "@/db/schemas/bank-account/schema"
import { bankTransactionRelation, bankTransactionTable } from "@/db/schemas/transaction/schema"
import { accountTitleTable } from "@/db/schemas/account-title/schema"
import { stockTable, stockRelation } from "@/db/schemas/stock/schema"
import { secBankAccountTable, secBankAccountRelation } from "@/db/schemas/sec-bank-account/schema"
import { fundRelation, fundTable } from "@/db/schemas/fund/schema"
import { assocCodeSearchCodeTable } from "@/db/schemas/assoc-code-search-code/schema"

export const table = {
	user,
	account,
	session,
	verification,
	bankAccountTable,
	accountTitleTable,
	bankTransactionTable,
	secBankAccountTable,
	stockTable,
	fundTable,
	assocCodeSearchCodeTable,
}
export const relation = {
	bankTransactionRelation,
	stockRelation,
	secBankAccountRelation,
	fundRelation,
}

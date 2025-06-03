import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, integer, serial, foreignKey } from "drizzle-orm/pg-core"
import { bankAccountTable } from "@/db/schemas/bank-account/schema"
import { z } from "zod"
import { accountTitleTable } from "@/db/schemas/account-title/schema"
import { converter } from "@/lib/converter"

export const bankTransactionTable = pgTable(
	"bank_transaction",
	{
		id: serial("id").primaryKey(),
		accountTitleId: integer("account_title_id"),
		bankAccountId: integer("bank_account_id").notNull(),
		amount: integer("amount").notNull(),
		date: timestamp("date").notNull(),
		description: text("description"),
	},
	(table) => [
		foreignKey({
			columns: [table.accountTitleId],
			foreignColumns: [accountTitleTable.id],
			name: "bank_transaction_account_title_id_fkey",
		}),
		foreignKey({
			columns: [table.bankAccountId],
			foreignColumns: [bankAccountTable.id],
			name: "bank_transaction_bank_account_id_fkey",
		}),
	],
)
export const bankTransactionRelation = relations(bankTransactionTable, ({ one }) => ({
	accountTitle: one(accountTitleTable, {
		fields: [bankTransactionTable.accountTitleId],
		references: [accountTitleTable.id],
	}),
	bankAccount: one(bankAccountTable, {
		fields: [bankTransactionTable.bankAccountId],
		references: [bankAccountTable.id],
	}),
}))

export const BankTransactionSchema = z.object({
	id: z.number().int().optional(),
	accountTitleId: z.preprocess(
		(value) => converter.nullableNumber(value),
		z.number({ message: "勘定項目を選択してください" }).nullish(),
	),
	bankAccountId: z.preprocess(
		(value) => converter.nullableNumber(value),
		z.number({ message: "収入先を選択してください" }),
	),
	amount: z.preprocess(
		(value) => converter.nullableNumber(value),
		z
			.number({ message: "取引金額は整数で入力してください" })
			.int({ message: "取引金額は整数で入力してください" }),
	),
	date: z.coerce
		.string()
		.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/, {
			message: "取引日はYYYY-MM-DDのフォーマットで入力してください",
		})
		.transform((value) => new Date(value)),
	description: z.string().optional(),
})

import { pgTable, text, integer, serial, foreignKey, real, unique } from "drizzle-orm/pg-core"
import { z } from "zod"
import { secBankAccountTable } from "@/db/schemas/sec-bank-account/schema"
import { relations } from "drizzle-orm"

export const fundTable = pgTable(
	"fund",
	{
		id: serial("id").primaryKey(),
		name: text("name"),
		amount: real("amount").notNull(),
		secBankAccountId: integer("sec_bank_account_id").notNull(),
		assocCode: text("assoc_code").notNull(),
		averagePrice: real("average_price").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.secBankAccountId],
			foreignColumns: [secBankAccountTable.id],
			name: "sec_bank_fund_fkey",
		}),
		unique().on(table.assocCode, table.secBankAccountId),
	],
)
export const fundRelation = relations(fundTable, ({ one }) => ({
	secBankAccount: one(secBankAccountTable, {
		fields: [fundTable.secBankAccountId],
		references: [secBankAccountTable.id],
	}),
}))

export const FundSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().nullable(),
	amount: z.number(),
	secBankAccountId: z.number().int(),
	assocCode: z.string(),
	averagePrice: z.number(),
})
export const SelectFundSchema = FundSchema.required({ id: true })

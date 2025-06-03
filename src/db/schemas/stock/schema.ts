import { pgTable, text, integer, serial, foreignKey, real, unique } from "drizzle-orm/pg-core"
import { z } from "zod"
import { secBankAccountTable } from "@/db/schemas/sec-bank-account/schema"
import { relations } from "drizzle-orm"

export const stockTable = pgTable(
	"stock",
	{
		id: serial("id").primaryKey(),
		name: text("name"),
		amount: real("amount").notNull(),
		secBankAccountId: integer("sec_bank_account_id").notNull(),
		ticker: text("ticker").notNull(),
		averagePrice: real("average_price").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.secBankAccountId],
			foreignColumns: [secBankAccountTable.id],
			name: "sec_bank_stock_fkey",
		}),
		unique().on(table.ticker, table.secBankAccountId),
	],
)
export const stockRelation = relations(stockTable, ({ one }) => ({
	secBankAccount: one(secBankAccountTable, {
		fields: [stockTable.secBankAccountId],
		references: [secBankAccountTable.id],
	}),
}))

export const StockSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().nullable(),
	amount: z.number(),
	secBankAccountId: z.number().int(),
	ticker: z.string(),
	averagePrice: z.number(),
})
export const SelectStockSchema = StockSchema.required({ id: true })

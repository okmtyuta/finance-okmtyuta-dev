import { pgTable, text, integer, serial, numeric, real } from "drizzle-orm/pg-core"
import { z } from "zod"
import { converter } from "@/lib/converter"
import { StockSchema, stockTable } from "@/db/schemas/stock/schema"
import { relations } from "drizzle-orm"
import { fundTable } from "@/db/schemas/fund/schema"

export const secBankAccountTable = pgTable("sec_bank_account", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	balance: real("balance").notNull(),
})
export const secBankAccountRelation = relations(secBankAccountTable, ({ many }) => ({
	stocks: many(stockTable),
	funds: many(fundTable),
}))

export const SecBankAccountSchema = z.object({
	id: z.number().int().optional(),
	name: z.string(),
	balance: z.preprocess((value) => converter.nullableNumber(value), z.number()),
})

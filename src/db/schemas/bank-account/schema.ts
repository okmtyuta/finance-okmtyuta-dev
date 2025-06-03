
import { pgTable, text, integer, serial } from "drizzle-orm/pg-core"
import { z } from "zod"
import { converter } from "@/lib/converter"

export const bankAccountTable = pgTable("bank_account", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	balance: integer("balance").notNull(),
})

export const BankAccountSchema = z.object({
	id: z.number().int().optional(),
	name: z.string(),
	balance: z.preprocess((value) => converter.nullableNumber(value), z.number()),
})

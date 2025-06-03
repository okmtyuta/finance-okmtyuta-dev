import { pgTable, text, serial } from "drizzle-orm/pg-core"
import { z } from "zod"

export const accountTitleTable = pgTable("account_title", {
	id: serial("id").primaryKey(),
	value: text("name").unique().notNull(),
})

export const AccountTitleSchema = z.object({
	id: z.number().int().optional(),
	value: z.string(),
})

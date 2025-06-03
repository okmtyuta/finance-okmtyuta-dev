import { pgTable, text, serial, real, unique } from "drizzle-orm/pg-core"
import { z } from "zod"

export const assocCodeSearchCodeTable = pgTable("assoc_code_search_code", {
	id: serial("id").primaryKey(),
	assocCode: text("assoc_code").unique().notNull(),
	searchCode: text("search_code").unique().notNull(),
})

export const AssocCodeSearchCodeSchema = z.object({
	id: z.number().int().optional(),
	assocCode: z.string(),
	searchCode: z.string(),
})
export const SelectAssocCodeSearchCodeSchema = AssocCodeSearchCodeSchema.required({ id: true })

import { StockSchema } from "@/db/schemas/stock/schema"

export const UpsertStockActionSchema = StockSchema.omit({
	id: true,
	name: true,
	averagePrice: true,
})

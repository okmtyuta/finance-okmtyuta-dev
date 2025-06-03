import { FundSchema } from "@/db/schemas/fund/schema"

export const UpsertFundActionSchema = FundSchema.omit({
	id: true,
	name: true,
	averagePrice: true,
})

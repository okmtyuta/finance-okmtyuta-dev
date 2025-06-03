import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import { table } from "@/db/schemas/schema"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...table,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
})

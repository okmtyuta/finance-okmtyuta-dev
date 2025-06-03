import { config } from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"
import { table, relation } from "@/db/schemas/schema"

config({ path: ".env" }) // or .env.local

export const db = drizzle(process.env.DATABASE_URL, { schema: { ...table, ...relation } })

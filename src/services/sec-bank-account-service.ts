// "use server"

import { db } from "@/db"
import { secBankAccountTable } from "@/db/schemas/sec-bank-account/schema"
import { eq } from "drizzle-orm"
import { calculateTotalFundPrice, calculateTotalStockPrice } from "@/services/asset-service"

interface UpdateSecBankAccountBalanceParams {
	secBankAccountId: number
}
export const updateSecBankAccountBalance = async ({
	secBankAccountId,
}: UpdateSecBankAccountBalanceParams) => {
	const secBankAccount = await db.query.secBankAccountTable.findFirst({
		where: eq(secBankAccountTable.id, secBankAccountId),
		with: {
			stocks: true,
			funds: true,
		},
	})

	if (secBankAccount == null) {
		throw new Error("証券口座が見つかりません")
	}

	const stockBalance = await calculateTotalStockPrice({ stocks: secBankAccount.stocks })
	const fundBalance = await calculateTotalFundPrice({ funds: secBankAccount.funds })

	const balance = stockBalance + fundBalance

	await db
		.update(secBankAccountTable)
		.set({ balance })
		.where(eq(secBankAccountTable.id, secBankAccountId))
}

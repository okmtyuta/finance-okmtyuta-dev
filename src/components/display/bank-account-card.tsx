import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { z } from "zod"
import { Badge } from "@/components/ui/badge"
import type { BankAccountSchema } from "@/db/schemas/bank-account/schema"

interface BankAccountCardProps {
	bankAccount: z.infer<typeof BankAccountSchema>
}
export const BankAccountCard = ({ bankAccount }: BankAccountCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{bankAccount.name}</CardTitle>
				{/* <CardDescription>{financialAccount.description}</CardDescription> */}
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-center gap-2">
					<Badge variant="default">銀行口座</Badge>
					<span>{bankAccount.balance.toLocaleString()}</span>
					<span>円</span>
				</div>
			</CardContent>
			{/* <CardFooter>
				<p>Card Footer</p>
			</CardFooter> */}
		</Card>
	)
}

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { BankAccountSchema } from "@/db/schemas/bank-account/schema"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UpdateSecBankAccountBalanceForm } from "../form/update-sec-bank-account-balance-form"
import { SecBankAccountSchema } from "@/db/schemas/sec-bank-account/schema"

const SelectBankAccountSchema = SecBankAccountSchema.required()
interface SecBankAccountCardProps {
	secBankAccount: z.infer<typeof SelectBankAccountSchema>
}
export const SecBankAccountCard = ({ secBankAccount }: SecBankAccountCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{secBankAccount.name}</CardTitle>
				{/* <CardDescription>{financialAccount.description}</CardDescription> */}
				<CardAction>
					<UpdateSecBankAccountBalanceForm secBankAccountId={secBankAccount.id} />
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-center gap-2">
					<Badge variant="default">証券口座</Badge>
					<span>{secBankAccount.balance.toLocaleString()}</span>
					<span>円</span>
				</div>
			</CardContent>
			{/* <CardFooter>
				<p>Card Footer</p>
			</CardFooter> */}
		</Card>
	)
}

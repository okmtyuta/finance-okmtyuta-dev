import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InsertFinancialTransactionForm } from "@/components/form/insert-financial-bank-form"
import { db } from "@/db"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { standardize } from "@/services/date-service"

const Page = async () => {
	const financialAccountTitles = await db.query.financialAccountTitleTable.findMany()
	const financialAccounts = await db.query.financialAccountTable.findMany()
	const latestFinancialTransactions = await db.query.financialTransactionTable.findMany({
		orderBy: (table, { desc }) => desc(table.date),
		limit: 5,
		with: {
			financialAccountTitle: true,
			financialAccount: true,
		},
	})

	return (
		<div className="grid grid-cols-8 gap-4">
			<aside className="hidden md:block lg:block xl:block 2xl:block col-span-0 md:col-span-3 lg:col-span-2 xl:col-span2 2xl:col-span-2">
				AAA
			</aside>
			<main className="col-span-8 md:col-span-5 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
				<div className="border-b">クイック登録</div>

				<Tabs defaultValue="income">
					<TabsList className="w-full">
						<TabsTrigger value="income">入出金</TabsTrigger>
						{/* <TabsTrigger value="transfer">振替</TabsTrigger> */}
					</TabsList>

					<TabsContent value="income">
						<InsertFinancialTransactionForm
							financialAccountTitles={financialAccountTitles}
							financialAccounts={financialAccounts}
							financialTransaction={{ date: new Date() }}
						/>
					</TabsContent>

					{/* <TabsContent value="transfer">
						<FinancialTransferForm
							financialAccounts={financialAccounts}
							financialTransfer={{ date: new Date() }}
						/>
					</TabsContent> */}
				</Tabs>

				<div className="border-b">最新の入出金</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px]">アカウント</TableHead>
							<TableHead>取引日</TableHead>
							<TableHead className="text-right">金額</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{latestFinancialTransactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell className="font-medium">{transaction.financialAccount.name}</TableCell>
								<TableCell>{standardize(transaction.date)}</TableCell>
								<TableCell className="text-right">
									{transaction.amount.toLocaleString()} 円
								</TableCell>
								<TableCell className="flex justify-end">
									<Link href={`/dashboard/transactions/${transaction.id}`}>
										<ChevronRight strokeWidth={1} />
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className="border-b">今月の収支</div>
				<div className="border-b">資産の推移</div>
				<div className="border-b">新しいセクション</div>
			</main>
		</div>
	)
}

export default Page

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InsertBankTransactionForm } from "@/components/form/insert-bank-transaction-form"
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
import { BankAccountCard } from "@/components/display/bank-account-card"
import { standardize } from "@/services/date-service"
import { UpsertStockForm } from "@/components/form/upsert-stock-form"
import { SecBankAccountCard } from "@/components/display/sec-bank-account-card"
import { fetchStockPrice } from "@/services/asset-service"
import { UpsertFundForm } from "@/components/form/upsert-fund-form"

const Page = async () => {
	const accountTitles = await db.query.accountTitleTable.findMany()
	const bankAccounts = await db.query.bankAccountTable.findMany()
	const secBankAccounts = await db.query.secBankAccountTable.findMany()
	const latestBankTransactions = await db.query.bankTransactionTable.findMany({
		orderBy: (table, { desc }) => desc(table.date),
		limit: 5,
		with: {
			accountTitle: true,
			bankAccount: true,
		},
	})

	return (
		<div className="grid grid-cols-8 gap-4">
			<aside className="hidden md:block lg:block xl:block 2xl:block col-span-0 md:col-span-3 lg:col-span-2 xl:col-span2 2xl:col-span-2">
				<div className="flex flex-col gap-2">
					{bankAccounts.map((bankAccount) => {
						return <BankAccountCard key={bankAccount.id} bankAccount={bankAccount} />
					})}
					{secBankAccounts.map((secBankAccount) => {
						return <SecBankAccountCard key={secBankAccount.id} secBankAccount={secBankAccount} />
					})}
				</div>
			</aside>
			<main className="col-span-8 md:col-span-5 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
				<div className="border-b">クイック登録</div>

				<Tabs defaultValue="transaction">
					<TabsList className="w-full">
						<TabsTrigger value="transaction">取引</TabsTrigger>
						<TabsTrigger value="stock">株式</TabsTrigger>
						<TabsTrigger value="fund">投資信託</TabsTrigger>
					</TabsList>

					<TabsContent value="transaction">
						<InsertBankTransactionForm accountTitles={accountTitles} bankAccounts={bankAccounts} />
					</TabsContent>
					<TabsContent value="stock">
						<UpsertStockForm secBankAccounts={secBankAccounts} />
					</TabsContent>
					<TabsContent value="fund">
						<UpsertFundForm secBankAccounts={secBankAccounts} />
					</TabsContent>
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
						{latestBankTransactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell className="font-medium">{transaction.bankAccount.name}</TableCell>
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

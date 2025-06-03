import { db } from "@/db"
import { type FundSchema, fundTable } from "@/db/schemas/fund/schema"
import { type SelectStockSchema, stockTable, type StockSchema } from "@/db/schemas/stock/schema"
import { and, eq } from "drizzle-orm"
import yahooFinance from "yahoo-finance2"
import type { z } from "zod"
import { JSDOM } from "jsdom"
import { assocCodeSearchCodeTable } from "@/db/schemas/assoc-code-search-code/schema"

interface FetchStockPriceParams {
	ticker: string
}
export const fetchStockPrice = async ({ ticker }: FetchStockPriceParams): Promise<number> => {
	const quote = await yahooFinance.quote(ticker)
	const price = quote.regularMarketPrice

	if (price == null) {
		throw new Error(`株価の取得に失敗しました: ${ticker}`)
	}

	return price
}

interface GetStockNameByTickerParams {
	ticker: string
}
export const getStockNameByTicker = async ({ ticker }: GetStockNameByTickerParams) => {
	const quote = await yahooFinance.quote(ticker)
	return quote.shortName
}

interface CalculateTotalStockPriceParams {
	stocks: z.infer<typeof StockSchema>[]
}
export const calculateTotalStockPrice = async ({
	stocks,
}: CalculateTotalStockPriceParams): Promise<number> => {
	const prices = await Promise.all(
		stocks.map(async (stock) => {
			const price = await fetchStockPrice({ ticker: stock.ticker })
			return price * stock.amount
		}),
	)
	const price = prices.reduce((acc, cur) => acc + cur, 0)

	return price
}

interface FindStockByTickerParams {
	secBankAccountId: number
	ticker: string
}
export const findStockInSecBankByTicker = async ({
	ticker,
	secBankAccountId,
}: FindStockByTickerParams) => {
	const stock = await db.query.stockTable.findFirst({
		where: and(eq(stockTable.ticker, ticker), eq(stockTable.secBankAccountId, secBankAccountId)),
	})
	return stock
}

interface AddStockParams {
	secBankAccountId: number
	ticker: string
	amount: number
}
export const addStock = async ({ secBankAccountId, ticker, amount }: AddStockParams) => {
	const stock = await findStockInSecBankByTicker({ ticker, secBankAccountId })
	if (stock == null) {
		throw new Error(`株式が見つかりません: ${ticker}`)
	}

	const currentPrice = await fetchStockPrice({ ticker })
	const total = stock.amount + amount
	const averagePrice = (stock.averagePrice * stock.amount + currentPrice * amount) / total

	await db
		.update(stockTable)
		.set({ amount: total, averagePrice })
		.where(eq(stockTable.ticker, ticker))
}

interface CreateStockParams {
	secBankAccountId: number
	ticker: string
	amount: number
}
export const createStock = async ({ secBankAccountId, ticker, amount }: CreateStockParams) => {
	const name = await getStockNameByTicker({ ticker: ticker })
	const averagePrice = await fetchStockPrice({ ticker: ticker })
	const [stock] = await db
		.insert(stockTable)
		.values({ name, amount, secBankAccountId, ticker, averagePrice })
		.returning()

	return stock
}

// ===== fund ======

interface ConvertAssocCodeToSearchCodeParams {
	assocCode: string
}
const convertAssocCodeToSearchCode = async ({ assocCode }: ConvertAssocCodeToSearchCodeParams) => {
	const assocCodeSearchCode = await db.query.assocCodeSearchCodeTable.findFirst({
		where: eq(assocCodeSearchCodeTable.assocCode, assocCode),
	})

	if (assocCodeSearchCode == null) {
		throw new Error(`検索コードが見つかりません: ${assocCode}`)
	}

	return assocCodeSearchCode.searchCode
}

interface FetchFundCodeBySearchCodeParams {
	assocCode: string
}
export const fetchFundNavByAssocCode = async ({ assocCode }: FetchFundCodeBySearchCodeParams) => {
	const searchCode = await convertAssocCodeToSearchCode({ assocCode })
	const url = `https://www.wealthadvisor.co.jp/snapshot/${searchCode}`
	const dom = await JSDOM.fromURL(url)
	const document = dom.window.document
	const navString = document.querySelector("p.common-normal-l")?.textContent?.replace(",", "")

	if (navString == null) {
		throw new Error(`ファンドの基準価額が取得できません: ${searchCode}`)
	}

	const nav = Number(navString)

	return nav
}

interface GetFundNameBySearchCodeParams {
	assocCode: string
}
export const getFundNameByAssocCode = async ({ assocCode }: GetFundNameBySearchCodeParams) => {
	const searchCode = await convertAssocCodeToSearchCode({ assocCode })
	const url = `https://www.wealthadvisor.co.jp/snapshot/${searchCode}`
	const dom = await JSDOM.fromURL(url)
	const document = dom.window.document
	const name = document.querySelector("h1.common-fund-name-title")?.textContent

	if (name == null) {
		throw new Error(`ファンド名が取得できません: ${assocCode}`)
	}

	return name
}

interface FindFundByAssocCodeParams {
	assocCode: string
	secBankAccountId: number
}
export const findFundInSecBankByAssocCode = async ({
	assocCode,
	secBankAccountId,
}: FindFundByAssocCodeParams) => {
	const fund = await db.query.fundTable.findFirst({
		where: and(
			eq(fundTable.assocCode, assocCode),
			eq(fundTable.secBankAccountId, secBankAccountId),
		),
	})
	return fund
}

interface AddFundParams {
	assocCode: string
	secBankAccountId: number
	amount: number
}
export const addFund = async ({ assocCode, secBankAccountId, amount }: AddFundParams) => {
	const fund = await findFundInSecBankByAssocCode({ assocCode, secBankAccountId })
	if (fund == null) {
		throw new Error(`ファンドが見つかりません: ${assocCode}`)
	}
	const currentNav = await fetchFundNavByAssocCode({ assocCode })
	const total = fund.amount + amount
	const averagePrice = (fund.averagePrice * fund.amount + currentNav * amount) / total

	await db
		.update(fundTable)
		.set({ amount: total, averagePrice })
		.where(eq(fundTable.assocCode, assocCode))
}

interface CreateFundParams {
	secBankAccountId: number
	assocCode: string
	amount: number
}
export const createFund = async ({ secBankAccountId, assocCode, amount }: CreateFundParams) => {
	const name = await getFundNameByAssocCode({ assocCode })
	const averagePrice = await fetchFundNavByAssocCode({ assocCode })
	const [fund] = await db
		.insert(fundTable)
		.values({ name, amount, secBankAccountId, assocCode, averagePrice })
		.returning()

	return fund
}

interface CalculateTotalFundPriceParams {
	funds: z.infer<typeof FundSchema>[]
}
export const calculateTotalFundPrice = async ({
	funds,
}: CalculateTotalFundPriceParams): Promise<number> => {
	const navs = await Promise.all(
		funds.map(async (fund) => {
			const nav = await fetchFundNavByAssocCode({ assocCode: fund.assocCode })
			return (nav * fund.amount) / 10000
		}),
	)
	const price = navs.reduce((acc, cur) => acc + cur, 0)

	return price
}

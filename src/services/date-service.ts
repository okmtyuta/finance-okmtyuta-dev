export const standardize = (date: Date) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0") // 月は0始まりなので+1
	const day = String(date.getDate()).padStart(2, "0")

	return `${year}-${month}-${day}`
}
export const getToday = () => {
	const now = new Date(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }))

	return standardize(now)
}

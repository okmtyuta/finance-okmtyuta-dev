import type { Metadata } from "next"
import "./globals.css"

import { SiteHeader } from "@/components/site/site-header"
import { SiteMain } from "@/components/site/site-main"
import { SiteFooter } from "@/components/site/site-footer"
import type { ReactNode } from "react"

export const metadata: Metadata = {
	title: "okmtyuta.dev",
	description: "okmtyuta development site",
}
export const dynamic = 'force-dynamic'

interface RootLayoutProps {
	children: ReactNode
}
const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
	return (
		<html lang="en">
			<body className="min-h-screen grid grid-rows-[auto_1fr_auto]">
				<SiteHeader />
				<SiteMain>{children}</SiteMain>
				<SiteFooter />
			</body>
		</html>
	)
}

export default RootLayout

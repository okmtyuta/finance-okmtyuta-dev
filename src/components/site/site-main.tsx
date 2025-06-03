import type { ReactNode } from "react"

interface FrameProps {
	children: ReactNode
}
interface SiteMainProps {
	children: ReactNode
}
const Frame = (props: FrameProps) => {
	return <div className="max-w-6xl my-0 mx-auto py-0 px-6">{props.children}</div>
}

export const SiteMain = (props: SiteMainProps) => {
	return (
		<div>
			<Frame>
				{/* <div className="py-4">
					<SiteGlobalNav />
				</div> */}
				{props.children}
			</Frame>
		</div>
	)
}

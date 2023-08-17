import { PropsWithChildren } from "react"

type Props = {
	centerX?: boolean
	centerY?: boolean
}

export const CenteredPage = ({ children, centerX, centerY }: PropsWithChildren<Props>) => (
	<div
		className={`h-full w-full flex flex-col ${centerX ? "items-center" : "items-start"} ${
			centerY ? "justify-center" : "justify-start"
		} min-h-screen`}
	>
		{children}
	</div>
)
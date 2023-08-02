import { RenderableProps } from "preact"

type Props = {
	centerX?: boolean
	centerY?: boolean
}

export const CenteredPage = ({ children, centerX, centerY }: RenderableProps<Props>) => (
	<div
		class={`h-full w-full flex flex-col ${centerX ? "items-center" : "items-start"} ${
			centerY ? "justify-center" : "justify-start"
		} min-h-screen`}
	>
		{children}
	</div>
)

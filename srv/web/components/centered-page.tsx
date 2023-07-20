import { RenderableProps } from "preact"

type Props = {}

export const CenteredPage = ({ children }: RenderableProps<Props>) => (
	<div class="h-full w-full flex flex-col items-center justify-center min-h-screen">
		<div class="w-full max-w-sm">{children}</div>
	</div>
)

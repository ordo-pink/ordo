import { RenderableProps } from "preact"
import { useSidebar } from "../streams/sidebar.ts"
import { BsThreeDotsVertical } from "#x/react_icons_bs@1.0.8/mod.ts"
import { useWindowSize } from "../hooks/use-window-size.ts"
import { useEffect, useState } from "preact/hooks"
import { executeCommand } from "../streams/commands.ts"

export default function Sidebar({ children }: RenderableProps<{}>) {
	const sidebar = useSidebar()

	const [width] = useWindowSize()
	const [isNarrow, setIsNarrow] = useState(true)

	useEffect(() => {
		const isNarrow = width < 768
		executeCommand("sidebar.set-size", isNarrow ? [0, 100] : [25, 75])

		setIsNarrow(isNarrow)
	}, [width])

	const handleSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		executeCommand("sidebar.set-size", [0, 100])
	}

	return (
		<div class="h-screen flex flex-col p-4 bg-neutral-200 dark:bg-neutral-900">
			<div class="flex items-center justify-between">
				<img src="/logo.png" class="w-10" alt="Ordo.pink Logo" />
			</div>
			<div class="text-neutral-500 cursor-pointer">
				<BsThreeDotsVertical />
			</div>
		</div>
	)
}

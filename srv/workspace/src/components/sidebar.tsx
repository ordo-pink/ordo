import { useHotkeys } from "react-hotkeys-hook"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MouseEvent, PropsWithChildren } from "react"
import { useCommands } from "$hooks/use-commands"
import { useCommandPaletteItems } from "$streams/command-palette"
import { getContextMenu } from "$streams/context-menu"
import { useSidebar } from "$streams/sidebar"
import { useUser } from "$streams/auth"
import UsedSpace from "$components/used-space"
import Null from "$components/null"

type Props = { isNarrow: boolean }

export default function Sidebar({ children, isNarrow }: PropsWithChildren<Props>) {
	const user = useUser()
	const sidebar = useSidebar()
	const commands = useCommands()
	const commandPaletteItems = useCommandPaletteItems()
	const contextMenu = getContextMenu()

	const onSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		commands.emit("sidebar.set-size", [0, 100])
	}

	const openCommandPalette = () => commands.emit("command-palette.show", commandPaletteItems)
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		contextMenu.show({ x: event.clientX, y: event.clientY, target: event.currentTarget })

	useHotkeys("ctrl+shift+p", openCommandPalette)

	return (
		<div
			className="h-screen w-full flex justify-between flex-col p-4 bg-neutral-200 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div>
				<div className="flex items-center justify-between">
					<img src="http://localhost:8000/logo.png" className="w-10" alt="Ordo.pink Logo" />
					<div className="text-neutral-500 cursor-pointer" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>

				<div>{children}</div>
			</div>

			<div>
				<div>{user.fold(Null, u => u.email)}</div>
				<div className="w-full">
					<UsedSpace />
				</div>
			</div>
		</div>
	)
}

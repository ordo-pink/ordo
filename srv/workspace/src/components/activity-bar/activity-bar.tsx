import { BsThreeDotsVertical } from "react-icons/bs"
import { useCommands } from "$hooks/use-commands"
import { useCommandPaletteItems } from "$streams/command-palette"
import { getContextMenu } from "$streams/context-menu"
import { useActivities } from "$streams/extensions"
import { useSidebar } from "$streams/sidebar"
import { useUser } from "$streams/auth"
import ActivityItem from "$components/activity-bar/activity"
import Null from "$components/null"
import { MouseEvent } from "react"
import { Unary } from "#lib/tau/mod"

type ShowContextMenu = Unary<MouseEvent<HTMLDivElement>, void>

const contextMenu = getContextMenu()

export default function ActivityBar() {
	const user = useUser()
	const sidebar = useSidebar()
	const commands = useCommands()
	const activities = useActivities()
	const commandPaletteItems = useCommandPaletteItems()

	const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	const showCommandPalette = () => commands.emit("command-palette.show", commandPaletteItems)
	const showContextMenu: ShowContextMenu = e =>
		contextMenu.show({ x: e.clientX, y: e.clientY, target: e.currentTarget })

	return (
		<div
			onContextMenu={showContextMenu}
			className={`activity-bar h-screen ${
				sidebar.disabled ? "w-[calc(3rem-10px)]" : "w-12"
			} flex flex-col justify-between items-center py-4 text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-900`}
		>
			<div>
				<div
					className={`text-neutral-500 cursor-pointer transition-opacity duration-300 ${
						isSidebarCollapsed ? "opacity-100" : "opacity-0"
					}`}
				>
					<div onClick={showCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>
			<div className="flex flex-col space-y-4 items-center">
				{activities.map(activity =>
					activity.background ? null : <ActivityItem key={activity.name} activity={activity} />
				)}
			</div>
			<div>
				{user.fold(Null, user => (
					<div
						className={`cursor-pointer transition-opacity duration-300 ${
							isSidebarCollapsed ? "opacity-100" : "opacity-0"
						}`}
					>
						{user.email && user.email.slice(0, 1)}
					</div>
				))}
			</div>
		</div>
	)
}

import { BsThreeDotsVertical } from "react-icons/bs"
import { useSidebar } from "../../streams/sidebar"
import { useUser } from "../../streams/auth"
import Null from "../null"
import ActivityItem from "./activity"
import { useCommands } from "../../hooks/use-commands"
import { useCommandPaletteItems } from "../../streams/command-palette"
import { Activity, useActivities } from "../../streams/extensions"
import { Either } from "#lib/either/mod"

export default function ActivityBar() {
	const user = useUser()
	const sidebar = useSidebar()
	const commands = useCommands()
	const activities = useActivities()

	const commandPaletteItems = useCommandPaletteItems()

	const showCommandPalette = () => commands.emit("command-palette.show", commandPaletteItems)

	const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	return (
		<div
			className={`h-screen ${
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
						{user.email.slice(0, 1)}
					</div>
				))}
			</div>
		</div>
	)
}

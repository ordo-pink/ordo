import { BsThreeDotsVertical } from "react-icons/bs"
import { useSidebar } from "src/streams/sidebar"
import { useUser } from "../../streams/auth"
import Null from "../null"
import Activity from "./activity"
import { useCommands } from "src/hooks/use-commands"
import { useCommandPaletteItems } from "src/streams/command-palette"

type Props = {
	activities: any[]
}

export default function ActivityBar({ activities }: Props) {
	const user = useUser()
	const sidebar = useSidebar()
	const commands = useCommands()

	const commandPaletteItems = useCommandPaletteItems()

	const showCommandPalette = () => commands.emit("command-palette.show", commandPaletteItems)

	return (
		<div
			className={`h-screen ${
				sidebar.disabled ? "w-[calc(3rem-10px)]" : "w-12"
			} flex flex-col justify-between items-center py-4 text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-900`}
		>
			<div>
				<div
					className={`text-neutral-500 cursor-pointer transition-opacity duration-300 ${
						sidebar.disabled || sidebar.sizes[0] === 0 ? "opacity-100" : "opacity-0"
					}`}
				>
					<div onClick={showCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>
			<div className="flex flex-col space-y-4 items-center">
				{activities.map(activity =>
					activity.background ? null : (
						<Activity key={activity.name} name={activity.name} version={activity.version} />
					)
				)}
			</div>
			<div>{user.fold(Null, user => user.email.slice(0, 1))}</div>
		</div>
	)
}

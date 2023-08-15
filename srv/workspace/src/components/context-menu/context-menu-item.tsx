import { Either } from "#lib/either/mod"
import { useAccelerator } from "$hooks/use-accelerator"
import { getCommands } from "$streams/commands"
import { ContextMenuItem } from "$streams/context-menu"
import RenderFromNullable from "$components/render-from-nullable"
import ActionListItem from "$components/action-list-item"
import Accelerator from "$components/accelerator"
import { MouseEvent } from "react"

const commands = getCommands()

type _P = { event: MouseEvent; item: ContextMenuItem; payload?: any }
export default function MenuItem({ item, event, payload: p }: _P) {
	const payload = item.payloadCreator ? item.payloadCreator({ payload: p, event }) : p
	const isDisabled = item.shouldBeDisabled && item.shouldBeDisabled({ event, payload })
	const emitContextMenuItemCommand = () =>
		Either.fromNullable(item.accelerator)
			.chain(() => Either.fromBoolean(() => !isDisabled))
			.map(() => commands.emit(item.commandName, payload))
			.map(() => commands.emit("context-menu.hide"))

	useAccelerator(item.accelerator, emitContextMenuItemCommand)

	return (
		<ActionListItem
			key={item.commandName}
			Icon={item.Icon}
			current={false}
			onClick={emitContextMenuItemCommand}
			text={item.readableName}
			disabled={isDisabled}
		>
			<RenderFromNullable having={item.accelerator}>
				<Accelerator accelerator={item.accelerator!} />
			</RenderFromNullable>
		</ActionListItem>
	)
}

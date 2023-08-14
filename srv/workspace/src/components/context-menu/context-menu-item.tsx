import { useHotkeys } from "react-hotkeys-hook"
import { Either } from "#lib/either/mod"
import { useCommands } from "$hooks/use-commands"
import { ContextMenuItem, getContextMenu } from "$streams/context-menu"
import RenderFromNullable from "$components/render-from-nullable"
import ActionListItem from "$components/action-list-item"
import Accelerator from "$components/accelerator"

type _P = { target: HTMLElement; item: ContextMenuItem; payload?: any }
export default function MenuItem({ item, target, payload: p }: _P) {
	const commands = useCommands()
	const contextMenu = getContextMenu()

	const payload = item.payloadCreator ? item.payloadCreator({ payload: p, target }) : p
	const isDisabled = item.shouldBeDisabled && item.shouldBeDisabled({ target, payload })
	const emitContextMenuItemCommand = () =>
		Either.fromNullable(item.accelerator)
			.chain(() => Either.fromBoolean(() => !isDisabled))
			.map(() => commands.emit(item.commandName, payload))
			.map(() => contextMenu.hide())

	useHotkeys(item.accelerator ?? [], emitContextMenuItemCommand)

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

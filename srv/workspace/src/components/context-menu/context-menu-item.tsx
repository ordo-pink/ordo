import { useCommands } from "../../hooks/use-commands"
import { ContextMenuItem, hideContextMenu } from "../../streams/context-menu"
import { Accelerator } from "../accelerator"
import { ActionListItem } from "../action-list-item"

type Props = {
	state: { x: number; y: number; target: any; structure: ContextMenuItem[] }
	item: ContextMenuItem
}

export default function MenuItem({ item, state }: Props) {
	const commands = useCommands()
	const payloadCreator = item.payloadCreator ?? (() => void 0)

	return (
		<ActionListItem
			key={item.name}
			Icon={item.Icon}
			current={false}
			onClick={() => {
				commands.emit(item.name as `${string}.${string}`, payloadCreator(state.target))
				hideContextMenu()
			}}
			text={item.name}
			disabled={item.disabled ? item.disabled(state.target) : false}
		>
			{item.accelerator ? <Accelerator accelerator={item.accelerator} /> : null}
		</ActionListItem>
	)
}

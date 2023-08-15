import type { ContextMenuItem } from "$streams/context-menu"
import MenuItem from "$components/context-menu/context-menu-item"
import { MouseEvent } from "react"

type _P = { items: ContextMenuItem[]; event: MouseEvent; payload?: any }
export default function ContextMenuItemList({ items, event, payload }: _P) {
	return (
		<div className="py-2">
			{items.map(item => (
				<MenuItem key={item.commandName} item={item} event={event} payload={payload} />
			))}
		</div>
	)
}

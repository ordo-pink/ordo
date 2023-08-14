import type { ContextMenuItem } from "$streams/context-menu"
import MenuItem from "$components/context-menu/context-menu-item"

type _P = { items: ContextMenuItem[]; target: HTMLElement; payload?: any }
export default function ContextMenuItemList({ items, target, payload }: _P) {
	return (
		<div className="py-2">
			{items.map(item => (
				<MenuItem key={item.commandName} item={item} target={target} payload={payload} />
			))}
		</div>
	)
}

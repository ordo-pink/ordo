// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { MouseEvent } from "react"
import { ContextMenu } from "#lib/libfe/mod"
import MenuItem from "$components/context-menu/context-menu-item"

type _P = { items: ContextMenu.Item[]; event: MouseEvent; payload?: any }
export default function ContextMenuItemList({ items, event, payload }: _P) {
	return (
		<div className="py-2">
			{items.map(item => (
				<MenuItem key={item.commandName} item={item} event={event} payload={payload} />
			))}
		</div>
	)
}

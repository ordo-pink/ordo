// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { MouseEvent } from "react"

import MenuItem from "./context-menu-item"

type _P = { items: Client.CtxMenu.Item[]; event: MouseEvent; payload?: any }
export default function ContextMenuItemList({ items, event, payload }: _P) {
	return (
		<div className="py-2">
			{items.map(item => (
				<MenuItem key={item.cmd} item={item} event={event} payload={payload} />
			))}
		</div>
	)
}

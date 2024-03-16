// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type { MouseEvent } from "react"

import { useAccelerator, useCommands } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import Accelerator from "@ordo-pink/frontend-react-components/accelerator"
import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import RenderFromNullable from "@ordo-pink/frontend-react-components/render-from-nullable"

type _P = { event: MouseEvent; item: Client.CtxMenu.Item; payload?: any }
export default function MenuItem({ item, event, payload: p }: _P) {
	const commands = useCommands()

	const payload = item.payloadCreator ? item.payloadCreator({ payload: p, event }) : p
	const isDisabled = item.shouldBeDisabled && item.shouldBeDisabled({ event, payload })
	const emitContextMenuItemCommand = () =>
		Either.fromBoolean(() => !isDisabled)
			.map(() => commands.emit(item.cmd, payload))
			.map(() => commands.emit<cmd.ctxMenu.hide>("context-menu.hide"))

	useAccelerator(item.accelerator, emitContextMenuItemCommand)

	return (
		<ActionListItem
			key={item.cmd}
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

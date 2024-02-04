// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { MouseEvent } from "react"

import { Either } from "@ordo-pink/either"
import { useAccelerator } from "@ordo-pink/frontend-react-hooks"
import { useCommands } from "@ordo-pink/frontend-stream-commands"

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

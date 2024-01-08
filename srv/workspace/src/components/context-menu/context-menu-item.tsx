// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { useAccelerator } from "$hooks/use-accelerator.hook"
import { getCommands } from "$streams/commands"
import RenderFromNullable from "$components/render-from-nullable"
import ActionListItem from "$components/action-list-item"
import { Accelerator } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"
import { CtxMenu } from "@ordo-pink/frontend-core"

const commands = getCommands()

type _P = { event: MouseEvent; item: CtxMenu.Item; payload?: any }
export default function MenuItem({ item, event, payload: p }: _P) {
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

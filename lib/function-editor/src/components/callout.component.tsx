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

import {
	BsCheckCircle,
	BsCircle,
	BsExclamationCircle,
	BsInfoCircle,
	BsQuestionCircle,
	BsThreeDotsVertical,
	BsXCircle,
} from "react-icons/bs"
import { Element, Transforms } from "slate"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import { useEffect } from "react"

import { useCommands } from "@ordo-pink/frontend-react-hooks"

import CalloutComponent from "@ordo-pink/frontend-react-components/callout"

export default function Callout({ attributes, children, element }: RenderElementProps) {
	const editor = useSlateStatic() as ReactEditor
	const commands = useCommands()

	useEffect(() => {
		const handleSetCalloutType = (type: Client.Notification.Type) => () => {
			const newProperties: Partial<Element & { calloutType: string }> = {
				calloutType: type,
			}

			Transforms.setNodes(editor, newProperties)
		}

		commands.on("editor.set-callout-type-default", handleSetCalloutType("default"))
		commands.on("editor.set-callout-type-info", handleSetCalloutType("info"))
		commands.on("editor.set-callout-type-question", handleSetCalloutType("question"))
		commands.on("editor.set-callout-type-success", handleSetCalloutType("success"))
		commands.on("editor.set-callout-type-warn", handleSetCalloutType("warn"))
		commands.on("editor.set-callout-type-rrr", handleSetCalloutType("rrr"))

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-default",
			Icon: BsCircle,
			readableName: "Default",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-info",
			Icon: BsInfoCircle,
			readableName: "Info",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-question",
			Icon: BsQuestionCircle,
			readableName: "Question",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-warn",
			Icon: BsExclamationCircle,
			readableName: "Warning",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-success",
			Icon: BsCheckCircle,
			readableName: "Success",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-rrr",
			Icon: BsXCircle,
			readableName: "Error",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		return () => {
			commands.off("editor.set-callout-type-default", handleSetCalloutType("default"))
			commands.off("editor.set-callout-type-info", handleSetCalloutType("info"))
			commands.off("editor.set-callout-type-question", handleSetCalloutType("question"))
			commands.off("editor.set-callout-type-success", handleSetCalloutType("success"))
			commands.off("editor.set-callout-type-warn", handleSetCalloutType("warn"))
			commands.off("editor.set-callout-type-rrr", handleSetCalloutType("rrr"))
		}
	}, [commands, editor, element])

	return (
		<div {...attributes} className="w-full py-4">
			<CalloutComponent type={(element as any).calloutType} className="w-full !max-w-full">
				<div className="flex w-full items-center justify-between">
					<span>{children}</span>
					<BsThreeDotsVertical
						className="shrink-0 cursor-pointer opacity-20 transition-opacity duration-300 hover:opacity-100"
						onClick={event =>
							commands.emit<cmd.ctx_menu.show>("context-menu.show", {
								event,
								payload: "editor.callout-menu",
							})
						}
					/>
				</div>
			</CalloutComponent>
		</div>
	)
}

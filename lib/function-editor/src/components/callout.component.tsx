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

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-default",
			Icon: BsCircle,
			readableName: "Default",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-info",
			Icon: BsInfoCircle,
			readableName: "Info",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-question",
			Icon: BsQuestionCircle,
			readableName: "Question",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-warn",
			Icon: BsExclamationCircle,
			readableName: "Warning",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.set-callout-type-success",
			Icon: BsCheckCircle,
			readableName: "Success",
			type: "update",
			shouldShow: ({ payload }) => payload === "editor.callout-menu",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
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
							commands.emit<cmd.ctxMenu.show>("context-menu.show", {
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

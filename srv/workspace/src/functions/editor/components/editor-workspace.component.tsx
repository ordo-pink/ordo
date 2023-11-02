// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import DataLabel from "$components/data/label.component"
import { useDataByFSID } from "$hooks/use-data.hook"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Descendant, createEditor, Node } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { useEffect, useMemo } from "react"
import { BsTerminal } from "react-icons/bs"
import { useContent } from "$hooks/use-content.hook"

export default function EditorWorkspace() {
	const { commands } = useSharedContext()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const data = useDataByFSID(fsid)
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])
	const content = useContent(fsid)

	useEffect(() => {
		commands.on("console.log", () => console.log("here"))

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "console.log",
			Icon: BsTerminal,
			readableName: "Консоль лог",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})
	}, [])

	return Either.fromNullable(data)
		.chain(data => Either.fromNullable(content).map(content => ({ data, content })))
		.fold(EmptyEditor, ({ data, content }) => (
			<div className="w-full h-full p-2 flex flex-col items-center py-12">
				<div className="w-full max-w-xl flex flex-col space-y-6">
					<div>
						<h1 className="text-3xl font-bold">{data.name}</h1>
					</div>

					<table className="w-full table-fixed text-neutral-500 text-sm">
						<tbody>
							<tr className="table-row">
								<td>Размер</td>
								<td>{data.size}B</td>
							</tr>
							<tr className="table-row">
								<td>Создан</td>
								<td>{new Date(data.createdAt).toLocaleString()}</td>
							</tr>
							<tr className="table-row">
								<td>Последнее изменение</td>
								<td>{new Date(data.updatedAt).toLocaleString()}</td>
							</tr>
							<tr className="table-row">
								<td>Ссылки</td>
								<td className="flex flex-wrap gap-x-1">
									{data.links.map(link => (
										<DataLabel key={link}>{link}</DataLabel>
									))}
								</td>
							</tr>
							<tr
								className="table-row cursor-pointer"
								onClick={() =>
									commands.emit<cmd.data.showEditLabelsPalette>(
										"data.show-edit-labels-palette",
										data,
									)
								}
							>
								<td>Теги</td>
								<td className="flex flex-wrap gap-1">
									{data.labels.map(label => (
										<DataLabel key={label}>{label}</DataLabel>
									))}
								</td>
							</tr>
						</tbody>
					</table>

					<Slate
						editor={editor}
						initialValue={deserialize(content)}
						onChange={value => {
							const isAstChange = editor.operations.some(op => "set_selection" !== op.type)

							if (!isAstChange) return

							commands.emit<cmd.data.setContent>("data.set-content", {
								fsid: data.fsid,
								content: serialize(value),
							})
						}}
					>
						<Editable
							className="outline-none"
							placeholder="Пора начинать..."
							onKeyDown={event => {
								if (editor.selection?.anchor.offset === 0 && event.key === "/") {
									;(event as any).clientX = event.currentTarget.offsetLeft
									;(event as any).clientY = event.currentTarget.offsetTop

									commands.emit<cmd.ctxMenu.show>("context-menu.show", {
										event: event as any,
										payload: "editor-quick-menu",
									})
								}
							}}
						/>
					</Slate>
				</div>
			</div>
		))
}

function EmptyEditor() {
	return <div>TODO</div>
}

const serialize = (value: Descendant[]) => {
	return (
		value
			// Return the string content of each paragraph in the value's children.
			.map(n => Node.string(n))
			// Join them all with line breaks denoting paragraphs.
			.join("\n")
	)
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string: string) => {
	// Return a value array of children derived by splitting the string.
	return string.split("\n").map(line => {
		return {
			type: "paragraph",
			children: [{ text: line }],
		}
	})
}

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataByFSID } from "$hooks/use-data.hook"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import DataEditor from "./data-editor.component"
import { useContent } from "$hooks/use-content.hook"
import { useSharedContext, cmd } from "@ordo-pink/frontend-core"
import { useMemo, useEffect, KeyboardEvent } from "react"
import { BsTerminal } from "react-icons/bs"
import { Subject, debounce, pairwise, timer } from "rxjs"
import { createEditor, Descendant, Node } from "slate"
import { withHistory } from "slate-history"
import { withReact, Slate, Editable } from "slate-react"

export default function EditorWorkspace() {
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const { commands } = useSharedContext()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	useEffect(() => {
		commands.on("console.log", () => console.log("here"))

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "console.log",
			Icon: BsTerminal,
			readableName: "Консоль лог",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.setContent>("data.set-content", { fsid, content: serialize(value) })
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return Either.fromNullable(data)
		.chain(data => Either.fromNullable(content).map(content => ({ data, content })))
		.fold(EmptyEditor, ({ data, content }) => (
			<div className="w-full h-full p-2 flex flex-col items-center py-12">
				<div className="w-full max-w-xl flex flex-col space-y-6">
					<div>
						<h1 className="text-3xl font-bold">{data.name}</h1>
					</div>
					<DataEditor data={data} />

					<Slate
						editor={editor}
						initialValue={deserialize(content)}
						onChange={(value: Descendant[]) => {
							const isAstChange = editor.operations.some(op => "set_selection" !== op.type)

							if (!isAstChange || !fsid) return

							save$.next({ fsid, value })
						}}
					>
						<Editable
							className="outline-none"
							placeholder="Пора начинать..."
							onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
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

// --- Internal ---

const save$ = new Subject<{ fsid: FSID; value: Descendant[] }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

const serialize = (value: Descendant[]) => value.map(n => Node.string(n)).join("\n")
const deserialize = (string: string) =>
	string.split("\n").map(line => ({ type: "paragraph", children: [{ text: line }] }))

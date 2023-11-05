// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataByFSID } from "$hooks/use-data.hook"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import DataEditor from "./data-editor.component"
import { useContent } from "$hooks/use-content.hook"
import { useSharedContext, cmd } from "@ordo-pink/frontend-core"
import { useMemo, useEffect, KeyboardEvent, useCallback } from "react"
import { BsTerminal } from "react-icons/bs"
import { Subject, debounce, timer } from "rxjs"
import {
	createEditor,
	Descendant,
	Editor,
	Node,
	Transforms,
	Range,
	Element as SlateElement,
	Point,
} from "slate"
import { withHistory } from "slate-history"
import { withReact, Slate, Editable, useSlateStatic, useReadOnly, ReactEditor } from "slate-react"
import { Switch } from "@ordo-pink/switch"
import EditableTitle from "./editable-title.component"

export default function EditorWorkspace() {
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const { commands } = useSharedContext()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)
	const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), [])

	const renderElement = useCallback((props: any) => <Element {...props} />, [])

	useEffect(() => {
		commands.on("editor.add-checklist-item", () => {
			editor.insertNode({
				children: [{ text: "What the heil!" }],
			})
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-checklist-item",
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
						<EditableTitle data={data} />
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
							spellCheck
							autoFocus
							className="outline-none"
							placeholder="Пора начинать..."
							renderElement={renderElement}
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

const withChecklists = (editor: ReactEditor) => {
	const { deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n: any) =>
					!Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === "check-list-item",
			}) as any

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					const newProperties: Partial<SlateElement & { type: string }> = {
						type: "paragraph",
					}

					Transforms.setNodes(editor, newProperties, {
						match: (n: any) =>
							!Editor.isEditor(n) &&
							SlateElement.isElement(n) &&
							(n as any).type === "check-list-item",
					})

					return editor
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}

const Element = (props: any) =>
	Switch.of(props.element.type)
		.case("check-list-item", () => <CheckListItemElement {...props} />)
		.default(() => <p {...props.attributes}>{props.children}</p>)

const CheckListItemElement = ({ attributes, children, element }: any) => {
	const editor = useSlateStatic() as ReactEditor
	const readOnly = useReadOnly()
	const { checked } = element
	return (
		<div {...attributes} className="flex items-center">
			<span contentEditable={false} className="mr-3">
				<input
					type="checkbox"
					checked={checked}
					onChange={event => {
						const path = ReactEditor.findPath(editor, element)
						const newProperties: Partial<SlateElement & { checked: boolean }> = {
							checked: event.target.checked,
						}

						Transforms.setNodes(editor, newProperties, { at: path })
					}}
				/>
			</span>
			<span
				contentEditable={!readOnly}
				suppressContentEditableWarning
				className={`flex outline-none ${checked ? "opacity-60 line-through" : "opacity-100"}`}
			>
				{children}
			</span>
		</div>
	)
}

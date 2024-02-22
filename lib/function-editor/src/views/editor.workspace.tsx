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

import { Descendant, Editor, Node, Element as SlateElement, Transforms, createEditor } from "slate"
import {
	Editable,
	ReactEditor,
	RenderElementProps,
	Slate,
	useReadOnly,
	useSlateStatic,
	withReact,
} from "slate-react"
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Subject } from "rxjs/internal/Subject"
import { debounce } from "rxjs/internal/operators/debounce"
import { timer } from "rxjs/internal/observable/timer"
import { withHistory } from "slate-history"

import {
	useCommands,
	useContent,
	useDataByFSID,
	useRouteParams,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { FSID } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"

import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import { EMPTY_EDITOR_CHILDREN, SHORTCUTS } from "../editor.constants"
import DataEditor from "../components/data-editor.component"
import EditableTitle from "../components/editable-title.component"
import { withChecklists } from "../plugins/with-checklists.editor-plugin"
import { withShortcuts } from "../plugins/with-shortcuts.editor-plugin"

import HoveringToolbar from "../components/hovering-toolbar.component"

// ---

export default function EditorWorkspace() {
	const { fsid } = useRouteParams<{ fsid: FSID }>()

	const commands = useCommands()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)

	const [initialState, setInitialState] = useState<Descendant[] | null | "empty">(null)

	const editor = useMemo(
		() => withShortcuts(withChecklists(withHistory(withReact(createEditor())))),
		[],
	)

	useEffect(() => {
		commands.emit<cmd.application.setTitle>(
			"application.set-title",
			data ? `${data.name} | Редактор` : "Редактор",
		)
	}, [data, commands])

	useEffect(() => {
		if (!data) return void setInitialState(null)
		if (data.size === 0) return void setInitialState("empty")
		if (!content) return void setInitialState(null)

		setInitialState(JSON.parse(content as string))

		return () => void setInitialState(null)
	}, [data, content])

	useEffect(() => {
		if (initialState === "empty") {
			editor.children = EMPTY_EDITOR_CHILDREN
			const point = { path: [0, 0], offset: 0 }
			editor.selection = { anchor: point, focus: point }
			editor.history = { undos: [], redos: [] }
		}
	}, [editor, initialState])

	const renderElement = useCallback((props: any) => <Element {...props} />, [])
	const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

	const handleDOMBeforeInput = useCallback(
		(event: InputEvent) => {
			queueMicrotask(() => {
				const pendingDiffs = ReactEditor.androidPendingDiffs(editor)

				const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
					if (!diff.text.endsWith(" ")) {
						return false
					}

					const { text } = Node.leaf(editor, path)
					const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1)
					if (!(beforeText in SHORTCUTS)) {
						return false
					}

					const blockEntry = Editor.above(editor, {
						at: path,
						match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
					})

					if (!blockEntry) return false

					const [, blockPath] = blockEntry
					return Editor.isStart(editor, Editor.start(editor, path), blockPath)
				})

				if (scheduleFlush) {
					ReactEditor.androidScheduleFlush(editor)
				}
			})

			switch (event.inputType) {
				case "formatBold":
					event.preventDefault()
					toggleMark(editor, "bold")
				// eslint-disable-next-line no-fallthrough
				case "formatItalic":
					event.preventDefault()
					toggleMark(editor, "italic")
				// eslint-disable-next-line no-fallthrough
				case "formatUnderline":
					event.preventDefault()
					toggleMark(editor, "underlined")
			}
		},
		[editor],
	)

	useEffect(() => {
		// const handleTest = () =>
		// 	editor.insertNode({
		// 		type: "check-list-item",
		// 		checked: false,
		// 		children: [{ text: "" }],
		// 	} as OrdoElement)

		// commands.on("editor.test", handleTest)

		// commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		// 	cmd: "editor.test",
		// 	Icon: BsTerminal,
		// 	readableName: "Создать чекбокс",
		// 	shouldShow: ({ payload }) => payload === "editor-quick-menu",
		// 	type: "update",
		// })

		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.setContent>("data.set-content", { fsid, content: serialize(value) })
		})

		return () => {
			// commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.test")
			// commands.off("editor.test", handleTest)
			subscription.unsubscribe()
		}
	}, [commands])

	return Either.fromNullable(data)
		.chain(data => Either.fromNullable(initialState).map(initialState => ({ data, initialState })))
		.fold(
			() => (
				<CenteredPage centerX centerY>
					<div className="px-12">
						Здесь будет редактор файла, если этот самый файл выбрать в сайдбаре слева.
					</div>
				</CenteredPage>
			),
			({ data, initialState }) => (
				<div className="flex size-full flex-col items-center p-2 py-12">
					<div className="flex w-full max-w-xl flex-col space-y-6">
						<div>
							<EditableTitle data={data} />
						</div>

						<DataEditor key={data.fsid} data={data} />

						<Slate
							editor={editor}
							initialValue={initialState === "empty" ? EMPTY_EDITOR_CHILDREN : initialState}
							onChange={(value: Descendant[]) => {
								const isAstChange = editor.operations.some(op => "set_selection" !== op.type)

								if (!isAstChange || !data.fsid) return

								commands.emit<cmd.background.startSaving>("background-task.start-saving")

								save$.next({ fsid: data.fsid, value })
							}}
						>
							<HoveringToolbar />
							<Editable
								spellCheck
								className="pb-96 outline-none"
								placeholder="Пора начинать..."
								renderLeaf={renderLeaf}
								onDOMBeforeInput={handleDOMBeforeInput}
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

									if (event.key === "Enter") {
										event.preventDefault()

										Transforms.insertNodes(editor, [
											{ type: "paragraph", children: [{ text: "" }] } as any,
										])
									}
								}}
							/>
						</Slate>
					</div>
				</div>
			),
		)
}

// --- Internal ---

const save$ = new Subject<{ fsid: FSID; value: Descendant[] }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

const serialize = (value: Descendant[]) => JSON.stringify(value)

const Leaf = ({ attributes, children, leaf }: any) => {
	if (leaf.bold) children = <strong>{children}</strong>
	if (leaf.code) children = <code>{children}</code>
	if (leaf.italic) children = <em>{children}</em>
	if (leaf.underlined) children = <u className="underline">{children}</u>

	return <span {...attributes}>{children}</span>
}

const Element = (props: any) =>
	Switch.of(props.element.type)
		.case("block-quote", () => <blockquote {...props.attributes}>{props.children}</blockquote>)
		.case("unordered-list", () => <ul {...props.attributes}>{props.children}</ul>)
		.case("ordered-list", () => <ol {...props.attributes}>{props.children}</ol>)
		.case("list-item", () => (
			<li className="py-2" {...props.attributes}>
				{props.children}
			</li>
		))
		.case("heading-1", () => (
			<h1 className="text-2xl font-black leading-6" {...props.attributes}>
				{props.children}
			</h1>
		))
		.case("heading-2", () => (
			<h2 className="text-xl font-extrabold leading-6" {...props.attributes}>
				{props.children}
			</h2>
		))
		.case("heading-3", () => (
			<h3 className="text-xl font-bold leading-6" {...props.attributes}>
				{props.children}
			</h3>
		))
		.case("heading-4", () => (
			<h4 className="text-lg font-bold leading-6" {...props.attributes}>
				{props.children}
			</h4>
		))
		.case("heading-5", () => (
			<h5 className="text-lg font-semibold leading-6" {...props.attributes}>
				{props.children}
			</h5>
		))
		.case("check-list-item", () => <CheckListItemElement {...props} />)
		.default(() => (
			<p className="" {...props.attributes}>
				{props.children}
			</p>
		))

const CheckListItemElement = ({ attributes, children, element }: RenderElementProps) => {
	const editor = useSlateStatic() as ReactEditor
	const readOnly = useReadOnly()

	return (
		<div {...attributes} className="flex items-center">
			<span contentEditable={false} className="mr-3">
				<input
					type="checkbox"
					className="size-6 cursor-pointer rounded-sm bg-neutral-200 text-emerald-500 focus:ring-0 dark:bg-neutral-500"
					checked={(element as any)?.checked}
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
				className={`flex outline-none ${
					(element as any)?.checked ? "line-through opacity-60" : "opacity-100"
				}`}
			>
				{children}
			</span>
		</div>
	)
}

const isMarkActive = (editor: ReactEditor, format: string) => {
	const marks = Editor.marks(editor) as any
	return marks ? marks[format] === true : false
}

const toggleMark = (editor: ReactEditor, format: string) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

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
	BsBlockquoteLeft,
	BsBox2,
	BsCheckCircle,
	BsCircle,
	BsExclamationCircle,
	BsInfoCircle,
	BsListCheck,
	BsListOl,
	BsListUl,
	BsQuestionCircle,
	BsTextParagraph,
	BsThreeDotsVertical,
	BsTypeH1,
	BsTypeH2,
	BsTypeH3,
	BsTypeH4,
	BsTypeH5,
	BsXCircle,
} from "react-icons/bs"
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
import { FSID } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { fromNullableE } from "@ordo-pink/either"

import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import Callout from "@ordo-pink/frontend-react-components/callout"
import Loader from "@ordo-pink/frontend-react-components/loader"

import { EMPTY_EDITOR_CHILDREN, SHORTCUTS } from "../editor.constants"
import { handleTransform } from "../fns/handle-transform"
import { withChecklists } from "../plugins/with-checklists.editor-plugin"
import { withShortcuts } from "../plugins/with-shortcuts.editor-plugin"

import DataEditor from "../components/data-editor.component"
import EditableTitle from "../components/editable-title.component"
import HoveringToolbar from "../components/hovering-toolbar.component"
import { OrdoDescendant } from "../editor.types"

export default function EditorWorkspace() {
	const { fsid } = useRouteParams<{ fsid: FSID }>()

	const commands = useCommands()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)

	const [prevFsid, setPrevFsid] = useState<FSID>()
	const [isLoading, setIsLoading] = useState(true)

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
		if (fsid !== prevFsid) {
			if (content == null) {
				setIsLoading(true)
				return
			}

			setPrevFsid(fsid)
			setIsLoading(false)

			editor.children = content !== "" ? JSON.parse(content as string) : EMPTY_EDITOR_CHILDREN
			const point = { path: [0, 0], offset: 0 }
			editor.selection = { anchor: point, focus: point }
			editor.history = { undos: [], redos: [] }
		}
	}, [fsid, prevFsid, content, editor])

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
				// @ts-ignore
				case "formatBold":
					event.preventDefault()
					toggleMark(editor, "bold")

				// @ts-ignore
				case "formatItalic": // eslint-disable-line no-fallthrough
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
		const handleCreateHeading1 = () => handleTransform(editor, "heading-1")
		const handleCreateHeading2 = () => handleTransform(editor, "heading-2")
		const handleCreateHeading3 = () => handleTransform(editor, "heading-3")
		const handleCreateHeading4 = () => handleTransform(editor, "heading-4")
		const handleCreateHeading5 = () => handleTransform(editor, "heading-5")
		const handleCreateListItem = () => handleTransform(editor, "list-item")
		const handleCreateNumberListItem = () => handleTransform(editor, "number-list-item")
		const handleCreateCheckListItem = () => handleTransform(editor, "check-list-item")
		const handleCreateBlockquote = () => handleTransform(editor, "block-quote")
		const handleCreateParagraph = () => handleTransform(editor, "paragraph")
		const handleCreateCallout = () => handleTransform(editor, "callout")

		// TODO: Add commands to `cmd` namespace
		commands.on("editor.add-heading-1", handleCreateHeading1)
		commands.on("editor.add-heading-2", handleCreateHeading2)
		commands.on("editor.add-heading-3", handleCreateHeading3)
		commands.on("editor.add-heading-4", handleCreateHeading4)
		commands.on("editor.add-heading-5", handleCreateHeading5)
		commands.on("editor.add-list-item", handleCreateListItem)
		commands.on("editor.add-list-item", handleCreateListItem)
		commands.on("editor.add-number-list-item", handleCreateNumberListItem)
		commands.on("editor.add-check-list-item", handleCreateCheckListItem)
		commands.on("editor.add-blockquote", handleCreateBlockquote)
		commands.on("editor.add-paragraph", handleCreateParagraph)
		commands.on("editor.add-callout", handleCreateCallout)

		// TODO: Support for putting a link
		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-heading-1",
			Icon: BsTypeH1,
			readableName: "Заголовок 1",
			accelerator: "1",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-heading-2",
			Icon: BsTypeH2,
			readableName: "Заголовок 2",
			accelerator: "2",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-heading-3",
			Icon: BsTypeH3,
			readableName: "Заголовок 3",
			accelerator: "3",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-heading-4",
			Icon: BsTypeH4,
			readableName: "Заголовок 4BsTypeH4",
			accelerator: "4",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-heading-5",
			Icon: BsTypeH5,
			readableName: "Заголовок 5",
			accelerator: "5",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-list-item",
			Icon: BsListUl,
			readableName: "Создать список",
			accelerator: "shift+1",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-number-list-item",
			Icon: BsListOl,
			readableName: "Создать упорядоченный список",
			accelerator: "shift+2",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-check-list-item",
			Icon: BsListCheck,
			readableName: "Создать чекбокс",
			accelerator: "shift+3",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-blockquote",
			Icon: BsBlockquoteLeft,
			readableName: "Создать цитату",
			accelerator: "b",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-paragraph",
			Icon: BsTextParagraph,
			readableName: "Создать параграф",
			accelerator: "backspace",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		commands.emit<cmd.ctxMenu.add>("context-menu.add", {
			cmd: "editor.add-callout",
			Icon: BsBox2,
			readableName: "Создать выноску",
			accelerator: "c",
			shouldShow: ({ payload }) => payload === "editor-quick-menu",
			type: "update",
		})

		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.setContent>("data.set-content", { fsid, content: serialize(value) })
		})

		return () => {
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-heading-1")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-heading-2")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-heading-3")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-heading-4")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-heading-5")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-list-item")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-number-list-item")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-check-list-item")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-blockquote")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-paragraph")
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "editor.add-callout")

			commands.off("editor.add-heading-1", handleCreateHeading1)
			commands.off("editor.add-heading-2", handleCreateHeading2)
			commands.off("editor.add-heading-3", handleCreateHeading3)
			commands.off("editor.add-heading-4", handleCreateHeading4)
			commands.off("editor.add-heading-5", handleCreateHeading5)
			commands.off("editor.add-list-item", handleCreateListItem)
			commands.off("editor.add-list-item", handleCreateListItem)
			commands.off("editor.add-number-list-item", handleCreateNumberListItem)
			commands.off("editor.add-check-list-item", handleCreateCheckListItem)
			commands.off("editor.add-blockquote", handleCreateBlockquote)
			commands.off("editor.add-paragraph", handleCreateParagraph)
			commands.off("editor.add-callout", handleCreateCallout)

			subscription.unsubscribe()
		}
	}, [commands, editor])

	return fromNullableE(data).fold(
		() => (
			<CenteredPage centerX centerY>
				<div className="px-12">
					Здесь будет редактор файла, если этот самый файл выбрать в сайдбаре слева.
				</div>
			</CenteredPage>
		),
		data => (
			<div className="flex size-full flex-col items-center p-2 py-12">
				<div className="flex w-full max-w-xl flex-col space-y-6">
					<div>
						<EditableTitle data={data} />
					</div>

					<DataEditor key={data.fsid} data={data} />

					<Slate
						editor={editor}
						initialValue={EMPTY_EDITOR_CHILDREN}
						onChange={(value: Descendant[]) => {
							const isAstChange = editor.operations.some(op => "set_selection" !== op.type)

							if (!isAstChange || !data.fsid) return

							commands.emit<cmd.background.startSaving>("background-task.start-saving")

							save$.next({ fsid: data.fsid, value })
						}}
					>
						<HoveringToolbar />
						{isLoading ? (
							<div className="flex size-full min-h-[50dvh] flex-col items-center justify-center">
								<Loader />
							</div>
						) : (
							<Editable
								spellCheck
								className="pb-96 outline-none"
								placeholder="Пора начинать..."
								renderLeaf={renderLeaf}
								onDOMBeforeInput={handleDOMBeforeInput}
								renderElement={renderElement}
								onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
									if (
										editor.selection?.anchor.offset === 0 &&
										(event.key === "/" || event.key === ".")
									) {
										const domSelection = window.getSelection()
										const domRange = domSelection?.getRangeAt(0)
										const rect = domRange?.getBoundingClientRect() ?? { top: 0, left: 0, width: 0 }

										;(event as any).clientX = rect.left
										;(event as any).clientY = rect.top - 50

										// TODO: Make a copy of context menu specifically for the editor
										commands.emit<cmd.ctxMenu.show>("context-menu.show", {
											event: event as any,
											payload: "editor-quick-menu",
										})

										return
									}

									if (event.key === "Enter") {
										if (!editor.selection) return

										const node = editor.children[editor.selection.anchor.path[0]] as OrdoDescendant

										if (
											node.type !== "check-list-item" &&
											node.type !== "list-item" &&
											node.type !== "number-list-item"
										) {
											event.preventDefault()

											Transforms.insertNodes(editor, [
												{ type: "paragraph", children: [{ text: "" }] } as any,
											])
										} else {
											if ((node as any).children?.[0].text === "") {
												event.preventDefault()

												handleTransform(editor, "paragraph")
												Transforms.delete(editor)
											}
										}
									}
								}}
							/>
						)}
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
		.case("callout", () => <EditorCalloutElement {...props} />)
		.case("block-quote", () => (
			<blockquote
				className="border-l border-neutral-500 py-2 pl-2 text-sm italic"
				{...props.attributes}
			>
				{props.children}
			</blockquote>
		))
		// .case("unordered-list", () => <ul {...props.attributes}>{props.children}</ul>)
		// .case("ordered-list", () => (
		// 	<ol className="list-decimal" {...props.attributes}>
		// 		{props.children}
		// 	</ol>
		// ))
		.case("list-item", () => (
			<li className="list-disc" {...props.attributes}>
				{props.children}
			</li>
		))
		.case("number-list-item", () => (
			<li className="list-decimal" {...props.attributes}>
				{props.children}
			</li>
		))
		.case("heading-1", () => (
			<h1 className="py-2 text-2xl font-black leading-6" {...props.attributes}>
				{props.children}
			</h1>
		))
		.case("heading-2", () => (
			<h2 className="py-2 text-xl font-extrabold leading-6" {...props.attributes}>
				{props.children}
			</h2>
		))
		.case("heading-3", () => (
			<h3 className="py-2 text-xl font-bold leading-6" {...props.attributes}>
				{props.children}
			</h3>
		))
		.case("heading-4", () => (
			<h4 className="py-2 text-lg font-bold leading-6" {...props.attributes}>
				{props.children}
			</h4>
		))
		.case("heading-5", () => (
			<h5 className="py-2 text-lg font-semibold leading-6" {...props.attributes}>
				{props.children}
			</h5>
		))
		.case("check-list-item", () => <CheckListItemElement {...props} />)
		.default(() => (
			<p className="py-2 " {...props.attributes}>
				{props.children}
			</p>
		))

const EditorCalloutElement = ({ attributes, children, element }: RenderElementProps) => {
	const editor = useSlateStatic() as ReactEditor
	const commands = useCommands()

	useEffect(() => {
		const handleSetCalloutType = (type: Client.Notification.Type) => () => {
			const newProperties: Partial<SlateElement & { calloutType: string }> = {
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
		<div {...attributes} className="py-4">
			<Callout type={(element as any).calloutType}>
				<div className="flex w-full items-center justify-between">
					{children}
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
			</Callout>
		</div>
	)
}

const CheckListItemElement = ({ attributes, children, element }: RenderElementProps) => {
	const editor = useSlateStatic() as ReactEditor
	const readOnly = useReadOnly()

	return (
		<div {...attributes} className="flex py-0.5">
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
				className={`mt-0.5 flex outline-none ${
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

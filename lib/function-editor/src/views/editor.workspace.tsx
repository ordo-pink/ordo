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
	BsTag,
	BsTextParagraph,
	BsThreeDotsVertical,
	BsTypeH1,
	BsTypeH2,
	BsTypeH3,
	BsTypeH4,
	BsTypeH5,
	BsXCircle,
} from "react-icons/bs"
import {
	Descendant,
	Editor,
	Node,
	Range,
	Element as SlateElement,
	Transforms,
	createEditor,
} from "slate"
import {
	Editable,
	ReactEditor,
	RenderElementProps,
	Slate,
	useReadOnly,
	useSlateStatic,
	withReact,
} from "slate-react"
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Fuse from "fuse.js"
import { Subject } from "rxjs/internal/Subject"
import { debounce } from "rxjs/internal/operators/debounce"
import { timer } from "rxjs/internal/observable/timer"
import { withHistory } from "slate-history"

import { FSID, PlainData } from "@ordo-pink/data"
import {
	useCommands,
	useContent,
	useDataByFSID,
	useDataLabels,
	useRouteParams,
	useSelectDataList,
} from "@ordo-pink/frontend-react-hooks"
import { Switch } from "@ordo-pink/switch"
import { fromNullableE } from "@ordo-pink/either"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import Callout from "@ordo-pink/frontend-react-components/callout"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import Loader from "@ordo-pink/frontend-react-components/loader"

import { EMPTY_EDITOR_CHILDREN, SHORTCUTS } from "../editor.constants"
import { handleTransform } from "../fns/handle-transform"
import { withChecklists } from "../plugins/with-checklists.editor-plugin"
import { withShortcuts } from "../plugins/with-shortcuts.editor-plugin"

import { OrdoDescendant, OrdoElement } from "../editor.types"
import { Portal } from "../components/portal.component"
import { noop } from "@ordo-pink/tau"
import { withLabels } from "../plugins/with-labels.editor-plugin"

import DataEditor from "../components/data-editor.component"
import EditableTitle from "../components/editable-title.component"
import HoveringToolbar from "../components/hovering-toolbar.component"
import Label from "../components/label.component"
import Link from "../components/link.component"
import { withLinks } from "../plugins/with-links.editor-plugin"

const labelFuse = new Fuse([] as string[], {
	threshold: 0.1,
})

const linkFuse = new Fuse([] as PlainData[], {
	keys: ["name"],
	threshold: 0.1,
})

export default function EditorWorkspace() {
	const ref = useRef<HTMLDivElement>(null)

	const { fsid } = useRouteParams<{ fsid: FSID }>()

	const commands = useCommands()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)

	const [prevFsid, setPrevFsid] = useState<FSID>()
	const [isLoading, setIsLoading] = useState(true)
	const [target, setTarget] = useState<Range | null>(null)
	const [index, setIndex] = useState(0)
	const [labelSearch, setLabelSearch] = useState("")
	const [linkSearch, setLinkSearch] = useState("")
	const [visibleLabels, setVisibleLabels] = useState<string[]>([])
	const [visibleLinks, setVisibleLinks] = useState<PlainData[]>([])

	const labels = useDataLabels()
	const links = useSelectDataList(item => item.fsid !== fsid)

	useEffect(() => {
		if (!labelSearch || !labels.length) return

		labelFuse.setCollection(labels)

		setVisibleLabels(
			labelFuse
				.search(labelSearch)
				.map(result => result.item)
				.slice(0, 10),
		)
	}, [labels.length, labelSearch])

	useEffect(() => {
		if (!linkSearch || !links.length) return

		linkFuse.setCollection(links)

		setVisibleLinks(
			linkFuse
				.search(linkSearch)
				.map(result => result.item)
				.slice(0, 10),
		)
	}, [links.length, linkSearch])

	const editor = useMemo(
		() =>
			withLinks(withLabels(withShortcuts(withChecklists(withHistory(withReact(createEditor())))))),
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
				case "formatCode": // eslint-disable-line no-fallthrough
					event.preventDefault()
					toggleMark(editor, "code")

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

		// TODO: Register once
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

	useEffect(() => {
		const el = ref.current
		if (!el || !target) return
		const domRange = ReactEditor.toDOMRange(editor, target)
		const rect = domRange.getBoundingClientRect()
		el.style.top = `${rect.top + window.scrollY + 24}px`
		el.style.left = `${rect.left + window.scrollX}px`
	}, [visibleLabels.length, editor, index, labelSearch, target])

	useEffect(() => {
		const el = ref.current
		if (!el || !target) return
		const domRange = ReactEditor.toDOMRange(editor, target)
		const rect = domRange.getBoundingClientRect()
		el.style.top = `${rect.top + window.scrollY + 24}px`
		el.style.left = `${rect.left + window.scrollX}px`
	}, [visibleLinks.length, editor, index, linkSearch, target])

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
							const { selection } = editor

							if (selection && Range.isCollapsed(selection)) {
								const [start] = Range.edges(selection)
								const wordBefore = Editor.before(editor, start, { unit: "word" })
								const before = wordBefore && Editor.before(editor, wordBefore)
								const beforeRange = before && Editor.range(editor, before, start)
								const beforeText = beforeRange && Editor.string(editor, beforeRange)
								const labelsBeforeMatch = beforeText && beforeText.match(/^[#№](\p{L}+)$/iu)
								const linksBeforeMatch = beforeText && beforeText.match(/^!(\p{L}+)$/iu)
								const after = Editor.after(editor, start)
								const afterRange = Editor.range(editor, start, after)
								const afterText = Editor.string(editor, afterRange)
								const afterMatch = afterText.match(/^(\s|$)/)

								if (linksBeforeMatch && afterMatch) {
									setTarget(beforeRange)
									setLinkSearch(linksBeforeMatch[1])
									setIndex(0)

									return
								}

								if (labelsBeforeMatch && afterMatch) {
									setTarget(beforeRange)
									setLabelSearch(labelsBeforeMatch[1])
									setIndex(0)

									return
								}
							}

							setTarget(null)

							const isAstChange = editor.operations.some(op => "set_selection" !== op.type)

							if (!isAstChange || !data.fsid) return

							commands.emit<cmd.background.startSaving>("background-task.start-saving")

							save$.next({ fsid: data.fsid, value })
						}}
					>
						<HoveringToolbar />

						{target && (labelSearch || linkSearch) && (
							<Portal>
								<div
									ref={ref}
									className="flex w-full max-w-sm flex-col rounded-lg bg-neutral-200 px-2 py-1 shadow-md dark:bg-neutral-600"
									style={{
										top: "-9999px",
										left: "-9999px",
										position: "absolute",
										zIndex: 1,
										padding: "3px",
									}}
									data-cy="labels-portal"
								>
									{visibleLinks.length > 0 ? (
										visibleLinks.map((link, i) => (
											<ActionListItem
												key={link.fsid}
												onClick={() => {
													Transforms.select(editor, target)
													insertLink(editor, link.fsid)
													setTarget(null)

													commands.emit<cmd.data.addLink>("data.add-link", {
														item: data,
														link: link.fsid,
													})
												}}
												text={link.name}
												Icon={BsTag}
												current={i === index}
											/>
										))
									) : visibleLabels.length > 0 ? (
										visibleLabels.map((label, i) => (
											<ActionListItem
												key={label}
												onClick={() => {
													Transforms.select(editor, target)
													insertLabel(editor, label)
													setTarget(null)

													commands.emit<cmd.data.addLabel>("data.add-label", { item: data, label })
												}}
												text={label}
												Icon={BsTag}
												current={i === index}
											/>
										))
									) : labelSearch !== "" ? (
										<ActionListItem
											onClick={() => {
												Transforms.select(editor, target)
												insertLabel(editor, labelSearch)
												setTarget(null)

												commands.emit<cmd.data.addLabel>("data.add-label", {
													item: data,
													label: labelSearch,
												})
											}}
											text={`Создать метку "${labelSearch}"`}
											Icon={BsTag}
											current
										/>
									) : null}
								</div>
							</Portal>
						)}

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
									if (target && (visibleLabels.length > 0 || labelSearch !== "")) {
										Switch.of(event.key)
											.case("ArrowDown", () => {
												event.preventDefault()
												const prevIndex = index >= visibleLabels.length - 1 ? 0 : index + 1
												setIndex(prevIndex)
											})
											.case("ArrowUp", () => {
												event.preventDefault()
												const nextIndex = index <= 0 ? visibleLabels.length - 1 : index - 1
												setIndex(nextIndex)
											})
											.case(
												key => ["Tab", "Enter"].includes(key),
												() => {
													event.preventDefault()
													Transforms.select(editor, target)
													insertLabel(editor, visibleLabels[index] ?? labelSearch)
													setTarget(null)

													commands.emit<cmd.data.addLabel>("data.add-label", {
														item: data,
														label: visibleLabels[index] ?? labelSearch,
													})
												},
											)
											.case("Escape", () => {
												event.preventDefault()
												setTarget(null)
											})
											.default(noop)

										return
									} else if (target && (visibleLinks.length > 0 || linkSearch !== "")) {
										Switch.of(event.key)
											.case("ArrowDown", () => {
												event.preventDefault()
												const prevIndex = index >= visibleLinks.length - 1 ? 0 : index + 1
												setIndex(prevIndex)
											})
											.case("ArrowUp", () => {
												event.preventDefault()
												const nextIndex = index <= 0 ? visibleLinks.length - 1 : index - 1
												setIndex(nextIndex)
											})
											.case(
												key => ["Tab", "Enter"].includes(key),
												() => {
													if (!visibleLinks[index]) return

													event.preventDefault()

													Transforms.select(editor, target)
													insertLink(editor, visibleLinks[index].fsid)
													setTarget(null)

													commands.emit<cmd.data.addLink>("data.add-link", {
														item: data,
														link: visibleLinks[index].fsid,
													})
												},
											)
											.case("Escape", () => {
												event.preventDefault()
												setTarget(null)
											})
											.default(noop)

										return
									}

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

const insertLabel = (editor: Editor, label: string) => {
	const labelNode: OrdoElement = {
		type: "label",
		label,
		children: [{ text: "" }],
	} as any
	Transforms.insertNodes(editor, labelNode)
	Transforms.move(editor)
}

const insertLink = (editor: Editor, fsid: FSID) => {
	const linkNode: OrdoElement = {
		type: "link",
		fsid,
		children: [{ text: "" }],
	} as any
	Transforms.insertNodes(editor, linkNode)
	Transforms.move(editor)
}

const serialize = (value: Descendant[]) => JSON.stringify(value)

const Leaf = ({ attributes, children, leaf }: any) => {
	if (leaf.bold) children = <strong className="inline-block">{children}</strong>
	if (leaf.code) children = <code className="inline-block">{children}</code>
	if (leaf.italic) children = <em className="inline-block">{children}</em>
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
		.case("link", () => <Link {...props} />)
		.case("label", () => <Label {...props} />)
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

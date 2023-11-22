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
import { Loading } from "$components/loading/loading"

export default function EditorWorkspace() {
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const { commands } = useSharedContext()
	const data = useDataByFSID(fsid)
	const content = useContent(fsid)
	const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), [])

	const renderElement = useCallback((props: any) => <Element {...props} />, [])
	const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

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
							className="outline-none pb-96"
							placeholder="Пора начинать..."
							renderLeaf={renderLeaf}
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

									Transforms.insertNodes(editor, [{ type: "paragraph", children: [{ text: "" }] }])
								}
							}}
						/>
					</Slate>
				</div>
			</div>
		))
}

const EmptyEditor = () => {
	const { fsid } = useRouteParams<{ fsid: FSID }>()

	return Either.fromNullable(fsid).fold(
		() => <div>TODO</div>, // TODO: "/editor" template page
		() => <Loading />,
	)
}

// --- Internal ---

const save$ = new Subject<{ fsid: FSID; value: Descendant[] }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

const serialize = (value: (Descendant & { type: string })[]) =>
	value
		.map(n =>
			Switch.of(n.type)
				.case("heading-1", () => `# ${Node.string(n)}`)
				.case("heading-2", () => `## ${Node.string(n)}`)
				.case("heading-3", () => `### ${Node.string(n)}`)
				.case("heading-4", () => `#### ${Node.string(n)}`)
				.case("heading-5", () => `##### ${Node.string(n)}`)
				.default(() => Node.string(n)),
		)
		.join("\n")

const deserialize = (string: string) =>
	string.split("\n").map(line =>
		Switch.of(line)
			.case(
				line => line.startsWith("# "),
				() => ({ type: "heading-1", children: [{ text: line.slice(2) }] }),
			)
			.default(() => ({ type: "paragraph", children: [{ text: line }] })),
	)

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

const Leaf = ({ attributes, children, leaf }: any) => {
	if (leaf.bold) children = <strong>{children}</strong>
	if (leaf.code) children = <code>{children}</code>
	if (leaf.italic) children = <em>{children}</em>
	if (leaf.underline) children = <u>{children}</u>

	return <span {...attributes}>{children}</span>
}

const Element = (props: any) =>
	Switch.of(props.element.type)
		.case("blockquote", () => <blockquote {...props.attributes} />)
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
			<h2 className="py-2" {...props.attributes}>
				{props.children}
			</h2>
		))
		.case("heading-3", () => (
			<h3 className="py-2" {...props.attributes}>
				{props.children}
			</h3>
		))
		.case("heading-4", () => (
			<h4 className="py-2" {...props.attributes}>
				{props.children}
			</h4>
		))
		.case("heading-5", () => (
			<h5 className="py-2" {...props.attributes}>
				{props.children}
			</h5>
		))
		.case("check-list-item", () => <CheckListItemElement {...props.attributes} />)
		.default(() => (
			<p className="py-2" {...props.attributes}>
				{props.children}
			</p>
		))

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

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsTypeBold, BsTypeItalic, BsTypeUnderline } from "react-icons/bs"
import { Editor, Range } from "slate"
import { ReactEditor, useFocused, useSlate } from "slate-react"
import { Ref, forwardRef, useEffect, useRef } from "react"

import { Portal } from "./portal.component"

export default function HoveringToolbar() {
	const ref = useRef<HTMLDivElement | null>()
	const editor = useSlate()
	const inFocus = useFocused()

	useEffect(() => {
		const el = ref.current
		const { selection } = editor

		if (!el) {
			return
		}

		if (
			!selection ||
			!inFocus ||
			Range.isCollapsed(selection) ||
			Editor.string(editor, selection) === ""
		) {
			el.removeAttribute("style")
			return
		}

		const domSelection = window.getSelection()
		const domRange = domSelection?.getRangeAt(0)
		const rect = domRange?.getBoundingClientRect() ?? { top: 0, left: 0, width: 0 }

		el.style.opacity = "1"
		el.style.display = "flex"
		el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`
		el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`
	})

	return (
		<Portal>
			<Menu
				ref={ref as any}
				className="absolute left-[-10000] top-[-10000] z-10 mt-1.5 hidden rounded-sm bg-neutral-300 p-2 opacity-0 shadow-lg dark:bg-neutral-700"
				onMouseDown={(e: any) => {
					// prevent toolbar from taking focus away from editor
					e.preventDefault()
				}}
			>
				<FormatButton format="bold" Icon={() => <BsTypeBold />} />
				<FormatButton format="italic" Icon={() => <BsTypeItalic />} />
				<FormatButton format="underlined" Icon={() => <BsTypeUnderline />} />
			</Menu>
		</Portal>
	)
}

const MenuRef = (
	{ className, style, ...props }: PropsWithChildren<any>,
	ref: Ref<HTMLDivElement | null>,
) => <div style={style} {...props} data-test-id="menu" ref={ref} className={className} />

const Menu = forwardRef(MenuRef)

const FormatButton = ({ format, Icon }: any) => {
	const editor = useSlate()

	return (
		<Button
			reversed
			active={isMarkActive(editor as ReactEditor, format)}
			onClick={() => toggleMark(editor as ReactEditor, format)}
		>
			<Icon />
		</Button>
	)
}

interface BaseProps {
	className: string
	[key: string]: unknown
}

const toggleMark = (editor: ReactEditor, format: string) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isMarkActive = (editor: ReactEditor, format: string) => {
	const marks = Editor.marks(editor) as any
	return marks ? marks[format] === true : false
}

const ButtonRef = (props: PropsWithChildren<BaseProps>, ref: Ref<HTMLSpanElement | null>) => (
	<span {...props} active={String(props.active)} ref={ref as any} className="" />
)

const Button = forwardRef(ButtonRef)

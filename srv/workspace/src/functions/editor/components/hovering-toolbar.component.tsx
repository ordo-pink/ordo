import { PropsWithChildren, Ref, forwardRef, useEffect, useRef } from "react"
import { Editor, Range } from "slate"
import { ReactEditor, useFocused, useSlate } from "slate-react"
import { Portal } from "./portal.component"
import { BsTypeBold, BsTypeItalic, BsTypeUnderline } from "react-icons/bs"

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
				className={`absolute hidden z-10 top-[-10000] left-[-10000] mt-1.5 opacity-0 bg-neutral-300 dark:bg-neutral-700 shadow-lg rounded-sm p-2`}
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

const Menu = forwardRef(
	({ className, style, ...props }: PropsWithChildren<any>, ref: Ref<HTMLDivElement | null>) => (
		<div style={style} {...props} data-test-id="menu" ref={ref} className={className} />
	),
)

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

const Button = forwardRef(
	(
		{
			className,
			active,
			reversed,
			...props
		}: PropsWithChildren<
			{
				active: boolean
				reversed: boolean
			} & BaseProps
		>,
		ref: Ref<HTMLSpanElement | null>,
	) => <span {...props} ref={ref as any} className="" />,
)

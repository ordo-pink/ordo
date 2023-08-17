import type {
	ComponentType,
	CSSProperties,
	KeyboardEventHandler,
	MouseEventHandler,
	PropsWithChildren,
} from "react"
import { noop } from "#lib/tau/mod"
import Link from "$components/link"

type Props = {
	text: string
	Icon: ComponentType
	current: boolean
	large?: boolean
	style?: CSSProperties
	disabled?: boolean
	href?: string
	onClick?: MouseEventHandler
	onMouseEnter?: MouseEventHandler
	onMouseLeave?: MouseEventHandler
	onContextMenu?: MouseEventHandler
	onEnterKeyDown?: KeyboardEventHandler
}

export default function ActionListItem({
	Icon,
	text,
	href,
	style = {},
	children,
	current,
	large,
	disabled,
	onClick = noop,
	onMouseEnter = noop,
	onMouseLeave = noop,
	onContextMenu = noop,
	onEnterKeyDown = noop,
}: PropsWithChildren<Props>) {
	const right = Array.isArray(children) ? children[0] : children
	const bottom = Array.isArray(children) ? children[1] : null

	return href ? (
		<Link className="no-underline !text-neutral-800 dark:!text-neutral-200" href={href}>
			<div
				className={`p-2 md:py-0.5 rounded-md flex space-x-8 justify-between items-center select-none ${
					large && "p-4 text-lg"
				} ${
					disabled
						? "text-neutral-300 dark:text-neutral-400"
						: "hover:bg-gradient-to-r from-rose-300/40 dark:from-slate-600 to-purple-300/40 dark:to-gray-600 cursor-pointer"
				} ${
					current &&
					"bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
				}`}
				style={style}
				onClick={e => (disabled ? void 0 : onClick(e))}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onContextMenu={onContextMenu}
				role="none"
				onKeyDown={e => (disabled ? void 0 : onEnterKeyDown(e))}
			>
				<div className="flex items-center space-x-2 w-full truncate">
					<div className="shrink-0">
						<Icon />
					</div>
					<div className="text-sm truncate">{text}</div>
				</div>
				<div className="shrink-0">{right}</div>
			</div>
			<div className="action-list_item_bottom">{bottom}</div>
		</Link>
	) : (
		<div>
			<div
				className={`p-2 md:py-0.5 rounded-md flex space-x-8 justify-between items-center select-none ${
					large && "p-4 text-lg"
				} ${
					disabled
						? "text-neutral-300 dark:text-neutral-400"
						: "hover:bg-gradient-to-r from-rose-300/40 dark:from-slate-600 to-purple-300/40 dark:to-gray-600 cursor-pointer"
				} ${
					current &&
					"bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
				}`}
				style={style}
				onClick={e => (disabled ? void 0 : onClick(e))}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onContextMenu={onContextMenu}
				role="none"
				onKeyDown={onEnterKeyDown}
			>
				<div className="flex items-center space-x-2 w-full truncate">
					<div className="shrink-0">
						<Icon />
					</div>
					<div className="text-sm truncate">{text}</div>
				</div>
				<div className="shrink-0">{right}</div>
			</div>
			<div className="action-list_item_bottom">{bottom}</div>
		</div>
	)
}
// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { CSSProperties, ComponentType, KeyboardEventHandler, MouseEventHandler } from "react"
import type { IconType } from "react-icons"

import { noop } from "@ordo-pink/tau"

import Link from "../link"

type Props = {
	text: string
	Icon: ComponentType | IconType
	current: boolean
	large?: boolean
	style?: CSSProperties
	disabled?: boolean
	href?: string
	className?: string
	title?: string
	children?: any
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
	className,
	title,
	onClick = noop,
	onMouseEnter = noop,
	onMouseLeave = noop,
	onContextMenu = noop,
	onEnterKeyDown = noop,
}: Props) {
	const right = Array.isArray(children) ? children[0] : children
	const bottom = Array.isArray(children) ? children[1] : null

	return href ? (
		<Link
			className={`!text-neutral-800 no-underline dark:!text-neutral-200 ${className}`}
			href={href}
		>
			<div
				title={title ?? text}
				className={`flex select-none items-center justify-between space-x-8 rounded-md p-2 sm:py-1 ${
					large ? "px-4 text-lg" : ""
				} ${
					disabled
						? "text-neutral-300 dark:text-neutral-400"
						: "cursor-pointer ring-0 hover:bg-gradient-to-r hover:from-slate-300 hover:to-neutral-300 hover:dark:from-slate-600 hover:dark:to-gray-600"
				} ${
					current
						? "bg-gradient-to-r !from-rose-300 !to-purple-300 hover:from-rose-300 hover:to-purple-300 dark:!from-pink-700 dark:!to-pink-950"
						: ""
				}`}
				// @ts-ignore
				style={style}
				onClick={e => (disabled ? void 0 : onClick(e))}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onContextMenu={onContextMenu}
				role="none"
				onKeyDown={e => (disabled ? void 0 : onEnterKeyDown(e))}
			>
				<div className="flex w-full items-center space-x-2 truncate">
					<div className="shrink-0">
						<Icon />
					</div>
					<div className="truncate text-sm">{text}</div>
				</div>
				<div className="shrink-0">{right}</div>
			</div>
			<div>{bottom}</div>
		</Link>
	) : (
		<div>
			<div
				className={`flex select-none items-center justify-between space-x-8 rounded-md p-2 md:py-1 ${
					large && "px-4 text-lg"
				} ${
					disabled
						? "text-neutral-300 dark:text-neutral-400"
						: "cursor-pointer from-slate-300 to-neutral-300 hover:bg-gradient-to-r dark:from-slate-600 dark:to-gray-600"
				} ${
					current &&
					"bg-gradient-to-r !from-rose-300 !to-purple-300 hover:from-rose-300 hover:to-purple-300 dark:!from-pink-700 dark:!to-pink-950"
				}`}
				// @ts-ignore
				style={style}
				onClick={e => (disabled ? void 0 : onClick(e))}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onContextMenu={onContextMenu}
				role="none"
				onKeyDown={onEnterKeyDown}
			>
				<div className="flex w-full items-center space-x-2 truncate">
					<div className="shrink-0">
						<Icon />
					</div>
					<div className="truncate text-sm">{text}</div>
				</div>
				<div className="shrink-0">{right}</div>
			</div>
			<div>{bottom}</div>
		</div>
	)
}

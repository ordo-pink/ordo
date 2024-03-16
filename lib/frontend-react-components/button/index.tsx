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

import { MouseEvent, PropsWithChildren, useRef } from "react"

import { noop } from "@ordo-pink/tau"

import { useAccelerator } from "@ordo-pink/frontend-react-hooks/src/use-accelerator.hook"

import Accelerator from "../accelerator/index"

import "./button.css"

type Props = PropsWithChildren<{
	onClick: (event: MouseEvent<HTMLButtonElement>) => void
	onMouseOver?: () => void
	disabled?: boolean
	className?: string
	outline?: boolean
	hotkey?: string
	center?: boolean
	inverted?: boolean
	compact?: boolean
	title?: string
}>

export const Base = ({
	children,
	onClick,
	disabled,
	className = "",
	hotkey = "",
	onMouseOver = noop,
	outline = false,
	center = false,
	compact = false,
	inverted = false,
	title = "",
}: Props) => {
	const ref = useRef<HTMLButtonElement>(null)

	useAccelerator(hotkey, () => void (ref.current && ref.current.click()))

	const classes = ["button"]

	if (outline) classes.push("outline")
	if (center) classes.push("center")
	if (compact) classes.push("compact")
	if (inverted) classes.push("inverted")
	if (className) classes.push(className)

	return (
		<button
			ref={ref}
			title={title}
			onClick={onClick}
			onContextMenu={onClick}
			onMouseOver={onMouseOver}
			onFocus={onMouseOver}
			className={classes.join(" ")}
			disabled={disabled}
		>
			<div className="flex items-center justify-center space-x-2">
				<div className="shrink-0">{children}</div>

				{hotkey ? (
					<div className={`button-accelerator ${!disabled && "visible"}`}>
						<Accelerator accelerator={hotkey} />
					</div>
				) : null}
			</div>
		</button>
	)
}

export const Primary = ({
	children,
	onClick,
	className,
	onMouseOver,
	hotkey,
	title,
	disabled,
	inverted,
	outline,
	center,
	compact,
}: Props) => {
	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={`primary ${className}`}
			outline={outline}
			center={center}
			compact={compact}
			inverted={inverted}
		>
			{children}
		</Base>
	)
}

export const Secondary = ({
	children,
	onClick,
	className,
	onMouseOver,
	hotkey,
	disabled,
	inverted,
	outline,
	center,
	compact,
	title,
}: Props) => {
	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={`secondary ${className}`}
			outline={outline}
			center={center}
			compact={compact}
			inverted={inverted}
		>
			{children}
		</Base>
	)
}

export const Success = ({
	children,
	onClick,
	className,
	onMouseOver,
	hotkey,
	disabled,
	outline,
	center,
	inverted,
	compact,
	title,
}: Props) => {
	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={`success ${className}`}
			outline={outline}
			center={center}
			compact={compact}
			inverted={inverted}
		>
			{children}
		</Base>
	)
}

export const Neutral = ({
	children,
	onClick,
	className,
	onMouseOver,
	hotkey,
	disabled,
	inverted,
	outline,
	center,
	compact,
	title,
}: Props) => {
	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={`neutral ${className}`}
			outline={outline}
			center={center}
			compact={compact}
			inverted={inverted}
		>
			{children}
		</Base>
	)
}

const OrdoButton = {
	Primary,
	Secondary,
	Neutral,
	Success,
	Base,
}

export default OrdoButton

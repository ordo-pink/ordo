// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { MouseEvent, PropsWithChildren, useRef } from "react"

import { Either } from "@ordo-pink/either"
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
	title = "",
}: Props) => {
	const ref = useRef<HTMLButtonElement>(null)

	useAccelerator(hotkey, () => void (ref.current && ref.current.click()))

	return (
		<button
			ref={ref}
			title={title}
			onClick={onClick}
			onContextMenu={onClick}
			onMouseOver={onMouseOver}
			onFocus={onMouseOver}
			className={`button ${outline ? "button-outline" : ""} ${className} ${
				compact ? "button-compact" : "button-normal"
			}`}
			disabled={disabled}
		>
			<div className={`button-content ${center ? "button-content-center" : ""}`}>
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
	let buttonClassNames: string

	if (disabled) {
		buttonClassNames = "button-primary-disabled"
	} else if (inverted) {
		buttonClassNames = "button-primary-inverted"
	} else {
		buttonClassNames = ""
	}

	const classNames = `button-primary ${buttonClassNames} ${className}`

	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={classNames}
			outline={outline}
			center={center}
			compact={compact}
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
	let buttonClassNames: string

	if (disabled) {
		buttonClassNames = "button-secondary-disabled"
	} else if (inverted) {
		buttonClassNames = "button-secondary-inverted"
	} else {
		buttonClassNames = ""
	}

	const buttonClass = `button-secondary ${buttonClassNames} ${className}`

	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			title={title}
			className={buttonClass}
			outline={outline}
			center={center}
			compact={compact}
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
	compact,
	title,
}: Props) => {
	const buttonAppearanceClass = Either.fromBoolean(() => !!disabled).fold(
		() =>
			"bg-gradient-to-r from-sky-300 dark:from-cyan-600 via-teal-300 dark:via-teal-600 to-emerald-300 dark:to-emerald-600 active-ring",
		() =>
			"bg-gradient-to-r from-slate-300 via-zinc-300 to-stone-300 dark:from-slate-900 dark:via-zinc-900 dark:to-stone-900",
	)

	const buttonClass = `${buttonAppearanceClass} ${className}`

	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			className={buttonClass}
			outline={outline}
			title={title}
			center={center}
			compact={compact}
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
	let buttonClassNames: string

	if (disabled) {
		buttonClassNames = "button-neutral-disabled"
	} else if (inverted) {
		buttonClassNames = "button-neutral-inverted"
	} else {
		buttonClassNames = ""
	}

	const buttonClass = `button-neutral ${buttonClassNames} ${className}`

	return (
		<Base
			onClick={onClick}
			onMouseOver={onMouseOver}
			disabled={disabled}
			hotkey={hotkey}
			className={buttonClass}
			outline={outline}
			title={title}
			center={center}
			compact={compact}
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

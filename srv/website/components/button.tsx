// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { MouseEventHandler, PropsWithChildren } from "react"
import { BsArrowRight } from "react-icons/bs"

type Props = PropsWithChildren<{
	onClick?: MouseEventHandler<HTMLButtonElement>
	inverted?: boolean
	disabled?: boolean
}>

export const Button = ({ children, disabled, inverted, onClick }: Props) => {
	const className = inverted
		? "text-stone-900 dark:text-neutral-100 bg-transparent"
		: "text-neutral-300 dark:text-neutral-800 bg-stone-900 dark:bg-neutral-100"

	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`border-2 border-stone-900 dark:border-neutral-100 disabled:border-neutral-500 cursor-pointer flex items-center disabled:ring-0 disabled:cursor-not-allowed disabled:bg-neutral-500 space-x-2  max-w-xs self-end px-6 py-1 rounded-md hover:ring-2 hover:ring-pink-300 dark:hover:ring-pink-500 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 transition-all duration-300 ${className}`}
		>
			<div>{children}</div>
			<BsArrowRight />
		</button>
	)
}

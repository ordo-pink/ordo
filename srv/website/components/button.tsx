// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { MouseEventHandler, PropsWithChildren } from "react"
import { BsArrowRight } from "react-icons/bs"

type Props = PropsWithChildren<{
	onClick?: MouseEventHandler<HTMLButtonElement>
	disabled?: boolean
}>

export const Button = ({ children, disabled, onClick }: Props) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className="cursor-pointer flex items-center disabled:ring-0 disabled:cursor-not-allowed disabled:bg-neutral-500 space-x-2 bg-stone-900 dark:bg-neutral-100 text-neutral-300 dark:text-neutral-800 max-w-xs self-end px-6 py-1 rounded-md hover:ring-2 hover:ring-pink-300 dark:hover:ring-pink-500 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 transition-all duration-300"
		>
			<div>{children}</div>
			<BsArrowRight />
		</button>
	)
}

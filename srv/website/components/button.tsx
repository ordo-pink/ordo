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
			className={`flex max-w-xs cursor-pointer items-center space-x-2 self-end rounded-md border-2 border-stone-900 px-6 py-1  transition-all duration-300 hover:ring-2 hover:ring-pink-300 focus:ring-2 focus:ring-pink-300 disabled:cursor-not-allowed disabled:border-neutral-500 disabled:bg-neutral-500 disabled:ring-0 dark:border-neutral-100 dark:hover:ring-pink-500 dark:focus:ring-pink-500 ${className}`}
		>
			<div>{children}</div>
			<BsArrowRight />
		</button>
	)
}

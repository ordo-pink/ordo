// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"

import Heading from "../heading"

type _P = PropsWithChildren<{ title?: string; className?: string }>
export default function Card({ title, children, className }: _P) {
	return (
		<div
			className={`flex w-full flex-col space-y-4 rounded-lg bg-neutral-200 p-4 shadow-md dark:bg-neutral-900 dark:shadow-inner md:p-8 ${className}`}
		>
			{title ? (
				<Heading level="3" uppercase center>
					{title}
				</Heading>
			) : null}
			{children}
		</div>
	)
}

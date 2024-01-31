// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { Title } from "./page-header"

type _P = PropsWithChildren<{ title?: string; className?: string }>
export default function Card({ title, children, className }: _P) {
	return (
		<div
			className={`flex flex-col p-4 space-y-4 w-full rounded-lg shadow-md bg-neutral-200 dark:bg-neutral-900 md:p-8 dark:shadow-inner ${className}`}
		>
			{title ? (
				<Title level="3" uppercase center>
					{title}
				</Title>
			) : null}
			{children}
		</div>
	)
}

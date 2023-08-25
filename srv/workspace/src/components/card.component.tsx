// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { Title } from "./page-header"

type _P = PropsWithChildren<{ title: string; className?: string }>
export default function Card({ title, children, className }: _P) {
	return (
		<div
			className={`w-full flex flex-col space-y-4 bg-neutral-300 dark:bg-neutral-900 p-4 md:p-8 rounded-lg shadow-md dark:shadow-inner ${className}`}
		>
			<Title level="3" uppercase center>
				{title}
			</Title>
			{children}
		</div>
	)
}

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"

export default function DataLabel({ children }: PropsWithChildren) {
	return (
		<div className="text-xs shadow-sm whitespace-nowrap text-neutral-500 bg-neutral-200 dark:bg-neutral-900 rounded-md px-1 py-0.5 hover:ring-1 hover:ring-purple-500 transition-all duration-300">
			{children}
		</div>
	)
}

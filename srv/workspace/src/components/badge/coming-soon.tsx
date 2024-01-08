// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { Badge } from "./badge"

type Props = PropsWithChildren<{ className?: string }>
export const ComingSoonBadge = ({ children, className = "" }: Props) => {
	return (
		<Badge
			className={`uppercase font-light bg-gradient-to-tr from-cyan-200 to-violet-200 dark:from-cyan-800 dark:to-violet-800 ${className}`}
		>
			{children ? children : <div>{"soon"}</div>}
		</Badge>
	)
}

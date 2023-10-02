// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { Badge } from "./badge"

import "./coming-soon.css"

type Props = PropsWithChildren<{
	className?: string
}>

export const ComingSoonBadge = ({ children, className = "" }: Props) => {
	return (
		<Badge className={`coming-soon-badge ${className}`}>
			{children ? children : <div>{"soon"}</div>}
		</Badge>
	)
}

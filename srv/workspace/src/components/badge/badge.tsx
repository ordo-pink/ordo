// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"

import "./badge.css"

type Props = PropsWithChildren<{
	className?: string
}>

export const Badge = ({ children, className = "" }: Props) => {
	return <div className={`badge ${className}`}>{children}</div>
}

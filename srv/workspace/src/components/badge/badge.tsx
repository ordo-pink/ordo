// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"

type P = PropsWithChildren<{ className?: string }>
export const Badge = ({ children, className = "" }: P) => {
	return <div className={`px-1 py-0.5 text-xs uppercase rounded-sm ${className}`}>{children}</div>
}

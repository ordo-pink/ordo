// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsHeadphones } from "react-icons/bs"
import { PropsWithChildren } from "react"
import { Badge } from "./badge"
import { Either } from "@ordo-pink/either"

type P = PropsWithChildren<{ className?: string }>
export const SupportBadge = ({ children, className = "" }: P) => {
	return (
		<Badge
			className={`bg-gradient-to-tr from-rose-300 to-pink-300 dark:from-rose-800 dark:to-pink-800 ${className}`}
		>
			<RenderChildren>{children}</RenderChildren>
		</Badge>
	)
}

const RenderChildren = ({ children }: PropsWithChildren) =>
	Either.fromNullable(children).fold(DefaultChildern, children => children)

const DefaultChildern = () => (
	<div className="flex items-center space-x-1">
		<BsHeadphones className="shrink-0" />
		<div>{"support"}</div>
	</div>
)

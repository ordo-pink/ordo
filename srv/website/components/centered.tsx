// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
	centerX?: boolean
	centerY?: boolean
	screenHeight?: boolean
}>

export const Centered = ({ children, centerX, centerY, screenHeight }: Props) => (
	<div
		className={`w-full flex flex-col ${centerX ? "items-center" : "items-start"} ${
			centerY ? "justify-center" : "justify-start"
		} ${screenHeight ? "h-screen" : "h-full"}`}
	>
		{children}
	</div>
)

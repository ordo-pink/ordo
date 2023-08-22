// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
	centerX?: boolean
	centerY?: boolean
}>

export const CenteredPage = ({ children, centerX, centerY }: Props) => (
	<div
		className={`h-full w-full flex flex-col ${centerX ? "items-center" : "items-start"} ${
			centerY ? "justify-center" : "justify-start"
		} min-h-screen`}
	>
		{children}
	</div>
)

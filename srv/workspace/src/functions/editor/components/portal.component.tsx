// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { createPortal } from "react-dom"

export const Portal = ({ children }: PropsWithChildren) => {
	return typeof document === "object" ? createPortal(children, document.body) : null
}

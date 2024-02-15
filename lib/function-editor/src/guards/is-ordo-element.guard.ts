// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Element } from "slate"
import { OrdoElement } from "../editor.types"

export const isOrdoElement = (x: any): x is OrdoElement =>
	!!x && x.type && typeof x.type === "string" && Element.isElement(x)

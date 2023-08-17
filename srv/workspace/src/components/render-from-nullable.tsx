// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Nullable } from "@ordo-pink/tau/mod"
import { PropsWithChildren } from "react"
import { Either } from "@ordo-pink/either/mod"
import Null from "$components/null"

type _P<T = any> = PropsWithChildren<{ having: Nullable<T> }>
export default function RenderFromNullable({ having: value, children }: _P) {
	return Either.fromNullable(value).fold(Null, () => children)
}

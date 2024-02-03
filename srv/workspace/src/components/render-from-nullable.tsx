// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import { Either } from "@ordo-pink/either"
import Null from "$components/null"

type _P<T = any> = PropsWithChildren<{ having: T | null }>
export default function RenderFromNullable({ having: value, children }: _P) {
	return Either.fromNullable(value).fold(Null, () => children)
}

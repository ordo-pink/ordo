// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"

import Null from "../null"

type P<T = any> = { having: T | null; children?: any }
export default function RenderFromNullable({ having: value, children }: P) {
	return Either.fromNullable(value).fold(Null, () => children)
}

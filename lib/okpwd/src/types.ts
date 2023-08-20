// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Nullable } from "@ordo-pink/tau"

// --- Public ---

// TODO: Add comments

export type Options = {
	min?: number
	max?: number
	skipCheckForNumbers?: boolean
	skipCheckForAlphaCharacters?: boolean
	skipCheckForSpecialCharacters?: boolean
}

export type Result = Nullable<string>

export type Fn = (options?: Options) => (pwd?: string) => Result

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { T as TAU } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

// TODO: Add comments

export type Options = {
	min?: number
	max?: number
	skipCheckForNumbers?: boolean
	skipCheckForAlphaCharacters?: boolean
	skipCheckForSpecialCharacters?: boolean
}

export type Result = TAU.Nullable<string>

export type Fn = (options?: Options) => (pwd?: string) => Result

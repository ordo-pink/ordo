// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TTau as TAU } from "#ramda"

// --- Public ---

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
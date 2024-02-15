// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type Options = {
	min?: number
	max?: number
	skipCheckForNumbers?: boolean
	skipCheckForAlphaCharacters?: boolean
	skipCheckForSpecialCharacters?: boolean
}

export type Result = string | null

export type Fn = (options?: Options) => (pwd?: string) => Result

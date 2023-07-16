import { TEither } from "#lib/either/mod.ts"

export type OkpwdOptions = {
	min?: number
	max?: number
	skipCheckForNumbers?: boolean
	skipCheckForAlphaCharacters?: boolean
	skipCheckForSpecialCharacters?: boolean
}

export type OkpwdFn = (
	options?: OkpwdOptions
) => (pwd?: string) => string | null

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never
export type EndsWithSlash<T extends string> = T extends `${string}/` ? T : never
export type NonSlash<T> = T extends "/" ? never : T
export type NonTrailingSlash<T> = T extends `${string}/` ? never : T

/**
 * Characters that cannot be used in FS path.
 */
export const FORBIDDEN_PATH_SYMBOLS = [
	"<",
	">",
	":",
	'"',
	"\\",
	"|",
	"?",
	"*",
	"..",
	"./",
	"//",
] as const

/**
 * Union type of all forbidden characters in FS path.
 */
export type ForbiddenPathSymbol = (typeof FORBIDDEN_PATH_SYMBOLS)[number]

/**
 * Disallows using characters in a provided union of characters in a provided string.
 *
 * @example ForbidCharacters<"*" | "+", "2*2"> -> never
 * @example ForbidCharacters<"*" | "+", "2+2"> -> never
 * @example ForbidCharacters<"*" | "+", "2-2"> -> "2-2"
 */
export type ForbidCharacters<
	Chars extends string,
	Str extends string
> = Str extends `${string}${Chars}${string}` ? never : Str

/**
 * A generic type that forbids including any of the forbidden characters.
 */
export type NoForbiddenSymbols<T extends string> = ForbidCharacters<ForbiddenPathSymbol, T>

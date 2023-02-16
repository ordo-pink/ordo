import { ForbidCharacters } from "@ordo-pink/common-types"
import { disallowedCharacters } from "."

export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never
export type EndsWIthSlash<T extends string> = T extends `${string}/` ? T : never

export type ForbiddenPathCharacters = (typeof disallowedCharacters)[number]

export type NoForbiddenCharacters<T extends string> = ForbidCharacters<ForbiddenPathCharacters, T>

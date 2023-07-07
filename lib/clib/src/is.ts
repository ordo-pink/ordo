import type { TEitherIsObject, TIsOption } from "../src/types.ts"
import { isObject } from "#lib/tau/mod.ts"
import { Either } from "#lib/either/mod.ts"

export const isLongOption: TIsOption = arg => arg.startsWith("--")

export const isShortOption: TIsOption = arg =>
	arg.startsWith("-") && !isLongOption(arg)

export const eitherIsObject: TEitherIsObject = x =>
	Either.fromBoolean(() => isObject(x), x)

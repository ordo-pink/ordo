import type { Nullable } from "#lib/tau/src/types.ts"

export type TLeftFn = <LeftValue, RightValue = unknown>(
	x: LeftValue
) => TEither<RightValue, LeftValue>

export type TRightFn = <RightValue, LeftValue = unknown>(
	x: RightValue
) => TEither<RightValue, LeftValue>

export type TEither<TRightValue, TLeftValue> = {
	readonly isLeft: boolean
	readonly isRight: boolean
	readonly isEither: boolean
	UNSAFE_get: () => TLeftValue | TRightValue
	map: <TNewRightValue>(
		f: (x: TRightValue) => TNewRightValue
	) => TEither<TNewRightValue, TLeftValue>
	leftMap: <TNewLeftValue>(
		f: (x: TLeftValue) => TNewLeftValue
	) => TEither<TRightValue, TNewLeftValue>
	getOrElse: <TNewLeftValue>(
		f: (x: TLeftValue) => TNewLeftValue
	) => TRightValue | TNewLeftValue
	chain: <TNewRightValue, TNewLeftValue>(
		f: (x: TRightValue) => TEither<TNewRightValue, TNewLeftValue>
	) => TEither<TNewRightValue, TLeftValue | TNewLeftValue>
	fold: <TNewRightValue, TNewLeftValue>(
		f: (x: TLeftValue) => TNewLeftValue,
		g: (x: TRightValue) => TNewRightValue
	) => TNewLeftValue | TNewRightValue
}

export type TEitherStatic = {
	fromNullable: <TRightValue>(
		x: Nullable<TRightValue>
	) => TEither<TRightValue, null>
	fromBoolean: <TRightValue, TLeftValue = undefined>(
		f: () => boolean,
		x: TRightValue,
		l?: TLeftValue
	) => TEither<TRightValue, TLeftValue>
	fromBooleanLazy: <TRightValue, TLeftValue = undefined>(
		f: () => boolean,
		r: () => TRightValue,
		l?: () => TLeftValue
	) => TEither<TRightValue, TLeftValue>
	try: <TRightValue, TLeftValue>(
		f: () => TRightValue
	) => TEither<TRightValue, TLeftValue>
	right: TRightFn
	left: TLeftFn
	of: TRightFn
}

// Impl -----------------------------------------------------------------------

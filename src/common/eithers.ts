import { Either as E, IEither, IEitherStatic as IES } from "or-else"
import type { UnaryFn } from "./types"

const toEither =
	<T, L>(pred: UnaryFn<T, boolean>, onFalse: L) =>
	(x: T): IEither<T, L> =>
		pred(x) ? E.right(x) : E.left(onFalse)

interface IEitherStatic extends IES {
	fromNullable: <T>(x: T) => IEither<NonNullable<T>, null>
	fromEmptyArray: <T>(x: T[]) => IEither<T[], never[]>
	fromBoolean: (x: boolean) => IEither<true, false>
}

export const Either: IEitherStatic = {
	...E,
	fromNullable: toEither(<T>(x: T) => x != null, null) as any,
	fromEmptyArray: toEither(<T extends unknown[]>(x: T) => x.length > 0, [] as never[]),
	fromBoolean: toEither((x: boolean) => x === true, false) as any,
}

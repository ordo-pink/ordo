import type { Nullable } from "#lib/tau/mod"
import { PropsWithChildren } from "react"
import { Either } from "#lib/either/mod"
import Null from "$components/null"

type _P<T = any> = PropsWithChildren<{ having: Nullable<T> }>
export default function RenderFromNullable({ having: value, children }: _P) {
	return Either.fromNullable(value).fold(Null, () => children)
}

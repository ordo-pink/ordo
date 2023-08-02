import type * as T from "../../types.ts"

type Props = Omit<T.Activity, "background">

export default function Activity({ name }: Props) {
	return <div>{name}</div>
}

import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import type { Zags } from "@ordo-pink/zags"

export namespace zags_jabs {
	export const marry$ =
		<$State extends Zags.BaseState>(zags: Zags.Instance<$State>): Maoka.Jab<() => $State> =>
		({ use }) => {
			let value: $State
			const divorce = zags.marry(state => {
				value = state
				use(maoka_dom.jabs.refresh$)
			})

			use(maoka_dom.jabs.onunmount(divorce))

			return () => value
		}

	export const cheat$ =
		<$State extends Zags.BaseState, $DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
			zags: Zags.Instance<$State>,
			dot_path: $DotPath,
		): Maoka.Jab<() => Zags.Pouch.RecordValueByDotPath<$State, $DotPath>> =>
		({ use }) => {
			let value: Zags.Pouch.RecordValueByDotPath<$State, $DotPath>

			const divorce = zags.cheat(dot_path, state => {
				value = state
				use(maoka_dom.jabs.refresh$)
			})

			use(maoka_dom.jabs.onunmount(divorce))

			return () => value
		}
}

import { Maoka } from "./maoka.types"

export namespace maoka_context {
	export const create: Maoka.Context.Create = <$Value>() => {
		const state = {} as Record<Maoka.Id, $Value>

		return {
			provide:
				(value: $Value): Maoka.Jab =>
				(_, node) =>
					void (state[node.root.id] = value),
			consume: (_, node) => state[node.root.id],
		}
	}
}

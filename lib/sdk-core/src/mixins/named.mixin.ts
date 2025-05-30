import type { Core } from "../sdk-core.types"
import { is_string } from "../validations.impl"

export namespace named {
	export const mixin: Core.Mixin<Named.Interface> = {
		instance: ({ name }) => ({ get_name: () => name }),
		static: { get_default_name: () => "" },
		validations: { is_name: is_string },
	}
}

// --- Types ---

export namespace Named {
	export type Name = string & {}

	export type DTO = [name: Name]

	export type Interface = {
		Instance: { get_name: () => Name }
		Plain: { name: Name }
		Static: { get_default_name: () => Name }
		Validations: { is_name: (x: any) => x is Name }
	}
}

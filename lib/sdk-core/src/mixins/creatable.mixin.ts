import type { Core } from "../sdk-core.types"

export namespace Creatable {
	/**
	 * Adds support for creating instances of other interfaces with predefined args.
	 * MUST be implemented for each mixed interface separately.
	 */
	export type Interface<$Args extends any[], $Interface extends Core.BaseInterface> = {
		Instance: {}
		Plain: {}
		Static: {
			/** Create an instance of given interface based on given args. */
			new: (...args: $Args) => $Interface["Instance"]
		}
		Validations: {}
	}
}

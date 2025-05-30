import type { Core } from "../../sdk-core.types"
import { is_string } from "../../validations.impl"

export namespace receptive {
	export const RX_EMAIL =
		// eslint-disable-next-line no-useless-escape
		/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

	export const mixin: Core.Mixin<Receptive.Interface> = {
		instance: ({ email }) => ({ get_email: () => email }),
		static: {},
		validations: {
			is_email: (x): x is Receptive.Email => is_string(x) && RX_EMAIL.test(x),
		},
	}
}

export namespace Receptive {
	export type Email = `${string}@${string}.${string}`

	export type DTO = [email: Email]

	export type Interface = {
		Instance: { get_email: () => Email }
		Plain: { email: Email }
		Static: {}
		Validations: { is_email: (x: any) => x is Email }
	}
}

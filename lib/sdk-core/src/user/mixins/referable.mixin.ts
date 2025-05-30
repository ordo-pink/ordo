import type { Core } from "../../sdk-core.types"
import type { Receptive } from "./receptive.mixin"
import type { UserID } from "../user.types"
import { is_string } from "../../validations.impl"

export namespace referable {
	export const RX_HANDLE = /^@[a-z0-9_]{1,23}$/

	export const mixin: Core.Mixin<Referable.Interface> = {
		instance: ({ handle }) => ({ get_handle: () => handle }),
		static: {
			create_handle: (email, id) => {
				const [first] = email.split("@", 1)
				const [last] = id.split("-", 1)

				return `@${first}${last}` as const
			},
		},
		validations: { is_handle: (x): x is Referable.Handle => is_string(x) && RX_HANDLE.test(x) },
	}
}

export namespace Referable {
	export type Handle = `@${string}` & {}

	export type DTO = [handle: Handle]

	export type Interface = {
		Instance: { get_handle: () => Handle }
		Plain: { handle: Handle }
		Static: { create_handle: (email: Receptive.Email, id: UserID) => Handle }
		Validations: { is_handle: (x: any) => x is Handle }
	}
}

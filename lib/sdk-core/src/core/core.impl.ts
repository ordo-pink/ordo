import type { Core } from "./core.types"

export namespace core {
	export const mix: Core.Mix = (...mixins) => ({
		...mixins.reduce((acc, mixin) => (mixin.static ? { ...acc, ...mixin.static } : acc), {} as any),
		validations: {
			...mixins.reduce((acc, mixin) => (mixin.validations ? { ...acc, ...mixin.validations } : mixin), {}),
		},
	})

	export namespace rx {
		export const uuid_v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
		export const fn_name = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/
		export const handle = /^@[a-z0-9_]{1,23}$/
		export const email =
			// eslint-disable-next-line no-useless-escape
			/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
		export const semantic_version =
			/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	}

	export namespace validations {
		export const is_string = (x: unknown): x is string => typeof x === "string"
		export const is_non_empty_string = (x: unknown): x is string => is_string(x) && x.trim() !== ""

		export const is_number = (x: unknown): x is number => typeof x === "number"
		export const is_0 = (x: unknown): x is 0 => x === 0
		export const is_positive_number = (x: unknown): x is number => is_number(x) && x > 0
		export const is_non_negative_number = (x: unknown): x is number => is_0(x) || is_positive_number(x)
		export const is_finite = (x: unknown): x is number => Number.isFinite(x)
		export const is_int = (x: unknown): x is number => Number.isInteger(x)
		export const is_finite_non_negative_int = (x: unknown): x is number =>
			is_non_negative_number(x) && is_finite(x) && is_int(x)
		export const is_uuid = (x: unknown): x is Core.UUIDv4 => is_string(x) && rx.uuid_v4.test(x)
		export const is_array = Array.isArray
		export const is_object = (x: unknown): x is Record<string, unknown> => x != null && typeof x === "object" && !is_array(x)
	}
}

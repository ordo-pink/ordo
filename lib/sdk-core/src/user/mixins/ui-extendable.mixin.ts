import { type SemVer, sem_ver } from "../../semver.impl"
import { is_finite_non_negative_int, is_string } from "../../validations.impl"
import type { Core } from "../../sdk-core.types"

export namespace ui_extendable {
	export const DEFAULT_FN_LIMIT = 10

	export const RX_FN_NAME = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/

	export const mixin: Core.Mixin<UIExtendable.Interface> = {
		instance: ({ installed_fns, fn_limit }) => ({
			can_install_fns: () => installed_fns.length < fn_limit,
			get_fn_limit: () => fn_limit,
			get_installed_fns: () => [...installed_fns],
			get_installed_fns_length: () => installed_fns.length,
			has_installed_fns: () => installed_fns.length > 0,
		}),
		static: {
			get_default_fn_limit: () => DEFAULT_FN_LIMIT,
			get_default_fns: () => [],
		},
		validations: {
			is_fn: (x): x is UIExtendable.Fn => {
				if (!is_string(x)) return false
				const parts = x.split(":")
				if (parts.length !== 2) return false
				return RX_FN_NAME.test(parts[0]) && sem_ver.is_sem_ver(parts[1])
			},
			is_fn_limit: is_finite_non_negative_int,
			is_fn_name: (x): x is UIExtendable.FnName => is_string(x) && RX_FN_NAME.test(x),
			is_version: sem_ver.is_sem_ver,
		},
	}
}

export namespace UIExtendable {
	export type FnName = `@${string}/${string}`
	export type Fn = `${FnName}:${SemVer.Version}`
	export type FnLimit = number & {}

	export type DTO = [installed_fns: Fn[], fn_limit: FnLimit]

	export type Interface = {
		Instance: {
			can_install_fns: () => boolean
			get_fn_limit: () => FnLimit
			get_installed_fns_length: () => number
			get_installed_fns: () => Fn[]
			has_installed_fns: () => boolean
		}
		Plain: {
			installed_fns: Fn[]
			fn_limit: FnLimit
		}
		Static: {
			get_default_fn_limit: () => FnLimit
			get_default_fns: () => []
		}
		Validations: {
			is_fn: (x: any) => x is Fn
			is_fn_limit: (x: any) => x is FnLimit
			is_fn_name: (x: any) => x is FnName
			is_version: (x: any) => x is SemVer.Version
		}
	}
}

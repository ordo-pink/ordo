/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "./core.types"
import type { User } from "../user/user.types"

export namespace core_sdk {
	export const mix: CoreSDK.Mix = (...mixins) => ({
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
		export const is_fn = (x: unknown): x is (...args: any[]) => any => typeof x === "function"
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
		export const is_uuid = (x: unknown): x is CoreSDK.UUIDv4 => is_string(x) && rx.uuid_v4.test(x)
		export const is_array = Array.isArray
		export const is_object = (x: unknown): x is Record<string, unknown> => x != null && typeof x === "object" && !is_array(x)
	}

	export namespace fns {
		export const noop: () => void = () => void 0
		export const eq = (target: number) => (val: number) => target === val
		export const gt = (min: number) => (val: number) => val > min
		export const gte = (min: number) => (val: number) => eq(min)(val) || gt(min)(val)
		export const lt = (max: number) => (val: number) => val < max
		export const lte = (max: number) => (val: number) => eq(max)(val) || lt(max)(val)
		export const keys_of: <T extends object>(o: T) => (keyof T)[] = o => {
			return Object.keys(o) as any
		}
		export const fuzzy_check = (source: string, target: string, ratio: number) => {
			const clean_source = source.trim().toLowerCase()
			const clean_target = target.trim().toLowerCase()
			let hits = 0

			if (!clean_target || clean_source.indexOf(clean_target) > -1) return true

			for (let i = 0; i < clean_target.length; i++) clean_source.indexOf(clean_target[i]) > -1 ? hits++ : hits--

			return hits / source.length >= ratio
		}

		export const obfuscate_email = (email: User.Email) => {
			const [localPart, domainPart] = email.split("@")

			const topLevelDomainStartIndex = domainPart.lastIndexOf(".")

			const higherLevelDomain = domainPart.slice(0, topLevelDomainStartIndex)
			const topLevelDomain = domainPart.slice(topLevelDomainStartIndex)

			const localTrimSize = localPart.length > 5 ? 4 : localPart.length > 2 ? 2 : 0
			const domainTrimSize = higherLevelDomain.length > 5 ? 4 : higherLevelDomain.length > 2 ? 2 : 0

			return localPart
				.slice(0, localTrimSize / 2)
				.concat("*".repeat(localPart.length - localTrimSize))
				.concat(localTrimSize ? localPart.slice(-localTrimSize / 2) : "")
				.concat("@")
				.concat(higherLevelDomain.slice(0, domainTrimSize / 2))
				.concat("*".repeat(higherLevelDomain.length - domainTrimSize))
				.concat(domainTrimSize ? higherLevelDomain.slice(-domainTrimSize / 2) : "")
				.concat(topLevelDomain)
		}
	}
}

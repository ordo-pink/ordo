/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export * from "./oath.catas"
export * from "./oath.ops"

export * as catas from "./oath.catas"
export * as ops from "./oath.ops"

import type * as Oath from "./oath.types"

export const create: Oath.Create = (fork, cancellation_reason) => {
	let reason: Oath.CancellationReason | undefined = cancellation_reason

	return {
		get is_cancelled() {
			return typeof reason === "string"
		},
		get is_oath() {
			return true as const
		},
		get reason() {
			return reason
		},

		cancel: r => void (reason = r),
		cata: boom =>
			new Promise((res, rej) =>
				fork(
					x => res(boom.resolve(x)),
					x => (boom.reject ? res(boom.reject(x) as any) : rej(x)),
				),
			),
		pipe: f => (reason ? (create(fork, reason) as any) : f(create(fork, reason) as any)),
	}
}

export const from_nullable: Oath.FromNullable = (x, on_null) =>
	x != null ? resolve(x) : (reject(on_null ? on_null() : null) as any)

export const from_promise: Oath.FromPromise = f => create((resolve, reject) => f().then(resolve, reject))

export const if_else: Oath.If = (condition, explosion) =>
	condition ? resolve(explosion?.t?.()) : (reject(explosion?.f?.()) as any)

export const merge: Oath.Merge = values => {
	let rejected = false

	const resolved_values = {} as any
	let resolved_length = 0

	return create((outer_resolve: any, outer_reject: any) => {
		const keys = Object.keys(values)
		if (!keys.length) return outer_resolve({})

		keys.forEach(key => {
			const value = (values as any)[key]

			if (value && value.is_oath) {
				value.cata({
					reject: (e: any) => {
						if (!rejected) {
							rejected = true
							outer_reject(e)
						}
					},
					resolve: (s: any) => {
						if (rejected) return

						resolved_values[key] = s
						resolved_length++

						if (resolved_length === keys.length) outer_resolve(resolved_values)
					},
				})
			} else if (value && value.then) {
				value.then(
					(s: any) => {
						if (rejected) return

						resolved_values[key] = s
						resolved_length++

						if (resolved_length === keys.length) outer_resolve(resolved_values)
					},
					(e: any) => {
						if (!rejected) {
							rejected = true
							outer_reject(e)
						}
					},
				)
			} else {
				resolved_values[key] = value
				resolved_length++

				if (resolved_length === keys.length) outer_resolve(resolved_values)
			}
		})
	})
}

export const all: Oath.All = values => {
	let rejected = false

	const resolved_values = [] as any[]
	let resolved_length = 0

	return create((outer_resolve: any, outer_reject: any) => {
		if (!values.length) return outer_resolve([])

		values.forEach((value: any) => {
			if (value?.is_oath) {
				value.cata({
					reject: (e: any) => {
						if (!rejected) {
							rejected = true
							outer_reject(e)
						}
					},
					resolve: (s: any) => {
						if (rejected) return

						resolved_values.push(s)
						resolved_length++

						if (resolved_length === values.length) outer_resolve(resolved_values)
					},
				})
			} else if (value?.then) {
				value.then(
					(s: any) => {
						if (rejected) return
						resolved_values.push(s)
						resolved_length++

						if (resolved_length === values.length) outer_resolve(resolved_values)
					},
					(e: any) => {
						if (!rejected) {
							rejected = true
							outer_reject(e)
						}
					},
				)
			} else {
				resolved_values.push(value)
				resolved_length++

				if (resolved_length === values.length) outer_resolve(resolved_values)
			}
		})
	})
}

export const any: Oath.Any = values => {
	let resolved = false

	const rejected_values = [] as any[]
	let rejected_length = 0

	return create((outer_resolve: any, outer_reject: any) => {
		if (!values.length) return outer_resolve()

		for (const value of values as any[]) {
			if (resolved) break

			if (value?.is_oath) {
				value.cata({
					reject: (e: any) => {
						rejected_values.push(e)
						rejected_length++

						if (rejected_length === values.length) outer_reject(rejected_values)
					},
					resolve: (s: any) => {
						if (!resolved) {
							resolved = true
							outer_resolve(s)
						}
					},
				})
			} else if (value?.then) {
				value.then(
					(s: any) => {
						if (!resolved) {
							resolved = true
							outer_resolve(s)
						}
					},
					(e: any) => {
						rejected_values.push(e)
						rejected_length++

						if (rejected_length === values.length) outer_reject(rejected_values)
					},
				)
			} else {
				resolved = true
				outer_resolve(value)
			}
		}
	})
}

export const of: Oath.Resolve = x => create(res => res(x))

export const resolve: Oath.Resolve = x => create(res => res(x))

export const reject: Oath.Reject = x => create((_, rej) => rej(x))

export const empty: Oath.Empty = () => create(res => res(void 0))

export const try_catch: Oath.Try = (tryer, catcher) => {
	try {
		return resolve(tryer())
	} catch (e) {
		return catcher ? reject(catcher(e as any)) : (reject(e) as any)
	}
}

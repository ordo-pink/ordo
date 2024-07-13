// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { UnderOath, UnderOathRejected } from "../src/types"
import { Oath } from "../src/impl"

type TArrayToUnion<T> = T extends Array<infer U> ? U : T
type TRecordToUnion<T extends Record<string, unknown>> = { [P in keyof T]: T[P] }[keyof T]

// TODO: Infer rejected type
export const merge_oath = <$TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
	values: $TSomeThings,
	abort_controller = new AbortController(),
): Oath<
	$TSomeThings extends []
		? { -readonly [P in keyof $TSomeThings]: UnderOath<$TSomeThings[P]> }
		: { [P in keyof $TSomeThings]: UnderOath<$TSomeThings[P]> },
	$TSomeThings extends Array<any>
		? TArrayToUnion<{ -readonly [P in keyof $TSomeThings]: UnderOathRejected<$TSomeThings[P]> }>
		: TRecordToUnion<{ [P in keyof $TSomeThings]: UnderOathRejected<$TSomeThings[P]> }>
> => {
	if (!values || typeof values !== "object") throw new Error("Invalid merge values")

	let rejected = false

	if (Array.isArray(values)) {
		const resolved_values = [] as any[]
		let resolved_length = 0

		return new Oath((outer_resolve: any, outer_reject: any) => {
			if (!values.length) return outer_resolve([])

			values.forEach(value => {
				if (value.is_oath) {
					value.fork(
						(e: any) => {
							if (!rejected) {
								rejected = true
								outer_reject(e)
							}
						},
						(s: any) => {
							if (rejected) return

							resolved_values.push(s)
							resolved_length++

							if (resolved_length === values.length) outer_resolve(resolved_values)
						},
					)
				} else if (value.then) {
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
				}
			})
		}, abort_controller)
	} else {
		const resolved_values = {} as any
		let resolved_length = 0

		return new Oath((outer_resolve: any, outer_reject: any) => {
			const keys = Object.keys(values)
			if (!keys.length) return outer_resolve({})

			keys.forEach(key => {
				const value = (values as any)[key]

				if (value && value.is_oath) {
					value.fork(
						(e: any) => {
							if (!rejected) {
								rejected = true
								outer_reject(e)
							}
						},
						(s: any) => {
							if (rejected) return

							resolved_values[key] = s
							resolved_length++

							if (resolved_length === keys.length) outer_resolve(resolved_values)
						},
					)
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
		}, abort_controller)
	}
}

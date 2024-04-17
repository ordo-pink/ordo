// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { UnderOath, UnderOathRejected } from "../src/types"
import { Oath } from "../src/impl"

type ArrayToUnion<T> = T extends Array<infer U> ? U : T
type RecordToUnion<T extends Record<string, unknown>> = { [P in keyof T]: T[P] }[keyof T]

// TODO: Infer rejected type
export const merge0 = <TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
	values: TSomeThings,
	abortController = new AbortController(),
): Oath<
	TSomeThings extends []
		? { -readonly [P in keyof TSomeThings]: UnderOath<TSomeThings[P]> }
		: { [P in keyof TSomeThings]: UnderOath<TSomeThings[P]> },
	TSomeThings extends Array<any>
		? ArrayToUnion<{ -readonly [P in keyof TSomeThings]: UnderOathRejected<TSomeThings[P]> }>
		: RecordToUnion<{ [P in keyof TSomeThings]: UnderOathRejected<TSomeThings[P]> }>
> => {
	if (!values || typeof values !== "object") throw new Error("Invalid merge values")

	let rejected = false

	if (Array.isArray(values)) {
		const resolvedValues = [] as any[]
		let resolvedLength = 0

		return new Oath((outerResolve: any, outerReject: any) => {
			if (!values.length) return outerResolve([])

			values.forEach(value => {
				if (value.isOath) {
					value.fork(
						(e: any) => {
							if (!rejected) {
								rejected = true
								outerReject(e)
							}
						},
						(s: any) => {
							if (rejected) return

							resolvedValues.push(s)
							resolvedLength++

							if (resolvedLength === values.length) outerResolve(resolvedValues)
						},
					)
				} else if (value.then) {
					value.then(
						(s: any) => {
							if (rejected) return
							resolvedValues.push(s)
							resolvedLength++

							if (resolvedLength === values.length) outerResolve(resolvedValues)
						},
						(e: any) => {
							if (!rejected) {
								rejected = true
								outerReject(e)
							}
						},
					)
				} else {
					resolvedValues.push(value)
					resolvedLength++
				}
			})
		}, abortController)
	} else {
		const resolvedValues = {} as any
		let resolvedLength = 0

		return new Oath((outerResolve: any, outerReject: any) => {
			const keys = Object.keys(values)
			if (!keys.length) return outerResolve({})

			keys.forEach(key => {
				const value = (values as any)[key]

				if (value && value.isOath) {
					value.fork(
						(e: any) => {
							if (!rejected) {
								rejected = true
								outerReject(e)
							}
						},
						(s: any) => {
							if (rejected) return

							resolvedValues[key] = s
							resolvedLength++

							if (resolvedLength === keys.length) outerResolve(resolvedValues)
						},
					)
				} else if (value && value.then) {
					value.then(
						(s: any) => {
							if (rejected) return

							resolvedValues[key] = s
							resolvedLength++

							if (resolvedLength === keys.length) outerResolve(resolvedValues)
						},
						(e: any) => {
							if (!rejected) {
								rejected = true
								outerReject(e)
							}
						},
					)
				} else {
					resolvedValues[key] = value
					resolvedLength++
					if (resolvedLength === keys.length) outerResolve(resolvedValues)
				}
			})
		}, abortController)
	}
}

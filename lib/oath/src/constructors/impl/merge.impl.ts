import { Oath } from "../../oath.types"
import { create } from "./create.impl"

export const merge: Oath.Constructors.Merge = values => {
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

export const all: Oath.Constructors.All = values => {
	let rejected = false

	const resolved_values = [] as any[]
	let resolved_length = 0

	return create((outer_resolve: any, outer_reject: any) => {
		if (!values.length) return outer_resolve([])

		values.forEach((value: any) => {
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
	})
}

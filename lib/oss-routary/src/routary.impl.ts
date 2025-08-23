/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Colonoscope, colonoscope } from "@ordo-pink/oss-colonoscope"

import type * as Lib from "./routary.types"

const get: Lib.MethodHandler = (url, handler) => each(["get"], url, handler)
const head: Lib.MethodHandler = (url, handler) => each(["head"], url, handler)
const post: Lib.MethodHandler = (url, handler) => each(["post"], url, handler)
const put: Lib.MethodHandler = (url, handler) => each(["put"], url, handler)
const patch: Lib.MethodHandler = (url, handler) => each(["patch"], url, handler)
const delit: Lib.MethodHandler = (url, handler) => each(["delete"], url, handler)
const options: Lib.MethodHandler = (url, handler) => each(["options"], url, handler)
const custom: Lib.CustomMethodHandler = (method, url, handler) => each([method], url, handler)

const each: Lib.EachMethodHandler =
	(methods, url, handler) => (env, mut, structure, before_handlers, after_handlers, on_creates) => {
		for (const method of methods) {
			if (!structure[method]) structure[method] = {}
			structure[method][url] = handler
		}

		return create(env, mut, structure, before_handlers, after_handlers, on_creates)
	}

const before_each: Lib.BeforeEach = callback => (env, mut, structure, before_handlers, after_handlers, on_creates) =>
	create(env, mut, structure, [...before_handlers, callback as any], after_handlers, on_creates) as any

const after_each: Lib.AfterEach = callback => (env, mut, structure, before_handlers, after_handlers, on_creates) =>
	create(env, mut, structure, before_handlers, [...after_handlers, callback as any], on_creates) as any

const once: Lib.Once = callback => (env, mut, structure, before_handlers, after_handlers, on_creates) =>
	create(env, mut, structure, before_handlers, after_handlers, [...on_creates, callback])

export const create: Lib.Create = (env, initial_mut = {} as any, structure = {}, before = [], after = [], on_creates = []) => ({
	pipe: op => op(env, initial_mut, structure, before, after, on_creates),
	or_else: (on_none_matched, catcher) => {
		const before_handlers = [...before]
		const after_handlers = [...after]

		for (const on_create of on_creates) {
			const callbacks = on_create({ env, structure })
			if (callbacks.after_each) after_handlers.push(callbacks.after_each)
			if (callbacks.before_each) before_handlers.push(callbacks.before_each)
		}

		return async (request, server) => {
			const method = request.method.toLowerCase() as Lib.Method
			let mut = { ...initial_mut }
			let current_path = new URL(request.url).pathname as Lib.Route
			let params = null as Colonoscope.Results
			let response: Response = null as any

			if (current_path.endsWith("/") && current_path.length > 1) current_path = current_path.slice(0, -1) as Lib.Route

			if (!structure[method]) return on_none_matched({ env, mut, request, server, params: null })

			const matched_route = Object.keys(structure[method]).find(route => {
				if (colonoscope.is_doctor(route)) {
					const colonoscopy = colonoscope.check(route, current_path)

					if (!colonoscopy) return false

					params = colonoscopy
					return true
				}

				return route === current_path
			}) as Lib.Route | undefined

			try {
				if (before_handlers.length)
					for (const handler of before_handlers) {
						mut = { ...mut, ...(await handler({ env, mut, request, server, params })) }
					}

				response = matched_route
					? await structure[method][matched_route]({ env, mut, request, server, params })
					: await on_none_matched({ env, mut, request, server, params })

				if (after.length)
					for (const handler of after_handlers) {
						const result = await handler({ env, mut, request, server, params, response, matched_route: matched_route ?? null })

						if (!result) continue
						if (result.mut) mut = { ...mut, ...result.mut }
						if (result.response) response = result.response
					}

				return response
			} catch (error) {
				return catcher({ request, mut, server, params, env, response, error, matched_route: matched_route ?? null })
			}
		}
	},
})

export const ops: Lib.Ops = {
	after_each,
	before_each,
	custom,
	delete: delit,
	each,
	get,
	head,
	once,
	options,
	patch,
	post,
	put,
}

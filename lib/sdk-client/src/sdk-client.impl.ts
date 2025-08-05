/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CORE, Core, core } from "@ordo-pink/sdk-core"
import { sweech } from "@ordo-pink/oss-sweech"

import type { ClientRrr, ClientSDK } from "./sdk-client.types"
import { create_zags } from "@ordo-pink/oss-zags"

export namespace client_sdk {
	// TODO Compose queries into a single zags with what is permitted instead of providing them separately
	export const create_f: ClientSDK.F.Create = (name, permissions, callback) => async global_state => {
		const logger: Core.Logger = {
			alert: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
			crit: (...message) => global_state.logger.crit(`f(${name}) =>`, ...message),
			debug: (...message) => global_state.logger.debug(`f(${name}) =>`, ...message),
			error: (...message) => global_state.logger.error(`f(${name}) =>`, ...message),
			info: (...message) => global_state.logger.info(`f(${name}) =>`, ...message),
			notice: (...message) => global_state.logger.notice(`f(${name}) =>`, ...message),
			panic: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
			warn: (...message) => global_state.logger.warn(`f(${name}) =>`, ...message),
		}

		const state: ClientSDK.F.State = {
			fetch: (...args) => {
				if (!permissions.queries.includes("fetch")) return Promise.reject(client_rrr.eperm("f_rrr_not_permitted_fetch"))
				return global_state.fetch(...args)
			},
			hosts: (() => {
				if (!permissions.queries.includes("hosts")) return {} as Core.Hosts
				return global_state.hosts
			})(),
			logger,
			hunter: {
				shoot: (prey, bullet) => {
					if (!permissions.commands.includes(prey)) throw client_rrr.eperm("f_rrr_not_permitted_shot", prey)
					return global_state.hunter.shoot(prey, bullet as any)
				},
				track: global_state.hunter.track,
			},
			activities$: (() => {
				if (!permissions.queries.includes("activities$")) return create_zags({}) as any
				return {
					...global_state.activities$,
					each: direct_zags_update_not_permitted,
					replace: direct_zags_update_not_permitted,
					update: direct_zags_update_not_permitted,
				}
			})(),
			i18n$: (() => {
				if (!permissions.queries.includes("i18n$")) return create_zags({}) as any
				return {
					...global_state.i18n$,
					each: direct_zags_update_not_permitted,
					replace: direct_zags_update_not_permitted,
					update: direct_zags_update_not_permitted,
				}
			})(),
			rotor$: (() => {
				if (!permissions.queries.includes("rotor$")) return create_zags({}) as any
				return {
					...global_state.rotor$,
					each: direct_zags_update_not_permitted,
					replace: direct_zags_update_not_permitted,
					update: direct_zags_update_not_permitted,
				}
			})(),
		}

		const destroy = await callback(state)

		return async () => {
			if (core.fns.is_fn(destroy)) {
				await destroy()
			}
		}
	}

	export const create_hotkey_from_event: ClientSDK.CreateHotkeyFromEvent = (event, is_darwin) => {
		let hotkey = ""

		if (event.altKey) hotkey += "meta+"
		if (event.ctrlKey) hotkey += is_darwin ? "ctrl+" : "mod+"
		if (event.metaKey) hotkey += "mod+"
		if (event.shiftKey) hotkey += "shift+"

		hotkey += sweech
			.match(event.code)
			.case("Period", () => ".")
			.case("Comma", () => ",")
			.case("Backquote", () => "`")
			.case("Minus", () => "-")
			.case("Backslash", () => "\\")
			.case("BracketLeft", () => "[")
			.case("BracketRight", () => "]")
			.case("Semicolon", () => ";")
			.case("Quote", () => "'")
			.case("Slash", () => "/")
			.case("Space", () => " ")
			.case(
				code => !code,
				() => "",
			)
			.case(
				code => code.startsWith("Key"),
				() => event.code.slice(3).toLowerCase(),
			)
			.case(
				code => code.startsWith("Digit"),
				() => event.code.slice(5),
			)
			.default(() => event.code.toLowerCase())

		return hotkey
	}
}

export namespace client_rrr {
	export const create: ClientRrr.CreateType =
		type =>
		(message, ...debug) => ({ type: CORE.RRR.TYPE[type], message, debug })

	export const eacces = create("EACCES")
	export const eagain = create("EAGAIN")
	export const eexist = create("EEXIST")
	export const efbig = create("EFBIG")
	export const eintr = create("EINTR")
	export const einval = create("EINVAL")
	export const eio = create("EIO")
	export const enoent = create("ENOENT")
	export const enospc = create("ENOSPC")
	export const enxio = create("ENXIO")
	export const eperm = create("EPERM")
	export const eunknown = create("EUNKNOWN")
}

const direct_zags_update_not_permitted = () => throw_rrr("f_rrr_not_permitted_direct_zags_update")

const throw_rrr = (message: ClientSDK.Translations.Key) => {
	throw client_rrr.eperm(message)
}

/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { SM_SCREEN_BREAKPOINT } from "@ordo-pink/core"
import { Zags } from "@ordo-pink/zags"
import { lt } from "@ordo-pink/tau"

import { NoSpace as NoSpace } from "./maoka-jabs.types"

export const listen_global_event =
	<$Key extends keyof DocumentEventMap>(key: $Key, f: (event: DocumentEventMap[$Key]) => void): Maoka.Jab =>
	({ use }) => {
		const handle_mount = () => {
			document.addEventListener(key, f)

			return () => document.removeEventListener(key, f)
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}

export const set_attribute =
	(key: string, value = ""): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => n.value.setAttribute(key, value)))
		// TODO if_string
	}

export const marry$ =
	<$State extends Zags.BaseState>(zags: Zags.Instance<$State>): Maoka.Jab<() => $State> =>
	({ use }) => {
		let value: $State
		const divorce = zags.marry(state => {
			value = state
			use(maoka_dom.jabs.refresh$)
		})

		use(maoka_dom.jabs.onunmount(divorce))

		return () => value
	}

export const cheat$ =
	<$State extends Zags.BaseState, $DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
		zags: Zags.Instance<$State>,
		dot_path: $DotPath,
	): Maoka.Jab<() => Zags.Pouch.RecordValueByDotPath<$State, $DotPath>> =>
	({ use }) => {
		let value: Zags.Pouch.RecordValueByDotPath<$State, $DotPath>

		const divorce = zags.cheat(dot_path, state => {
			value = state
			use(maoka_dom.jabs.refresh$)
		})

		use(maoka_dom.jabs.onunmount(divorce))

		return () => value
	}

export const set_id =
	(id?: string): Maoka.Jab =>
	({ use, node }) =>
		use(set_attribute("id", id ?? String(node.id)))

export const set_class =
	(...classes: string[]): Maoka.Jab =>
	({ use }) =>
		use(set_attribute("class", classes.join(" ")))

export const add_class =
	(...classes: string[]): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => n.value.classList.add(...classes.flatMap(cls => cls.split(" ")))))
		// TODO if_string
	}

export const remove_class =
	<$TClass extends string>(...classes: NoSpace<$TClass>[]): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => n.value.classList.remove(...classes.flatMap(cls => cls.split(" ")))))
		// TODO if_string
	}

export const replace_class =
	<$Prev extends string, $Next extends string>(prev: NoSpace<$Prev>, next: NoSpace<$Next>): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => n.value.classList.replace(prev, next)))
		// TODO if_string
	}

export const set_style =
	(str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => Object.keys(str).forEach(k => ((n.value.style as any)[k] = (str as any)[k]))))
		// TODO if_string
	}

export const listen =
	<$Element extends HTMLElement, $Event extends keyof $Element>(
		event: $Event extends `on${string}` ? $Event : never,
		f: $Element[$Event],
	): Maoka.Jab =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => ((n.value as any)[event] = f)))

export const set_inner_html =
	(html: string): Maoka.Jab =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => (n.value.innerHTML = html)))

export const is_sm_screen$: Maoka.Jab<() => boolean> = ({ use }) => {
	const is_sm = lt(SM_SCREEN_BREAKPOINT)

	let value: boolean = is_sm(window.innerWidth)

	use(
		maoka_dom.jabs.onmount(() => {
			const handle_resize = () => {
				const is_sm_screen = is_sm(window.innerWidth)

				if (value !== is_sm_screen) {
					value = is_sm_screen
					use(maoka_dom.jabs.refresh$)
				}
			}

			window.addEventListener("resize", handle_resize)

			return () => window.removeEventListener("resize", handle_resize)
		}),
	)

	return () => value
}

export const is_darwin: Maoka.Jab<boolean> = () => navigator.appVersion.indexOf("Mac") !== -1

export const is_mobile: Maoka.Jab<boolean> = () =>
	["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "IEMobile", "Opera Mini"].some(platform =>
		navigator.userAgent.includes(platform),
	)

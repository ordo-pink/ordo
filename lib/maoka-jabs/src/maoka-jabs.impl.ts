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

import { TMaokaJab, type TMaokaProps } from "@ordo-pink/maoka"
import { SM_SCREEN_BREAKPOINT } from "@ordo-pink/core"
import { lt } from "@ordo-pink/tau"

import { TNoSpace } from "./maoka-jabs.types"

export const set_attribute =
	(key: string, value = "") =>
	(ctx: TMaokaProps) =>
		void ctx.element.setAttribute(key, value)

export const set_class =
	(...classes: string[]) =>
	(ctx: TMaokaProps) =>
		void ctx.element.setAttribute("class", classes.join(" "))

export const add_class =
	(...classes: string[]) =>
	(ctx: TMaokaProps) => {
		if (ctx.element.classList) {
			ctx.element.classList.add(...classes.flatMap(cls => cls.split(" ")))
		} else {
			const current_classes = ctx.element.getAttribute("class") ?? ""

			ctx.element.setAttribute(
				"class",
				current_classes
					.split(" ")
					.concat(classes.flatMap(cls => cls.split(" ")))
					.join(" "),
			)
		}
	}

export const remove_class =
	<$TClass extends string>(...classes: TNoSpace<$TClass>[]) =>
	(ctx: TMaokaProps) => {
		if (ctx.element.classList) {
			ctx.element.classList.remove(...classes.flatMap(cls => cls.split(" ")))
		} else {
			const current_classes = ctx.element.getAttribute("class") ?? ""

			ctx.element.setAttribute(
				"class",
				current_classes
					.split(" ")
					.filter(cls => !classes.includes(cls as TNoSpace<$TClass>))
					.join(" "),
			)
		}
	}

export const replace_class =
	<$TPrev extends string, $TNext extends string>(prev: TNoSpace<$TPrev>, next: TNoSpace<$TNext>) =>
	(ctx: TMaokaProps) => {
		const current_classes = ctx.element.getAttribute("class") ?? ""

		ctx.element.setAttribute("class", current_classes.replace(prev, next))
	}

export const set_style = (str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>) => (ctx: TMaokaProps) =>
	void Object.keys(str).forEach(k => ((ctx.element.style as any)[k] = (str as any)[k]))

export const listen =
	<K extends keyof HTMLElement>(event: K extends `on${string}` ? K : never, f: HTMLElement[K]) =>
	(ctx: TMaokaProps) =>
		void ((ctx.element as unknown as any)[event] = f)

export const set_inner_html = (html: string) => (ctx: TMaokaProps) => void (ctx.element.innerHTML = html)

export const create_context = <$TValue>() => {
	const state = {} as Record<string, $TValue>

	return {
		provide: (value: $TValue) => (props: TMaokaProps) => {
			if (!state[props.rid]) state[props.rid] = value
		},

		consume: (props: TMaokaProps) => {
			return state[props.rid] ?? ({} as $TValue)
		},
	}
}

const is_sm = lt(SM_SCREEN_BREAKPOINT)

export const is_sm_screen$: TMaokaJab<() => boolean> = ({ refresh, onunmount }) => {
	let value: boolean = is_sm(window.innerWidth)

	const handle_resize = () => {
		const is_sm_screen = is_sm(window.innerWidth)

		if (value !== is_sm_screen) {
			value = is_sm_screen
			refresh()
		}
	}

	window.addEventListener("resize", handle_resize)

	onunmount(() => window.removeEventListener("resize", handle_resize))

	return () => value
}

export const is_darwin: TMaokaJab<boolean> = () => navigator.appVersion.indexOf("Mac") !== -1

export const is_mobile: TMaokaJab<boolean> = () =>
	["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "IEMobile", "Opera Mini"].some(platform =>
		navigator.userAgent.includes(platform),
	)

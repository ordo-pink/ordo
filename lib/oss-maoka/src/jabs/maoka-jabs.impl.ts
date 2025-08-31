/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { IfDOM, OnMount, OnUnmount, Refresh$, SetAttribute } from "./maoka-jabs.types.ts"
import type { Node } from "../dom/maoka-dom.types.ts"
import { REFRESH_EVENT_NAME } from "../dom/maoka-dom.constants.ts"
import { node_guard } from "../dom/maoka-dom.impl.ts"

export const jab_if_dom: IfDOM =
	f =>
	({ node }) => {
		if (node_guard(node)) return f(node as any)
	}

export const jab_onmount: OnMount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Node<HTMLElement>) => {
			if (!n.value.onmount) n.value.onmount = []
			n.value.onmount.push(() => f(n))
		}

		use(jab_if_dom(handle_if_dom))
	}

export const jab_onunmount: OnUnmount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Node<HTMLElement>) => {
			if (!n.value.onunmount) n.value.onunmount = []
			n.value.onunmount.push(() => f(n))
		}

		use(jab_if_dom(handle_if_dom))
	}

export const jab_refresh$: Refresh$ = ({ use }) =>
	use(jab_if_dom(n => n.value.dispatchEvent(new CustomEvent(REFRESH_EVENT_NAME, { detail: n, bubbles: true }))))

export const jab_set_attribute: SetAttribute =
	(name, value = "") =>
	({ use }) => {
		use(jab_if_dom(n => n.value.setAttribute(name, value)))
	}

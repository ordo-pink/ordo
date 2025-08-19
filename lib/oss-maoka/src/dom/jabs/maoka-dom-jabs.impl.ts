/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Dom from "../maoka-dom.types.ts"
import type * as Jabs from "./maoka-dom-jabs.types.ts"
import { REFRESH_EVENT_NAME } from "../maoka-dom.constants.ts"
import { node_guard } from "../maoka-dom.impl.ts"

export const hit_if_dom: Jabs.HitIfDom =
	f =>
	({ node }) => {
		if (node_guard(node)) return f(node as any)
	}

export const onmount: Jabs.OnMount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Dom.Node<HTMLElement>) => {
			if (!n.value.onmount) n.value.onmount = []
			n.value.onmount.push(() => f(n))
		}

		use(hit_if_dom(handle_if_dom))
	}

export const onunmount: Jabs.OnUnmount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Dom.Node<HTMLElement>) => {
			if (!n.value.onunmount) n.value.onunmount = []
			n.value.onunmount.push(() => f(n))
		}

		use(hit_if_dom(handle_if_dom))
	}

export const refresh$: Jabs.Refresh$ = ({ use }) => {
	use(hit_if_dom(n => n.value.dispatchEvent(new CustomEvent(REFRESH_EVENT_NAME, { detail: n, bubbles: true }))))
}

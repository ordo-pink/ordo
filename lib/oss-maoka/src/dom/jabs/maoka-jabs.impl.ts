/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as DOM from "../maoka-dom.constants"
import type * as Dom from "../maoka-dom.types"
import type * as Jabs from "./maoka-jabs.types"
import * as dom from "../maoka-dom.impl"

export const if_dom: Jabs.IfDOM =
	f =>
	({ node }) => {
		if (dom.node_guard(node)) return f(node as any)
	}

export const onmount: Jabs.OnMount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Dom.DomNode<HTMLElement>) => {
			if (!n.value.onmount) n.value.onmount = []
			n.value.onmount.push(() => f(n))
		}

		use(if_dom(handle_if_dom))
	}

export const onunmount: Jabs.OnUnmount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Dom.DomNode<HTMLElement>) => {
			if (!n.value.onunmount) n.value.onunmount = []
			n.value.onunmount.push(() => f(n))
		}

		use(if_dom(handle_if_dom))
	}

export const refresh$: Jabs.Refresh$ = ({ use }) =>
	use(if_dom(n => n.value.dispatchEvent(new CustomEvent(DOM.REFRESH_EVENT_NAME, { detail: n, bubbles: true }))))

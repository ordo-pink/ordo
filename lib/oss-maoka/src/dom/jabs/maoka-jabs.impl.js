/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/** @import * as Jabs from "./maoka-jabs.types.ts" */

import * as dom from "../maoka-dom.impl.js"

/** @type {Jabs.IfDOM} */
export const if_dom =
	f =>
	({ node }) =>
		dom.node_guard(node) && f(node)

/** @type {Jabs.OnMount} */
export const onmount =
	f =>
	({ use }) => {
		const handle_if_dom = n => {
			if (!n.value.onmount) n.value.onmount = []
			n.value.onmount.push(() => f(n))
		}

		use(if_dom(handle_if_dom))
	}

/** @type {Jabs.OnUnmount} */
export const onunmount =
	f =>
	({ use }) => {
		const handle_if_dom = n => {
			if (!n.value.onunmount) n.value.onunmount = []
			n.value.onunmount.push(() => f(n))
		}

		use(if_dom(handle_if_dom))
	}

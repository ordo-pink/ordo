import type * as Jabs from "./maoka-dom-jabs.types.ts"
import * as MAOKA_DOM from "../maoka-dom.constants.ts"
import type { Node } from "../maoka-dom.types.ts"
import { node_guard } from "../maoka-dom.impl.ts"

export const hit_if_dom: Jabs.HitIfDom =
	f =>
	({ node }) => {
		if (node_guard(node)) return f(node as any)
	}

export const onmount: Jabs.OnMount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Node<HTMLElement>) => {
			if (!n.value.onmount) n.value.onmount = []
			n.value.onmount.push(() => f(n))
		}

		use(hit_if_dom(handle_if_dom))
	}

export const onunmount: Jabs.OnUnmount =
	f =>
	({ use }) => {
		const handle_if_dom = (n: Node<HTMLElement>) => {
			if (!n.value.onunmount) n.value.onunmount = []
			n.value.onunmount.push(() => f(n))
		}

		use(hit_if_dom(handle_if_dom))
	}

export const refresh$: Jabs.Refresh$ = ({ use }) => {
	use(hit_if_dom(n => n.value.dispatchEvent(new CustomEvent(MAOKA_DOM.REFRESH_EVENT_NAME, { detail: n, bubbles: true }))))
}

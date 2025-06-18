import { type MaokaSDK, maoka_sdk } from "@ordo-pink/sdk-maoka"
import { maoka, maoka_dom } from "@ordo-pink/maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { result } from "@ordo-pink/result"

/**
 * Title div watches for "title.set_title" shots and makes changes to the DOM. This behavior is extracted into
 * a separate Maoka component to avoid redundant rerenders of higher level DOM nodes in case the `t$` jab triggers
 * a refresh due to changes in translations.
 */
export const title = maoka.create("div", ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)
	const translate = use(maoka_sdk.jabs.t$) // TODO Move to context

	use(maoka_dom.jabs.onmount(listen_set_title_shots(hunter, translate, document)))
})

// --- Internal ---

type ListenSetTitleShots = (hunter: ClientSDK.Hunter, translate: MaokaSDK.Jabs.TFn, document: Document) => () => void
const listen_set_title_shots: ListenSetTitleShots = (hunter, translate, document) => () =>
	result
		.from_nullable(document.querySelector("title"))
		.pipe(result.ops.map(el => hunter.track("title.set_title", gun_for_set_title(el, translate))))
		.cata(result.catas.if_ok(release => release()))

type GunForSetTitle = (element: HTMLTitleElement, translate: MaokaSDK.Jabs.TFn) => ClientSDK.GunFor<"title.set_title">
const gun_for_set_title: GunForSetTitle = (el, translate) => t =>
	result
		.of(translate(t, "404"))
		.pipe(result.ops.map(t => `${t} | Ordo.pink`))
		.cata(result.catas.if_ok(title => void (el.innerText = title)))

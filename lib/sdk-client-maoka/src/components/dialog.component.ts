/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type ClientSDK, MODAL } from "@ordo-pink/sdk-client"
import { type Maoka, maoka, maoka_dom, maoka_styled } from "@ordo-pink/oss-maoka"
import { type MaokaSDK, maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import "./dialog.styles.css"
import type { Dialog } from "@ordo-pink/maoka-components"

export namespace DIALOG {
	export enum TYPE {
		INFO,
		DANGER,
		ACTIONS,
	}
}

export namespace Dialog {
	export type IconRenderer = (span: HTMLSpanElement) => void | Promise<void>
	export type BodyRenderer = (div: HTMLDivElement) => void | Promise<void>

	export type Args = {
		actions: () => MaokaSDK.Components.ButtonArgs[]
		render_body?: Dialog.BodyRenderer
		render_icon: Dialog.IconRenderer
		title: () => string
		type: Dialog.Type
	}

	export type Type = DIALOG.TYPE

	export namespace Info {
		export type Args = {
			render_body?: Dialog.BodyRenderer
			render_icon?: Dialog.IconRenderer
			title: () => string
		}

		export type Jab = (state: ClientSDK.F.State, args: Dialog.Info.Args) => Maoka.Jab<[show: () => void, hide: () => void]>
	}

	export namespace Actions {
		export type Args = {
			actions: () => MaokaSDK.Components.ButtonArgs[]
			render_body?: Dialog.BodyRenderer
			render_icon?: Dialog.IconRenderer
			title: () => string
		}

		export type Jab = (state: ClientSDK.F.State, args: Dialog.Actions.Args) => Maoka.Jab<[show: () => void, hide: () => void]>
	}
}

const dialog_base = maoka.create<Dialog.Args>(
	"div",
	({ actions = () => [], node, render_body, render_icon, title, type, use }) => {
		use(maoka_sdk.jabs.classes.set("dialog", get_dialog_css_class(type)))

		const handle_cancel_click = () =>
			void (maoka_dom.guards.is_dom_node(node) && node.value.parentElement?.parentElement?.parentElement?.click())

		return () => [
			dialog_header_div(() => [dialog_icon_span({ render_icon }), dialog_title_h2(title)]),
			render_body ? dialog_body_div({ render_body }) : void 0,
			dialog_footer_div(() => [
				maoka_sdk.components.button.neutral({ hotkey: "escape", kindergarten: () => "OK", on_click: handle_cancel_click }),
				...actions().map(action => maoka_sdk.components.button.primary(action)),
			]),
		]
	},
)

export const dialog_info = ({ title, render_body, render_icon }: Dialog.Info.Args) =>
	dialog_base({
		actions: () => [],
		render_body,
		render_icon: render_icon ? render_icon : () => void 0, // TODO
		title,
		type: DIALOG.TYPE.INFO,
	})

export const dialog_actions = ({ actions, title, render_body, render_icon }: Dialog.Actions.Args) =>
	dialog_base({
		actions,
		render_body,
		render_icon: render_icon ? render_icon : () => void 0, // TODO
		title,
		type: DIALOG.TYPE.ACTIONS,
	})

const create_dialog: (
	state: ClientSDK.F.State,
	component: Maoka.Component,
) => Maoka.Jab<[show: () => void, hide: () => void]> =
	(state, component) =>
	({ node }) => {
		const hide = () => void state.hunter.shoot("modal.hide")
		const show = () =>
			void state.hunter.shoot("modal.show", {
				render: div => maoka_dom.render(div, component, node.root.create_id),
				size: MODAL.SIZE.SM,
			})

		return [show, hide]
	}

export const create_dialog_info: Dialog.Info.Jab = (state, args) => create_dialog(state, dialog_info(args))

export const create_dialog_actions: Dialog.Actions.Jab = (state, args) => create_dialog(state, dialog_actions(args))

const dialog_header_div = maoka_styled.div("header")
const dialog_title_h2 = maoka_styled.h2("title")
const dialog_footer_div = maoka_styled.div("footer")
const dialog_body_div = maoka.create<{ render_body: Dialog.BodyRenderer }>("div", ({ render_body, use }) => {
	use(maoka_sdk.jabs.classes.set("body"))
	use(maoka_dom.jabs.onmount(n => void render_body(n.value as HTMLDivElement)))
})
const dialog_icon_span = maoka.create<{ render_icon: Dialog.IconRenderer }>("span", ({ render_icon, use }) => {
	use(maoka_sdk.jabs.classes.set("icon"))
	use(maoka_dom.jabs.onmount(n => void render_icon(n.value as HTMLSpanElement)))
})

const get_dialog_css_class = (type: Dialog.Type) =>
	sweech
		.match(type)
		.case(DIALOG.TYPE.ACTIONS, () => "action")
		.case(DIALOG.TYPE.DANGER, () => "danger")
		.case(DIALOG.TYPE.INFO, () => "info")
		.default(() => "")

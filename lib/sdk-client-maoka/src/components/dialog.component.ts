/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "@ordo-pink/oss-maoka"
import * as maoka from "@ordo-pink/oss-maoka"
import * as maoka_dom from "@ordo-pink/oss-maoka/dom"
import * as maoka_styled from "@ordo-pink/oss-maoka/styled"
import { type ClientSDK, MODAL } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import type * as ClientMaoka from "../sdk-client-maoka.types"

import "./dialog.styles.css"

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
		actions: () => ClientMaoka.Components.ButtonArgs[]
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

		export type Jab = (state: ClientSDK.F.State, args: Dialog.Info.Args) => Maoka.MaokaJab<[show: () => void, hide: () => void]>
	}

	export namespace Actions {
		export type Args = {
			actions: () => ClientMaoka.Components.ButtonArgs[]
			render_body?: Dialog.BodyRenderer
			render_icon?: Dialog.IconRenderer
			title: () => string
		}

		export type Jab = (
			state: ClientSDK.F.State,
			args: Dialog.Actions.Args,
		) => Maoka.MaokaJab<[show: () => void, hide: () => void]>
	}
}

const dialog_base = maoka.create_component<Dialog.Args>(
	"div",
	({ actions = () => [], node, render_body, render_icon, title, type, use }) => {
		use(client_maoka.jabs.classes.set("dialog", get_dialog_css_class(type)))

		const handle_cancel_click = () =>
			void (maoka_dom.node_guard(node) && node.value.parentElement?.parentElement?.parentElement?.click())

		return () => [
			dialog_header_div(() => [dialog_icon_span({ render_icon }), dialog_title_h2(title)]),
			render_body ? dialog_body_div({ render_body }) : void 0,
			dialog_footer_div(() => [
				client_maoka.components.button.neutral({ hotkey: "escape", kindergarten: () => "OK", on_click: handle_cancel_click }),
				...actions().map(action => client_maoka.components.button.primary(action)),
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
	component: Maoka.MaokaComponent,
) => Maoka.MaokaJab<[show: () => void, hide: () => void]> =
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

const dialog_header_div = maoka_styled.tags.div("header")
const dialog_title_h2 = maoka_styled.tags.h2("title")
const dialog_footer_div = maoka_styled.tags.div("footer")
const dialog_body_div = maoka.create_component<{ render_body: Dialog.BodyRenderer }>("div", ({ render_body, use }) => {
	use(client_maoka.jabs.classes.set("body"))
	use(maoka_dom.onmount(n => void render_body(n.value as HTMLDivElement)))
})
const dialog_icon_span = maoka.create_component<{ render_icon: Dialog.IconRenderer }>("span", ({ render_icon, use }) => {
	use(client_maoka.jabs.classes.set("icon"))
	use(maoka_dom.onmount(n => void render_icon(n.value as HTMLSpanElement)))
})

const get_dialog_css_class = (type: Dialog.Type) =>
	sweech
		.match(type)
		.case(DIALOG.TYPE.ACTIONS, () => "action")
		.case(DIALOG.TYPE.DANGER, () => "danger")
		.case(DIALOG.TYPE.INFO, () => "info")
		.default(() => "")

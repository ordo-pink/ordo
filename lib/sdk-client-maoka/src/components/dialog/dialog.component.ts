/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import maoka, { type Maoka } from "@ordo-pink/oss-maoka"
import maoka_dom from "@ordo-pink/oss-maoka/dom"
import maoka_styled from "@ordo-pink/oss-maoka-styled"
import { sweech } from "@ordo-pink/oss-sweech"

import { neutral, primary } from "../button/button.component"
import { set_class } from "../../jabs/class.jab"

import "./dialog.styles.css"

export enum TYPE {
	INFO,
	DANGER,
	ACTIONS,
}

const base = maoka.create<OrdoClientMaoka.Components.Dialog.Args>(
	"div",
	({ actions = () => [], node, render_body, render_icon, title, type, use }) => {
		use(set_class("dialog", get_dialog_css_class(type)))

		const handle_cancel_click = () =>
			void (maoka_dom.node_guard(node) && node.value.parentElement?.parentElement?.parentElement?.click())

		return () => [
			dialog_header_div(() => [dialog_icon_span({ render_icon }), dialog_title_h2(title)]),
			render_body ? dialog_body_div({ render_body }) : void 0,
			dialog_footer_div(() => [
				neutral({ hotkey: "escape", kindergarten: () => "OK", on_click: handle_cancel_click }),
				...actions().map(action => primary(action)),
			]),
		]
	},
)

export const info = ({ title, render_body, render_icon }: OrdoClientMaoka.Components.Dialog.Info.Args) =>
	base({
		actions: () => [],
		render_body,
		render_icon: render_icon ? render_icon : () => void 0, // TODO
		title,
		type: TYPE.INFO,
	})

export const actions = ({ actions, title, render_body, render_icon }: OrdoClientMaoka.Components.Dialog.Actions.Args) =>
	base({
		actions,
		render_body,
		render_icon: render_icon ? render_icon : () => void 0, // TODO
		title,
		type: TYPE.ACTIONS,
	})

const create_dialog: (
	state: OrdoClient.F.State,
	component: Maoka.Component,
) => Maoka.Jab<[show: () => void, hide: () => void]> =
	(state, component) =>
	({ node }) => {
		const hide = () => void state.hunter.shoot("modal.hide")
		const show = () =>
			void state.hunter.shoot("modal.show", {
				render: div => maoka_dom.render(div, component, node.root.create_id),
				size: ordo_client.modal.SIZE.SM,
			})

		return [show, hide]
	}

export const create_dialog_info: OrdoClientMaoka.Components.Dialog.Info.Jab = (state, args) => create_dialog(state, info(args))

export const create_dialog_actions: OrdoClientMaoka.Components.Dialog.Actions.Jab = (state, args) =>
	create_dialog(state, actions(args))

const dialog_header_div = maoka_styled.div("header")
const dialog_title_h2 = maoka_styled.h2("title")
const dialog_footer_div = maoka_styled.div("footer")
const dialog_body_div = maoka.create<{ render_body: OrdoClientMaoka.Components.Dialog.BodyRenderer }>(
	"div",
	({ render_body, use }) => {
		use(set_class("body"))
		use(maoka_dom.onmount(n => void render_body(n.value as HTMLDivElement)))
	},
)
const dialog_icon_span = maoka.create<{ render_icon: OrdoClientMaoka.Components.Dialog.IconRenderer }>(
	"span",
	({ render_icon, use }) => {
		use(set_class("icon"))
		use(maoka_dom.onmount(n => void render_icon(n.value as HTMLSpanElement)))
	},
)

const get_dialog_css_class = (type: OrdoClientMaoka.Components.Dialog.Type) =>
	sweech
		.match(type)
		.case(TYPE.ACTIONS, () => "action")
		.case(TYPE.DANGER, () => "danger")
		.case(TYPE.INFO, () => "info")
		.default(() => "")

declare global {
	namespace OrdoClientMaoka.Components {}
}

declare global {
	namespace OrdoClientMaoka.Components.Dialog {
		export type IconRenderer = (span: HTMLSpanElement) => void | Promise<void>
		export type BodyRenderer = (div: HTMLDivElement) => void | Promise<void>

		export type Args = {
			actions: () => OrdoClientMaoka.Components.Button.Args[]
			render_body?: OrdoClientMaoka.Components.Dialog.BodyRenderer
			render_icon: OrdoClientMaoka.Components.Dialog.IconRenderer
			title: () => string
			type: OrdoClientMaoka.Components.Dialog.Type
		}

		export type Type = TYPE

		export namespace Info {
			export type Args = {
				render_body?: OrdoClientMaoka.Components.Dialog.BodyRenderer
				render_icon?: OrdoClientMaoka.Components.Dialog.IconRenderer
				title: () => string
			}

			export type Jab = (
				state: OrdoClient.F.State,
				args: OrdoClientMaoka.Components.Dialog.Info.Args,
			) => Maoka.Jab<[show: () => void, hide: () => void]>
		}

		export namespace Actions {
			export type Args = {
				actions: () => OrdoClientMaoka.Components.Button.Args[]
				render_body?: OrdoClientMaoka.Components.Dialog.BodyRenderer
				render_icon?: OrdoClientMaoka.Components.Dialog.IconRenderer
				title: () => string
			}

			export type Jab = (
				state: OrdoClient.F.State,
				args: OrdoClientMaoka.Components.Dialog.Actions.Args,
			) => Maoka.Jab<[show: () => void, hide: () => void]>
		}
	}
}

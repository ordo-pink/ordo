// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { LabelColor, NotificationType } from "@ordo-pink/core"
import { BsCookie } from "@ordo-pink/frontend-icons"
import { Button } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Result } from "@ordo-pink/result"
import { T } from "@ordo-pink/tau"

import hero_layer_0 from "../static/index-hero-layer-0.png"
import hero_layer_1 from "../static/index-hero-layer-1.png"
import hero_layer_2 from "../static/index-hero-layer-2.png"

import "./landing.page.css"

let is_cookie_modal_shown = false

// TODO Translations
export default Maoka.create("main", ({ use, on_unmount }) => {
	const commands = use(MaokaOrdo.Jabs.Commands.get)
	const { t } = use(MaokaOrdo.Jabs.Translations)
	const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)

	if (!is_cookie_modal_shown) show_cookie_modal(commands.emit)

	document.addEventListener("mousemove", event => handle_mouse_move(event))

	on_unmount(() => {
		document.removeEventListener("mousemove", event => handle_mouse_move(event))
		Object.assign(document.documentElement, { style: "" })
	})

	const handle_mouse_move = (event: MouseEvent) => {
		const dx = (event.clientX - window.innerWidth / 2) * -0.005
		const dy = (event.clientY - window.innerHeight / 2) * -0.01
		const style = `--move-x: ${dx}deg; --move-y: ${dy}deg;`

		Object.assign(document.documentElement, { style })
	}

	// const handle_sign_up_click = () =>
	// 	commands.emit("cmd.application.notification.show", {
	// 		type: NotificationType.RRR,
	// 		message: "t.welcome.landing_page.rrr_sign_up_unavailable.message",
	// 		duration: 10,
	// 		title: "t.welcome.landing_page.rrr_sign_up_unavailable.title",
	// 	})

	const handle_try_click = () => {
		const has_files = metadata_query.get().cata({ Ok: x => x.length > 0, Err: T })
		if (!has_files) create_tutorial_files(commands.emit, metadata_query)

		commands.emit("cmd.file_editor.open")
	}

	// const handle_more_click = () => console.log("HERE") // TODO Link to details

	return () => {
		const t_ordo = "ORDO"
		const t_bring_your_thoughts_to = "Bring your thoughts to"
		// const t_more = t("t.welcome.landing_page.sections.hero.learn_more")
		const t_beta_started = t("t.welcome.landing_page.sections.hero.beta_started_announcement")
		const t_try_now = t("t.welcome.landing_page.sections.hero.try_now_button")
		// const t_sign_up = t("t.welcome.landing_page.sections.hero.sign_up")

		commands.emit("cmd.application.set_title", "t.welcome.landing_page.title")

		return HeroSection(() => [
			HeroSectionLayers(() => [
				// Floating hero section images
				HeroSectionImageLayer(hero_layer_0, 0),
				HeroSectionImageLayer(hero_layer_1, 1),
				HeroSectionImageLayer(hero_layer_2, 2),
			]),
			HeroCard(() =>
				HeroCardContent(() => [
					HeroCardLogoSection(() => [
						HeroCardLogoWrapper(() => [t_bring_your_thoughts_to, HeroCardLogoText(() => t_ordo)]),
						// HeroCardLogoAction(() =>
						// 	Button.Neutral({ text: t_more, on_click: handle_more_click, hotkey: "m", hotkey_options: { prevent_in_inputs: true } }),
						// ),
					]),

					CallToActionSection(() =>
						CallToActionCard(() => [
							CallToActionBetaLogo(`"${t_beta_started}"`),
							ActionsContainer(() => [
								Button.Primary({
									text: t_try_now,
									hotkey: "mod+enter",
									on_click: handle_try_click,
									hotkey_options: { prevent_in_inputs: true },
								}),
								// Button.Neutral({
								// 	text: t_sign_up,
								// 	hotkey: "mod+u",
								// 	on_click: handle_sign_up_click,
								// 	hotkey_options: { prevent_in_inputs: true },
								// }),
							]),
						]),
					),
				]),
			),
		])
	}
})

// --- Internal ---

const HeroSectionImageLayer = (image_path: string, index: number) =>
	Maoka.create("div", ({ use }) => {
		const background_image = `url(${image_path})`

		use(MaokaJabs.set_class(`hero-layer hero-layer_${index}`))
		use(MaokaJabs.set_style({ backgroundImage: background_image }))
	})

const HeroSection = Maoka.styled("section", { class: "hero-section" })
const HeroCard = Maoka.styled("div", { class: "card-container" })
const HeroCardContent = Maoka.styled("div", { class: "card" })
const HeroCardLogoText = Maoka.styled("span", { class: "logo_ordo-text" })
const HeroSectionLayers = Maoka.styled("div", { class: "hero-layers" })
const HeroCardLogoWrapper = Maoka.styled("h1", { class: "logo" })
const HeroCardLogoSection = Maoka.styled("div", { class: "logo-section" })
// const HeroCardLogoAction = Maoka.styled("div", { class: "logo_action" })

const ActionsContainer = Maoka.styled("div", { class: "actions-container" })

const CallToActionSection = Maoka.styled("div", { class: "cta" })
const CallToActionCard = Maoka.styled("div", { class: "cta_card" })
const CallToActionLogoWraper = Maoka.styled("div")
const CallToActionBetaText = Maoka.styled("h3", { class: "cta_beta" })
const BetaStartedMessage = Maoka.styled("p", { class: "cta_beta_started" })
const CallToActionBetaLogo = (t_beta_started: string) =>
	CallToActionLogoWraper(() => [
		CallToActionBetaText(() => [
			Token("token_keyword", "const "),
			Token("token_variable", "teβt "),
			Token("token_keyword", "= "),
			Token("token_scope", "() "),
			Token("token_keyword", "⇒"),
			BetaStartedMessage(() => t_beta_started),
		]),
	])

const Token = (cls: string, text: string) => Maoka.styled("span", { class: cls })(() => text)

const show_cookie_modal = (emit: Ordo.Command.EmitFn) => {
	emit("cmd.application.notification.show", {
		title: "t.welcome.landing_page.cookie_banner.title",
		message: "t.welcome.landing_page.cookie_banner.message",
		type: NotificationType.WARN,
		duration: 15,
		render_icon: span => span.appendChild(BsCookie("size-5") as SVGSVGElement),
	})

	is_cookie_modal_shown = true
}

const create_tutorial_files = (emit: Ordo.Command.EmitFn, metadata_query: Ordo.Metadata.Query) => {
	const labels = [{ name: "🎉 Intro", color: LabelColor.PURPLE }]
	const last_file_content =
		// eslint-disable-next-line quotes
		'[{"type":"p","children":[{"type":"text","value":"Hello, friend."}]},{"type":"p","children":[{"type":"text","value":""}]},{"type":"p","children":[{"type":"text","value":"This is basically the end of the road so far. But there is way more for us to go."}]},{"type":"p","children":[{"type":"text","value":"Keep in mind, that ORDO is local first, and all the stuff you have here is stored on your computer. Don\'t wipe it out with cleaners."}]},{"type":"p","children":[{"type":"text","value":"We\'ll soon add a way to sync between your devices but for now it is what it is. Enjoy!"}]},{"type":"p","children":[{"type":"text","value":""}]},{"type":"p","children":[{"type":"text","value":"To reach out to us, ping @ordo_pink on X or drop us an email hello@ordo.pink. Yes, as you can see, links are not supported yet. So as Ctrl + A."}]},{"type":"p","children":[{"type":"text","value":""}]},{"type":"p","children":[{"type":"text","value":"Cheers! 🍻"}]},{"type":"p","children":[{"type":"text","value":""}]},{"type":"p","children":[{"type":"text","value":"(To remove this tutorial, simply right-click on the `Start here!` file and then `Remove file`. It will cascade delete the others inside)"}]}]'

	emit("cmd.metadata.create", { name: "Start here!", parent: null, labels, type: "database/ordo" })

	const parent = metadata_query
		.get_by_name_and_parent("Start here!", null)
		.pipe(Result.ops.chain(Result.FromOption))
		.pipe(Result.ops.map(x => x.get_fsid()))
		.cata(Result.catas.or_else(() => null as never))

	emit("cmd.metadata.create", { name: "Join ORDO", parent, props: { emoji_icon: "✅" }, labels })
	emit("cmd.metadata.create", { name: "Try changing emoji to `check`", parent, labels, props: { emoji_icon: "👆" } })
	emit("cmd.metadata.create", { name: "Enable labels in database column options", parent, labels })
	emit("cmd.metadata.create", { name: "Click on a label to edit its options", parent, labels: [...labels, "BORING"] })
	emit("cmd.metadata.create", { name: "Create a new file by clicking +New", parent, labels })
	emit("cmd.metadata.create", { name: "Click on this text to open file content", parent, labels })

	const last_file_fsid = metadata_query
		.get_by_name_and_parent("Click on this text to open file content", parent)
		.pipe(Result.ops.chain(Result.FromOption))
		.pipe(Result.ops.map(x => x.get_fsid()))
		.cata(Result.catas.or_else(() => null as never))

	emit("cmd.content.set", { fsid: last_file_fsid, content: last_file_content, content_type: "text/ordo" })
}

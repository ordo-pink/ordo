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

import { BsCookie } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { NotificationType } from "@ordo-pink/core"

import "./landing.page.css"
import { Button } from "@ordo-pink/maoka-components"

let modal_shown = false

// TODO Translations
export default Maoka.create("div", ({ use, on_unmount }) => {
	const commands = use(MaokaOrdo.Jabs.Commands)
	const { t } = use(MaokaOrdo.Jabs.Translations)

	document.addEventListener("mousemove", event => handle_mouse_move(event))

	on_unmount(() => {
		document.removeEventListener("mousemove", event => handle_mouse_move(event))
		Object.assign(document.documentElement, { style: "" })
	})

	if (!modal_shown) {
		commands.emit("cmd.application.notification.show", {
			title: "t.welcome.landing_page.cookie_banner.title",
			message: "t.welcome.landing_page.cookie_banner.message",
			type: NotificationType.WARN,
			duration: 15,
			render_icon: span => span.appendChild(BsCookie("size-5") as SVGSVGElement),
		})

		modal_shown = true
	}

	const handle_mouse_move = (event: MouseEvent) => {
		const dx = (event.clientX - window.innerWidth / 2) * -0.005
		const dy = (event.clientY - window.innerHeight / 2) * -0.01
		const style = `--move-x: ${dx}deg; --move-y: ${dy}deg;`

		Object.assign(document.documentElement, { style })
	}

	const handle_sign_up_click = () =>
		commands.emit("cmd.application.notification.show", {
			type: NotificationType.RRR,
			message: "t.welcome.landing_page.rrr_sign_up_unavailable.message",
			duration: 10,
			title: "t.welcome.landing_page.rrr_sign_up_unavailable.title",
		})

	const handle_try_click = () => commands.emit("cmd.file_editor.open")

	const handle_more_click = () => console.log("HERE") // TODO Link to details

	return () => {
		const t_ordo = "ORDO"
		const t_bring_your_thoughts_to = "Bring your thoughts to"
		const t_more = t("t.welcome.landing_page.sections.hero.learn_more")
		const t_beta_started = t("t.welcome.landing_page.sections.hero.beta_started_announcement")
		const t_try = t("t.welcome.landing_page.sections.hero.try_now_button")
		const t_sign_up = t("t.welcome.landing_page.sections.hero.sign_up")

		const sign_up_params = { text: t_sign_up, accelerator: "mod+u", on_click: handle_sign_up_click }
		const try_now_params = { text: t_try, accelerator: "mod+enter", on_click: handle_try_click }
		const learn_more_params = { text: t_more, on_click: handle_more_click, accelerator: "m" }

		commands.emit("cmd.application.set_title", "t.welcome.landing_page.title")

		return HeroSection(() => [
			HeroSectionLayers(() => [
				HeroSectionImageLayer(0),
				HeroSectionImageLayer(1),
				HeroSectionImageLayer(2),
			]),
			HeroCard(() =>
				HeroCardContent(() => [
					HeroCardLogoSection(() => [
						HeroCardLogoWrapper(() => [t_bring_your_thoughts_to, HeroCardLogoText(() => t_ordo)]),
						HeroCardLogoAction(() => Button.Neutral(learn_more_params)),
					]),

					CallToActionSection(() =>
						CallToActionCard(() => [
							CallToActionBetaLogo(`"${t_beta_started}"`),
							ActionsContainer(() => [
								Button.Primary(try_now_params),
								Button.Neutral(sign_up_params),
							]),
						]),
					),
				]),
			),
		])
	}
})

// --- Internal ---

const HeroSectionImageLayer = (index: number) =>
	Maoka.create("div", ({ use }) => {
		const hosts = use(MaokaOrdo.Jabs.Hosts)

		const background_image = `url(${hosts.static}/index-hero-layer-${index}.png)`
		console.log(background_image)

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
const HeroCardLogoAction = Maoka.styled("div", { class: "mt-12 flex items-center space-x-8" })
const CallToActionSection = Maoka.styled("div", {
	class:
		"w-full max-w-2xl space-y-8 rounded-lg bg-gradient-to-br from-sky-200/80 via-indigo-200/80 to-indigo-200/80 px-8 py-4 shadow-lg md:py-12 dark:from-sky-950 dark:via-indigo-950 dark:to-indigo-950",
})
const CallToActionCard = Maoka.styled("div", { class: "flex flex-col space-y-8" })
const CallToActionLogoWraper = Maoka.styled("div")
const CallToActionBetaText = Maoka.styled("h3", { class: "text-2xl font-bold" })
const BetaStartedMessage = Maoka.styled("p", { class: "center ml-4 opacity-75" })
const CallToActionBetaLogo = (t_beta_started: string) =>
	CallToActionLogoWraper(() => [
		CallToActionBetaText(() => [
			Token("text-purple-600 dark:text-orange-400", "const "),
			Token("text-neutral-700 dark:text-white", "teβt "),
			Token("text-purple-600 dark:text-orange-400", "= "),
			Token("text-orange-600 dark:text-purple-400", "() "),
			Token("align-middle text-purple-600 dark:text-orange-400", "⇒"),
			BetaStartedMessage(() => t_beta_started),
		]),
	])

const Token = (cls: string, text: string) => Maoka.styled("span", { class: cls })(() => text)
const ActionsContainer = Maoka.styled("div", {
	class: "flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0",
})

/*
<Button.Primary
	onClick={e => {
		e.preventDefault()

		commands.emit("cmd.auth.open_sign_up")
	}}
>
	{t_sign_up}
</Button.Primary>

<Button.Secondary
	onClick={e => {
		e.preventDefault()

		commands.emit("cmd.auth.open_sign_in")
	}}
>
	{t_sign_in}
</Button.Secondary>
*/

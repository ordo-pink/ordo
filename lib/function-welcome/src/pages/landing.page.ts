import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-hooks"

import "./landing.page.css"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"

// TODO Translations
export default Maoka.create("div", ({ use, on_unmount }) => {
	const commands = use(MaokaOrdo.Hooks.commands)

	commands.emit("cmd.application.set_title", {
		window_title: "Welcome to ORDO!",
		status_bar_title: "We don't use cookies. Wait, what?!",
	})

	const handle_mouse_move = (event: MouseEvent) => {
		const nx = (event.clientX - window.innerWidth / 2) * -0.005
		const ny = (event.clientY - window.innerHeight / 2) * -0.01
		const style = `--move-x: ${nx}deg; --move-y: ${ny}deg;`

		Object.assign(document.documentElement, { style })
	}

	document.addEventListener("mousemove", handle_mouse_move)

	on_unmount(() => {
		document.removeEventListener("mousemove", handle_mouse_move)
		Object.assign(document.documentElement, { style: "" })
	})

	return () =>
		Section(() => [
			Layers(() => [Layer(0), Layer(1), Layer(2)]),
			Card(() =>
				CardContent(() => [
					LogoSection(() => [
						LogoWrapper(() => ["Bring your thoughts to", Logo(() => "ORDO")]),
						LogoAction(() => Maoka.styled("button", {})(() => "TODO")),
					]),
					CallToActionSection(() => "TODO"),
				]),
			),
		])
})

// --- Internal ---

const Layer = (index: number) =>
	Maoka.create("div", ({ use }) => {
		const hosts = use(MaokaOrdo.Hooks.hosts)

		const background_image = `url(${hosts.static}/index-hero-layer-${index}.png)`

		use(MaokaHooks.set_class(`hero-layer hero-layer_${index}`))
		use(MaokaHooks.set_style({ backgroundImage: background_image }))
	})

const Section = Maoka.styled("section", { class: "hero-section" })
const Card = Maoka.styled("div", { class: "card-container" })
const CardContent = Maoka.styled("div", { class: "card" })
const Logo = Maoka.styled("span", { class: "logo_ordo-text" })
const Layers = Maoka.styled("div", { class: "hero-layers" })
const LogoWrapper = Maoka.styled("h1", { class: "logo" })
const LogoSection = Maoka.styled("div", { class: "logo-section" })
const CallToActionSection = Maoka.styled("div", { class: "w-full max-w-md" })
const LogoAction = Maoka.styled("div", { class: "mt-12 flex items-center space-x-8" })

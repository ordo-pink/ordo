import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-hooks"

import "./landing.page.css"

// TODO Translations
export const WelcomeLandingPage = Maoka.create("div", ({ use, on_unmount }) => {
	const hosts = use(MaokaOrdo.Hooks.hosts)
	const commands = use(MaokaOrdo.Hooks.commands)

	commands.emit("cmd.application.set_title", {
		window_title: "Welcome to ORDO!",
		status_bar_title: "We don't use cookies. Wait, what?!",
	})

	const handle_mouse_move = (event: MouseEvent) => {
		Object.assign(document.documentElement, {
			style: `
  --move-x: ${(event.clientX - window.innerWidth / 2) * -0.005}deg;
  --move-y: ${(event.clientY - window.innerHeight / 2) * -0.01}deg;
  --layer-0: ;
  --layer-1: ${hosts.static}/index-hero-layer-1.png;
  --layer-2: ${hosts.static}/index-hero-layer-2.png;
  `,
		})
	}

	document.addEventListener("mousemove", handle_mouse_move)

	on_unmount(() => {
		document.removeEventListener("mousemove", handle_mouse_move)
		Object.assign(document.documentElement, { style: "" })
	})

	return () =>
		Maoka.styled("section", "hero-section", () => [
			HeroLayers,
			Maoka.styled("div", "card-container", () =>
				Maoka.styled("div", "card", () => [LogoSection, CallToActionSection]),
			),
		])
})

// --- Internal ---

const HeroLayer = (index: number) =>
	Maoka.create("div", ({ use }) => {
		const hosts = use(MaokaOrdo.Hooks.hosts)

		const background_image = `url(${hosts.static}/index-hero-layer-${index}.png)`

		use(Maoka.hooks.set_class(`hero-layer hero-layer_${index}`))
		use(Maoka.hooks.set_style({ backgroundImage: background_image }))
	})

const HeroLayers = Maoka.styled("div", "hero-layers", () => [
	HeroLayer(0),
	HeroLayer(1),
	HeroLayer(2),
])

const BringYourThoughtsToORDO = Maoka.styled("h1", "logo", () => [
	"Bring your thoughts to",
	Maoka.styled("span", "logo_ordo-text", () => "ORDO"),
])

const LogoSection = Maoka.styled("div", "logo-section", () => [
	BringYourThoughtsToORDO,
	// TODO Use button
	Maoka.styled("div", "mt-12 flex items-center space-x-8", () =>
		Maoka.styled("button", "", () => "learn more"),
	),
])

const CallToActionSection = Maoka.styled("div", "w-full max-w-md", () => "HEY")

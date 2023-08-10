import { callOnce } from "#lib/tau/mod.ts"
import { registerCommand } from "./commands.ts"

export const initRouter = callOnce(() => {
	registerCommand("router.navigate", ({ payload: { url, replace = false } }) => {
		replace ? window.location.replace(url) : (window.location.href = url)
	})

	registerCommand("router.open-external", ({ payload: { url, newTab = true } }) => {
		newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
	})
})

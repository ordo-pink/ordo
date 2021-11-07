import { ColorTheme } from "../appearance/types"

export type Configuration = {
	"window.main-window.width": number
	"window.main-window.height": number
	"window.main-window.x": number
	"window.main-window.y": number
	"appearance.dark-mode.theme": ColorTheme
	"application.global-settings-path": string
	"application.last-open-file": string
}

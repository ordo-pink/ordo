import { nativeTheme } from "electron"
import { Settings } from "../settings"
import { ColorTheme } from "./types"

export const setTheme = (theme: ColorTheme): ColorTheme => {
	nativeTheme.themeSource = theme
	return Settings.set("appearance.dark-mode.theme", theme)
		.persist(Settings.get("application.global-settings-path"))
		.get("appearance.dark-mode.theme")
}

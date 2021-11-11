import { Configuration } from "./types"
import { existsSync, writeFileSync, readFileSync } from "fs"
import YAML from "yaml"
import { sortKeys } from "../../../utils/object"

const SETTINGS_MAP = Symbol.for("SETTINGS_MAP")

type TSettings = {
	[SETTINGS_MAP]: Configuration
	get: <K extends keyof Configuration>(key: K) => Configuration[K]
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) => TSettings
	persist: (path: string) => TSettings
	loadFromFile: (path: string) => TSettings
}

export const Settings: TSettings = {
	[SETTINGS_MAP]: {
		"window.main-window.width": 800,
		"window.main-window.height": 600,
		"window.main-window.x": 0,
		"window.main-window.y": 0,
		"appearance.dark-mode.theme": "system",
		"application.global-settings-path": "",
		"application.last-open-file": "",
		"application.root-folder-path": "",
	},
	get: (key) => Settings[SETTINGS_MAP][key],
	set: (key, value) => {
		Settings[SETTINGS_MAP][key] = value

		return Settings
	},
	loadFromFile: (path: string) => {
		if (!existsSync(path)) {
			Settings.persist(path)
		}

		Settings[SETTINGS_MAP] = {
			...Settings[SETTINGS_MAP],
			...YAML.parse(readFileSync(path, "utf-8")),
		}

		return Settings
	},
	persist: (path: string) => {
		writeFileSync(path, YAML.stringify(sortKeys(Settings[SETTINGS_MAP])), "utf-8")

		return Settings
	},
}

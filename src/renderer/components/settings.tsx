import * as React from "react"

const toggleDarkMode = window.darkModeAPI.toggle
const systemDarkMode = window.darkModeAPI.system

export const Settings: React.FC = () => {
	return (
		<>
			<button
				className="text-white px-8 py-2 mr-2 bg-blue-700 dark:bg-pink-700"
				onClick={toggleDarkMode}
			>
				Toggle
			</button>
			<button
				className="text-white px-8 py-2 bg-blue-700 dark:bg-pink-700"
				onClick={systemDarkMode}
			>
				System
			</button>
		</>
	)
}

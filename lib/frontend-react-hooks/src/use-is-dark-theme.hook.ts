// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"

export const useIsDarkTheme = () => {
	const [isDarkTheme, setIsDarkTheme] = useState(false)

	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleDarkModeChange = (event: MediaQueryListEvent) => setIsDarkTheme(event.matches)
		setIsDarkTheme(darkModeMediaQuery.matches)

		darkModeMediaQuery.addEventListener("change", handleDarkModeChange)

		return () => darkModeMediaQuery.removeEventListener("change", handleDarkModeChange)
	}, [])

	return isDarkTheme
}
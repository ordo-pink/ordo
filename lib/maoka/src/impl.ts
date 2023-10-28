// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Maoka } from "./types"

export const maoka: Maoka = "maoka"

export const h = (el: string, n: null, children: string) => {
	const element = document.createElement(el)
	element.appendChild(children)

	document.getElementById("app").appendChild(element)
}

export const Fragment = (...args: any[]) => {
	console.log("Fragment", args)
}

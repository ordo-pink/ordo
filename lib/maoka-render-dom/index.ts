/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { is_dom_jab, is_maoka_dom_element, onmount_jab, onunmount_jab, render } from "./src/maoka-render-dom.impl"

export * from "./src/maoka-render-dom.types"

export const MaokaDOM = {
	Jabs: { onmount: onmount_jab, onunmount: onunmount_jab, is_dom: is_dom_jab },
	is_maoka_dom_element,
	render,
}

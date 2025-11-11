/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as MaokaDom from "./src/dom/maoka-dom.types.ts"
import type * as MaokaDomJabs from "./src/dom/jabs/maoka-jabs.types.ts"

export declare const render: MaokaDom.DomRender
export declare const node_guard: MaokaDom.DomNodeGuard
export declare const if_dom: MaokaDomJabs.IfDOM
export declare const onmount: MaokaDomJabs.OnMount
export declare const onunmount: MaokaDomJabs.OnUnmount
export declare const REFRESH_EVENT_NAME: string

export declare const jabs: {
	if_dom: MaokaDomJabs.IfDOM
	onmount: MaokaDomJabs.OnMount
	onunmount: MaokaDomJabs.OnUnmount
}

export declare const maoka_dom: {
	render: MaokaDom.DomRender
	node_guard: MaokaDom.DomNodeGuard
	jabs: {
		if_dom: MaokaDomJabs.IfDOM
		onmount: MaokaDomJabs.OnMount
		onunmount: MaokaDomJabs.OnUnmount
	}
}

export declare const DOM: {
	REFRESH_EVENT_NAME: string
}

export type * from "./src/dom/maoka-dom.types.ts"
export type * as MaokaDom from "./src/dom/maoka-dom.types.ts"
